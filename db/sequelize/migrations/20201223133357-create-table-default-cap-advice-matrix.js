'use strict'

const DatabaseStandards = require('../database-standards')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('default_cap_advice_matrix', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
      },
      partner_code: Sequelize.STRING,
      room_count: Sequelize.INTEGER,
      default_cap_advice: DatabaseStandards.DECIMAL_TYPE,
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
    }).then(() =>
      queryInterface.addConstraint('default_cap_advice_matrix', {
        type: 'unique',
        fields: ['partner_code', 'room_count'],
        name: 'uq_default_cap_advice_matrix_partner_code_room_count'
      }))
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('default_cap_advice_matrix')
  }
}
