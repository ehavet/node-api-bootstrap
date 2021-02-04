import routes from './api/v0/quotes.api'
import { CreateQuote } from './domain/create-quote.usecase'
import { QuoteSqlRepository } from './infrastructure/quote-sql.repository'
import { QuoteRepository } from './domain/quote.repository'
import { QuoteSqlModel } from './infrastructure/sql-models/quote-sql-model'
import { UpdateQuote } from './domain/update-quote.usecase'
import { GetQuoteById } from './domain/get-quote-by-id.usecase'

export interface Container {
  CreateQuote: CreateQuote
  UpdateQuote: UpdateQuote
  GetQuoteById: GetQuoteById
  quoteRepository: QuoteRepository
}

const quoteRepository: QuoteRepository = new QuoteSqlRepository()
const createQuote: CreateQuote = CreateQuote.factory(quoteRepository)
const updateQuote: UpdateQuote = UpdateQuote.factory(quoteRepository)
const getQuoteById: GetQuoteById = GetQuoteById.factory(quoteRepository)

export const container: Container = {
  CreateQuote: createQuote,
  UpdateQuote: updateQuote,
  GetQuoteById: getQuoteById,
  quoteRepository: quoteRepository
}

export const quoteSqlModels: Array<any> = [
  QuoteSqlModel
]

export function quoteRoutes () {
  return routes(container)
}
