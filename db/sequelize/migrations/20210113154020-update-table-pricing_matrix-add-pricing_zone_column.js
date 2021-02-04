'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    // TODO :  Add AllowNull constraint
    return queryInterface.addColumn(
      'pricing_matrix',
      'pricing_zone', { type: Sequelize.STRING }
    )
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('pricing_matrix', 'pricing_zone')
  }
}
