import { Offer } from './offer'
import { OffersRepository } from './offers-repository'

export interface GetOffers {
    (id): Promise<Offer>
}

export namespace GetOffersUsecaseFactory {
    export function factory (
      offersRepository: OffersRepository
    ): GetOffers {
      return async (offerId) => {
        const offers: Offer = await offersRepository.get(offerId)
        return offers
      }
    }
}
