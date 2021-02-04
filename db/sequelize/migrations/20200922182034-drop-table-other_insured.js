'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.dropTable('other_insured')
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.createTable('other_insured', {
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
            tableName: 'policy_risk'
          },
          key: 'id'
        },
        allowNull: false
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE
    })
  }
}
