const koa = require('koa')
const app = new koa()
const logger = require('koa-logger')
const mongoose = require('mongoose')
const {connect, initSchemas} = require('./database/init')
const router = require('./routes')

;(async () => {
  await connect() // 连接数据库
  
  initSchemas() // 初始化schema
  
  // require('./tasks/movie.js') // 启用movie.js爬虫脚本
  // require('./tasks/api.js') // 通过豆瓣请求详细数据
  // require('./tasks/trailer.js') // 封面图和预告片视频地址
  // require('./tasks/qiniu.js') // 七牛存储静态资源
  app.use(logger())
  
  app
    .use(router.routes())
    .use(router.allowedMethods())
  
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

