'use strict'

module.exports = {
  up: async (queryInterface) => {
    return await queryInterface.sequelize.transaction(async (transaction) => {
      const removeInsuranceIdForeignkeyConstraintOnPolicyTable = await queryInterface
        .removeConstraint('policy', 'policy_insurance_id_fkey', { transaction: transaction })

      const renameInsuranceIdToPolicyInsuranceIdOnPolicyTable = await queryInterface
        .renameColumn('policy', 'insurance_id', 'policy_insurance_id', { transaction: transaction })

      const removeInsurancePrimaryKeyConstraintOnInsuranceTable = await queryInterface
        .removeConstraint('insurance', 'insurance_pkey', { transaction: transaction })

      const removeInsurancePrimaryKeyIndexOnInsuranceTable = await queryInterface
        .removeIndex('insurance', 'insurance_pkey', { transaction: transaction })

      const renameTableInsuranceToPolicyInsurance = await queryInterface
        .renameTable('insurance', 'policy_insurance', { transaction: transaction })

      const addPolicyInsuranceIdPrimaryKeyConstraintOnPolicyInsuranceTable = await queryInterface
        .addConstraint('policy_insurance', {
          type: 'primary key',
          fields: ['id'],
          name: 'policy_insurance_pkey',
          transaction: transaction
        })

      const addPolicyInsuranceIdForeignkeyConstraintOnPolicyTable = await queryInterface
        .addConstraint('policy', {
          type: 'foreign key',
          fields: ['policy_insurance_id'],
          name: 'policy_policy_insurance_id_fkey',
          references: {
            table: 'policy_insurance',
            field: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
          allowNull: false,
          transaction: transaction
        })

      return [
        removeInsuranceIdForeignkeyConstraintOnPolicyTable,
        renameInsuranceIdToPolicyInsuranceIdOnPolicyTable,
        removeInsurancePrimaryKeyConstraintOnInsuranceTable,
        removeInsurancePrimaryKeyIndexOnInsuranceTable,
        renameTableInsuranceToPolicyInsurance,
        addPolicyInsuranceIdPrimaryKeyConstraintOnPolicyInsuranceTable,
        addPolicyInsuranceIdForeignkeyConstraintOnPolicyTable
      ]
    })
  },

  down: async (queryInterface) => {
    return await queryInterface.sequelize.transaction(async (transaction) => {
      const removePolicyInsuranceIdForeignkeyConstraintOnPolicyTable = await queryInterface
        .removeConstraint('policy', 'policy_policy_insurance_id_fkey', { transaction: transaction })

      const renamePolicyInsuranceIdToInsuranceIdOnPolicyTable = await queryInterface
        .renameColumn('policy', 'policy_insurance_id', 'insurance_id', { transaction: transaction })

      const removePolicyInsurancePrimaryKeyConstraintOnPolicyInsuranceTable = await queryInterface
        .removeConstraint('policy_insurance', 'policy_insurance_pkey', { transaction: transaction })

      const removePolicyInsurancePrimaryKeyIndexPolicyInsuranceTable = await queryInterface
        .removeIndex('policy_insurance', 'policy_insurance_pkey', { transaction: transaction })

      const renameTablePolicyInsuranceToInsurance = await queryInterface
        .renameTable('policy_insurance', 'insurance', { transaction: transaction })

      const addInsuranceIdPrimaryKeyConstraintOnInsuranceTable = await queryInterface
        .addConstraint('insurance', {
          type: 'primary key',
          fields: ['id'],
          name: 'insurance_pkey',
          transaction: transaction
        })

      const addInsuranceIdForeignKeyConstraintOnPolicyTable = await queryInterface
        .addConstraint('policy', {
          type: 'foreign key',
          fields: ['insurance_id'],
          name: 'policy_insurance_id_fkey',
          references: {
            table: 'insurance',
            field: 'id'
          },
          allowNull: false,
          transaction: transaction
        })

      return [
        removePolicyInsuranceIdForeignkeyConstraintOnPolicyTable,
        renamePolicyInsuranceIdToInsuranceIdOnPolicyTable,
        removePolicyInsurancePrimaryKeyConstraintOnPolicyInsuranceTable,
        removePolicyInsurancePrimaryKeyIndexPolicyInsuranceTable,
        renameTablePolicyInsuranceToInsurance,
        addInsuranceIdPrimaryKeyConstraintOnInsuranceTable,
        addInsuranceIdForeignKeyConstraintOnPolicyTable
      ]
    })
  }
}
