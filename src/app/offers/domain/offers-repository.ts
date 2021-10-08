import { Offer } from './offer'

export interface OffersRepository {
    get(id): Offer
}
