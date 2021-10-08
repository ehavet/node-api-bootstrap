import { Offer } from './offer'
import { OffersRepository } from './offers-repository'

export interface GetOffer {
    (id: string): Offer
}

export namespace GetOfferUsecaseFactory {
    export function factory (
      offersRepository: OffersRepository
    ): GetOffer {
      return (id: string) => {
        const offer: Offer = offersRepository.get(id)
        return offer
      }
    }
}
