const {controller, get, post, put} = require('../lib/decorator')
const {
  checkPassword
} = require('../service/user')

@controller('/api/v0/user')
export class userController {
  @post('/')  // 获取所有movie数据
  async login (ctx, next) {
    const {email, password} = ctx.request.body
    const matchData = await checkPassword(email, password)
    
    if (!matchData.user) {
      return (ctx.body = {
        success: false,
        err: '用户或密码错误'
      })
    }
    
    if (matchData.match) {
      return (ctx.body = {
        success: true
      })
    }
    
    return (ctx.body = {
      success: false,
      err: '用户或密码错误'
    })
  }
}