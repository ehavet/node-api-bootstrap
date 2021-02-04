'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    const addQuoteInsuranceIdColumn = queryInterface.addColumn(
      'quote',
      'quote_insurance_id', {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'quote_insurance'
          },
          key: 'id'
        },
        allowNull: false,
        onDelete: 'CASCADE'
      }
    )

    const addQuoteRiskIdColumn = queryInterface.addColumn(
      'quote',
      'quote_risk_id', {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'quote_risk'
          },
          key: 'id'
        },
        allowNull: false,
        onDelete: 'CASCADE'
      }
    )

    const removeInsuranceIdColumn = queryInterface.removeColumn('quote', 'insurance_id')
    const removeRiskIdColumn = queryInterface.removeColumn('quote', 'risk_id')

    return Promise.all([
      addQuoteInsuranceIdColumn,
      addQuoteRiskIdColumn,
      removeInsuranceIdColumn,
      removeRiskIdColumn
    ])
  },

  down: (queryInterface, Sequelize) => {
    const addInsuranceIdColumn = queryInterface.addColumn(
      'quote',
      'insurance_id', {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'quote_insurance'
          },
          key: 'id'
        },
        allowNull: false
      }
    )

    const addRiskIdColumn = queryInterface.addColumn(
      'quote',
      'risk_id', {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'quote_risk'
          },
          key: 'id'
        },
        allowNull: false
      }
    )

    const removeQuoteInsuranceIdColumn = queryInterface.removeColumn('quote', 'quote_insurance_id')
    const removeQuoteRiskIdColumn = queryInterface.removeColumn('quote', 'quote_risk_id')

    return Promise.all([
      addInsuranceIdColumn,
      addRiskIdColumn,
      removeQuoteInsuranceIdColumn,
      removeQuoteRiskIdColumn
    ])
  }
}
