'use strict'

const DatabaseStandards = require('../database-standards')

module.exports = {
  up: (queryInterface) => {
    const addCoverMonthlyPriceNoTax = queryInterface.addColumn(
      'pricing_matrix',
      'cover_monthly_price_no_tax',
      { type: DatabaseStandards.DECIMAL_TYPE_SCALE_FIVE }
    )
    const addCoverMonthlyPriceTax = queryInterface.addColumn(
      'pricing_matrix',
      'cover_monthly_price_tax', { type: DatabaseStandards.DECIMAL_TYPE_SCALE_FIVE }
    )

    return Promise.all([addCoverMonthlyPriceTax, addCoverMonthlyPriceNoTax])
  },

  down: (queryInterface) => {
    const removeCoverMonthlyPriceNoTax = queryInterface.removeColumn('pricing_matrix', 'cover_monthly_price_no_tax')
    const removeCoverMonthlyPriceTax = queryInterface.removeColumn('pricing_matrix', 'cover_monthly_price_tax')

    return Promise.all([removeCoverMonthlyPriceNoTax, removeCoverMonthlyPriceTax])
  }
}
