// 跟数据库进行交互
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')
const Category = mongoose.model('Category')
import {uploadToQiniu, nanoid} from '../tasks/qiniu'

export const getAllMovies =  async (type, year) => {
  let query = {}
  if (type) {
    query.movieTypes = {
      $in: [type]
    }
  }
  
  if (year) {
    query.year = year
  }
  const movies = await Movie.find(query)
  
  return movies
}

export const getMovieDetail =  async (id) => {
  
  const movie = await Movie.findOne({_id: id}).exec()
  
  return movie
}

export const getRelativeMovies =  async (movie) => {
  const movies = await Movie.find({
    movieTypes: {
      $in: movie.movieTypes
    }
  }).exec()
  
  return movies
}

export const findAndRemove = async (id) => {
  const movie = await Movie.findOne({_id: id}).exec()
  
  if (movie) {
    await movie.remove()
  }
}

export const fetchAndSave = async (item) => {
  
  let movie = await Movie.findOne({_id: item._id}).exec()
  if (movie) {
    Object.assign(movie, item)
  } else {
    movie = new Movie(item)
    movie.category = []
    for (let i = 0; i < movie.movieTypes.length; i++) {
      let item = movie.movieTypes[i]
      let cat = await Category.findOne({
        name: item
      }).exec()
      if (!cat) {
        cat = new Category({
          name: item,
          movies: [movie._id]
        })
      } else {
        if (cat.movies.indexOf(movie._id) === -1) {
          cat.movies.push(movie._id)
        }
      }
      movie.category.push(cat._id)
      await cat.save()
    }
  }
  
  await movie.save()
  
  // console.log("item", item)
  // let movie
  // if (item._id) { // 修改数据
  //   movie = await Movie.findOne({
  //     _id: item._id
  //   }).exec()
  // } else { // 添加数据
  //   movie = new Movie(item)
  // }
  // console.log("movie", movie)
  // // 向七牛传数据
  // let videoData, coverData, posterData
  // if (movie.video !== item.video || !item._id) {
  //   try {
  //     console.log('准备获取并上传video')
  //     let videoData = await uploadToQiniu(item.video, nanoid() + '.mp4')
  //     console.log('准备获取并上传cover')
  //     let coverData = await uploadToQiniu(item.cover, nanoid() + '.png')
  //     console.log('准备获取并上传poster')
  //     let posterData = await uploadToQiniu(item.poster, nanoid() + '.png')
  // 
  //     if (videoData.key) {
  //       movie.videoKey = videoData.key
  //     }
  //     if (coverData.key) {
  //       movie.coverKey = coverData.key
  //     }
  //     if (posterData.key) {
  //       movie.posterKey = posterData.key
  //     }
  // 
  //     await movie.save()
  //   } catch(err) {
  //     console.log(movie.cover)
  //     console.log(err)
  //   }
  // }
  // 
  // if (item._id) {
  //   Object.assign(movie, item)
  // }
  // 
  // // 处理目录
  // if (!movie.category)  movie.category = []
  // for (let i = 0; i < movie.movieTypes.length; i++) {
  //   let item = movie.movieTypes[i]
  //   let cat = await Category.findOne({
  //     name: item
  //   }).exec()
  //   if (!cat) {
  //     cat = new Category({
  //       name: item,
  //       movies: [movie._id]
  //     })
  //   } else {
  //     if (cat.movies.indexOf(movie._id) === -1) {
  //       cat.movies.push(movie._id)
  //     }
  //   }
  //   if (movie.category.indexOf(cat._id) === -1) {
  //     movie.category.push(cat._id)
  //   }
  //   await cat.save()
  // }
  // 
  // // 保存电影数据到数据库
  // await movie.save()
}