'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('policy_risk_other_people', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
      },
      policy_risk_id: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'policy_risk'
          },
          key: 'id'
        },
        allowNull: false
      },
      policy_person_id: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'policy_person'
          },
          key: 'id'
        },
        allowNull: false
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE
    })
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable('policy_risk_other_people')
  }
}
