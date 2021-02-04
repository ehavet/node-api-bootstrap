'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('quote_risk_other_people', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
      },
      quote_risk_id: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'quote_risk'
          },
          key: 'id'
        },
        allowNull: false,
        onDelete: 'CASCADE'
      },
      quote_person_id: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'quote_person'
          },
          key: 'id'
        },
        allowNull: false,
        onDelete: 'CASCADE'
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE
    })
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('quote_risk_other_people')
  }
}
