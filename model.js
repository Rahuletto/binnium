import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const mongoose = require('mongoose')

const models = new mongoose.Schema({
  uid: 'string',
  title: 'string',
  desc: 'string',
  code: 'string',
  language: 'string',
  filename: 'string'
})

export const Model = mongoose.model('binnium', models)
