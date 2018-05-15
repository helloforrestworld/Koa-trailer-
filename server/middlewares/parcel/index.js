const env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
const {resolve} = require('path')
const script = require(resolve(__dirname, `${env}.js`))

module.exports = script