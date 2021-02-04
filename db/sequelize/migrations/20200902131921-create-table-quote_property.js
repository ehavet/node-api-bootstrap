'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('quote_property', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
      },
      room_count: Sequelize.INTEGER,
      address: Sequelize.STRING,
      postal_code: Sequelize.STRING,
      city: Sequelize.STRING,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE
    })
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('quote_property')
  }
}
