const mongoose = require('mongoose')
const Schema = mongoose.Schema
const currentTime = new Date().getTime()

const unitSchema = new Schema({
  name: { type: String, unique: true },
  createTime: { type: Number, default: currentTime },
  upadteTime: { type: Number, default: null }
}, {
  collections: 'unit'
})

module.exports = mongoose.model('Unit', unitSchema, 'unit')