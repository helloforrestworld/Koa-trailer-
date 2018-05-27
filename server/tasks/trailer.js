const cp = require('child_process')
const {resolve} = require('path')

const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')
const script =  resolve(__dirname, '../crawler/video')

export const crawTrailer = new Promise((resolve, reject) => {
  (async () => {
    let movies = await Movie.find({ // 获取需要爬video的movie数据
      $or: [
        {video: {$exists: false}},
        {video: null}
      ]
    }).exec()
    
    const child = cp.fork(script, []) // 开启子进程 等待信息传递
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
      let doubanId = data.doubanId
      let movie = await Movie.findOne({
        doubanId: doubanId
      }).exec()
      
      if (data.video) {
        movie.video = data.video
        movie.cover = data.cover
        
        await movie.save()
      } else {
        await movie.remove()
      }
      
      if (data.finish) {
        resolve({success: true})
      }
    })
    child.send(movies) // 开始爬虫
  })()
})