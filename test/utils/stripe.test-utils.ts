import nock from 'nock'

export const stripeTestUtils = (function () {
  return {
    initStripeMock: () => {
      nock('https://api.stripe.com:443')
        .get('/v1/balance_transactions/bt_123321123321')
        .reply(200, balanceTransaction)
    },

    cleanStripeMock: () => {
      // This cleans all mocks. May be there is a better way to clean only the created mock but haven't found it
      nock.cleanAll()
    }
  }
}())

const balanceTransaction = {
  id: 'bt_123321123321',
  object: 'balance_transaction',
  amount: 12000,
  available_on: 1602115200,
  created: 1601546787,
  currency: 'eur',
  description: null,
  exchange_rate: null,
  fee: 373,
  fee_details: [
    {
      amount: 373,
      application: null,
      currency: 'eur',
      description: 'Stripe processing fees',
      type: 'stripe_fee'
    }
  ],
  net: 11627,
  reporting_category: 'charge',
  source: 'ch_1HXOgBA83rayFmv9r86BTZHi',
  status: 'pending',
  type: 'charge'
}
