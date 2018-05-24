import bodyParser from 'koa-bodyparser'
import logger from 'koa-logger'
import session from 'koa-session'
import compress from 'koa-compress'

export const addLogger = app => {
  app.use(logger())
}

export const addBodyParser = app => {
  app.use(bodyParser())
}

export const addCompress = app => {
  app.use(compress())
}

export const addSession = app => {
  app.keys = ['forrest-movie']
  const CONFIG = {
    key: 'koa:sess',
    maxAge: 86400000,
    overwrite: true,
    httpOnly: false,
    signed: true,
    rolling: false
  }
  app.use(session(CONFIG, app))
}