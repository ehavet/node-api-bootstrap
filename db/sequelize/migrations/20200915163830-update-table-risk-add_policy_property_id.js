'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction(async (transaction) => {
      const addPolicyPropertyIdOnRiskTable = await queryInterface
        .addColumn(
          'risk',
          'policy_property_id', {
            type: Sequelize.UUID,
            references: {
              model: {
                tableName: 'policy_property'
              },
              key: 'id'
            },
            allowNull: true,
            transaction: transaction
          }
        )

      return [
        addPolicyPropertyIdOnRiskTable
      ]
    })
  },

  down: async (queryInterface) => {
    return await queryInterface.sequelize.transaction(async (transaction) => {
      const removePolicyPropertyIdOnRiskTable = await queryInterface
        .removeColumn('risk', 'policy_property_id', { transaction: transaction })

      return [
        removePolicyPropertyIdOnRiskTable
      ]
    })
  }
}
