'use strict'

module.exports = {
  up: async (queryInterface) => {
    await upConvertAmountAndPspFee(queryInterface)
  },

  down: async (queryInterface) => {
    await downConvertAmountAndPspFee(queryInterface)
  }
}

async function upConvertAmountAndPspFee (queryInterface) {
  await _convertAmountAndPspFee(queryInterface, true)
}
async function downConvertAmountAndPspFee (queryInterface) {
  await _convertAmountAndPspFee(queryInterface, false)
}

async function _convertAmountAndPspFee (queryInterface, isUpMigration) {
  const payments = await queryInterface.sequelize.query('SELECT id, amount, psp_fee FROM payment')

  return payments[0].map(payment => {
    const amount = parseInt(payment.amount)
    const pspFee = parseInt(payment.psp_fee)
    return queryInterface.bulkUpdate('payment', {
      amount: isUpMigration ? amount / 100 : amount * 100,
      psp_fee: isUpMigration ? pspFee / 100 : pspFee * 100
    }, {
      id: payment.id
    })
  })
}
