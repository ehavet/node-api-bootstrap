'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('policy', {
      id: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        autoIncrement: false,
        allowNull: false
      },
      partner_code: Sequelize.STRING(20),
      premium: Sequelize.FLOAT,
      nb_months_due: Sequelize.INTEGER,
      subscription_date: Sequelize.DATE,
      start_date: Sequelize.DATEONLY,
      term_start_date: Sequelize.DATEONLY,
      term_end_date: Sequelize.DATEONLY,
      signature_date: Sequelize.DATE,
      payment_date: Sequelize.DATE,
      insurance_id: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'insurance'
          },
          key: 'id'
        },
        allowNull: false
      },
      risk_id: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'risk'
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
    return queryInterface.dropTable('policy')
  }
}
