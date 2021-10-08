import { GetOffers, GetOffersUsecaseFactory } from '../../../../src/app/offers/domain/get-application-version.usecase'
import { OffersRepository } from '../../../../src/app/offers/domain/offers-repository'
import { OffersRepositoryImpl } from '../../../../src/app/offers/infrastructure/offers-repository.impl'
import { Offers } from '../../../../src/app/offers/domain/offers'
import { expect } from '../../../test-utils'

describe('Usecase - Get application version', async () => {
  const expectedApplicationVersion: Offers = { version: '1.2.32' }
  const applicationInquirer: OffersRepository = new OffersRepositoryImpl({ version: '1.2.32' })
  const getApplicationVersion: GetOffers = GetOffersUsecaseFactory.factory(applicationInquirer)

  it('should return an application version object', async () => {
    const applicationVersion: Offers = await getApplicationVersion()
    expect(applicationVersion).to.deep.equal(expectedApplicationVersion)
  })
})
