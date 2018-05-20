const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed // mongoose的混合数据类型
const ObjectId = Schema.Types.ObjectId 

export const config = {
  doubanId: {
    unique: true,
    type: String
  },
  category: [{
    type: ObjectId,
    ref: 'Category' // 引用关系
  }],
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
  
  uptoQiniu: {
    type: Boolean,
    default: true
  },
  
  meta: {
    createdAt: { // 信息创建时间
      type: Date,
      default: Date.now()
    },
    updatedAt: { // 信息更新时间
      type: Date,
      default: Date.now()
    }
  }
}

const movieSchema = new Schema(config)

movieSchema.pre('save', function (next) { // 保存一条数据前
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  
  next()
})

mongoose.model('Movie', movieSchema)