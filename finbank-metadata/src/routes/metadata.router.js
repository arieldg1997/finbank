const express = require('express')
const {
  putMetadata,
  listGlueTables
} = require('../controllers/metadata.controller')

const metadataRouter = express.Router()

metadataRouter.get('/:databaseName', listGlueTables)
metadataRouter.post('/', putMetadata)

module.exports = metadataRouter
