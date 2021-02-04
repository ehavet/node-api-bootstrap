'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction(async (transaction) => {
      const setPolicyHolderIdOnPolicyTable = await queryInterface.sequelize
        .transaction(async (setPolicyHolderIdOnPolicyTable) => {
          return await queryInterface.sequelize
            .query(
              'UPDATE policy SET (policy_holder_id) = (row(policy_person.id)) FROM policy_person WHERE policy_person.policy_id = policy.id',
              { transaction: setPolicyHolderIdOnPolicyTable }
            )
        }, { transaction: transaction })

      const addPolicyHolderIdConstraintsOnPolicyTable = await queryInterface.sequelize
        .transaction(async (addPolicyHolderIdConstraintsOnPolicyTable) => {
          return await queryInterface
            .changeColumn(
              'policy',
              'policy_holder_id',
              {
                type: Sequelize.UUID,
                allowNull: false,
                onDelete: 'CASCADE',
                transaction: addPolicyHolderIdConstraintsOnPolicyTable
              }
            )
        }, { transaction: transaction })

      return [setPolicyHolderIdOnPolicyTable, addPolicyHolderIdConstraintsOnPolicyTable]
    })
  },

  down: async (queryInterface) => {
    return await queryInterface.sequelize.transaction(async (transaction) => {
      const setPolicyIdOnPolicyPersonTable = await queryInterface.sequelize
        .transaction(async (setPolicyIdOnPolicyPersonTable) => {
          return await queryInterface.sequelize
            .query(
              'UPDATE policy_person SET (policy_id) = (row(policy.id)) FROM policy WHERE policy.policy_holder_id = policy_person.id',
              { transaction: setPolicyIdOnPolicyPersonTable }
            )
        }, { transaction: transaction })

      const removeRiskIdForeignKeyConstrainOnPropertyTable = await queryInterface.sequelize
        .transaction(async (removeRiskIdForeignKeyConstrainOnPropertyTable) => {
          return await queryInterface
            .removeConstraint('policy_person', 'policy_person_policy_id_fkey',
              { transaction: removeRiskIdForeignKeyConstrainOnPropertyTable })
        }, { transaction: transaction })

      return [setPolicyIdOnPolicyPersonTable, removeRiskIdForeignKeyConstrainOnPropertyTable]
    })
  }
}
