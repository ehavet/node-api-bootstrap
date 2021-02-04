/* eslint no-process-env: 0 */
'use strict'

const { populateTableFromCSV } = require('../../scripts/populate-table-from-csv')

module.exports = {
  up: async (queryInterface) => {
    await emptyPricingZoneTable(queryInterface)

    const databaseConnectionString = process.env.FALCO_API_DATABASE_URL
    const csvFileName = 'pricing-zones_2021-01-19.csv'
    const tableAndFieldsToPopulate = 'pricing_zone(id,product,cover,postal_code,city_code,city,pricing_zone)'
    return populateTableFromCSV(databaseConnectionString, csvFileName, tableAndFieldsToPopulate)
  },

  down: async (queryInterface) => {
    return emptyPricingZoneTable(queryInterface)
  }
}

async function emptyPricingZoneTable (queryInterface) {
  return queryInterface.sequelize.query('TRUNCATE TABLE pricing_zone')
}
