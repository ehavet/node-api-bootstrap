const config = require('../config')

export interface CryptoConfig {
    algorithm: string
    encryptionEncoding: BufferEncoding
    key: string
    initializationVector: string
}

export const cryptoConfig: CryptoConfig = {
  algorithm: 'aes-256-cbc',
  encryptionEncoding: 'base64',
  key: config.get('FALCO_API_CRYPTO_KEY'),
  initializationVector: 'ABCDEFGHIJKLMNOP'
}
