const { version } = require('../../package.json')

export interface ApplicationConfig {
    version: string
}

export const appConfig: ApplicationConfig = {
  version: version
}
