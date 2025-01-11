const express = require('express')
const userRouter = require('./routes/user.router')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/user', userRouter)

module.exports = app
