import routes from './offers/api/v0/offers.api'
import { OffersRepository } from './offers/domain/offers-repository'
import { OffersRepositoryImpl } from './offers/infrastructure/offers-repository.impl'
import { GetOffers, GetOffersUsecaseFactory } from './offers/domain/get-offers.usecase'
import { GetOffer, GetOfferUsecaseFactory } from './offers/domain/get-offer.usecase'

export interface Container {
    GetOffers: GetOffers
    GetOffer: GetOffer
}

const offersRepository: OffersRepository = new OffersRepositoryImpl()
const getOffers: GetOffers = GetOffersUsecaseFactory.factory(offersRepository)
const getOffer: GetOffer = GetOfferUsecaseFactory.factory(offersRepository)

export const container: Container = {
  GetOffers: getOffers,
  GetOffer: getOffer
}

export function offersRoutes () {
  return routes(container)
}
