// ------------------------------------------
// This is a fun project made under 2 days ;)
// ------------------------------------------

import { createRequire } from 'module'
import { nanoid } from 'nanoid'
import { Model } from './model.js'
const require = createRequire(import.meta.url)
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
require('dotenv').config()
const ejs = require('ejs')

const path = require('path')

// Mongoose
const mongoose = require('mongoose')

mongoose
  .connect(process.env.mongo)
  .catch((err) => {
    console.log('Error connecting to mongodb')
    console.log(err)
    process.exit(1)
  })
  .then(() => console.log('Connected to mongodb'))

// Using bodyParser
app.use(bodyParser.urlencoded({ extended: true }))

// Set engine to EJS
app.engine('html', ejs.renderFile)
app.set('view engine', 'html')

app.use(express.static('./site'))

// ----------------------------
// All the Functions necessary
// ----------------------------

// A Simple function to render files
const renderTemplate = (res, req, template, data = {}) => {
  const baseData = {
    path: req.path
  }
  res.render(
    path.resolve(`${process.cwd()}${path.sep}site/${template}`),
    Object.assign(baseData, data)
  )
}

// A length of 12 makes takes 1 thousand years to have a 1% probability of collision at a rate of 1000 ids per hour
const makeid = (length) => (length ? nanoid(length) : nanoid(12))

// ----------------------------

// Home Page. You can set it into create.ejs
app.get('/', (req, res) => {
  renderTemplate(res, req, 'index.ejs')
})

app.get('/create', async (req, res) => {
  renderTemplate(res, req, 'create.ejs')
})

// POST request from the form to create bins/paste
app.post('/create', async (req, res) => {
  if (req.body.code === '' || !req.body.code) {
    return res.redirect('/create')
  }

  const id = makeid(12) // Create a special UID (8 characters)

  const obj = new Model({
    title: req.body.title || 'Untitled',
    desc: req.body.desc || 'No Description',
    code: req.body.code
      .replaceAll("'", `\\'`)
      .replaceAll('"', `\\"`)
      .replaceAll("`", '\\`'), // Escape some characters

    uid: id,
    language: req.body.language,
    filename: req.body.filename
  })

  await obj.save()

  res.redirect(`/file/${id}`)
})

app.get('/file/:uid', async (req, res) => {
  const data = await Model.findOne({ uid: req.params.uid })

  if (!data) return renderTemplate(res, req, 'error.ejs')
  // Throw error if the file is not found.
  else {
    data.code = data.code
      .replaceAll("'", `\\'`)
      .replaceAll('"', `\\"`)
      .replaceAll("`", '\\`') // Supporting legacy bins (old bins)
      
      
    renderTemplate(res, req, 'file.ejs', { data })
  }
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Listening to PORT: ${port}`)
})
