const mongoose = require('mongoose')
const Schema = mongoose.Schema
const currentTime = new Date().getTime()

const productSchema = new Schema({
  name: { type: String, default: '木托盘' },
  model: { type: String, unique: true },
  unit: { type: String, default: '个' },
  createTime: { type: Number, default: currentTime },
  upadteTime: { type: Number, default: null }
}, {
  collections: 'product'
})

module.exports = mongoose.model('Product', productSchema, 'product')