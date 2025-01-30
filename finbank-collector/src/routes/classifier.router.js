const express = require('express')
const {
  getAllClassifiers,
  createClassifier
} = require('../controllers/classifier.controller')

const collectorRouter = express.Router()

collectorRouter.get('/', getAllClassifiers)
collectorRouter.post('/', createClassifier)

module.exports = collectorRouter
