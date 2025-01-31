const AWS = require('../config/keys')

const glue = new AWS.Glue()
const lakeFormation = new AWS.LakeFormation()

const listGlueTables = async (req, res) => {
  const databaseName = req.params.databaseName

  try {
    const params = { DatabaseName: databaseName }
    const response = await glue.getTables(params).promise()

    const tableNames = response.TableList.map(table => table.Name)

    return res.status(200).json({
      database: databaseName,
      tables: tableNames
    })
  } catch (error) {
    console.error('Error al listar tablas de Glue:', error)

    return res.status(500).json({
      error: 'Error al listar tablas',
      details: error.message
    })
  }
}

const updateGlueTableMetadata = async (databaseName, tableName, newParams) => {
  try {
    const response = await glue
      .getTable({ DatabaseName: databaseName, Name: tableName })
      .promise()

    if (!response || !response.Table) {
      throw new Error(
        `La tabla '${tableName}' no fue encontrada en la base de datos '${databaseName}'`
      )
    }

    const { Table } = response

    const updatedTableInput = {
      Name: Table.Name,
      StorageDescriptor: Table.StorageDescriptor,
      TableType: Table.TableType,
      Parameters: {
        ...Table.Parameters,
        ...newParams
      }
    }

    await glue
      .updateTable({
        DatabaseName: databaseName,
        TableInput: updatedTableInput
      })
      .promise()

    console.log(`Metadata actualizada en la tabla ${tableName}`)
  } catch (error) {
    console.error('Error actualizando metadata en Glue:', error)
  }
}

const applyLFTagToTable = async (
  databaseName,
  tableName,
  shareTo,
  classification
) => {
  try {
    const params = {
      Resource: {
        Table: {
          DatabaseName: databaseName,
          Name: tableName
        }
      },
      LFTags: [
        {
          TagKey: 'Classification',
          TagValues: classification
        }
      ]
    }

    if (shareTo) {
      params.LFTags.push({
        TagKey: shareTo[0],
        TagValues: shareTo
      })
    }

    console.log(params.LFTags)

    const response = await lakeFormation.addLFTagsToResource(params).promise()
    console.log(JSON.stringify(response))

    console.log(`LF-Tags aplicados a la tabla ${databaseName}.${tableName}`)
  } catch (error) {
    console.error('Error aplicando LF-Tag a la tabla:', error)
  }
}

const putMetadata = async (req, res) => {
  const { schema, table, shareTo, classification, metadata } = req.body

  updateGlueTableMetadata(schema, table, metadata)
  applyLFTagToTable(schema, table, shareTo, classification)
  res.status(201).json({ message: 'Metadata actualizada' })
}

module.exports = { putMetadata, listGlueTables }
