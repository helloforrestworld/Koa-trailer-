const Router = require('koa-router')
const mongoose = require('mongoose')
const router = new Router()

// 获取所有movie数据
router.get('/movie/all', async (ctx, next) => {
  const Movie = mongoose.model('Movie')
  const movies = await Movie.find({}).sort({
    'meta.createdAt' : -1 // 创建时间从近到远排序
  })
  
  ctx.body = {
    movies
  }
})

// 获取某条数据
router.get('/moviedetail/:id', async (ctx, next) => {
  const Movie = mongoose.model('Movie')
  const id = ctx.params.id
  const movie = await Movie.find({_id: id}).exec()
  
  ctx.body = {
    movie
  }
})

module.exports = router