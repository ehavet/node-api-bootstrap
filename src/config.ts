import { Envie, Joi } from 'envie'

require('dotenv').config()

export type Config = Map<string, any>

module.exports = Envie({

  FALCO_API_APP_NAME: Joi.string(),

  FALCO_API_DATABASE_URL: Joi.string().uri({ scheme: ['postgres'] }).description('Connection string of the main database'),

  FALCO_API_LOG_LEVEL: Joi.string().valid('fatal', 'error', 'warn', 'info', 'debug', 'trace'),

  FALCO_API_PORT: Joi.number().min(0)
    .description('Port on which the HTTP server will listen'),

  FALCO_API_URL_PREFIX: Joi.string(),

  FALCO_URL_PREFIX: Joi.string().default('/'),

  FALCO_API_CRYPTO_KEY: Joi.string().base64(),

  FALCO_API_CRYPTO_IV: Joi.string(),

  FALCO_API_EMAIL_VALIDATION_LINK_URL: Joi.string().uri(),

  FALCO_API_EMAIL_VALIDATION_TOKEN_VALIDITY_PERIOD: Joi.number().min(1),

  FALCO_API_EMAIL_TRANSPORT: Joi.string().valid('sendmail', 'stream'),

  FALCO_API_STRIPE_API_KEY: Joi.string(),

  FALCO_API_STRIPE_API_KEY_TEST: Joi.string(),

  FALCO_API_STRIPE_API_VERSION: Joi.string(),

  FALCO_API_STRIPE_WEBHOOK_SECRET: Joi.string(),

  FALCO_API_EMAIL_VALIDATION_DEFAULT_CALLBACK_ROUTE: Joi.string(),

  FALCO_API_EMAIL_VALIDATION_DEFAULT_CALLBACK_URL: Joi.string(),

  FALCO_API_DOCUMENTS_STORAGE_FOLDER: Joi.string(),

  FALCO_API_HELLO_SIGN_API_KEY: Joi.string(),

  FALCO_API_HELLO_SIGN_PRODUCTION_MODE: Joi.boolean(),

  FALCO_API_HELLO_SIGN_CLIENT_ID: Joi.string(),

  FALCO_API_PDF_GENERATION_PRODUCTION_MODE: Joi.boolean()
}) as Config
