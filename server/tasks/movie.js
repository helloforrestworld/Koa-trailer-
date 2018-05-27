const cp = require('child_process')
const {resolve} = require('path')

const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')
const script =  resolve(__dirname, '../crawler/trailer-list')
export const crawMoives =  new Promise((resolve, reject) => {
  (async () => {
    const child = cp.fork(script, [])
    let invoked = false
    
    child.on('error', err => {
      if (invoked) return
      
      invoked = true
      
      console.log(err)
    })
    
    child.on('exit', code => {
      if (invoked) return
      
      invoked = true
      
      let err = code === 0 ? null : new Error('exit code' + code)
      
      console.log(err)
    })
    
    child.on('message', async (data) => {
      let result = data.result // 爬虫后movies的数据导入数据库
      
      for (var i = 0; i < result.length; i++) {
        let item = result[i]
        if (item.doubanId) {
          let movie = await Movie.findOne({
            doubanId: item.doubanId
          }).exec()
          
          if (!movie) {
            movie = new Movie(item)
            await movie.save()
          }
        }
        if (i === result.length - 1) {
          console.log('resolve')
          resolve({success: true})
        }
      }
    })
  })()
})
