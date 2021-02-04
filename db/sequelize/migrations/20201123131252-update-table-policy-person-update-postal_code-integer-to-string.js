'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('policy_person', 'postal_code', {
      type: Sequelize.STRING
    })

    await queryInterface.changeColumn('policy_property', 'postal_code', {
      type: Sequelize.STRING
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('policy_person', 'postal_code', {
      type: 'INTEGER USING CAST("postal_code" as INTEGER)'
    })
    await queryInterface.changeColumn('policy_property', 'postal_code', {
      type: 'INTEGER USING CAST("postal_code" as INTEGER)'
    })
  }
}
