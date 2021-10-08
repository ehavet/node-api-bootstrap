import routes from './offers/api/v0/offers.api'
import { OffersRepository } from './offers/domain/offers-repository'
import { OffersRepositoryImpl } from './offers/infrastructure/offers-repository.impl'
import { appConfig } from '../configs/application.config'
import { GetOffers, GetOffersUsecaseFactory } from './offers/domain/get-application-version.usecase'

export interface Container {
    GetApplicationVersion: GetOffers
}

const applicationInquirer: OffersRepository = new OffersRepositoryImpl(appConfig)
const getOffers: GetOffers = GetOffersUsecaseFactory.factory(applicationInquirer)

export const container: Container = {
  GetApplicationVersion: getOffers
}

export function offersRoutes () {
  return routes(container)
}
