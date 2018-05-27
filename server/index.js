const koa = require('koa')
const app = new koa()
const logger = require('koa-logger')
const {resolve} = require('path')
const mongoose = require('mongoose')
const {connect, initSchemas, initUser} = require('./database/init')
const R = require('ramda')
const MIDDLEWARES = ['common', 'router', 'parcel']


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
  await initUser() // 初始Forrest用户
  
  await useMiddlewares(app)
  
  app.listen(3333, (err) => {
    if (err) {
      console.log(err)
    } else {
      console.log('Test Server Running at port 3333')
    }
  })
  
  // 启动爬虫脚本
  await require('./tasks/movie').crawMoives
  console.log('基础数据爬取完成')
  await require('./tasks/api').fetchDetails
  console.log('数据详情爬取完成')
  await require('./tasks/trailer').crawTrailer
  console.log('视频海报爬取完成')
  const uptoQiniu =  require('./tasks/qiniu').init
  await uptoQiniu()
  console.log('视频海报上传七牛云成功')
})()

