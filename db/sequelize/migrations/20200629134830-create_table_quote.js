'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('quote', {
      id: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        autoIncrement: false,
        allowNull: false
      },
      partner_code: Sequelize.STRING(20),
      insurance_id: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'insurance'
          },
          key: 'id'
        },
        allowNull: false
      },
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
    return queryInterface.dropTable('quote')
  }
}
