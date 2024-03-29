import { Offer } from "./offer";

export interface OffersRepository {
    getAll(): Offer[]
    get(offerId: string): Offer
    create(newOffer: Offer): void
}
