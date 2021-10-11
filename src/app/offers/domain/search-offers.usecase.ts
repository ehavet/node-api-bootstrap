import { Offer } from './offer'
import { OffersRepository } from './offers-repository'

export interface SearchOffers {
    (search: string): Offer[]
}

export namespace SearchOffersUsecaseFactory {
    export function factory (
      offersRepository: OffersRepository
    ): SearchOffers {
      return (search: string) => {
        const offers: Offer[] = offersRepository.getAll()
        
        search = search.toLocaleLowerCase()
        return offers.filter(offer => {
          const description = offer.description.toLocaleLowerCase()
          const title = offer.title.toLocaleLowerCase()
          return description.includes(search) || title.includes(search)
        });
      }
    }
}
