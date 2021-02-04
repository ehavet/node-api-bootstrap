'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    const addCreatedAtColumn = queryInterface.addColumn(
      'pricing_zone',
      'created_at', { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') }
    )
    const addUpdatedAtColumn = queryInterface.addColumn(
      'pricing_zone',
      'updated_at', { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') }
    )
    return Promise.all([addCreatedAtColumn, addUpdatedAtColumn])
  },

  down: (queryInterface) => {
    const removeCreatedAtColumn = queryInterface.removeColumn('pricing_zone', 'created_at')
    const removeUpdatedAtColumn = queryInterface.removeColumn('pricing_zone', 'updated_at')
    return Promise.all([removeCreatedAtColumn, removeUpdatedAtColumn])
  }
}
