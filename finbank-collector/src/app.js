const express = require('express')
const classifierRouter = require('./routes/classifier.router')
const cors = require('cors')

const app = express()

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/classifier', classifierRouter)

module.exports = app
