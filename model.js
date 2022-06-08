let mongoose = require('mongoose')

let model = new mongoose.Schema({
  uid: 'string',
  title: 'string',
  desc: "string",
  code: "string",
  language: "string",
  filename: "string"
})

module.exports = mongoose.model('binnium', model)
