import { GetOffers, GetOffersUsecaseFactory } from '../../../../src/app/offers/domain/get-offers.usecase'
import { OffersRepository } from '../../../../src/app/offers/domain/offers-repository'
import { OffersRepositoryImpl } from '../../../../src/app/offers/infrastructure/offers-repository.impl'
import { Offer } from '../../../../src/app/offers/domain/offer'
import { expect } from '../../../test-utils'

describe('Usecase - Get offers', async () => {
  const applicationInquirer: OffersRepository = new OffersRepositoryImpl()
  const getOffers: GetOffers = GetOffersUsecaseFactory.factory(applicationInquirer)

  it('should return an offer', async () => {
    const expectedOffer: Offer = { id: '1234' }
    const applicationVersion: Offer = await getOffers(expectedOffer.id)
    expect(applicationVersion).to.deep.equal(expectedOffer)
  })
})
