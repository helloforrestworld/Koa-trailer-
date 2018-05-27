const rq = require('request-promise-native')
const url = 'http://api.douban.com/v2/movie/'

const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')
const Category = mongoose.model('Category')

async function fetchMovie(item) {
  const result = await rq(url + item.doubanId)
  let body
  
  try {
    body = JSON.parse(result)
  } catch (err) {
    console.log(err)
  }
  return body
}

export const fetchDetails = new Promise((resolve, reject) => {
  (async () => {
    // 数据库获取movies数据
    let movies = await Movie.find({
      $or: [ // 条件选择
        {summary: {$exists: false}},
        {summary: null},
        {summary: ''},
        {title: ''},
        {year: {$exists: false}}
      ],
      doubanId: {$exists: true}
    }).exec()
    
    for(let i = 0; i < movies.length; i++) {
      let movie = movies[i]
      if (!movie || !movie.doubanId) continue
      let movieData = await fetchMovie(movie) // 请求豆瓣接口
      
      // 处理数据
      if (movieData) {
        movie.summary = movieData.summary
        movie.title = movieData.title || movieData.alt_title || ''
        movie.rawTitle = movieData.alt_title || movie.title
        
        if (movieData.attrs) {
          let movieTypes = movieData.attrs.movie_type || []
          movie.movieTypes = movieTypes
          movie.year = movieData.attrs.year[0] || 2500
          
          for (let i = 0; i < movieTypes.length; i ++) { // 处理分类目录
            let item = movieTypes[i]
            
            let cat = await Category.findOne({
              name: item
            }).exec()
            
            if (!cat) {
              cat = new Category({
                name: item,
                movies: [movie._id]
              })
            } else {
              if (cat.movies.indexOf(movie._id) === -1) {
                cat.movies.push(movie._id)
              }
            }
            await cat.save()
            
            if (!movie.category) {
              movie.category = [cat._id]
            } else {
              if (movie.category.indexOf(cat._id) === -1) {
                movie.category.push(cat._id)
              }
            }
          }
          
          let dates = movieData.attrs.pubdate || [] // 上映日期相关
          let pubdates = []
          
          dates.map(item => {
            if (item && item.split('(').length > 0) {
              let parts = item.split('(')
              let date = parts[0]
              let country = '未知'
              
              if (parts[1]) {
                country = parts[1].split(')')[0]
              }
              
              pubdates.push({
                date: new Date(date),
                country
              })
            }
          })
          
          movie.pubdate = pubdates
        }
        
        // 处理标签相关
        let tags = movieData.tags || []
        movie.tags = []
        tags.forEach(tag => {
          movie.tags.push(tag.name)
        })
        
        await movie.save()
        resolve({success: true})
      }
    }
  })()
})

