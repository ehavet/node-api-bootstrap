import routes from './offers/api/v0/offers.api'
import { OffersRepository } from './offers/domain/offers-repository'
import { OffersRepositoryImpl } from './offers/infrastructure/offers-repository.impl'
import { GetOffers, GetOffersUsecaseFactory } from './offers/domain/get-offers.usecase'

export interface Container {
    GetOffers: GetOffers
}

const applicationInquirer: OffersRepository = new OffersRepositoryImpl()
const getOffers: GetOffers = GetOffersUsecaseFactory.factory(applicationInquirer)

export const container: Container = {
  GetOffers: getOffers
}

export function offersRoutes () {
  return routes(container)
}
