'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      const setSpecialOperationsCodeOnPolicyTable = await queryInterface.addColumn(
        'policy',
        'special_operations_code', {
          type: Sequelize.STRING(100),
          allowNull: true,
          transaction: transaction
        }
      )

      const setSpecialOperationsCodeAppliedAtOnPolicyTable = await queryInterface.addColumn(
        'policy',
        'special_operations_code_applied_at', {
          type: Sequelize.DATE,
          allowNull: true,
          transaction: transaction
        }
      )

      return [
        setSpecialOperationsCodeOnPolicyTable,
        setSpecialOperationsCodeAppliedAtOnPolicyTable
      ]
    })
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      const removeSpecialOperationsCodeOnPolicyTable = await queryInterface
        .removeColumn('policy', 'special_operations_code', { transaction: transaction })

      const removeSpecialOperationsCodeAppliedAtOnPolicyTable = await queryInterface
        .removeColumn('policy', 'special_operations_code_applied_at', { transaction: transaction })
      return [
        removeSpecialOperationsCodeOnPolicyTable,
        removeSpecialOperationsCodeAppliedAtOnPolicyTable
      ]
    })
  }
}
