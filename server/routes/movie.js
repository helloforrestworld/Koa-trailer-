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
    const {type, year} = ctx.query
    const movies = await getAllMovies(type, year)
    
    ctx.body = {
      success: movies.length ? true : false,
      movies
    }
  }
  @get('/detail/:id') // 获取某电影详细数据
  async getMovieDetail (ctx, next) {
    const id = ctx.params.id
    const movie = await getMovieDetail(id)
    const relativeMovies = await getRelativeMovies(movie)
    
    ctx.body = {
      data: {
        success: movie ? true : false, 
        movie,
        relativeMovies
      },
      success: true
    }
  }
  
  @get('/search') // 搜索
  async getSearchMovies (ctx, next) {
    const value = ctx.query.value
    const ret = await searchMovies(value)
    if (ret.err) {
      ctx.body = {
        success: false,
        err: '数据库搜索错误'
      }
    } else if (ret.movies) {
      ctx.body = {
        data: {
          movies: ret.movies
        },
        success: true
      }
    }
  }
}