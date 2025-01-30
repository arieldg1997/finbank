const cron = require('node-cron')
const AWS = require('aws-sdk')

AWS.config.update({ region: process.env.AWS_REGION || 'us-east-1' })

const dynamoDB = new AWS.DynamoDB.DocumentClient()
const sqs = new AWS.SQS()
const emrService = require('../services/emr.service')

const QUEUE_NAME = 'collector-queue'
const TABLE_NAME = 'finbank-classifiers'
const timer = process.env.INBOUND_CRON || '*/10 * * * * *'

const getQueueUrl = async () => {
  try {
    const response = await sqs.getQueueUrl({ QueueName: QUEUE_NAME }).promise()
    return response.QueueUrl
  } catch (error) {
    console.error('Error obteniendo la URL de la cola:', error.message)
    throw error
  }
}

const processMessages = async () => {
  try {
    const queueUrl = await getQueueUrl()

    const params = {
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 0
    }

    const response = await sqs.receiveMessage(params).promise()

    if (response.Messages && response.Messages.length > 0) {
      for (const message of response.Messages) {
        console.log('Mensaje recibido:', message.Body)
        const body = JSON.parse(message.Body)
        record = body['Records'][0]
        const bucket = record['s3']['bucket']['name'].split(':').pop()
        const path = record['s3']['object']['key']
        const file = path.split('/').pop()
        const file_name_list = file.split('.')
        const extension = file_name_list.pop()
        const interface = file_name_list.pop()

        const data = await dynamoDB
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

        if (!data.Items) {
          console.log('Classifier does not exist')
          return
        }

        await emrService.submitSparkJob(
          bucket,
          path,
          data.Items[0].writeMode,
          data.Items[0].columns
        )

        await sqs
          .deleteMessage({
            QueueUrl: queueUrl,
            ReceiptHandle: message.ReceiptHandle
          })
          .promise()

        console.log('Mensaje eliminado de la cola.')
      }
    } else {
      console.log('No hay mensajes en la cola.')
    }
  } catch (error) {
    console.error('Error procesando mensajes de SQS:', error.message)
    console.log(error.stack)
  }
}

// Programar la ejecución cada 10 segundos
cron.schedule(timer, () => {
  console.log('Running inbound task...')
  processMessages()
})
