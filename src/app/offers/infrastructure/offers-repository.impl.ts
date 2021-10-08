import { OffersRepository } from '../domain/offers-repository'
import { Offer } from '../domain/offer'

export class OffersRepositoryImpl implements OffersRepository {
  constructor () {}

  get (id): Offer {
    return { id: id }
  }
}
