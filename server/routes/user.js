const {
  controller,
  get,
  post,
  put,
  auth,
  admin,
  required,
  del
} = require('../lib/decorator')
const {
  checkPassword
} = require('../service/user')
const {
  getAllMovies,
  findAndRemove,
  fetchAndSave
} = require('../service/movie')

@controller('/admin')
export class adminController {
  @get('/movie/list')
  @auth // 登录状态
  @admin('admin') // 管理员
  async getMovies (ctx, next) {
    let {start = 0, end} = ctx.query
    const movies = await getAllMovies()
    
    start = parseInt(start)
    end = parseInt(end)
    end = end ? end : movies.length
    let ret = []
    
    if (movies) ret = movies.slice(start, end) 
    
    ctx.body = {
      movies: ret,
      total: movies.length,
      success: true
    }
  }
  
  @del('/movies')
  @auth // 登录状态
  @admin('admin') // 管理员
  @required({ // 参数合法性检验
    query: ['id']
  })
  async remove (ctx, next) {
    const id = ctx.query.id
    const movie = await findAndRemove(id)
    const movies = await getAllMovies()
    
    ctx.body = {
      data: movies,
      success: true
    }
  }
  
  @post('/login')  // 登录
  @required({ // 参数合法性检验
    body: ['email', 'password']
  })
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
      ctx.session.user = {
        _id: matchData.user._id,
        email: matchData.user.email,
        role: matchData.user.role,
        username: matchData.user.username
      }
      return (ctx.body = {
        success: true
      })
    }
    
    return (ctx.body = {
      success: false,
      err: '用户或密码错误'
    })
  }
  
  @post('/upload') // 添加电影
  @auth // 登录状态
  @admin('admin') // 管理员
  @required({
    body: ['movie']
  })
  async upload (ctx, next) {
    const movie = ctx.request.body.movie
    const ret = await fetchAndSave(movie)
    if (ret && ret.success) { // 上传成功
      const movies = await getAllMovies()
      
      ctx.body = {
        data: movies,
        success: true
      }
    } else {
      ctx.body = { // 上传失败
        success: false
      }
    }
  }
}