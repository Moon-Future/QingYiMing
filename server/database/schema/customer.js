const mongoose = require('mongoose')
const Schema = mongoose.Schema
const currentTime = new Date().getTime()

const customerSchema = new Schema({
  customer: { type: String },
  name: { type: String, default: '木托盘' },
  model: { type: String, default: '' },
  nun: { type: String, default: '' },
  unit: { type: String, default: '' },
  createTime: { type: Number, default: currentTime },
  upadteTime: { type: Number, default: null }
}, {
  collections: 'customer'
})

module.exports = mongoose.model('Customer', customerSchema, 'customer')