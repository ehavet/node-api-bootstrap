'use strict'

module.exports = {
  up: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      return await queryInterface.renameColumn('quote_person', 'email_validation_date', 'email_validated_at', { transaction: transaction })
    })
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      return await queryInterface.renameColumn('quote_person', 'email_validated_at', 'email_validation_date', { transaction: transaction })
    })
  }
}
