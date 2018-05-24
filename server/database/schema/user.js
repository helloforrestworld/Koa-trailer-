const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed // mongoose的混合数据类型
const SALT_WORK_FACTOR = 10 // 加盐参数
const MAX_LOGIN_ATTEMPTS = 10 // 频繁登录上限 
const LOCK_TIME = 0.5 * 60 * 60 * 1000 // 半小时锁定

const userSchema = new Schema({
  username: {
    unique: true, // 唯一的字段
    require: true,
    type: String
  },
  email: {
    unique: true,
    require: true,
    type: String
  },
  password: { // 加密处理
    unique: true,
    type: String
  },
  loginUntil: Number,
  loginAttempts: {
    type: Number,
    require: true,
    default: 0
  },
  role: {
    type: String,
    default: 'user'
  },
  meta: {
    createdAt: { // 信息创建时间
      type: Date,
      default: Date.now()
    },
    updatedAt: { // 信息更新时间
      type: Date,
      default: Date.now()
    }
  }
})

userSchema.virtual('isLocked').get(function () { // 虚拟字段  是否被锁定
  return !!(this.lockUntil && this.lockUntil > Date.now())
})

userSchema.pre('save', function (next) { // 保存一条数据前
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})
userSchema.pre('save', function (next) { // 保存一条数据前
  if (!this.isModified('password')) return next() // 密码没被修改
  // 加密处理
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => { // 加盐
    if (err) return next(err)
    
    bcrypt.hash(this.password, salt, (error, hash) => { // 盐 + hash
      if (error) return next(err)
      console.log('bcrypt:'+ hash)
      this.password = hash // 设置密码
      next()
    })
  })
})

userSchema.methods = { // 增加实例方法
  comparePassword: (_password, password) => { // 核对密码
    // _password 网站提交的明文密码
    // password  数据库加密后的
    return new Promise((resolve, reject) => {
      bcrypt.compare(_password, password, (err, isMatch) => {
        if (!err) resolve(isMatch)
        else reject(err)
      })
    })
  },
  incLoginAttempts: (user) => { // 处理登录上限 和 锁定时间
    return new Promise((resolve, reject) => {
      if (this.lockUtil && this.lockUtil < Date.now()) { // 被锁定 且过了锁定时间
        this.update({
          $set: {
            loginAttempts: 1
          },
          $unset: {
            loginUntil: 1
          }
        }, (err) => {
          if (!err) resolve(true)
          else reject(err)
        })
      } else {
        let updates = {
          $inc: {
            loginAttempts: 1
          }
        }
        
        if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) { // 用户频繁访问
          updates.$set = {
            lockUtil: Date.now() + LOCK_TIME
          }
        }
        
        this.update(updates, err => {
          if (!err) resolve(true)
          else reject(err)
        })
      }
    })
  }
}

mongoose.model('User', userSchema)