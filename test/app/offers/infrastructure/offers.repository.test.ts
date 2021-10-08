import { OffersRepositoryImpl } from '../../../../src/app/offers/infrastructure/offers-repository.impl'
import { OffersRepository } from '../../../../src/app/offers/domain/offers-repository'
import { expect } from '../../../test-utils'
import { Offer } from '../../../../src/app/offers/domain/offer'

describe('Offers repository', async () => {
  const expectedOffer: Offer = { id: '1234' }
  const offersRepository: OffersRepository = new OffersRepositoryImpl()

  describe('get', async () => {
    it('should return and offer by id', async () => {
      expect(offersRepository.get(expectedOffer.id)).to.deep.equal(expectedOffer)
    })
  })
})
