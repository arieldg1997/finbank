const AWS = require('aws-sdk')
const dotenv = require('dotenv')

dotenv.config()

const glue = new AWS.Glue({ region: process.env.AWS_REGION })

const checkDatabaseExists = async schema => {
  try {
    await glue.getDatabase({ Name: schema }).promise()
    console.log(`La base de datos "${schema}" existe.`)
  } catch (error) {
    if (error.code === 'EntityNotFoundException') {
      console.error(`La base de datos "${schema}" no existe.`)
      await glue
        .createDatabase({
          DatabaseInput: {
            Name: schema
          }
        })
        .promise()
      console.log(`La base de datos "${schema}" se creó correctamente.`)
    } else {
      console.error('Error al verificar la base de datos:', error)
    }
    throw error
  }
}

const createTable = async (domain, tableName, columns) => {
  const schema = `${domain}_staging`
  const createTableParams = {
    DatabaseName: schema,
    TableInput: {
      Name: tableName,
      StorageDescriptor: {
        Location: `s3://${domain}/staging/${tableName}/`,
        InputFormat:
          'org.apache.hadoop.hive.ql.io.parquet.MapredParquetInputFormat',
        OutputFormat:
          'org.apache.hadoop.hive.ql.io.parquet.MapredParquetOutputFormat',
        SerdeInfo: {
          SerializationLibrary:
            'org.apache.hadoop.hive.ql.io.parquet.serde.ParquetHiveSerDe',
          Parameters: {}
        },
        Columns: columns,
        SortColumns: [],
        StoredAsSubDirectories: false
      },
      Parameters: {
        classification: 'parquet'
      },
      TableType: 'EXTERNAL_TABLE'
    }
  }

  await glue.createTable(createTableParams).promise()
}

const createTableIfNotExists = async (domain, tableName, columns) => {
  const schema = `${domain}_staging`
  try {
    await checkDatabaseExists(schema)

    const params = {
      DatabaseName: schema,
      Name: tableName
    }

    const response = await glue.getTable(params).promise()

    if (response.Table.TableType !== 'EXTERNAL_TABLE') {
      console.log('Creando tabla si no existe...')

      createTable(domain, tableName, columns)
    }
  } catch (error) {
    console.log('La tabla no existe, creando...')
    await createTable(domain, tableName, columns)
  }
}

module.exports = { createTableIfNotExists }
