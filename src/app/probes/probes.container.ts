import routes from './api/v0/probes.api'
import { ApplicationInquirer } from './domain/application-inquirer'
import { AppnameApplicationInquirer } from './infrastructure/appname.application-inquirer'
import { appConfig } from '../../configs/application.config'
import { GetApplicationVersion } from './domain/get-application-version.usecase'

export interface Container {
    GetApplicationVersion: GetApplicationVersion
}

const applicationInquirer: ApplicationInquirer = new AppnameApplicationInquirer(appConfig)
const getApplicationVersion: GetApplicationVersion = GetApplicationVersion.factory(applicationInquirer)

export const container: Container = {
  GetApplicationVersion: getApplicationVersion
}

export function probesRoutes () {
  return routes(container)
}
