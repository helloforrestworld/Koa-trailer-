const koa = require('koa')
const app = new koa()
const logger = require('koa-logger')
const {connect} = require('./database/init')

;(async () => {
  await connect()
})()

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