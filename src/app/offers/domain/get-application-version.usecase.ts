import { Offers } from './offers'
import { OffersRepository } from './offers-repository'

export interface GetOffers {
    (): Promise<Offers>
}

export namespace GetOffersUsecaseFactory {
    export function factory (
      offersRepository: OffersRepository
    ): GetOffers {
      return async () => {
        const version: string = await offersRepository.get()
        return { version: version }
      }
    }
}
