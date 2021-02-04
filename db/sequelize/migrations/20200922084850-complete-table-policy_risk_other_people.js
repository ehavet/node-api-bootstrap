'use strict'

module.exports = {
  up: async (queryInterface) => {
    const { v4: uuidv4 } = require('uuid')
    return await queryInterface.sequelize.transaction(async (transaction) => {
      const otherInsuredList = await queryInterface.sequelize.query(
        'SELECT id, firstname, lastname, created_at, updated_at, risk_id FROM other_insured',
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
          transaction: transaction
        }
      )

      if (otherInsuredList.length > 0) {
        const policyPeople = await otherInsuredList.map(insured => {
          return { id: insured.id, firstname: insured.firstname, lastname: insured.lastname, created_at: insured.created_at, updated_at: insured.created_at }
        })

        const bulkInsertOnPolicyPerson = await queryInterface.bulkInsert(
          'policy_person',
          policyPeople,
          { transaction: transaction }
        )

        const riskToPersonAssociations = await otherInsuredList.map(insured => {
          return { id: uuidv4(), policy_risk_id: insured.risk_id, policy_person_id: insured.id, created_at: insured.created_at, updated_at: insured.created_at }
        })

        const bulkInsertOnPolicyRiskOtherPeople = await queryInterface.bulkInsert(
          'policy_risk_other_people',
          riskToPersonAssociations,
          { transaction: transaction }
        )

        const clearOtherInsuredTable = await queryInterface.sequelize.query(
          'DELETE FROM other_insured',
          {
            type: queryInterface.sequelize.QueryTypes.SELECT,
            transaction: transaction
          }
        )

        return [bulkInsertOnPolicyPerson, bulkInsertOnPolicyRiskOtherPeople, clearOtherInsuredTable]
      }

      return Promise.resolve()
    })
  },

  down: async (queryInterface) => {
    return await queryInterface.sequelize.transaction(async (transaction) => {
      const otherInsuredList = await queryInterface.sequelize.query(
        'SELECT policy_person.id, policy_person.firstname, policy_person.lastname, policy_risk_other_people.policy_risk_id as risk_id, policy_person.created_at, policy_person.updated_at FROM policy_person INNER JOIN policy_risk_other_people ON policy_person.id = policy_risk_other_people.policy_person_id',
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
          transaction: transaction
        }
      )

      if (otherInsuredList.length > 0) {
        const bulkInsertOnOtherInsured = await queryInterface.bulkInsert(
          'other_insured',
          otherInsuredList,
          { transaction: transaction }
        )

        const removePolicyRiskOtherPeopleForeignKeyConstraint = await queryInterface
          .removeConstraint(
            'policy_risk_other_people', 'policy_risk_other_people_policy_person_id_fkey',
            { transaction: transaction }
          )

        const deletePolicyPersonAsOtherInsured = await queryInterface.sequelize.query(
          'DELETE FROM policy_person USING policy_risk_other_people WHERE policy_person.id = policy_risk_other_people.policy_person_id',
          {
            type: queryInterface.sequelize.QueryTypes.SELECT,
            transaction: transaction
          }
        )

        const clearPolicyRiskOtherPeopleTable = await queryInterface.sequelize.query(
          'DELETE FROM policy_risk_other_people',
          {
            type: queryInterface.sequelize.QueryTypes.SELECT,
            transaction: transaction
          }
        )

        const addPolicyRiskOtherPeopleForeignKeyConstraint = await queryInterface
          .addConstraint('policy_risk_other_people', {
            type: 'foreign key',
            fields: ['policy_person_id'],
            name: 'policy_risk_other_people_policy_person_id_fkey',
            references: {
              table: 'policy_person',
              field: 'id'
            },
            allowNull: false,
            transaction: transaction
          })

        return [
          bulkInsertOnOtherInsured,
          removePolicyRiskOtherPeopleForeignKeyConstraint,
          deletePolicyPersonAsOtherInsured,
          clearPolicyRiskOtherPeopleTable,
          addPolicyRiskOtherPeopleForeignKeyConstraint
        ]
      }

      return Promise.resolve()
    })
  }
}
