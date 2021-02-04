import { UpdateQuoteCommand } from './update-quote-command'
import { Quote } from './quote'
import { QuoteRepository } from './quote.repository'

export interface UpdateQuote {
    (updateQuoteCommand: UpdateQuoteCommand): Promise<Quote>
}

export namespace UpdateQuote {

  export function factory (
    quoteRepository: QuoteRepository
  ): UpdateQuote {
    return async (updateQuoteCommand: UpdateQuoteCommand): Promise<Quote> => {
      const quote: Quote = await quoteRepository.get(updateQuoteCommand.id)
      const partnerCode = quote.partnerCode
      const { city, postalCode, roomCount } = updateQuoteCommand.risk.property
      const updatedQuote: Quote = Quote.update(quote, partner, updateQuoteCommand, partnerOperationCodes, defaultCapAdvice, coverMonthlyPrices)

      return await quoteRepository.update(updatedQuote)
    }
  }
}
