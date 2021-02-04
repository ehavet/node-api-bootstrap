'use strict'

module.exports = {
  up: async (queryInterface) => {
    return await queryInterface.sequelize.transaction(async (transaction) => {
      const removeContactPolicyIdOnPolicyPersonTable = await queryInterface
        .removeColumn('policy_person', 'policy_id', { transaction: transaction })

      return [removeContactPolicyIdOnPolicyPersonTable]
    })
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction(async (transaction) => {
      const addPolicyIdOnPolicyPersonTable = await queryInterface.addColumn(
        'policy_person',
        'policy_id', {
          type: Sequelize.STRING,
          references: {
            model: {
              tableName: 'policy'
            },
            key: 'id'
          },
          allowNull: true,
          transaction: transaction
        }
      )

      return [addPolicyIdOnPolicyPersonTable]
    })
  }
}
