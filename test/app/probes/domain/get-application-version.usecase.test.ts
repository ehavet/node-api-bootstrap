import { GetApplicationVersion } from '../../../../src/app/probes/domain/get-application-version.usecase'
import { ApplicationInquirer } from '../../../../src/app/probes/domain/application-inquirer'
import { AppnameApplicationInquirer } from '../../../../src/app/probes/infrastructure/appname.application-inquirer'
import { ApplicationVersion } from '../../../../src/app/probes/domain/application-version'
import { expect } from '../../../test-utils'

describe('Usecase - Get application version', async () => {
  const expectedApplicationVersion: ApplicationVersion = { version: '1.2.34' }
  const applicationInquirer: ApplicationInquirer = new AppnameApplicationInquirer({ version: '1.2.34' })
  const getApplicationVersion: GetApplicationVersion = GetApplicationVersion.factory(applicationInquirer)

  it('should return an application version object', async () => {
    const applicationVersion: ApplicationVersion = await getApplicationVersion()
    expect(applicationVersion).to.deep.equal(expectedApplicationVersion)
  })
})
