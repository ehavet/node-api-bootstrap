import { ApplicationInquirer } from '../domain/application-inquirer'
import { ApplicationConfig } from '../../../configs/application.config'

export class AppnameApplicationInquirer implements ApplicationInquirer {
  constructor (private config: ApplicationConfig) {}

  getVersion (): string {
    return this.config.version
  }
}
