const hellosignSdk = require('hellosign-sdk')
const config = require('../config')

export interface HelloSignConfig {
    hellosign
    clientId: string
    testMode: boolean
    key: string
}

export const helloSignConfig: HelloSignConfig = {
  hellosign: hellosignSdk({ key: config.get('FALCO_API_HELLO_SIGN_API_KEY') }),
  clientId: config.get('FALCO_API_HELLO_SIGN_CLIENT_ID'),
  testMode: !config.get('FALCO_API_HELLO_SIGN_PRODUCTION_MODE'),
  key: config.get('FALCO_API_HELLO_SIGN_API_KEY')
}
