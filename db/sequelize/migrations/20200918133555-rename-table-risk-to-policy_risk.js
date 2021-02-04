'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction(async (transaction) => {
      const renameTableRiskToPolicyRiskUpdate = await queryInterface.sequelize
        .transaction(async (renameTableRiskToPolicyRiskUpdate) => {
          const removeRiskIdForeignkeyConstraintOnPolicyTable = await queryInterface
            .removeConstraint('policy', 'policy_risk_id_fkey',
              { transaction: renameTableRiskToPolicyRiskUpdate }
            )

          const removeRiskIdForeignkeyConstraintOnOtherInsuredTable = await queryInterface
            .removeConstraint('other_insured', 'other_insured_risk_id_fkey',
              { transaction: renameTableRiskToPolicyRiskUpdate }
            )

          const removeRiskPrimaryKeyConstraintOnRiskTable = await queryInterface
            .removeConstraint('risk', 'risk_pkey', { transaction: renameTableRiskToPolicyRiskUpdate })

          const removeRiskPrimaryKeyIndexOnRiskTable = await queryInterface
            .removeIndex('risk', 'risk_pkey', { transaction: renameTableRiskToPolicyRiskUpdate })

          const renameTableRiskToPolicyRisk = await queryInterface
            .renameTable('risk', 'policy_risk', { transaction: renameTableRiskToPolicyRiskUpdate })

          const renameRiskIdToPolicyRiskIdOnPolicyTable = await queryInterface
            .renameColumn('policy', 'risk_id', 'policy_risk_id',
              { transaction: renameTableRiskToPolicyRiskUpdate }
            )

          const addPolicyRiskIdPrimaryKeyConstraintOnPolicyRiskTable = await queryInterface
            .addConstraint('policy_risk', {
              type: 'primary key',
              fields: ['id'],
              name: 'policy_risk_pkey',
              transaction: renameTableRiskToPolicyRiskUpdate
            })

          const addPolicyRiskIdForeignkeyConstraintOnPolicyTable = await queryInterface
            .addConstraint('policy', {
              type: 'foreign key',
              fields: ['policy_risk_id'],
              name: 'policy_policy_risk_id_fkey',
              references: {
                table: 'policy_risk',
                field: 'id'
              },
              onDelete: 'cascade',
              onUpdate: 'cascade',
              allowNull: false,
              transaction: renameTableRiskToPolicyRiskUpdate
            })

          const addPolicyRiskIdForeignkeyConstraintOnOtherInsuredTable = await queryInterface
            .addConstraint('other_insured', {
              type: 'foreign key',
              fields: ['risk_id'],
              name: 'other_insured_policy_risk_id_fkey',
              references: {
                table: 'policy_risk',
                field: 'id'
              },
              allowNull: false,
              transaction: renameTableRiskToPolicyRiskUpdate
            })

          return [
            removeRiskIdForeignkeyConstraintOnPolicyTable,
            removeRiskIdForeignkeyConstraintOnOtherInsuredTable,
            removeRiskPrimaryKeyConstraintOnRiskTable,
            removeRiskPrimaryKeyIndexOnRiskTable,
            renameTableRiskToPolicyRisk,
            renameRiskIdToPolicyRiskIdOnPolicyTable,
            addPolicyRiskIdPrimaryKeyConstraintOnPolicyRiskTable,
            addPolicyRiskIdForeignkeyConstraintOnPolicyTable,
            addPolicyRiskIdForeignkeyConstraintOnOtherInsuredTable
          ]
        }, { transaction: transaction })

      const addPersonIdOnPolicyRiskTable = await queryInterface.sequelize
        .transaction(async (addPersonIdToPolicyRiskTable) => {
          return [
            await queryInterface
              .addColumn(
                'policy_risk',
                'policy_person_id', {
                  type: Sequelize.UUID,
                  references: {
                    model: {
                      tableName: 'policy_person'
                    },
                    key: 'id'
                  },
                  allowNull: true,
                  transaction: transaction
                }
              ), { transaction: addPersonIdToPolicyRiskTable }
          ]
        }, { transaction: transaction })

      const setPersonIdOnPolicyRiskTable = await queryInterface.sequelize
        .transaction(async (setPersonIdOnPolicyRiskTable) => {
          return [
            await queryInterface.sequelize
              .query(
                'UPDATE policy_risk SET (policy_person_id) = (row(policy.policy_holder_id)) FROM policy WHERE policy.policy_risk_id = policy_risk.id',
                { transaction: setPersonIdOnPolicyRiskTable }
              )
          ]
        }, { transaction: transaction })

      return [
        ...renameTableRiskToPolicyRiskUpdate,
        ...addPersonIdOnPolicyRiskTable,
        ...setPersonIdOnPolicyRiskTable
      ]
    })
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction(async (transaction) => {
      const renameTablePolicyRiskToRiskUpdate = await queryInterface.sequelize.transaction(async (renameTablePolicyRiskToRiskUpdate) => {
        const removePolicyRiskIdForeignkeyConstraintOnPolicyTable = await queryInterface
          .removeConstraint('policy', 'policy_policy_risk_id_fkey',
            { transaction: renameTablePolicyRiskToRiskUpdate }
          )

        const removePolicyRiskIdForeignkeyConstraintOnOtherInsuredTable = await queryInterface
          .removeConstraint('other_insured', 'other_insured_risk_id_fkey',
            { transaction: renameTablePolicyRiskToRiskUpdate }
          )

        const removePolicyRiskPrimaryKeyConstraintOnPolicyRiskTable = await queryInterface
          .removeConstraint('policy_risk', 'policy_risk_pkey', { transaction: renameTablePolicyRiskToRiskUpdate })

        const removePolicyRiskPrimaryKeyIndexPolicyRiskTable = await queryInterface
          .removeIndex('policy_risk', 'policy_risk_pkey', { transaction: renameTablePolicyRiskToRiskUpdate })

        const renameTablePolicyRiskToRisk = await queryInterface
          .renameTable('policy_risk', 'risk', { transaction: renameTablePolicyRiskToRiskUpdate })

        const renamePolicyRiskIdToRiskIdOnPolicyTable = await queryInterface
          .renameColumn('policy', 'policy_risk_id', 'risk_id',
            { transaction: renameTablePolicyRiskToRiskUpdate }
          )

        const addRiskIdPrimaryKeyConstraintOnRiskTable = await queryInterface
          .addConstraint('risk', {
            type: 'primary key',
            fields: ['id'],
            name: 'risk_pkey',
            transaction: renameTablePolicyRiskToRiskUpdate
          })

        const addRiskIdForeignkeyConstraintOnPolicyTable = await queryInterface
          .addConstraint('policy', {
            type: 'foreign key',
            fields: ['risk_id'],
            name: 'policy_risk_id_fkey',
            references: {
              table: 'risk',
              field: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'cascade',
            allowNull: false,
            transaction: renameTablePolicyRiskToRiskUpdate
          })

        const addRiskIdForeignkeyConstraintOnOtherInsuredTable = await queryInterface
          .addConstraint('other_insured', {
            type: 'foreign key',
            fields: ['risk_id'],
            name: 'other_insured_risk_id_fkey',
            references: {
              table: 'risk',
              field: 'id'
            },
            allowNull: false,
            transaction: renameTablePolicyRiskToRiskUpdate
          })

        return [
          removePolicyRiskIdForeignkeyConstraintOnPolicyTable,
          removePolicyRiskIdForeignkeyConstraintOnOtherInsuredTable,
          removePolicyRiskPrimaryKeyConstraintOnPolicyRiskTable,
          removePolicyRiskPrimaryKeyIndexPolicyRiskTable,
          renameTablePolicyRiskToRisk,
          renamePolicyRiskIdToRiskIdOnPolicyTable,
          addRiskIdPrimaryKeyConstraintOnRiskTable,
          addRiskIdForeignkeyConstraintOnPolicyTable,
          addRiskIdForeignkeyConstraintOnOtherInsuredTable
        ]
      }, { transaction: transaction })

      const removePersonIdOnRiskTable = await queryInterface.sequelize
        .transaction(async (removePersonIdOnRiskTable) => {
          return [
            await queryInterface.removeColumn('risk', 'policy_person_id', { transaction: removePersonIdOnRiskTable })
          ]
        }, { transaction: transaction })

      return [
        ...renameTablePolicyRiskToRiskUpdate,
        ...removePersonIdOnRiskTable
      ]
    })
  }
}
