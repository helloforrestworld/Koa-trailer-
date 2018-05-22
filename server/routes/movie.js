const {controller, get, post, put} = require('../lib/decorator')
const {
  getAllMovies,
  getMovieDetail,
  getRelativeMovies,
  searchMovies
} = require('../service/movie')

@controller('/api/v0/movies')
export class movieController {
  @get('/')  // 获取所有movie数据
  async getMovies (ctx, next) {
    let {type, year, start = 0, end} = ctx.query
    const movies = await getAllMovies(type, year)
    let ret = []
    start = parseInt(start)
    end = parseInt(end)
    end = end ? end : movies.length
    ret = movies.slice(start, end)
    
    ctx.body = {
      success: movies.length ? true : false,
      movies: ret,
      total: movies.length
    }
  }
  @get('/detail/:id') // 获取某电影详细数据
  async getMovieDetail (ctx, next) {
    const id = ctx.params.id
    const movie = await getMovieDetail(id)
    const relativeMovies = await getRelativeMovies(movie)
    
    ctx.body = {
      success: movie ? true : false, 
      movie,
      relativeMovies
    }
  }
  
  @get('/search') // 搜索
  async getSearchMovies (ctx, next) {
    let {search, start = 0, end} = ctx.query
    let response = await searchMovies(search)
    
    if (response.err) {
      ctx.body = {
        success: false,
        err: '数据库搜索错误'
      }
    } else if (response.movies) {
      let ret = []
      start = parseInt(start)
      end = parseInt(end)
      end = end ? end : response.movies.length
      ret = response.movies.slice(start, end)
      ctx.body = {
        movies: ret,
        total: response.movies.length,
        success: true
      }
    }
  }
}