'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction(async (transaction) => {
      const addPolicyHolderIdOnPolicyTable = await queryInterface
        .addColumn(
          'policy',
          'policy_holder_id', {
            type: Sequelize.UUID,
            references: {
              model: {
                tableName: 'policy_person'
              },
              key: 'id'
            },
            allowNull: true,
            onDelete: 'CASCADE',
            transaction: transaction
          }
        )
      return [
        addPolicyHolderIdOnPolicyTable
      ]
    })
  },

  down: async (queryInterface) => {
    return await queryInterface.sequelize.transaction(async (transaction) => {
      const removePolicyHolderIdOnPolicyTable = await queryInterface
        .removeColumn('policy', 'policy_holder_id', { transaction: transaction })
      return [
        removePolicyHolderIdOnPolicyTable
      ]
    })
  }
}
