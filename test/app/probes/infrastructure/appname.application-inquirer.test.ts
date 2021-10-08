import { ApplicationConfig } from '../../../../src/configs/application.config'
import { OffersRepositoryImpl } from '../../../../src/app/offers/infrastructure/offers-repository.impl'
import { OffersRepository } from '../../../../src/app/offers/domain/offers-repository'
import { expect } from '../../../test-utils'

describe('AppeninApplicationInquirer', async () => {
  const config: ApplicationConfig = { version: '9.9.99' }
  const applicationInquirer: OffersRepository = new OffersRepositoryImpl(config)

  describe('getVersion', async () => {
    it('should return application version', async () => {
      expect(applicationInquirer.get()).to.be.equal(config.version)
    })
  })
})
