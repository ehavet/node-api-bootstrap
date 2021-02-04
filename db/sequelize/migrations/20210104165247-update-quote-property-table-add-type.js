'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'quote_property',
      'type', {
        type: Sequelize.STRING,
        allowNull: true
      }
    )
  },

  down: async (queryInterface) => {
    return queryInterface.removeColumn('quote_property', 'type')
  }
}
