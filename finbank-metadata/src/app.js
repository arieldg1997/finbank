const express = require('express')
const metadataRouter = require('./routes/metadata.router')
const cors = require('cors')

const app = express()

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/metadata', metadataRouter)

module.exports = app
