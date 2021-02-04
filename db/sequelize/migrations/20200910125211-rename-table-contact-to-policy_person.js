'use strict'

module.exports = {
  up: async (queryInterface) => {
    return await queryInterface.sequelize.transaction(async (transaction) => {
      const removeContactPrimaryKeyConstraint = await queryInterface
        .removeConstraint('contact', 'contact_pkey', { transaction: transaction })

      const removeContactPolicyIdForeignKeyConstraint = await queryInterface
        .removeConstraint('contact', 'contact_policy_id_fkey', { transaction: transaction })

      const removeContactPrimaryKeyIndex = await queryInterface
        .removeIndex('contact', 'contact_pkey', { transaction: transaction })

      const renameTableContactToPolicyPerson = await queryInterface
        .renameTable('contact', 'policy_person', { transaction: transaction })

      const addPolicyPersonPrimaryKeyConstraint = await queryInterface
        .addConstraint('policy_person', {
          type: 'primary key',
          fields: ['id'],
          name: 'policy_person_pkey',
          transaction: transaction
        })

      return [
        removeContactPrimaryKeyConstraint,
        removeContactPolicyIdForeignKeyConstraint,
        removeContactPrimaryKeyIndex,
        renameTableContactToPolicyPerson,
        addPolicyPersonPrimaryKeyConstraint
      ]
    })
  },

  down: async (queryInterface) => {
    return await queryInterface.sequelize.transaction(async (transaction) => {
      const renamePolicyPersonToContactTable = await queryInterface.sequelize.transaction(async (renamePolicyPersonToContactTable) => {
        const removePolicyPersonPrimaryKeyConstraint = await queryInterface
          .removeConstraint('policy_person', 'policy_person_pkey', { transaction: renamePolicyPersonToContactTable })

        const removePolicyPersonPrimaryKeyIndex = await queryInterface
          .removeIndex('policy_person', 'policy_person_pkey', { transaction: renamePolicyPersonToContactTable })

        const renameTablePolicyPersonToContact = await queryInterface
          .renameTable('policy_person', 'contact', { transaction: renamePolicyPersonToContactTable })

        const addContactPrimaryKeyConstraint = await queryInterface
          .addConstraint('contact', {
            type: 'primary key',
            fields: ['id'],
            name: 'contact_pkey',
            transaction: renamePolicyPersonToContactTable
          })

        const addPolicyIdForeignKeyConstraintOnContactTable = await queryInterface
          .addConstraint('contact', {
            type: 'foreign key',
            fields: ['policy_id'],
            name: 'contact_policy_id_fkey',
            references: {
              table: 'policy',
              field: 'id'
            },
            allowNull: false,
            transaction: renamePolicyPersonToContactTable
          })

        return [
          removePolicyPersonPrimaryKeyConstraint,
          removePolicyPersonPrimaryKeyIndex,
          renameTablePolicyPersonToContact,
          addContactPrimaryKeyConstraint,
          addPolicyIdForeignKeyConstraintOnContactTable
        ]
      }, { transaction: transaction })

      return [renamePolicyPersonToContactTable]
    })
  }
}
