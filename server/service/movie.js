// 跟数据库进行交互
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')
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
  console.log(id)
  const movie = await Movie.findOne({_id: id}).exec()
  
  if (movie) {
    await movie.remove()
  }
}