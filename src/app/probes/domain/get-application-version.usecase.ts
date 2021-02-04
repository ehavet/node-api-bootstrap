import { ApplicationVersion } from './application-version'
import { ApplicationInquirer } from './application-inquirer'

export interface GetApplicationVersion {
    (): Promise<ApplicationVersion>
}

export namespace GetApplicationVersion {
    export function factory (
      applicationInquirer: ApplicationInquirer
    ): GetApplicationVersion {
      return async () => {
        const version: string = await applicationInquirer.getVersion()
        return { version: version }
      }
    }
}
