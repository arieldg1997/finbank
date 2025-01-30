const AWS = require('aws-sdk')
const dotenv = require('dotenv')

dotenv.config()

const emr = new AWS.EMRServerless({ region: process.env.AWS_REGION })

const EMR_APPLICATION_ID = process.env.EMR_APPLICATION_ID
const EMR_EXECUTION_ROLE = process.env.EMR_EXECUTION_ROLE
const SPARK_SCRIPT_LOCATION = process.env.SPARK_SCRIPT_LOCATION

const submitSparkJob = async (bucket, path, writeMode, columns) => {
  try {
    console.log('Iniciando job de Spark en EMR Serverless...')

    const params = {
      applicationId: EMR_APPLICATION_ID,
      executionRoleArn: EMR_EXECUTION_ROLE,
      jobDriver: {
        sparkSubmit: {
          entryPoint: SPARK_SCRIPT_LOCATION,
          entryPointArguments: [
            '--bucket',
            bucket,
            '--path',
            path,
            '--mode',
            writeMode,
            '--columns',
            JSON.stringify(columns)
          ]
        }
      },
      name: `${path}-${Date.now()}`
    }

    const response = await emr.startJobRun(params).promise()
    console.log(`Job enviado con éxito. Job ID: ${response.jobRunId}`)

    return response.jobRunId
  } catch (error) {
    console.error('Error enviando job a EMR Serverless:', error)
    throw error
  }
}

module.exports = { submitSparkJob }
