const mongoose = require('mongoose')
const db = 'mongodb://localhost/premovie'
const glob = require('glob') // 加载匹配到的模块
const { resolve } = require('path')

mongoose.Promise = global.Promise // 老版本的mongoose 实现的Promise不太一样

exports.initSchemas = () => { // 同步加载所有schema方法
  glob.sync(resolve(__dirname, './schema', '**/*.js')).forEach(require)
}

exports.initUser = async () => {
  const User = mongoose.model('User')
  let user = await User.findOne({
    username: 'Forrest'
  })
  if (!user) {
     user = new User({
      username: 'Forrest',
      email: 'admin@qq.com',
      password: '123456',
      role: 'admin'
    })
    await user.save()
  }
}

exports.connect = () => {
  
  return new Promise((resolve, reject) => {
    let failTime = 0
    
    if (process.env.NODE_ENV !== 'production') {
      mongoose.set('debug', true)
    }
    mongoose.connect(db)
    
    mongoose.connection.on('disconnected', () => {
      failTime ++
      if (failTime > 5) {
        reject('数据库重连失败')
      } else {
        mongoose.connect(db)
      }
    })
    
    mongoose.connection.on('error', err => {
      if (failTime >= 5) {
        reject(err)
      }
    })
    
    mongoose.connection.once('open', () => {
      resolve()
      
      failTime = 0
      console.log('MongoDB Connectd Successfully!')
    })
  })
}