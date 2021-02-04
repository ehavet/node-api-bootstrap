import { expect } from '../../../test-utils'
import { createQuoteFixture } from '../fixtures/quote.fixture'
import { quoteRepositoryStub } from '../fixtures/quote-repository.test-doubles'
import { GetQuoteById } from '../../../../src/app/quotes/domain/get-quote-by-id.usecase'
import { QuoteNotFoundError, QuotePartnerOwnershipError } from '../../../../src/app/quotes/domain/quote.errors'

describe('Quotes - Usecase - Get Quote by Id', async () => {
  it('should return the found quote', async () => {
    // Given
    const storedQuote = createQuoteFixture()
    const quoteRepository = quoteRepositoryStub()
    quoteRepository.get.withArgs(storedQuote.id).resolves(storedQuote)

    const getQuoteById = GetQuoteById.factory(quoteRepository)

    // When
    const foundQuote = await getQuoteById({ quoteId: storedQuote.id, partnerCode: storedQuote.partnerCode })

    // Then
    expect(foundQuote).to.deep.equal(storedQuote)
  })

  it('should throw a QuoteNotFoundError when the quote is not found', async () => {
    // Given
    const unknownQuoteId: string = 'UNKNOWN'
    const quoteRepository = quoteRepositoryStub()
    quoteRepository.get.withArgs(unknownQuoteId).rejects(new QuoteNotFoundError(unknownQuoteId))

    const getQuoteById = GetQuoteById.factory(quoteRepository)

    // When
    const promise = getQuoteById({ quoteId: unknownQuoteId, partnerCode: 'myPartner' })

    // Then
    return expect(promise).to.be.rejectedWith(QuoteNotFoundError)
  })

  it('should return an error if the requested quote partner code is not matching the found quote partner code', async () => {
    // Given
    const storedQuote = createQuoteFixture()
    const quoteRepository = quoteRepositoryStub()
    quoteRepository.get.withArgs(storedQuote.id).resolves(storedQuote)

    const getQuoteById = GetQuoteById.factory(quoteRepository)

    // When
    const promise = getQuoteById({ quoteId: storedQuote.id, partnerCode: 'other-partner' })

    // Then
    return expect(promise).to.be.rejectedWith(QuotePartnerOwnershipError)
  })
})
