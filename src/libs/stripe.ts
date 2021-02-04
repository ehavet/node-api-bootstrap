import Stripe from 'stripe'
const config = require('../config')

const stripeConfig = { apiVersion: config.get('FALCO_API_STRIPE_API_VERSION') }

export type StripeClients = {
  TestClient: Stripe
  LiveClient: Stripe
}
export const stripe: StripeClients = {
  TestClient: new Stripe(config.get('FALCO_API_STRIPE_API_KEY_TEST'), stripeConfig),
  LiveClient: new Stripe(config.get('FALCO_API_STRIPE_API_KEY'), stripeConfig)
}
