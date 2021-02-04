import { ApplicationInquirer } from '../domain/application-inquirer'
import { ApplicationConfig } from '../../../configs/application.config'

export class AppeninApplicationInquirer implements ApplicationInquirer {
  constructor (private config: ApplicationConfig) {}

  getVersion (): string {
    return this.config.version
  }
}
