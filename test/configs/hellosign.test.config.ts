import { HelloSignConfig } from '../../src/configs/hello-sign.config'
import { config } from '../test-utils'
const hellosignSdk = require('hellosign-sdk')

export const helloSignConfigTest: HelloSignConfig = {
  hellosign: hellosignSdk({ key: config.get('FALCO_API_HELLO_SIGN_API_KEY') }),
  clientId: config.get('FALCO_API_HELLO_SIGN_CLIENT_ID'),
  testMode: !config.get('FALCO_API_HELLO_SIGN_PRODUCTION_MODE'),
  key: config.get('FALCO_API_HELLO_SIGN_API_KEY')
}
