const AWS = require('../config/keys')
const dynamoDB = new AWS.DynamoDB.DocumentClient()
const glueService = require('../services/glue.service')

const TABLE_NAME = 'finbank-classifiers'

const getAllClassifiers = async (req, res) => {
  const params = {
    TableName: TABLE_NAME
  }

  try {
    const data = await dynamoDB.scan(params).promise()
    res.json(data.Items)
  } catch (error) {
    console.error('Error al listar classifiers:', error)
    throw new Error('No se pudieron obtener los classifiers.')
  }
}

const createClassifier = async (req, res) => {
  const { domain, interface, writeMode, user, columns } = req.body

  const classifierName = `${domain}-${interface}`

  const duplicatedClassifier = await dynamoDB
    .query({
      TableName: TABLE_NAME,
      KeyConditionExpression: '#interface = :nameValue',
      ExpressionAttributeNames: {
        '#interface': 'interface'
      },
      ExpressionAttributeValues: {
        ':nameValue': interface
      }
    })
    .promise()

  if (duplicatedClassifier['Count'] > 0) {
    res.status(500).json({ message: 'Classifier already exists' })
    return
  }

  try {
    glueService.createTableIfNotExists(domain, interface, columns)

    const newClassifier = {
      name: classifierName,
      domain: domain,
      interface: interface,
      writeMode: writeMode,
      columns: columns,
      createdAt: new Date().toISOString(),
      createdBy: user,
      updatedAt: new Date().toISOString(),
      updatedBy: user
    }

    const params = {
      TableName: TABLE_NAME,
      Item: newClassifier
    }

    await dynamoDB.put(params).promise()

    res.status(201).json({ message: 'Classifier registered successfully' })
  } catch (error) {
    console.error('Error registering classifier:', error)
    res.status(500).json({ message: 'Error registering classifier' })
  }
}

module.exports = { getAllClassifiers, createClassifier }
