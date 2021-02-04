/* eslint no-process-env: 0 */
'use strict'

const { populateTableFromCSV } = require('../../scripts/populate-table-from-csv')

module.exports = {
  up: async (queryInterface) => {
    const databaseConnectionString = process.env.FALCO_API_DATABASE_URL
    await emptyPricingMatrixTable(queryInterface)
    const csvFileName = 'pricing-matrix_2021-01-15.csv'
    const tableAndFieldsToPopulate = 'pricing_matrix(id,partner,cover,room_count,pricing_zone,cover_monthly_price,cover_monthly_price_no_tax,cover_monthly_price_tax)'
    return populateTableFromCSV(databaseConnectionString, csvFileName, tableAndFieldsToPopulate)
  },

  down: async (queryInterface) => {
    return await emptyPricingMatrixTable(queryInterface)
  }
}

async function emptyPricingMatrixTable (queryInterface) {
  return queryInterface.sequelize.query('TRUNCATE TABLE pricing_matrix')
}
