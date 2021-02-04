'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('payment_policy', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
      },
      payment_id: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'payment'
          },
          key: 'id'
        },
        allowNull: false,
        onDelete: 'CASCADE'
      },
      policy_id: {
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: 'policy'
          },
          key: 'id'
        },
        allowNull: false
      }
    })
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('payment_policy')
  }
}
