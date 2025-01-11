const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')

dotenv.config()

const AWS = require('../config/keys')
const dynamoDB = new AWS.DynamoDB.DocumentClient()

const TABLE_NAME = 'finbank-users'

const listUsers = async (req, res) => {
  const params = {
    TableName: TABLE_NAME
  }

  try {
    const data = await dynamoDB.scan(params).promise()
    res.json(data.Items)
  } catch (error) {
    console.error('Error al listar usuarios:', error)
    throw new Error('No se pudieron obtener los usuarios.')
  }
}

const register = async (req, res) => {
  const { username, password, email, name, surname, domain, role } = req.body

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required' })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = {
      username: username,
      email: email || null,
      name: name || null,
      surname: surname || null,
      domain: domain || null,
      role: role || 'user',
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const params = {
      TableName: TABLE_NAME,
      Item: newUser
    }

    await dynamoDB.put(params).promise()

    res.status(201).json({ message: 'User registered successfully' })
  } catch (error) {
    console.error('Error registering user:', error)
    res.status(500).json({ message: 'Error registering user' })
  }
}

const login = async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required' })
  }

  try {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        username: username
      }
    }

    const { Item: user } = await dynamoDB.get(params).promise()

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    )

    res.json({ token })
  } catch (error) {
    console.error('Error during login:', error.message)
    res.status(500).json({ message: 'Error during login' })
  }
}

module.exports = { listUsers, register, login }
