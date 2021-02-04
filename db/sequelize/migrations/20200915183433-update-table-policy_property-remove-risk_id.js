'use strict'

module.exports = {
  up: async (queryInterface) => {
    return await queryInterface.sequelize.transaction(async (transaction) => {
      const removeRiskIdColumnOnPolicyPropertyTable = await queryInterface
        .removeColumn('policy_property', 'risk_id', { transaction: transaction })

      return [
        removeRiskIdColumnOnPolicyPropertyTable
      ]
    })
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction(async (transaction) => {
      const addRiskIdOnPropertyTable = await queryInterface
        .addColumn(
          'policy_property',
          'risk_id', {
            type: Sequelize.UUID,
            references: {
              model: {
                tableName: 'risk'
              },
              key: 'id'
            },
            allowNull: true,
            transaction: transaction
          }
        )

      return [
        addRiskIdOnPropertyTable
      ]
    })
  }
}
