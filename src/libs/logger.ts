import Pino from 'pino'

const config = require('../config')

export type Logger = Pino.Logger

export const logger = Pino({
  name: config.get('FALCO_API_APP_NAME'),
  level: config.get('FALCO_API_LOG_LEVEL')
})
