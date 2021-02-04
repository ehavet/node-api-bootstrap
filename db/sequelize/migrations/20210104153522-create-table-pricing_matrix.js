'use strict'

const DEFAULT_PRECISION = 14
const DEFAULT_SCALE = 6

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('pricing_matrix', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
      },
      partner: Sequelize.STRING,
      room_count: Sequelize.INTEGER,
      cover_monthly_price: Sequelize.DECIMAL(DEFAULT_PRECISION, DEFAULT_SCALE),
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
        allowNull: false,
        field: 'created_at'
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
        allowNull: false,
        field: 'updated_at'
      }
    })
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('pricing_matrix')
  }
}
