const rq = require('request-promise-native')
const url = 'http://api.douban.com/v2/movie/subject/'



async function fetchMovie(item) {
  const result = await rq(url + item.doubanId)
  
  return result
}

var arr = [
  { doubanId: 26603666,
      title: '妈妈咪鸭',
      rate: 7,
      poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2515018270.jpg' },
  { doubanId: 10535571,
    title: '外来者',
    rate: 5.6,
    poster: 'https://img1.doubanio.com/view/photo/l_ratio_poster/public/p2514369049.jpg' },
  { title: '', rate: 0, poster: '' }
]

;(async () => {
   arr.forEach(async movie => {
     let result
     if (movie.doubanId) {
       result = await fetchMovie(movie)
       try {
        result = await JSON.parse(result)
       } catch(err) {
         console.log(err)
       }
       console.log(result.summary)
     }
   })
})()

