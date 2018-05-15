const Bundler = require('parcel-bundler')
const views = require('koa-views')
const stati = require('koa-static')
const {resolve} = require('path')

const r = path => resolve(__dirname, path)

export const prod = async app => {
  app.use(stati(r('../../../dist')))
  app.use(views(r('../../../dist')), {
    extension: 'html'
  })
  
  app.use(async (ctx) => {
    await ctx.render('index.html')
  })
}