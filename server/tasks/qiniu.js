// 上传数据到七牛图床

const qiniu = require('qiniu')
const nanoid = require('nanoid') // 生成随机ID作为静态资源文件名
const config = require('../config')
const mongoose = require('mongoose')


// 七牛认证
const bucket = config.qiniu.bucket
const mac = new qiniu.auth.digest.Mac(config.qiniu.AK, config.qiniu.SK)
const cfg = new qiniu.conf.Config()
const client = new qiniu.rs.BucketManager(mac, cfg)

const Movie = mongoose.model('Movie')

// 七牛download数据方法
const uploadToQiniu = async (url, key) => { 
  return new Promise((resolve, reject) => {
    client.fetch(url, bucket, key, (err, ret, info) => {
      if (err) {
        reject(err)
      } else {
        if (info.statusCode === 200) {
          resolve({ key })
        } else {
          reject(info)
        }
      }
    })
  })
}

// 开始上传数据
;(async () => {
  let movies = await Movie.find({
    $or: [
      {videoKey: {$exists: false}},
      {videoKey: null},
      {videoKey: ''}
    ]
  }).exec()
  
  for (let i = 0; i < movies.length; i ++) {
    let movie = movies[i]
    if (movie.video && !movie.key) {
      try {
        console.log('准备获取并上传video')
        let videoData = await uploadToQiniu(movie.video, nanoid() + '.mp4')
        console.log('准备获取并上传cover')
        let coverData = await uploadToQiniu(movie.cover, nanoid() + '.png')
        console.log('准备获取并上传poster')
        let posterData = await uploadToQiniu(movie.poster, nanoid() + '.png')
        
        if (videoData.key) {
          movie.videoKey = videoData.key
        }
        if (coverData.key) {
          movie.coverKey = coverData.key
        }
        if (posterData.key) {
          movie.posterKey = posterData.key
        }
        
        await movie.save()
      } catch(err) {
        console.log(err)
      }
    }
  }
})()



