import routes from './offers/api/v0/offers.api'
import { OffersRepository } from './offers/domain/offers-repository'
import { OffersRepositoryImpl } from './offers/infrastructure/offers-repository.impl'
import { GetOffers, GetOffersUsecaseFactory } from './offers/domain/get-offers.usecase'
import { GetOffer, GetOfferUsecaseFactory } from './offers/domain/get-offer.usecase'
import { CreateOffer, CreateOfferUsecaseFactory } from './offers/domain/create-offer.usecase'
import { SearchOffers, SearchOffersUsecaseFactory } from './offers/domain/search-offers.usecase'

export interface Container {
    GetOffers: GetOffers
    GetOffer: GetOffer
    CreateOffer: CreateOffer
    SearchOffers: SearchOffers
}

const offersRepository: OffersRepository = new OffersRepositoryImpl()
const getOffers: GetOffers = GetOffersUsecaseFactory.factory(offersRepository)
const getOffer: GetOffer = GetOfferUsecaseFactory.factory(offersRepository)
const createOffer: CreateOffer = CreateOfferUsecaseFactory.factory(offersRepository)
const searchOffers: SearchOffers = SearchOffersUsecaseFactory.factory(offersRepository)

export const container: Container = {
  GetOffers: getOffers,
  GetOffer: getOffer,
  CreateOffer: createOffer,
  SearchOffers: searchOffers,
}

export function offersRoutes () {
  return routes(container)
}
