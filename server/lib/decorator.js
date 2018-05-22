const Router = require('koa-router')
const glob = require('glob')
const {resolve} = require('path')
const _ = require('lodash')
const R = require('ramda')

const symbolPrefix = Symbol('prefix')
const routerMap = new Map()

const isArray = c => _.isArray(c) ? c : [c]

export class Route {
  constructor (app, apiPath) {
    this.app = app
    this.apiPath = apiPath
    this.router = new Router()
  }
  
  init () { // 初始化路由
    
    // 加载路由
    glob.sync(resolve(this.apiPath, '**/*.js')).forEach(require)
    
    // 从routerMap读取路径和方法 初始化路由
    for (let [conf, controller] of routerMap) {
      const controllers = isArray(controller)
      let prefixPath = conf.target[symbolPrefix]
      
      if (prefixPath) prefixPath = normalizePath(prefixPath)
      const routerPath = prefixPath + conf.path
      this.router[conf.method](routerPath, ...controllers)
    }
    
    this.app.use(this.router.routes())
    this.app.use(this.router.allowedMethods())
  }
}



const normalizePath = path => path.startsWith('/') ? path : `/${path}`

const router = conf => (target, key, descriptor) => {
  conf.path = normalizePath(conf.path)
  
  routerMap.set({
    target: target,
    path: conf.path,
    method: conf.method
  }, target[key])
}

// 装饰器方法实现
export const controller = path => target => (target.prototype[symbolPrefix] = path)

export const get = path => router({
  method: 'get',
  path: path
})

export const post = path => router({
  method: 'post',
  path: path
})

export const put = path => router({
  method: 'put',
  path: path
})

export const del = path => router({
  method: 'delete',
  path: path
})

// const changeToArr = R.unless(
//   R.is(isArray),
//   R.of
// )

// const convert = middleware => (target, key, descriptor) => {
//   return (target, key, descriptor) => {
//     target[key] = R.compose(
//       R.concat(
//         changeToArr(middleware)
//       ),
//       changeToArr
//     )(target[key])
//     return descriptor
//   }
// }


const decorate = (args, middleware) => {
  let [target, key, descriptor] = args

  target[key] = isArray(target[key])
  target[key].unshift(middleware)

  return descriptor
}

const convert = middleware => (...args) => decorate(args, middleware)

export const auth = convert (async (ctx, next) => {
  if (!ctx.session.user) {
    return (
      ctx.body = {
        success: false,
        code: 401,
        err: '登录信息失效,重新登录'
      }
    )
  }
  await next()
})

export const admin = roleExpected => convert (async (ctx, next) => {
  const { role } = ctx.session.user
  
  if (!role || role !== roleExpected  ) {
    return (
      ctx.body = {
        success: false,
        code: 403,
        err: '权限不足'
      }
    )
  }
  await next()
})

export const required = paramsObj => convert(async (ctx, next) => {
  let errs = []

  R.forEachObjIndexed(
    (val, key) => {
      errs = errs.concat(
        R.filter(
          name => !R.has(name, ctx.request[key])
        )(val)
      )
    }
  )(paramsObj)

  if (!R.isEmpty(errs)) {
    return (
      ctx.body = {
        success: false,
        errCode: 412,
        errMsg: `${R.join(', ', errs)} is required`
      }
    )
  }
  await next()
})
