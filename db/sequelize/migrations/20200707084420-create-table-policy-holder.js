'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('policy_holder', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
      },
      firstname: Sequelize.STRING,
      lastname: Sequelize.STRING,
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
    return queryInterface.dropTable('policy_holder')
  }
}
