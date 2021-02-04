'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('pricing_zone', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
      },
      product: Sequelize.STRING,
      cover: Sequelize.STRING,
      postal_code: Sequelize.STRING,
      city_code: Sequelize.STRING,
      city: Sequelize.STRING,
      pricing_zone: Sequelize.STRING
    })
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('pricing_zone')
  }
}
