'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    const addAddressColumn = queryInterface.addColumn(
      'property',
      'address', { type: Sequelize.STRING }
    )
    const addPostalCodeColumn = queryInterface.addColumn(
      'property',
      'postal_code', { type: Sequelize.INTEGER }
    )
    const addCityColumn = queryInterface.addColumn(
      'property',
      'city', { type: Sequelize.STRING }
    )
    return Promise.all([addAddressColumn, addPostalCodeColumn, addCityColumn])
  },

  down: (queryInterface) => {
    const removeAddressColumn = queryInterface.removeColumn('property', 'address')
    const removePostalCodeColumn = queryInterface.removeColumn('property', 'postal_code')
    const removeCityColumn = queryInterface.removeColumn('property', 'city')
    return Promise.all([removeAddressColumn, removePostalCodeColumn, removeCityColumn])
  }
}
