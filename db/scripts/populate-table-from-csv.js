/* eslint no-process-env: 0 */
'use strict'

const fs = require('fs')
const path = require('path')
const { Pool } = require('pg')
const pgCopyStreams = require('pg-copy-streams')
const { v4: uuidv4 } = require('uuid')
const csv = require('csv')

/**
 * Populate a table with the data from a CSV file. A UUID will be automatically generated for each entry.
 *
 * @param {string} databaseConnectionString - a string like 'postgresql://login:password@host:port/dbName'
 * @param {string} csvFileName - the file must have a header and coma separators
 * @param {string} tableAndFieldsToPopulate - a string like 'table(field1,field2,field3,field4)'
 * @returns {Promise<unknown>}
 */
async function populateTableFromCSV (databaseConnectionString, csvFileName, tableAndFieldsToPopulate) {
  const dbClient = await connectToDatabase(databaseConnectionString)

  const csvFilePath = path.join(process.env.PWD, '/db/data', csvFileName)
  const csvStream = fs.createReadStream(csvFilePath, { encoding: 'utf8' })

  const insertCsvIntoDBStream = dbClient.query(pgCopyStreams.from(`COPY ${tableAndFieldsToPopulate} FROM STDIN DELIMITER ',' CSV HEADER`))

  return new Promise((resolve, reject) => {
    csvStream.on('error', (args) => reject(new Error(args)))
    csvStream.on('finish', (args) => resolve(args))

    insertCsvIntoDBStream.on('error', (args) => reject(new Error(args)))
    insertCsvIntoDBStream.on('finish', (args) => resolve(args))

    csvStream
      .pipe(csv.parse({ delimiter: '\n', raw: true }))
      .pipe(csv.transform(insertUUID))
      .pipe(insertCsvIntoDBStream)
  })
}

async function connectToDatabase (databaseConnectionString) {
  const pool = new Pool({ connectionString: databaseConnectionString })
  const client = await pool.connect()
  return client
}

function insertUUID (line) {
  return `${uuidv4()},${line.raw}`
}

module.exports = {
  populateTableFromCSV
}
