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

// 七牛删除数据方法
const deleteFromQiniu = async (key) => {
  return new Promise((resolve, reject) => {
    client.delete(bucket, key, (err, ret, info) => {
      if (err) {
        reject(err)
      } else {
        console.log(info.statusCode)
        resolve(ret)
      }
    })
  })
}


// 开始上传数据
export const init = async function init(movie, whichChange){
  return new Promise( async (resolve, reject) => {
    let movies = []
    let first = false
    if (!movie) { // 批量上传
      first = true
      movies = await Movie.find({
        $or: [
          {videoKey: {$exists: false}},
          {videoKey: null},
          {videoKey: ''}
        ],
        uptoQiniu: true
      }).exec()
    } else {
      if (movie.uptoQiniu) movies.push(movie)
    }
    
    for (let i = 0; i < movies.length; i ++) {
      let movie = movies[i]
      try {
        let videoData, coverData, posterData
        if (first || (whichChange && whichChange.video)) {
          console.log('准备获取并上传video')
          videoData = await uploadToQiniu(movie.video, nanoid() + '.mp4')
        }
        if (first || (whichChange && whichChange.cover)) {
          console.log('准备获取并上传cover')
          coverData = await uploadToQiniu(movie.cover, nanoid() + '.png')
        }
        if (first || (whichChange && whichChange.poster)) {
          console.log('准备获取并上传poster')
          posterData = await uploadToQiniu(movie.poster, nanoid() + '.png')
        }
        
        if (videoData && videoData.key) {
          await deleteFromQiniu(movie.videoKey)
          movie.videoKey = videoData.key
        }
        if (coverData && coverData.key) {
          await deleteFromQiniu(movie.coverKey)
          movie.coverKey = coverData.key
        }
        if (posterData && posterData.key) {
          await deleteFromQiniu(movie.posterKey)
          movie.posterKey = posterData.key
        }
        
        await movie.save()
      } catch(err) {
        reject(err)
      }
    }
    resolve({success: true})
  })
}