const config = require('../config')

export interface ValidationLinkConfig {
  baseUrl: string
  validityPeriodinMonth: number
  frontUrl: string,
  frontCallbackPageRoute: string
  locales: string[]
}

export const validationLinkConfig: ValidationLinkConfig = {
  baseUrl: config.get('FALCO_API_EMAIL_VALIDATION_LINK_URL'),
  validityPeriodinMonth: config.get('FALCO_API_EMAIL_VALIDATION_TOKEN_VALIDITY_PERIOD'),
  frontUrl: config.get('FALCO_API_EMAIL_VALIDATION_DEFAULT_CALLBACK_URL'),
  frontCallbackPageRoute: config.get('FALCO_API_EMAIL_VALIDATION_DEFAULT_CALLBACK_ROUTE'),
  locales: ['fr', 'en']
}
