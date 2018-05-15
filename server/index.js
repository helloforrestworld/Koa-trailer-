const koa = require('koa')
const app = new koa()
const logger = require('koa-logger')
const {resolve} = require('path')
const mongoose = require('mongoose')
const {connect, initSchemas} = require('./database/init')
const R = require('ramda')
const MIDDLEWARES = ['router', 'parcel']

// 加载中间件数组
const useMiddlewares = (app) => {
  R.map(
    R.compose(
      R.forEachObjIndexed( // 每个属性依次执行给定函数
        initWith => initWith(app) //initWith 引入的函数
      ),
      require, // 引入
      name => resolve(__dirname, `./middlewares/${name}`) // 路径
    )
  )(MIDDLEWARES)
}

;(async () => {
  await connect() // 连接数据库
  
  initSchemas() // 初始化schema
  
  // require('./tasks/movie.js') // 启用movie.js爬虫脚本
  // require('./tasks/api.js') // 通过豆瓣请求详细数据
  // require('./tasks/trailer.js') // 封面图和预告片视频地址
  // require('./tasks/qiniu.js') // 七牛存储静态资源
  app.use(logger())
  
  await useMiddlewares(app)
  
  app.listen(3333, (err) => {
    if (err) {
      console.log(err)
    } else {
      console.log('Test Server Running at port 3333')
    }
  })
})()

