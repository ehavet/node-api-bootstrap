import { Quote } from './quote'

export interface QuoteRepository {
    save(quote: Quote): Promise<Quote>,
    get(quoteId: string): Promise<Quote>,
    update(quote: Quote): Promise<Quote>
}
