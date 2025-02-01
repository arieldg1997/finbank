const express = require('express')
const userRouter = require('./routes/user.router')
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

app.use('/user', userRouter)

module.exports = app
