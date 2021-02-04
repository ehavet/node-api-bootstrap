'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'quote_property',
      'occupancy', {
        type: Sequelize.STRING,
        allowNull: true
      }
    )
  },

  down: async (queryInterface) => {
    return queryInterface.removeColumn('quote_property', 'occupancy')
  }
}
