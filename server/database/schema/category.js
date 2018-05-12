const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId // mongoose的id数据类型

const categorySchema = new Schema({
  name: {
    unique: true,
    type: String
  },
  movies: [{
    type: ObjectId,
    ref: 'Movie' // 引用关系
  }],
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
})

categorySchema.pre('save', function (next) { // 保存一条数据前
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  
  next()
})

mongoose.model('Category', categorySchema)