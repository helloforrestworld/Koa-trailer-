const cp = require('child_process')
const {resolve} = require('path')

const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')

;(async () => {
  const script =  resolve(__dirname, '../crawler/trailer-list')
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
  
  child.on('message', data => {
    let result = data.result // 爬虫后movies的数据导入数据库
    
    result.forEach(async (item) => {
      if (!item.doubanId) return
      
      let movie = await Movie.findOne({
        doubanId: item.doubanId
      }).exec()
      
      if (!movie) {
        movie = new Movie(item)
        await movie.save()
      }
    })
  })
})()