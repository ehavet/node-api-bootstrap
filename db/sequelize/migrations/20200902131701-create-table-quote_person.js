'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('quote_person', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
      },
      firstname: Sequelize.STRING,
      lastname: Sequelize.STRING,
      address: Sequelize.STRING,
      postal_code: Sequelize.STRING,
      city: Sequelize.STRING,
      email: Sequelize.STRING,
      email_validation_date: Sequelize.DATE,
      phone_number: Sequelize.STRING,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE
    })
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('quote_person')
  }
}
