'use strict'

module.exports = {
  up: async (queryInterface) => {
    return await queryInterface.dropTable('policy_holder')
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.transaction(async (transaction) => {
      const createTablePolicyHolder = await queryInterface.sequelize.transaction(async (createTablePolicyHolder) => {
        const createTable = await queryInterface.createTable('policy_holder', {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false
          },
          firstname: Sequelize.STRING,
          lastname: Sequelize.STRING,
          risk_id: {
            type: Sequelize.UUID,
            references: {
              model: {
                tableName: 'risk'
              },
              key: 'id'
            },
            allowNull: true
          },
          created_at: Sequelize.DATE,
          updated_at: Sequelize.DATE
        }, { transaction: createTablePolicyHolder })

        return [createTable]
      }, { transaction: transaction })

      const completeTablePolicyHolder = await queryInterface.sequelize
        .transaction(async (completeTablePolicyHolder) => {
          const policyHolders = await queryInterface.sequelize.query(
            'SELECT policy_person.id, policy.risk_id, policy_person.lastname, policy_person.firstname, policy_person.created_at, policy_person.updated_at FROM policy INNER JOIN policy_person on policy.policy_holder_id = policy_person.id',
            {
              type: queryInterface.sequelize.QueryTypes.SELECT,
              transaction: completeTablePolicyHolder
            }
          )

          return await queryInterface.bulkInsert(
            'policy_holder',
            policyHolders,
            { returning: true, transaction: completeTablePolicyHolder }
          )
        }, { transaction: transaction })

      return [
        ...createTablePolicyHolder,
        ...completeTablePolicyHolder
      ]
    })
  }
}
