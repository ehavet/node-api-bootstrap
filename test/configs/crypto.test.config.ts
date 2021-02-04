import { CryptoConfig } from '../../src/configs/crypto.config'
const config = require('../utils/config.test-utils')

export const cryptoTestConfig: CryptoConfig = {
  algorithm: 'aes-256-cbc',
  encryptionEncoding: 'base64',
  key: config.get('FALCO_API_CRYPTO_KEY'),
  initializationVector: 'ABCDEFGHIJKLMNOP'
}
