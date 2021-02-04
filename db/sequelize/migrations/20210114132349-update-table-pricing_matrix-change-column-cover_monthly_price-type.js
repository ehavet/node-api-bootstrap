'use strict'

const DatabaseStandard = require('../database-standards')
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.changeColumn('pricing_matrix', 'cover_monthly_price', {
      type: DatabaseStandard.DECIMAL_TYPE_SCALE_FIVE
    })
  },

  down: async (queryInterface) => {
    await queryInterface.changeColumn('pricing_matrix', 'cover_monthly_price', {
      type: DatabaseStandard.DECIMAL_TYPE
    })
  }
}
