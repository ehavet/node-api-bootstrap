/* eslint no-process-env: 0 */
'use strict'

const { populateTableFromCSV } = require('../../scripts/populate-table-from-csv')

module.exports = {
  up: async (queryInterface) => {
    const databaseConnectionString = process.env.FALCO_API_DATABASE_URL
    await emptyPricingMatrixTable(queryInterface)
    const csvFileName = 'pricing-matrix-with-covers.csv'
    const tableAndFieldsToPopulate = 'pricing_matrix(id,partner,room_count,cover,cover_monthly_price)'
    return populateTableFromCSV(databaseConnectionString, csvFileName, tableAndFieldsToPopulate)
  },

  down: async (queryInterface) => {
    return await emptyPricingMatrixTable(queryInterface)
  }
}

async function emptyPricingMatrixTable (queryInterface) {
  return queryInterface.sequelize.query('TRUNCATE TABLE pricing_matrix')
}
