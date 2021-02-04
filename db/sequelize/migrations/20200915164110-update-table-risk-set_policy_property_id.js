'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction(async (transaction) => {
      const setPolicyPropertyIdOnRiskTable = await queryInterface.sequelize
        .transaction(async (setPolicyPropertyIdOnRiskTable) => {
          return await queryInterface.sequelize
            .query(
              'UPDATE risk SET (policy_property_id) = (row(policy_property.id)) FROM policy_property WHERE policy_property.risk_id = risk.id',
              { transaction: setPolicyPropertyIdOnRiskTable }
            )
        }, { transaction: transaction })

      const addPolicyPropertyIdConstraintsOnRiskTable = await queryInterface.sequelize
        .transaction(async (addPolicyPropertyIdConstraintsOnRiskTable) => {
          return await queryInterface
            .changeColumn(
              'risk',
              'policy_property_id',
              {
                type: Sequelize.UUID,
                allowNull: false,
                onDelete: 'CASCADE',
                transaction: addPolicyPropertyIdConstraintsOnRiskTable
              }
            )
        }, { transaction: transaction })

      return [setPolicyPropertyIdOnRiskTable, addPolicyPropertyIdConstraintsOnRiskTable]
    })
  },

  down: async (queryInterface) => {
    return await queryInterface.sequelize.transaction(async (transaction) => {
      const setRiskIdOnPolicyPropertyTable = await queryInterface.sequelize
        .transaction(async (setPolicyPropertyIdOnRiskTable) => {
          return await queryInterface.sequelize
            .query(
              'UPDATE policy_property SET (risk_id) = (row(risk.id)) FROM risk WHERE risk.policy_property_id = policy_property.id',
              { transaction: setPolicyPropertyIdOnRiskTable }
            )
        }, { transaction: transaction })

      const removeRiskIdForeignKeyConstrainOnPropertyTable = await queryInterface.sequelize
        .transaction(async (removeRiskIdForeignKeyConstrainOnPropertyTable) => {
          return await queryInterface
            .removeConstraint('policy_property', 'policy_property_risk_id_fkey',
              { transaction: removeRiskIdForeignKeyConstrainOnPropertyTable }
            )
        }, { transaction: transaction })

      return [
        setRiskIdOnPolicyPropertyTable,
        removeRiskIdForeignKeyConstrainOnPropertyTable
      ]
    })
  }
}
