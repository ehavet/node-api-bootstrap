'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'policy_person',
      'email_validated_at', { type: Sequelize.DATE }
    )
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('policy_person', 'email_validated_at')
  }
}
