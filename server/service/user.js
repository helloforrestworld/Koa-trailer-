// 处理登录和后台管理
const mongoose = require('mongoose')
const User = mongoose.model('User')

export const checkPassword = async(email, password) => {
  let match = false
  const user = await User.findOne({email}).exec()
  
  if (user) {
    match = await user.comparePassword(password, user.password)
  }
  
  return {
    match,
    user
  }
}