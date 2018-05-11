const koa = require('koa')
const app = new koa()
const logger = require('koa-logger')
const mongoose = require('mongoose')
const {connect, initSchemas} = require('./database/init')

;(async () => {
  await connect() // 连接数据库
  
  initSchemas() // 初始化schema
  
  // 测试
  const Movie = mongoose.model('Movie')
  const movies = await Movie.find({})
  console.log(movies)
  
  app.use(logger())
  
  app.use(async (ctx, next) => {
    ctx.body = '电影首页'
  })
  
  app.listen(3333, (err) => {
    if (err) {
      console.log(err)
    } else {
      console.log('Test Server Running at port 3333')
    }
  })
})()

