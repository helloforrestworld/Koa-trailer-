// 上传数据到七牛图床
// { doubanId: 27160683,
//     title: '忍者蝙蝠侠',
//     rate: 7.1,
//     poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2506695706.jpg' 
// },

const qiniu = require('qiniu')
const nanoid = require('nanoid') // 生成随机ID作为静态资源文件名
const config = require('../config')

const bucket = config.qiniu.bucket
const mac = new qiniu.auth.digest.Mac(config.qiniu.AK, config.qiniu.SK)
const cfg = new qiniu.conf.Config()
const client = new qiniu.rs.BucketManager(mac, cfg)

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

;(async () => {
  let movies = [{
    doubanId: 27160683,
    video: 'http://vt1.doubanio.com/201805112330/08f8c408e430d33ca33704ea2724d48b/view/movie/M/302270554.mp4',
    cover: 'https://img3.doubanio.com/img/trailer/medium/2513586693.jpg?',
    poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2506695706.jpg'
  }]
  
  movies.map(async movie => {
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
        console.log(movie)
      } catch(err) {
        console.log(err)
      }
    }
  })
})()

// { doubanId: 27160683,
//   video: 'http://vt1.doubanio.com/201805112330/08f8c408e430d33ca33704ea2724d48b/view/movie/M/302270554.mp4',
//   cover: 'https://img3.doubanio.com/img/trailer/medium/2513586693.jpg?',
//   poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2506695706.jpg',
//   videoKey: 'ciR_9lBN9u4m98A9F0EM0.mp4',
//   coverKey: 'sNRen81_THL8WBldRSjIO.png',
//   posterKey: 'L50JCu_8dMng6tmzWB8H~.png' }



