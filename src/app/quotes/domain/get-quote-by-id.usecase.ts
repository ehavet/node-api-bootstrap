import { Quote } from './quote'
import { QuoteRepository } from './quote.repository'
import { QuotePartnerOwnershipError } from './quote.errors'

export interface GetQuoteById {
    (getQuoteByIdQuery: GetQuoteById.GetQuoteByIdQuery): Promise<Quote>
}

export namespace GetQuoteById {

    export interface GetQuoteByIdQuery {
        quoteId: string,
        partnerCode: string
    }

    export function factory (quoteRepository: QuoteRepository): GetQuoteById {
      return async (getQuoteByIdQuery: GetQuoteByIdQuery): Promise<Quote> => {
        const foundQuote = await quoteRepository.get(getQuoteByIdQuery.quoteId)

        if (Quote.isNotIssuedForPartner(foundQuote, getQuoteByIdQuery.partnerCode)) {
          throw new QuotePartnerOwnershipError(foundQuote.id, getQuoteByIdQuery.partnerCode)
        }
        return foundQuote
      }
    }
}
