'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('payment', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
      },
      amount: Sequelize.INTEGER,
      currency: Sequelize.STRING,
      processor: Sequelize.STRING,
      method: Sequelize.STRING,
      external_id: Sequelize.STRING,
      psp_fee: Sequelize.INTEGER,
      status: Sequelize.STRING,
      payed_at: Sequelize.DATE,
      cancelled_at: Sequelize.DATE,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE
    })
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('payment')
  }
}
