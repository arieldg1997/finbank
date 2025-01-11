const express = require('express')
const { listUsers, register, login } = require('../controllers/user.controller')

const userRouter = express.Router()

userRouter.get('/', listUsers)
userRouter.post('/register', register)
userRouter.post('/login', login)

module.exports = userRouter
