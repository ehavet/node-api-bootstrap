'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      const setSpecialOperationsCodeOnQuoteTable = await queryInterface.addColumn(
        'quote',
        'special_operations_code', {
          type: Sequelize.STRING(100),
          allowNull: true,
          transaction
        }
      )

      const setSpecialOperationsCodeAppliedAtOnQuoteTable = await queryInterface.addColumn(
        'quote',
        'special_operations_code_applied_at', {
          type: Sequelize.DATE,
          allowNull: true,
          transaction
        }
      )

      return [
        setSpecialOperationsCodeOnQuoteTable,
        setSpecialOperationsCodeAppliedAtOnQuoteTable
      ]
    })
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      const removeSpecialOperationsCodeOnQuoteTable = await queryInterface
        .removeColumn('quote', 'special_operations_code', { transaction })

      const removeSpecialOperationsCodeAppliedAtOnQuoteTable = await queryInterface
        .removeColumn('quote', 'special_operations_code_applied_at', { transaction })
      return [
        removeSpecialOperationsCodeOnQuoteTable,
        removeSpecialOperationsCodeAppliedAtOnQuoteTable
      ]
    })
  }
}
