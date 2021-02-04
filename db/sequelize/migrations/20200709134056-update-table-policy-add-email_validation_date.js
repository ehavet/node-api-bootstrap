'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'policy',
      'email_validation_date', { type: Sequelize.DATE }
    )
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('policy', 'email_validation_date')
  }
}
