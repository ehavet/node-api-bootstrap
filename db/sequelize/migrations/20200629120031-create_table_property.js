'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('property', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
      },
      room_count: Sequelize.INTEGER,
      risk_id: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'risk'
          },
          key: 'id'
        },
        allowNull: false
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE
    })
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('property')
  }
}
