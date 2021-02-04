'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'policy',
      'status', { type: Sequelize.STRING(50) }
    )
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('policy', 'status')
  }
}
