const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed // mongoose的混合数据类型

const movieSchema = new Schema({
  doubanId: String,
  rate: Number,
  title: String,
  summary: String,
  poster: String,
  video: String,
  cover: String,
  
  posterKey: String,
  videoKey: String,
  coverKey: String,
  
  rawTitle: String,
  movieTypes: [String],
  pubdate: Mixed,
  year: Number,
  
  tags: Array,
  
  meta: {
    createdAt: { // 信息创建时间
      type: Date,
      default: Date.now()
    }
    updatedAt: { // 信息更新时间
      type: Date,
      default: Date.now()
    }
  }
})

mongoose.model('Movie', movieSchema)