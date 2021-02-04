'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction(async (transaction) => {
      const addPremiumColumn = await queryInterface.addColumn(
        'quote',
        'premium',
        { type: Sequelize.FLOAT, transaction: transaction }
      )
      const addNbMonthsDueColumn = await queryInterface.addColumn(
        'quote',
        'nb_months_due',
        { type: Sequelize.INTEGER, transaction: transaction }
      )
      const addStartDateColumn = await queryInterface.addColumn(
        'quote',
        'start_date',
        { type: Sequelize.DATEONLY, transaction: transaction }
      )
      const addTermStartDateColumn = await queryInterface.addColumn(
        'quote',
        'term_start_date',
        { type: Sequelize.DATEONLY, transaction: transaction }
      )
      const addTermEndDateColumn = await queryInterface.addColumn(
        'quote',
        'term_end_date',
        { type: Sequelize.DATEONLY, transaction: transaction }
      )

      return [
        addPremiumColumn,
        addNbMonthsDueColumn,
        addStartDateColumn,
        addTermStartDateColumn,
        addTermEndDateColumn
      ]
    })
  },

  down: async (queryInterface) => {
    return await queryInterface.sequelize.transaction(async (transaction) => {
      const removePremiumColumn = await queryInterface
        .removeColumn('quote', 'premium', { transaction: transaction })
      const removeNbMonthsDueColumn = await queryInterface
        .removeColumn('quote', 'nb_months_due', { transaction: transaction })
      const removeStartDateColumn = await queryInterface
        .removeColumn('quote', 'start_date', { transaction: transaction })
      const removeTermStartDateColumn = await queryInterface
        .removeColumn('quote', 'term_start_date', { transaction: transaction })
      const removeTermEndDateColumn = await queryInterface
        .removeColumn('quote', 'term_end_date', { transaction: transaction })

      return [
        removePremiumColumn,
        removeNbMonthsDueColumn,
        removeStartDateColumn,
        removeTermStartDateColumn,
        removeTermEndDateColumn
      ]
    })
  }
}
