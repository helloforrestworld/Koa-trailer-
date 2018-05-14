const {controller, get, post, put} = require('../lib/decorator')
const {
  getAllMovies,
  getMovieDetail,
  getRelativeMovies
} = require('../service/movie')

@controller('/api/v0/movies')
export class movieController {
  @get('/')  // 获取所有movie数据
  async getMovies (ctx, next) {
    const {type, year} = ctx.query
    const movies = await getAllMovies(type, year)
    
    ctx.body = {
      movies
    }
  }
  @get('/:id') // 获取某电影详细数据
  async getMovieDetail (ctx, next) {
    const id = ctx.params.id
    const movie = await getMovieDetail(id)
    const relativeMovies = await getRelativeMovies(movie)
    
    ctx.body = {
      data: {
        movie,
        relativeMovies
      },
      success: true
    }
  }
}