const express = require('express')
const { putMetadata } = require('../controllers/metadata.controller')

const metadataRouter = express.Router()

metadataRouter.post('/', putMetadata)

module.exports = metadataRouter
