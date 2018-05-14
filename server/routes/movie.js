const mongoose = require('mongoose')
const {controller, get, post, put} = require('../lib/decorator')

@controller('/api/v0/movies')
export class movieController {
  @get('/')  // 获取所有movie数据
  async getMovies (ctx, next) {
    const Movie = mongoose.model('Movie')
    const movies = await Movie.find({}).sort({
      'meta.createdAt' : -1 // 创建时间从近到远排序
    })
    
    ctx.body = {
      movies
    }
  }
  @get('/:id') // 获取某电影详细数据
  async getMovieDetail (ctx, next) {
    const Movie = mongoose.model('Movie')
    const id = ctx.params.id
    const movie = await Movie.find({_id: id}).exec()
    
    ctx.body = {
      movie
    }
  }
}