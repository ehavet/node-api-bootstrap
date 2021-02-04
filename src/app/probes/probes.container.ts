import routes from './api/v0/probes.api'
import { CheckApplicationReadiness } from './domain/check-application-readiness.usecase'
import { DatabaseHealthChecker } from './domain/database-health-checker'
import { SequelizeHealthChecker } from './infrastructure/sequelize.health-checker'
import { ApplicationInquirer } from './domain/application-inquirer'
import { AppeninApplicationInquirer } from './infrastructure/appenin.application-inquirer'
import { appConfig } from '../../configs/application.config'
import { GetApplicationVersion } from './domain/get-application-version.usecase'

export interface Container {
    CheckApplicationReadiness: CheckApplicationReadiness
    GetApplicationVersion: GetApplicationVersion
}

const databaseHealthChecker: DatabaseHealthChecker = new SequelizeHealthChecker()
const checkApplicationReadiness: CheckApplicationReadiness = CheckApplicationReadiness.factory(databaseHealthChecker)

const applicationInquirer: ApplicationInquirer = new AppeninApplicationInquirer(appConfig)
const getApplicationVersion: GetApplicationVersion = GetApplicationVersion.factory(applicationInquirer)

export const container: Container = {
  CheckApplicationReadiness: checkApplicationReadiness,
  GetApplicationVersion: getApplicationVersion
}

export function probesRoutes () {
  return routes(container)
}
