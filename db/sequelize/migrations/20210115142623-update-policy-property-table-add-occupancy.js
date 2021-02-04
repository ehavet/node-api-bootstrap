'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'policy_property',
      'occupancy', {
        type: Sequelize.STRING
      }
    )
  },

  down: async (queryInterface) => {
    return queryInterface.removeColumn('policy_property', 'occupancy')
  }
}
