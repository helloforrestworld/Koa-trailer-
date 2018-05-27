// 跟数据库进行交互
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')
const Category = mongoose.model('Category')
import {uploadToQiniu, nanoid} from '../tasks/qiniu'
import {init as qiniu} from '../tasks/qiniu'
import {deepCopy} from '../lib/util'

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
  const movies = await Movie.find(query).sort({'meta.updatedAt':  -1}).exec() 
  
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
  }).limit(10).exec()
  
  return movies
}

export const findAndRemove = async (id) => {
  const movie = await Movie.findOne({_id: id}).exec()
  
  if (movie) {
    await movie.remove()
  }
}

export const fetchAndSave = async (item) => {
  let whichChange = {video: true, poster: true, cover: true}
  let rollbackMovie = {} //上传失败回滚 
  
  let movie = await Movie.findOne({_id: item._id}).exec()
  if (movie) { // 修改
    whichChange.video = movie.video !== item.video
    whichChange.poster = movie.poster !== item.poster
    whichChange.cover = movie.cover !== item.cover
    
    rollbackMovie = deepCopy(movie)
    Object.assign(movie, item)
  } else { // 添加
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
  
  // 同步资源到七牛
  return await qiniu(movie, whichChange).catch( async (err) => {
    //上传失败回滚
    if (rollbackMovie.meta) {
      Object.assign(movie, rollbackMovie)
      await movie.save()
    } else {
      await movie.remove()
    }
    console.log(err)
  })
}

export const searchMovies = async (search) => {
  let movies
  try {
    let query = {
      $or: [
        { title: {$regex: new RegExp(search, 'i')} },
        { tags: {$in: [search]} },
        { movieTypes: {$in: [search]} }
      ]
    }
    if (parseInt(search)) {
      query.$or.push(
        { year: parseInt(search)}
      )
    }
    movies = await Movie.find(query).exec()
  } catch(err) {
    console.log(err)
    return {err}
  }
  return {movies}
}