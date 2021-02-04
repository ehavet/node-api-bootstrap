import { ApplicationConfig } from '../../../../src/configs/application.config'
import { AppeninApplicationInquirer } from '../../../../src/app/probes/infrastructure/appenin.application-inquirer'
import { ApplicationInquirer } from '../../../../src/app/probes/domain/application-inquirer'
import { expect } from '../../../test-utils'

describe('AppeninApplicationInquirer', async () => {
  const config: ApplicationConfig = { version: '9.9.99' }
  const applicationInquirer: ApplicationInquirer = new AppeninApplicationInquirer(config)

  describe('getVersion', async () => {
    it('should return application version', async () => {
      expect(applicationInquirer.getVersion()).to.be.equal(config.version)
    })
  })
})
