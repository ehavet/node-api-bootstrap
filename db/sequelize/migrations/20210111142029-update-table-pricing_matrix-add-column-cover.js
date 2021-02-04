'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'pricing_matrix',
      'cover', { type: Sequelize.STRING }
    )
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('pricing_matrix', 'cover')
  }
}
