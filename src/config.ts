import { Envie, Joi } from 'envie'
require('dotenv').config()

export type Config = Map<string, any>

module.exports = Envie({
  FALCO_API_APP_NAME: Joi.string(),
  FALCO_API_PORT: Joi.number().min(0).description('Port on which the HTTP server will listen'),
  FALCO_API_URL_PREFIX: Joi.string(),
  FALCO_API_LOG_LEVEL: Joi.string().valid('fatal', 'error', 'warn', 'info', 'debug', 'trace')
}) as Config
