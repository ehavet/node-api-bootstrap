'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('quote_risk', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
      },
      quote_property_id: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'quote_property'
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
        allowNull: true,
        onDelete: 'CASCADE'
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE
    })
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('quote_risk', { cascade: true })
  }
}
