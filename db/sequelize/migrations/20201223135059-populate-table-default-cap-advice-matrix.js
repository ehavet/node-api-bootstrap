/* eslint no-process-env: 0 */
'use strict'

const { populateTableFromCSV } = require('../../scripts/populate-table-from-csv')

module.exports = {
  up: async (queryInterface) => {
    await emptyDefaultCapAdviceTable(queryInterface)

    const databaseConnectionString = process.env.FALCO_API_DATABASE_URL
    const csvFileName = 'default-cap-advice-matrix-basic.csv'
    const tableAndFieldsToPopulate = 'default_cap_advice_matrix(id,partner_code,room_count,default_cap_advice)'
    return populateTableFromCSV(databaseConnectionString, csvFileName, tableAndFieldsToPopulate)
  },

  down: async (queryInterface) => {
    return emptyDefaultCapAdviceTable(queryInterface)
  }
}

async function emptyDefaultCapAdviceTable (queryInterface) {
  return queryInterface.sequelize.query('TRUNCATE TABLE default_cap_advice_matrix')
}
