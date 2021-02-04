import { Quote } from './quote'
import { CreateQuoteCommand } from './create-quote-command'
import { QuoteRepository } from './quote.repository'

export interface CreateQuote {
    (createQuoteCommand: CreateQuoteCommand): Promise<Quote>
}

export namespace CreateQuote {

    export function factory (
      quoteRepository: QuoteRepository
    ): CreateQuote {
      return async (createQuoteCommand: CreateQuoteCommand): Promise<Quote> => {
        const quote: Quote = Quote.create(createQuoteCommand)
        await quoteRepository.save(quote)
        return quote
      }
    }
}
