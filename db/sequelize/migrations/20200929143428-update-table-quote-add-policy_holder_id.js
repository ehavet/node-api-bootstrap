'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.addColumn(
      'quote',
      'policy_holder_id', {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'quote_person'
          },
          key: 'id'
        },
        allowNull: true,
        onDelete: 'CASCADE'
      }
    )
  },

  down: async (queryInterface) => {
    return await queryInterface.removeColumn('quote', 'policy_holder_id')
  }
}
