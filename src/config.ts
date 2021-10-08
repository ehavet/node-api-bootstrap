import { Envie, Joi } from 'envie'
require('dotenv').config()

export type Config = Map<string, any>

module.exports = Envie({
  API_APP_NAME: Joi.string(),
  API_PORT: Joi.number().min(0).description('Port on which the HTTP server will listen'),
  API_URL_PREFIX: Joi.string(),
  API_LOG_LEVEL: Joi.string().valid('fatal', 'error', 'warn', 'info', 'debug', 'trace')
}) as unknown as Config
