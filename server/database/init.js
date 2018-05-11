const mongoose = require('mongoose')
const db = 'mongodb://localhost/local'

mongoose.Promise = global.Promise // 老版本的mongoose 实现的Promise不太一样

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
      let Dog = mongoose.model('Dog', {name: String})
      let dog1 = new Dog({name: 'jackey'})
      
      dog1.save().then(() => {
        console.log('dog1存储成功')
      })
      
      failTime = 0
      console.log('MongoDB Connectd Successfully!')
    })
  })
}