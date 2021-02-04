'use strict'

module.exports = {
  up: async (queryInterface) => {
    await queryInterface
      .renameColumn('pricing_matrix', 'cover_monthly_price_no_tax', 'cover_monthly_price_excl_tax')
  },

  down: async (queryInterface) => {
    await queryInterface
      .renameColumn('pricing_matrix', 'cover_monthly_price_excl_tax', 'cover_monthly_price_no_tax')
  }
}
