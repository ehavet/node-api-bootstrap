'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('quote_insurance', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
      },
      monthly_price: Sequelize.FLOAT,
      default_deductible: Sequelize.FLOAT,
      default_ceiling: Sequelize.FLOAT,
      currency: Sequelize.STRING(5),
      simplified_covers: Sequelize.ARRAY(Sequelize.STRING(15)),
      product_code: Sequelize.STRING(50),
      product_version: Sequelize.STRING(30),
      contractual_terms: Sequelize.STRING(),
      ipid: Sequelize.STRING(),
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE
    })
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('quote_insurance', { cascade: true })
  }
}
