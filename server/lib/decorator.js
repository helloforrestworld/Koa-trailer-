const Router = require('koa-router')
const glob = require('glob')
const {resolve} = require('path')
const _ = require('lodash')

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
    
    // 装饰路由
    for (let [conf, controller] of routerMap) {
      const controllers = isArray(controller)
      cosnt prefixPath = conf.target[symbolPrefix]
      
      if (prefixPath) prefixPath = normalizePath(prefixPath)
      const routerPath = prefixPath + conf.path
      this.router[conf.method](routerPath, ...controllers)
    }
    
    this.app.use(this.router.routes())
    this.app.use(router.allowedMethods())
  }
}



const normalizePath = path => path.startsWith('/') ? path : `/${path}`

const router = conf => (target, key, descriptor) => {
  conf.path = normalizePath(conf.path)
  
  routerMap.set({
    target: target,
    ...conf
  }, target[key])
}

// 装饰器方法实现
export const controller = path => target => (target.prototype[symbolPrefix] = path)

export const get = path => router({
  method: 'get',
  path: path
})

export const post = path => router({
  method: 'get',
  path: path
})

export const put = path => router({ // 修改已有的
  method: 'get',
  path: path
})

export const del = path => router({
  method: 'get',
  path: path
})

export const use = path => router({ // router使用某些中间件
  method: 'get',
  path: path
})

export const all = path => router({ // 处理所有的请求
  method: 'get',
  path: path
})