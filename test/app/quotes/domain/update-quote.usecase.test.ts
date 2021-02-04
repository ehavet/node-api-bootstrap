import { dateFaker, expect, sinon } from '../../../test-utils'
import { UpdateQuoteCommand } from '../../../../src/app/quotes/domain/update-quote-command'
import { UpdateQuote } from '../../../../src/app/quotes/domain/update-quote.usecase'
import { Quote } from '../../../../src/app/quotes/domain/quote'
import {
  createQuoteFixture,
  createQuoteInsuranceFixture,
  createQuotePolicyHolderFixture,
  createQuoteRiskFixture,
  createUpdateQuoteCommandFixture,
  createUpdateQuoteCommandPolicyHolderFixture,
  createUpdateQuoteCommandRiskFixture
} from '../fixtures/quote.fixture'
import { SinonStubbedInstance } from 'sinon'
import {
  QuoteNotFoundError,
  QuoteRiskNumberOfRoommatesError,
  QuoteRiskOccupancyNotInsurableError,
  QuoteRiskPropertyRoomCountNotInsurableError,
  QuoteRiskPropertyTypeNotInsurableError,
  QuoteRiskRoommatesNotAllowedError,
  QuoteStartDateConsistencyError
} from '../../../../src/app/quotes/domain/quote.errors'
import { PartnerRepository } from '../../../../src/app/partners/domain/partner.repository'
import { createPartnerFixture } from '../../partners/fixtures/partner.fixture'
import { OperationCode } from '../../../../src/app/core/domain/operation-code'
import { OperationCodeNotApplicableError } from '../../../../src/app/policies/domain/operation-code.errors'
import { Partner } from '../../../../src/app/partners/domain/partner'
import { partnerRepositoryStub } from '../../partners/fixtures/partner-repository.test-doubles'
import { quoteRepositoryStub } from '../fixtures/quote-repository.test-doubles'
import { defaultCapAdviceRepositoryStub } from '../fixtures/default-cap-advice-repository.test-doubles'
import { DefaultCapAdvice } from '../../../../src/app/quotes/domain/default-cap-advice/default-cap-advice'
import { coverMonthlyPriceRepositoryStub } from '../fixtures/cover-monthly-price-repository.test-doubles'
import { PropertyType } from '../../../../src/app/core/domain/type/property-type'
import { pricingZoneRepositoryStub } from '../fixtures/pricing-zone-repository.test-doubles'
import { CoverPricingZone } from '../../../../src/app/quotes/domain/cover-pricing-zone/cover-pricing-zone'
import { CoverMonthlyPrice } from '../../../../src/app/quotes/domain/cover-monthly-price/cover-monthly-price'
import { Occupancy } from '../../../../src/app/core/domain/type/occupancy'

describe('Quotes - Usecase - Update Quote', async () => {
  const now: Date = new Date('2020-01-05T00:00:00Z')
  let updateQuote: UpdateQuote
  let quoteRepository
  let partnerRepository: SinonStubbedInstance<PartnerRepository>
  let quote: Quote
  let partner: Partner
  const defaultCapAdviceRepository = defaultCapAdviceRepositoryStub()
  const coverMonthlyPriceRepository = coverMonthlyPriceRepositoryStub()
  const pricingZoneRepository = pricingZoneRepositoryStub()
  const quoteId: string = 'UDQUOT3'
  const partnerCode: string = 'myPartner'
  const coverMonthlyPrices: CoverMonthlyPrice[] = [
    { price: '2.50000', cover: 'DDEAUX' },
    { price: '2.50000', cover: 'INCEND' },
    { price: '0.82000', cover: 'VOLXXX' }
  ]
  const pricingZones: CoverPricingZone[] = [
    { zone: 'ZD1', cover: 'DDEAUX' },
    { zone: 'ZB2', cover: 'INCEND' },
    { zone: 'ZC3', cover: 'VOLXXX' }
  ]

  beforeEach(() => {
    dateFaker.setCurrentDate(now)
    quote = createQuoteFixture({ id: quoteId })
    quoteRepository = quoteRepositoryStub({ update: sinon.mock() })
    partnerRepository = partnerRepositoryStub()
    partner = createPartnerFixture(
      {
        code: partnerCode,
        questions: [
          {
            code: Partner.Question.QuestionCode.PROPERTY_TYPE,
            toAsk: false,
            defaultValue: PropertyType.FLAT,
            defaultNextStep: Partner.Question.QuestionCode.ADDRESS
          },
          {
            code: Partner.Question.QuestionCode.OCCUPANCY,
            toAsk: false,
            defaultValue: Occupancy.TENANT,
            defaultNextStep: Partner.Question.QuestionCode.ADDRESS
          },
          {
            code: Partner.Question.QuestionCode.ROOM_COUNT,
            toAsk: true,
            options: [
              { value: 1 },
              { value: 2 },
              { value: 3 },
              { value: 4, nextStep: Partner.Question.NextStepAction.REJECT }
            ],
            defaultNextStep: Partner.Question.QuestionCode.ADDRESS,
            defaultValue: 1
          },
          {
            code: Partner.Question.QuestionCode.ADDRESS,
            toAsk: true,
            defaultNextStep: Partner.Question.NextStepAction.SUBMIT
          },
          {
            code: Partner.Question.QuestionCode.ROOMMATE,
            applicable: true,
            maximumNumbers: [
              { roomCount: 1, value: 0 },
              { roomCount: 2, value: 1 },
              { roomCount: 3, value: 2 }
            ]
          }
        ],
        offer: {
          simplifiedCovers: ['ACDDE', 'ACVOL'],
          defaultDeductible: 150,
          productCode: 'APP999',
          productVersion: 'v2020-02-01',
          contractualTerms: '/path/to/contractual/terms',
          ipid: '/path/to/ipid',
          operationCodes: [OperationCode.SEMESTER1, OperationCode.FULLYEAR]
        }
      }
    )
    partnerRepository.getByCode.withArgs(partnerCode).resolves(partner)
    partnerRepository.getOperationCodes.withArgs(partnerCode).resolves(
      [OperationCode.FULLYEAR, OperationCode.SEMESTER1, OperationCode.SEMESTER2, OperationCode.BLANK]
    )
    defaultCapAdviceRepository.get.resolves({ value: 7000 })
    pricingZoneRepository.getAllForProductByLocation.resolves(pricingZones)
    coverMonthlyPriceRepository.getAllForPartnerByPricingZone.resolves(coverMonthlyPrices)
    updateQuote = UpdateQuote.factory(quoteRepository, partnerRepository, defaultCapAdviceRepository, coverMonthlyPriceRepository, pricingZoneRepository)
  })

  afterEach(() => {
    quoteRepository.get.reset()
    partnerRepository.getByCode.reset()
    partnerRepository.getOperationCodes.reset()
    quoteRepository.update.reset()
    coverMonthlyPriceRepository.getAllForPartnerByPricingZone.reset()
    coverMonthlyPriceRepository.getAllForPartnerWithoutZone.reset()
    pricingZoneRepository.getAllForProductByLocation.reset()
  })

  describe('updating the start date', async () => {
    it('should update start date, term start date and term end date when start date is changed', async () => {
      // Given
      const updatedStartDate: Date = new Date('2020-07-01')
      const updatedQuote = createQuoteFixture(
        {
          id: 'UDQUOT3',
          startDate: new Date('2020-07-01T00:00:00.000Z'),
          termStartDate: new Date('2020-07-01T00:00:00.000Z'),
          termEndDate: new Date('2021-06-30T00:00:00.000Z'),
          specialOperationsCode: null,
          specialOperationsCodeAppliedAt: null
        }
      )
      quoteRepository.get.withArgs(quoteId).resolves(quote)
      quoteRepository.update.resolves(updatedQuote)

      // When
      const updateQuoteCommand = createUpdateQuoteCommandFixture({ id: quoteId, startDate: updatedStartDate })
      await updateQuote(updateQuoteCommand)

      // Then
      expect(quoteRepository.update).to.have.been.calledWith(updatedQuote)
    })
  })

  describe('updating the special operations code', async () => {
    it('should update premium on 5 months if new special operations code is SEMESTER1', async () => {
      // Given
      quoteRepository.get.withArgs(quoteId).resolves(quote)
      const updateQuoteCommand = createUpdateQuoteCommandFixture({ id: quoteId, specOpsCode: 'SEMESTER1' })
      const updatedQuote = createQuoteFixture(
        {
          id: 'UDQUOT3',
          premium: 29.1,
          nbMonthsDue: 5,
          specialOperationsCode: OperationCode.SEMESTER1,
          specialOperationsCodeAppliedAt: new Date('2020-01-05T00:00:00.000Z'),
          termEndDate: new Date('2020-06-04T00:00:00.000Z')
        }
      )
      quoteRepository.update.resolves(updatedQuote)

      // When
      await updateQuote(updateQuoteCommand)

      // Then
      sinon.assert.calledWithExactly(quoteRepository.update, updatedQuote)
    })

    it('should update premium on 5 months if new special operations code is SEMESTER2', async () => {
      // Given
      quoteRepository.get.withArgs(quoteId).resolves(quote)
      const updateQuoteCommand = createUpdateQuoteCommandFixture({ id: quoteId, specOpsCode: 'SEMESTER2' })
      const updatedQuote = createQuoteFixture(
        {
          id: 'UDQUOT3',
          premium: 29.1,
          nbMonthsDue: 5,
          specialOperationsCode: OperationCode.SEMESTER2,
          specialOperationsCodeAppliedAt: new Date('2020-01-05T00:00:00.000Z'),
          termEndDate: new Date('2020-06-04T00:00:00.000Z')
        }
      )
      quoteRepository.update.resolves(updatedQuote)

      // When
      await updateQuote(updateQuoteCommand)

      // Then
      sinon.assert.calledWithExactly(quoteRepository.update, updatedQuote)
    })

    it('should update premium on 10 months if new special operations code is FULLYEAR', async () => {
      // Given
      quoteRepository.get.withArgs(quoteId).resolves(quote)
      const updateQuoteCommand = createUpdateQuoteCommandFixture({ id: quoteId, specOpsCode: 'FULLYEAR' })
      const updatedQuote = createQuoteFixture(
        {
          id: 'UDQUOT3',
          premium: 58.2,
          nbMonthsDue: 10,
          specialOperationsCode: OperationCode.FULLYEAR,
          specialOperationsCodeAppliedAt: new Date('2020-01-05T00:00:00.000Z'),
          termEndDate: new Date('2020-11-04T00:00:00.000Z')
        }
      )
      quoteRepository.update.resolves(updatedQuote)

      // When
      await updateQuote(updateQuoteCommand)

      // Then
      sinon.assert.calledWithExactly(quoteRepository.update, updatedQuote)
    })

    describe('when an empty operation code is provided', async () => {
      it('should update premium on 12 months with specialOperationsCode and specialOperationsCodeAppliedAt not filled up when no spec ops code applied previously', async () => {
        // Given
        quoteRepository.get.withArgs(quoteId).resolves(quote)
        const updateQuoteCommand = createUpdateQuoteCommandFixture({ id: quoteId, specOpsCode: '' })
        const updatedQuote = createQuoteFixture(
          {
            id: 'UDQUOT3',
            premium: 69.84,
            nbMonthsDue: 12,
            specialOperationsCode: null,
            specialOperationsCodeAppliedAt: null,
            termEndDate: new Date('2021-01-04T00:00:00.000Z')
          }
        )
        quoteRepository.update.resolves(updatedQuote)

        // When
        await updateQuote(updateQuoteCommand)

        // Then
        return expect(quoteRepository.update).to.have.been.calledWithExactly(updatedQuote)
      })

      it('should update premium on 12 months with specialOperationsCode null and specialOperationsCodeAppliedAt filled up when a spec ops code has been applied previously', async () => {
        // Given
        const quote = createQuoteFixture({ id: quoteId, specialOperationsCode: OperationCode.SEMESTER1, specialOperationsCodeAppliedAt: new Date() })
        quoteRepository.get.withArgs(quoteId).resolves(quote)
        const updateQuoteCommand = createUpdateQuoteCommandFixture({ id: quote.id, specOpsCode: '' })
        const updatedQuote = createQuoteFixture(
          {
            id: 'UDQUOT3',
            premium: 69.84,
            nbMonthsDue: 12,
            specialOperationsCode: null,
            specialOperationsCodeAppliedAt: new Date('2020-01-05T00:00:00.000Z'),
            termEndDate: new Date('2021-01-04T00:00:00.000Z')
          }
        )
        quoteRepository.update.resolves(updatedQuote)

        // When
        await updateQuote(updateQuoteCommand)

        // Then
        return expect(quoteRepository.update).to.have.been.calledWithExactly(updatedQuote)
      })
    })

    describe('when an undefined operation code is provided', async () => {
      it('should update premium on 12 months with specialOperationsCode and specialOperationsCodeAppliedAt not filled up when no spec ops code applied previously', async () => {
        // Given
        quoteRepository.get.withArgs(quoteId).resolves(quote)
        const updateQuoteCommand = createUpdateQuoteCommandFixture({ id: quoteId, specOpsCode: undefined })
        const updatedQuote = createQuoteFixture(
          {
            id: 'UDQUOT3',
            premium: 69.84,
            nbMonthsDue: 12,
            specialOperationsCode: null,
            specialOperationsCodeAppliedAt: null,
            termEndDate: new Date('2021-01-04T00:00:00.000Z')
          }
        )
        quoteRepository.update.resolves(updatedQuote)

        // When
        await updateQuote(updateQuoteCommand)

        // Then
        return expect(quoteRepository.update).to.have.been.calledWithExactly(updatedQuote)
      })

      it('should update premium on 12 months with specialOperationsCode null and specialOperationsCodeAppliedAt filled up when a spec ops code has been applied previously', async () => {
        // Given
        const quote = createQuoteFixture({ id: quoteId, specialOperationsCode: OperationCode.SEMESTER1, specialOperationsCodeAppliedAt: new Date() })
        quoteRepository.get.withArgs(quoteId).resolves(quote)
        const updateQuoteCommand = createUpdateQuoteCommandFixture({ id: quote.id, specOpsCode: undefined })
        const updatedQuote = createQuoteFixture(
          {
            id: 'UDQUOT3',
            premium: 69.84,
            nbMonthsDue: 12,
            specialOperationsCode: null,
            specialOperationsCodeAppliedAt: new Date('2020-01-05T00:00:00.000Z'),
            termEndDate: new Date('2021-01-04T00:00:00.000Z')
          }
        )
        quoteRepository.update.resolves(updatedQuote)

        // When
        await updateQuote(updateQuoteCommand)

        // Then
        return expect(quoteRepository.update).to.have.been.calledWithExactly(updatedQuote)
      })
    })

    describe('should apply operation code when valid code contains spaces or non alphanumeric characters', async () => {
      const codesList = ['FULL   YEAR', 'FULL_YEAR', 'FULL.YEAR', 'fullyear', 'full@year', 'FUll!ç&Year']
      const updatedQuote = createQuoteFixture(
        {
          id: 'UDQUOT3',
          nbMonthsDue: 10,
          premium: 58.2,
          specialOperationsCode: OperationCode.FULLYEAR,
          specialOperationsCodeAppliedAt: new Date('2020-01-05T00:00:00.000Z'),
          termEndDate: new Date('2020-11-04T00:00:00.000Z')
        }
      )

      for (const code of codesList) {
        it(`when ${code} is passed as special operations code`, async () => {
          // Given
          quoteRepository.get.withArgs(quoteId).resolves(quote)
          quoteRepository.update.withArgs(updatedQuote).resolves()

          const updateQuoteCommand = createUpdateQuoteCommandFixture({ id: quoteId, specOpsCode: code })

          // When
          await updateQuote(updateQuoteCommand)

          // Then
          quoteRepository.update.verify()
        })
      }
    })
  })

  describe('updating the policy holder', async () => {
    it('should add a policy holder with no email validation date when former quote policy holder is undefined', async () => {
      // Given
      quote.policyHolder = undefined
      const updatedQuote = createQuoteFixture(
        {
          id: 'UDQUOT3',
          specialOperationsCode: null,
          specialOperationsCodeAppliedAt: null,
          termEndDate: new Date('2021-01-04T00:00:00.000Z')
        }
      )
      quoteRepository.get.withArgs(quoteId).resolves(quote)
      quoteRepository.update.resolves(updatedQuote)

      const updateQuoteCommand = createUpdateQuoteCommandFixture({
        id: quoteId
      })

      // When
      await updateQuote(updateQuoteCommand)

      // Then
      sinon.assert.calledWithExactly(quoteRepository.update, updatedQuote)
    })

    it('should update the email and reset the email validation date when email is changed', async () => {
      // Given
      const quote = createQuoteFixture(
        {
          id: 'UDQUOT3',
          policyHolder: createQuotePolicyHolderFixture({
            email: 'former@email.com',
            emailValidatedAt: new Date('2022-01-13T00:00:00.000Z')
          })
        }
      )

      const updatedQuote = createQuoteFixture(
        {
          id: 'UDQUOT3',
          specialOperationsCode: null,
          specialOperationsCodeAppliedAt: null,
          termEndDate: new Date('2021-01-04T00:00:00.000Z'),
          policyHolder: createQuotePolicyHolderFixture({
            email: 'updated@email.com',
            emailValidatedAt: undefined
          })
        }
      )
      quoteRepository.get.withArgs(quoteId).resolves(quote)
      quoteRepository.update.resolves(updatedQuote)

      const updateQuoteCommand = createUpdateQuoteCommandFixture({
        id: quoteId,
        policyHolder: createUpdateQuoteCommandPolicyHolderFixture({
          email: 'updated@email.com'
        })
      })

      // When
      await updateQuote(updateQuoteCommand)

      // Then
      sinon.assert.calledWithExactly(quoteRepository.update, updatedQuote)
    })

    it('should not reset the email validation date when email is not changed', async () => {
      // Given
      const quote = createQuoteFixture(
        {
          id: 'UDQUOT3',
          policyHolder: createQuotePolicyHolderFixture({
            email: 'former@email.com',
            emailValidatedAt: new Date('2022-01-13T00:00:00.000Z')
          })
        }
      )

      const updatedQuote = createQuoteFixture(
        {
          id: 'UDQUOT3',
          specialOperationsCode: null,
          specialOperationsCodeAppliedAt: null,
          termEndDate: new Date('2021-01-04T00:00:00.000Z'),
          policyHolder: createQuotePolicyHolderFixture({
            email: 'former@email.com',
            emailValidatedAt: new Date('2022-01-13T00:00:00.000Z')
          })
        }
      )
      quoteRepository.get.withArgs(quoteId).resolves(quote)
      quoteRepository.update.withArgs(updatedQuote).resolves()

      const updateQuoteCommand = createUpdateQuoteCommandFixture({
        id: quoteId,
        policyHolder: createUpdateQuoteCommandPolicyHolderFixture({
          email: 'former@email.com'
        })
      })

      // When
      await updateQuote(updateQuoteCommand)

      // Then
      sinon.assert.calledWithExactly(quoteRepository.update, updatedQuote)
    })

    it('should update policy holder properties when they have changed', async () => {
      // Given
      const updatedQuote = createQuoteFixture(
        {
          id: 'UDQUOT3',
          specialOperationsCode: null,
          specialOperationsCodeAppliedAt: null,
          termEndDate: new Date('2021-01-04T00:00:00.000Z'),
          policyHolder: createQuotePolicyHolderFixture({
            firstname: 'Eupe',
            lastname: 'Daitide',
            address: '999 rue des prairies',
            postalCode: '91100',
            city: undefined,
            email: 'jeanjean@email.com',
            phoneNumber: '+33684205510'
          })
        }
      )
      quoteRepository.get.withArgs(quoteId).resolves(quote)
      quoteRepository.update.resolves(updatedQuote)

      const updateQuoteCommand = createUpdateQuoteCommandFixture({
        id: quoteId,
        policyHolder: createUpdateQuoteCommandPolicyHolderFixture({
          firstname: 'Eupe',
          lastname: 'Daitide',
          address: '999 rue des prairies',
          postalCode: '91100',
          city: undefined,
          email: 'jeanjean@email.com',
          phoneNumber: '+33684205510'
        })
      })

      // When
      await updateQuote(updateQuoteCommand)

      // Then
      sinon.assert.calledWithExactly(quoteRepository.update, updatedQuote)
    })

    it('should get all pricing zones by location when the location is provided', async () => {
      // GIVEN
      const productCode = 'APP999'
      const postalCode = '75019'
      const city = 'Paris'
      quoteRepository.get.withArgs(quoteId).resolves(quote)

      const updateQuoteCommand = createUpdateQuoteCommandFixture({
        id: quoteId
      })

      updateQuoteCommand.risk.property.postalCode = postalCode
      updateQuoteCommand.risk.property.city = city

      // WHEN
      await updateQuote(updateQuoteCommand)

      // THEN
      sinon.assert.calledWithExactly(pricingZoneRepository.getAllForProductByLocation, productCode, city, postalCode)
    })
  })

  describe('updating the risk', async () => {
    it('should update the insurance estimate and premium if the room count is changed', async () => {
      // Given
      const newRoomCount: number = 3
      const defaultCapAdviceForRoomCountOf3: DefaultCapAdvice = { value: 10000 }
      const updatedQuote = createQuoteFixture(
        {
          id: 'UDQUOT3',
          specialOperationsCode: null,
          specialOperationsCodeAppliedAt: null,
          termEndDate: new Date('2021-01-04T00:00:00.000Z'),
          insurance: createQuoteInsuranceFixture({
            estimate: {
              monthlyPrice: 7.82,
              defaultDeductible: 150,
              defaultCeiling: defaultCapAdviceForRoomCountOf3.value
            }
          }),
          risk: createQuoteRiskFixture({
            property: {
              address: '88 rue des prairies',
              city: 'Kyukamura',
              postalCode: '91100',
              roomCount: 3,
              type: PropertyType.FLAT,
              occupancy: Occupancy.TENANT
            }
          }),
          premium: 93.84
        }
      )
      quoteRepository.get.withArgs(quoteId).resolves(quote)
      quoteRepository.update.resolves(updatedQuote)
      defaultCapAdviceRepository.get.withArgs(partnerCode, newRoomCount).resolves(defaultCapAdviceForRoomCountOf3)
      coverMonthlyPriceRepository.getAllForPartnerByPricingZone.resolves([{ price: '4.500000', cover: 'DDEAUX' }, { price: '2.500000', cover: 'VOLXXX' }, { price: '0.820000', cover: 'INCEND' }])

      const updateQuoteCommand = createUpdateQuoteCommandFixture({ id: quoteId })
      updateQuoteCommand.risk.property.roomCount = newRoomCount

      // When
      await updateQuote(updateQuoteCommand)

      // Then
      sinon.assert.calledWithExactly(quoteRepository.update, updatedQuote)
    })

    it('should update risk if risk address, postal code and city are changed', async () => {
      // Given
      const updatedQuote = createQuoteFixture(
        {
          id: 'UDQUOT3',
          specialOperationsCode: null,
          specialOperationsCodeAppliedAt: null,
          termEndDate: new Date('2021-01-04T00:00:00.000Z'),
          risk: createQuoteRiskFixture({
            property: {
              roomCount: 2,
              address: '5 avenue du bitume',
              postalCode: '13840',
              city: 'Nakamura',
              type: PropertyType.FLAT,
              occupancy: Occupancy.TENANT
            }
          })
        }
      )
      quoteRepository.get.withArgs(quoteId).resolves(quote)
      quoteRepository.update.resolves(updatedQuote)

      const updateQuoteCommand = createUpdateQuoteCommandFixture({
        id: quoteId,
        risk: createQuoteRiskFixture({
          property: {
            roomCount: 2,
            address: '5 avenue du bitume',
            postalCode: '13840',
            city: 'Nakamura',
            type: PropertyType.FLAT,
            occupancy: Occupancy.TENANT
          }
        })
      })

      // When
      await updateQuote(updateQuoteCommand)

      // Then
      sinon.assert.calledWithExactly(quoteRepository.update, updatedQuote)
    })

    it('should add risk on the person if there was no risk on person before', async () => {
      // Given
      quote.risk.person = undefined
      const newRiskPerson: Quote.Risk.Person = {
        firstname: 'Jean-Jean',
        lastname: 'Lapin'
      }
      const updatedQuote = createQuoteFixture(
        {
          id: 'UDQUOT3',
          specialOperationsCode: null,
          specialOperationsCodeAppliedAt: null,
          termEndDate: new Date('2021-01-04T00:00:00.000Z'),
          risk: createQuoteRiskFixture({
            person: newRiskPerson
          })
        }
      )

      quoteRepository.get.withArgs(quoteId).resolves(quote)
      quoteRepository.update.resolves(updatedQuote)

      const updateQuoteCommand = createUpdateQuoteCommandFixture({
        id: quoteId,
        risk: createQuoteRiskFixture({
          person: newRiskPerson
        })
      })

      // When
      await updateQuote(updateQuoteCommand)

      // Then
      sinon.assert.calledWithExactly(quoteRepository.update, updatedQuote)
    })

    it('should update the risk person if firstname and lastname have changed', async () => {
      // Given
      const updatedQuote = createQuoteFixture(
        {
          id: 'UDQUOT3',
          specialOperationsCode: null,
          specialOperationsCodeAppliedAt: null,
          termEndDate: new Date('2021-01-04T00:00:00.000Z'),
          risk: createQuoteRiskFixture({
            person: {
              firstname: 'Harry',
              lastname: 'Cover'
            }
          })
        }
      )
      quoteRepository.get.withArgs(quoteId).resolves(quote)
      quoteRepository.update.resolves(updatedQuote)

      const updateQuoteCommand = createUpdateQuoteCommandFixture({
        id: quoteId,
        risk: createQuoteRiskFixture({
          person: {
            firstname: 'Harry',
            lastname: 'Cover'
          }
        })
      })

      // When
      await updateQuote(updateQuoteCommand)

      // Then
      sinon.assert.calledWithExactly(quoteRepository.update, updatedQuote)
    })

    it('should remove the person if the risk on the person is deleted', async () => {
      // Given
      const updatedQuote = createQuoteFixture(
        {
          id: 'UDQUOT3',
          specialOperationsCode: null,
          specialOperationsCodeAppliedAt: null,
          termEndDate: new Date('2021-01-04T00:00:00.000Z'),
          risk: createQuoteRiskFixture({
            person: undefined
          })
        }
      )
      quoteRepository.get.withArgs(quoteId).resolves(quote)
      quoteRepository.update.resolves(updatedQuote)

      const updateQuoteCommand = createUpdateQuoteCommandFixture({
        id: quoteId,
        risk: createQuoteRiskFixture({
          person: undefined
        })
      })

      // When
      await updateQuote(updateQuoteCommand)

      // Then
      sinon.assert.calledWithExactly(quoteRepository.update, updatedQuote)
    })

    it('should update risk on the other people if the risk on the other people is changed', async () => {
      // Given
      const updatedQuote = createQuoteFixture(
        {
          id: 'UDQUOT3',
          specialOperationsCode: null,
          specialOperationsCodeAppliedAt: null,
          termEndDate: new Date('2021-01-04T00:00:00.000Z'),
          risk: createQuoteRiskFixture({
            otherPeople: [
              { firstname: 'Jean', lastname: 'Bono' }
            ]
          })
        }
      )

      quote.risk.otherPeople = []
      quoteRepository.get.withArgs(quoteId).resolves(quote)
      quoteRepository.update.resolves(updatedQuote)

      const updateQuoteCommand = createUpdateQuoteCommandFixture({
        id: quoteId,
        risk: createQuoteRiskFixture({
          otherPeople: [
            { firstname: 'Jean', lastname: 'Bono' }
          ]
        })
      })

      // When
      await updateQuote(updateQuoteCommand)

      // Then
      sinon.assert.calledWithExactly(quoteRepository.update, updatedQuote)
    })

    it('should remove the risk on the other people if the risk on the other people is deleted', async () => {
      // Given
      const updatedQuote = createQuoteFixture(
        {
          id: 'UDQUOT3',
          specialOperationsCode: null,
          specialOperationsCodeAppliedAt: null,
          termEndDate: new Date('2021-01-04T00:00:00.000Z'),
          risk: createQuoteRiskFixture({
            otherPeople: []
          })
        }
      )

      quote.risk.otherPeople = []
      quoteRepository.get.withArgs(quoteId).resolves(quote)
      quoteRepository.update.resolves(updatedQuote)

      const updateQuoteCommand = createUpdateQuoteCommandFixture({
        id: quoteId,
        risk: createQuoteRiskFixture({
          otherPeople: []
        })
      })

      // When
      await updateQuote(updateQuoteCommand)

      // Then
      sinon.assert.calledWithExactly(quoteRepository.update, updatedQuote)
    })
  })

  it('should save and return the updated quote', async () => {
    // Given
    coverMonthlyPriceRepository.getAllForPartnerByPricingZone.reset()
    pricingZoneRepository.getAllForProductByLocation.reset()

    const postalCode = '66666'
    const city = 'Babylone'

    const expectedQuote: Quote = createQuoteFixture({
      id: quoteId,
      partnerCode: partnerCode,
      nbMonthsDue: 10,
      premium: 48.2,
      risk: {
        property: {
          roomCount: 1,
          address: '666 rue de la mer morte',
          postalCode: postalCode,
          city: city,
          type: PropertyType.FLAT,
          occupancy: Occupancy.TENANT
        },
        person: {
          firstname: 'Lucie',
          lastname: 'Fer'
        },
        otherPeople: undefined
      },
      policyHolder: {
        firstname: 'Lucie',
        lastname: 'Fer',
        address: '666 rue de la mer morte',
        postalCode: postalCode,
        city: city,
        email: 'henoch@book.com',
        phoneNumber: '+66666666666',
        emailValidatedAt: undefined
      },
      insurance: createQuoteInsuranceFixture({ estimate: { defaultCeiling: 7000, defaultDeductible: 150, monthlyPrice: 4.82 } }),
      specialOperationsCode: OperationCode.FULLYEAR,
      specialOperationsCodeAppliedAt: new Date('2020-01-05T00:00:00.000Z'),
      startDate: new Date('2020-01-05T00:00:00.000Z'),
      termStartDate: new Date('2020-01-05T00:00:00.000Z'),
      termEndDate: new Date('2020-11-04T00:00:00.000Z')
    })

    const updateQuoteCommand: UpdateQuoteCommand = {
      id: quoteId,
      risk: {
        property: {
          roomCount: 1,
          address: '666 rue de la mer morte',
          postalCode: postalCode,
          city: city,
          type: PropertyType.FLAT,
          occupancy: Occupancy.TENANT
        },
        person: {
          firstname: 'Lucie',
          lastname: 'Fer'
        }
      },
      policyHolder: {
        firstname: 'Lucie',
        lastname: 'Fer',
        address: '666 rue de la mer morte',
        postalCode: postalCode,
        city: city,
        email: 'henoch@book.com',
        phoneNumber: '+66666666666'
      },
      startDate: now,
      specOpsCode: 'FULLYEAR'
    }

    const coverMonthlyPrices = [
      { price: '1.50000', cover: 'INCEND' },
      { price: '2.50000', cover: 'DDEAUX' },
      { price: '0.82000', cover: 'VOLXXX' }]

    quoteRepository.get.withArgs(quoteId).resolves(quote)
    quoteRepository.update.resolves(expectedQuote)
    pricingZoneRepository.getAllForProductByLocation.withArgs(partner.offer.productCode, city, postalCode).resolves(pricingZones)
    coverMonthlyPriceRepository.getAllForPartnerByPricingZone.withArgs(partnerCode, pricingZones, 1).resolves(coverMonthlyPrices)

    // When
    const result = await updateQuote(updateQuoteCommand)

    // Then
    sinon.assert.calledWithExactly(quoteRepository.update, expectedQuote)
    expect(result).to.deep.equal(expectedQuote)
  })

  it('should throw a QuoteNotFoundError when quote to update is not found', async () => {
    // Given
    const unknowQuoteId = 'UNKN0W'
    const updateQuoteCommand: UpdateQuoteCommand = createUpdateQuoteCommandFixture({ id: unknowQuoteId })

    quoteRepository.get.withArgs(unknowQuoteId).rejects(new QuoteNotFoundError(unknowQuoteId))

    // When
    const promise = updateQuote(updateQuoteCommand)

    // Then
    return expect(promise).to.be.rejectedWith(QuoteNotFoundError)
  })

  it('should throw a QuoteRiskRoommatesNotAllowedError when roommates are not allowed', async () => {
    // Given
    const unknowQuoteId = 'UNKN0W'
    const updateQuoteCommand: UpdateQuoteCommand = createUpdateQuoteCommandFixture({
      id: unknowQuoteId,
      risk: createUpdateQuoteCommandRiskFixture({
        property: { roomCount: 3, city: '', postalCode: '', address: '' }
      })
    })

    quoteRepository.get.withArgs(unknowQuoteId).rejects(new QuoteRiskRoommatesNotAllowedError(3))

    // When
    const promise = updateQuote(updateQuoteCommand)

    // Then
    return expect(promise).to.be.rejectedWith(QuoteRiskRoommatesNotAllowedError)
  })

  it('should throw a QuoteRiskNumberOfRoommatesError when max number of roommates is exceeded', async () => {
    // Given
    const unknowQuoteId = 'UNKN0W'
    const updateQuoteCommand: UpdateQuoteCommand = createUpdateQuoteCommandFixture({
      id: unknowQuoteId,
      risk: createUpdateQuoteCommandRiskFixture({
        property: { roomCount: 2, city: '', postalCode: '', address: '' },
        otherPeople: [
          {
            firstname: 'Samy',
            lastname: 'Aza'
          },
          {
            firstname: 'Kasy',
            lastname: 'Ade'
          }
        ]
      })
    })

    quoteRepository.get.withArgs(unknowQuoteId).rejects(new QuoteRiskNumberOfRoommatesError(1, 2))

    // When
    const promise = updateQuote(updateQuoteCommand)

    // Then
    return expect(promise).to.be.rejectedWith(QuoteRiskNumberOfRoommatesError)
  })

  it('should throw QuoteRiskPropertyRoomCountNotInsurableError when there is no coverage for the given property room count', async () => {
    // Given
    const city = 'Malinville'
    const postalCode = '77000'
    quoteRepository.get.withArgs(quoteId).resolves(quote)

    const updateQuoteCommand: UpdateQuoteCommand = createUpdateQuoteCommandFixture({
      id: quoteId,
      specOpsCode: undefined,
      risk: createUpdateQuoteCommandRiskFixture({
        property: {
          roomCount: 10,
          address: '101 rue des lapins',
          postalCode: postalCode,
          city: city,
          type: PropertyType.FLAT,
          occupancy: Occupancy.TENANT
        }
      })
    })
    // When
    const quotePromise = updateQuote(updateQuoteCommand)
    // Then
    return expect(quotePromise)
      .to.be.rejectedWith(
        QuoteRiskPropertyRoomCountNotInsurableError,
        '10 room(s) property is not insurable'
      )
  })

  it('should throw OperationCodeNotApplicableError if operation code is not applicable for partner', async () => {
    // Given
    quoteRepository.get.withArgs(quoteId).resolves(quote)

    const updateQuoteCommande = createUpdateQuoteCommandFixture({
      id: quoteId,
      specOpsCode: 'NOTAPPLICABLECODE',
      risk: createUpdateQuoteCommandRiskFixture({
        property: {
          roomCount: 1,
          address: '101 rue des lapins',
          postalCode: '77000',
          city: 'Malinville',
          type: PropertyType.FLAT,
          occupancy: Occupancy.TENANT
        },
        person: { firstname: 'jean', lastname: 'jean' },
        otherPeople: []
      })
    })

    // When
    const promise = updateQuote(updateQuoteCommande)

    // Then
    return expect(promise).to.be.rejectedWith(
      OperationCodeNotApplicableError,
      'The operation code NOTAPPLICABLECODE is not applicable for partner : myPartner'
    )
  })

  it('should throw an QuoteStartDateConsistencyError when start date is earlier than today', async () => {
    // Given
    const earlierThanTodayDate: Date = new Date('2009-01-27')
    quoteRepository.get.withArgs(quoteId).resolves(quote)

    // When
    const updateQuoteCommand = createUpdateQuoteCommandFixture({ id: quoteId, startDate: earlierThanTodayDate })
    const promise = updateQuote(updateQuoteCommand)
    // Then
    return expect(promise).to.be.rejectedWith(QuoteStartDateConsistencyError)
  })

  it('should throw an QuoteRiskPropertyTypeNotInsurableError when property type is not insurable by the partner', async () => {
    // Given
    quoteRepository.get.withArgs(quoteId).resolves(quote)
    updateQuote = UpdateQuote.factory(quoteRepository, partnerRepository, defaultCapAdviceRepository, coverMonthlyPriceRepository, pricingZoneRepository)
    // When
    const updateQuoteCommand = createUpdateQuoteCommandFixture({
      id: quoteId,
      risk: createQuoteRiskFixture({
        property: {
          roomCount: 2,
          address: '88 rue des prairies',
          postalCode: '91100',
          city: 'Kyukamura',
          type: PropertyType.HOUSE
        }
      })
    })
    const promise = updateQuote(updateQuoteCommand)
    // Then
    return expect(promise).to.be.rejectedWith(QuoteRiskPropertyTypeNotInsurableError)
  })

  it('should throw an QuoteRiskOccupancyNotInsurableError when occupancy is not insurable by the partner', async () => {
    // Given
    const updateQuoteCommand = createUpdateQuoteCommandFixture({
      id: quoteId,
      risk: createQuoteRiskFixture({
        property: {
          roomCount: 2,
          address: '88 rue des prairies',
          postalCode: '91100',
          city: 'Kyukamura',
          type: PropertyType.FLAT,
          occupancy: Occupancy.LANDLORD
        }
      })
    })
    quoteRepository.get.withArgs(quoteId).resolves(quote)
    updateQuote = UpdateQuote.factory(quoteRepository, partnerRepository, defaultCapAdviceRepository, coverMonthlyPriceRepository, pricingZoneRepository)
    // When
    const promise = updateQuote(updateQuoteCommand)
    // Then
    return expect(promise).to.be.rejectedWith(QuoteRiskOccupancyNotInsurableError)
  })

  it('should return cover monthly prices when no city or postal code are found', async () => {
    // Given
    const postalCode = '66666'
    const city = 'Babylone'

    const updateQuoteCommand: UpdateQuoteCommand = {
      id: quoteId,
      risk: {
        property: {
          roomCount: 1,
          address: '666 rue de la mer morte',
          postalCode: postalCode,
          city: city,
          type: PropertyType.FLAT,
          occupancy: Occupancy.TENANT
        },
        person: {
          firstname: 'Lucie',
          lastname: 'Fer'
        }
      },
      policyHolder: {
        firstname: 'Lucie',
        lastname: 'Fer',
        address: '666 rue de la mer morte',
        postalCode: postalCode,
        city: city,
        email: 'henoch@book.com',
        phoneNumber: '+66666666666'
      },
      startDate: now,
      specOpsCode: 'FULLYEAR'
    }

    quoteRepository.get.withArgs(quoteId).resolves(quote)
    pricingZoneRepository.getAllForProductByLocation.withArgs(partner.offer.productCode, city, postalCode).resolves([])
    coverMonthlyPriceRepository.getAllForPartnerWithoutZone.resolves([{ price: '0.25233', cover: 'ZNOTFOUND' }])

    // When
    await updateQuote(updateQuoteCommand)

    // Then
    sinon.assert.calledWithExactly(coverMonthlyPriceRepository.getAllForPartnerWithoutZone, partnerCode, 1)
  })

  it('should return cover monthly prices when no city or postal code are provided', async () => {
    // Given
    const postalCode = undefined
    const city = undefined

    const updateQuoteCommand: UpdateQuoteCommand = {
      id: quoteId,
      risk: {
        property: {
          roomCount: 2,
          address: '666 rue de la mer morte',
          postalCode: postalCode,
          city: city,
          type: PropertyType.FLAT,
          occupancy: Occupancy.TENANT
        },
        person: {
          firstname: 'Lucie',
          lastname: 'Fer'
        }
      },
      policyHolder: {
        firstname: 'Lucie',
        lastname: 'Fer',
        address: '666 rue de la mer morte',
        postalCode: postalCode,
        city: city,
        email: 'henoch@book.com',
        phoneNumber: '+66666666666'
      },
      startDate: now,
      specOpsCode: 'FULLYEAR'
    }

    quoteRepository.get.withArgs(quoteId).resolves(quote)
    coverMonthlyPriceRepository.getAllForPartnerWithoutZone.resolves([{ price: '0.25233', cover: 'ZNOTFOUND' }])

    // When
    await updateQuote(updateQuoteCommand)

    // Then
    sinon.assert.calledWithExactly(coverMonthlyPriceRepository.getAllForPartnerWithoutZone, partnerCode, 2)
  })
})
