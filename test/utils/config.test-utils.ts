import { Envie, Joi } from 'envie'

export type Config = Map<string, any>

module.exports = Envie({
  FALCO_API_PORT: Joi.number().min(0).default(8666).description('Port on which the HTTP server will listen'),
  FALCO_API_URL_PREFIX: Joi.string().default('/'),
  FALCO_API_LOG_LEVEL: Joi.string().valid('fatal', 'error', 'warn', 'info', 'debug', 'trace').default('error')
}) as unknown as Config
