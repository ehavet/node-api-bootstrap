import { OffersRepository } from '../domain/offers-repository'
import { ApplicationConfig } from '../../../configs/application.config'

export class OffersRepositoryImpl implements OffersRepository {
  constructor (private config: ApplicationConfig) {}

  get (): string {
    return this.config.version
  }
}
