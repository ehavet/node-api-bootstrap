'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    const addContractualTermsColumn = queryInterface.addColumn(
      'insurance',
      'contractual_terms', { type: Sequelize.STRING }
    )
    const addIpidColumn = queryInterface.addColumn(
      'insurance',
      'ipid', { type: Sequelize.STRING }
    )
    return Promise.all([addContractualTermsColumn, addIpidColumn])
  },

  down: (queryInterface) => {
    const removeContractualTermsColumn = queryInterface.removeColumn('insurance', 'contractual_terms')
    const removeIpidColumn = queryInterface.removeColumn('insurance', 'ipid')
    return Promise.all([removeContractualTermsColumn, removeIpidColumn])
  }
}
