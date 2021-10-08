import { Offer } from './offer'
import { OffersRepository } from './offers-repository'

export interface GetOffers {
    (): Offer[]
}

export namespace GetOffersUsecaseFactory {
    export function factory (
      offersRepository: OffersRepository
    ): GetOffers {
      return () => {
        const offers: Offer[] = offersRepository.getAll()
        return offers
      }
    }
}
