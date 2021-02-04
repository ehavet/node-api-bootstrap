'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('contact', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
      },
      firstname: Sequelize.STRING,
      lastname: Sequelize.STRING,
      address: Sequelize.STRING,
      postal_code: Sequelize.INTEGER,
      city: Sequelize.STRING,
      email: Sequelize.STRING,
      phone_number: Sequelize.STRING,
      policy_id: {
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: 'policy'
          },
          key: 'id'
        },
        allowNull: false
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE
    })
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('contact')
  }
}
