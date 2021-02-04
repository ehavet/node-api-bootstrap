import { QuoteSqlRepository } from '../../../../src/app/quotes/infrastructure/quote-sql.repository'
import { Quote } from '../../../../src/app/quotes/domain/quote'
import { dbTestUtils, expect } from '../../../test-utils'
import {
  createQuoteFixture,
  createQuoteRiskFixture
} from '../fixtures/quote.fixture'
import { QuoteNotFoundError } from '../../../../src/app/quotes/domain/quote.errors'
import { QuoteSqlModel } from '../../../../src/app/quotes/infrastructure/sql-models/quote-sql-model'
import { PropertyType } from '../../../../src/app/core/domain/type/property-type'
import { Occupancy } from '../../../../src/app/core/domain/type/occupancy'

async function resetDb () {
  await QuoteSqlModel.destroy({ truncate: true, cascade: true })
}

describe('Repository - Quote', async () => {
  const quoteRepository = new QuoteSqlRepository()

  before(async () => {
    await dbTestUtils.initDB()
  })

  after(async () => {
    await dbTestUtils.closeDB()
  })

  afterEach(async function () {
    this.timeout(10000)
    await resetDb()
  })

  describe('#save', async () => {
    it('should save the quote into the db', async () => {
      // Given
      const expectedQuote: Quote = createQuoteFixture({
        id: 'RF85D4S',
        risk: createQuoteRiskFixture({
          property: {
            roomCount: 2,
            address: '88 rue des prairies',
            postalCode: '91100',
            city: 'Kyukamura',
            type: PropertyType.FLAT,
            occupancy: Occupancy.TENANT
          }
        })
      })

      // When
      const quote = await quoteRepository.save(expectedQuote)

      // Then
      const result = await QuoteSqlModel.findAll({
        include: [{ all: true }, { model: QuoteRiskSqlModel, include: [{ all: true }] }]
      })

      expect(quote).to.deep.equal(expectedQuote)

      expect(result).to.have.lengthOf(1)

      const savedQuote = result[0]
      expect(savedQuote.id).to.equal('RF85D4S')
      expect(savedQuote.partnerCode).to.equal('myPartner')
      expect(savedQuote.premium).to.equal('69.840000')
      expect(savedQuote.nbMonthsDue).to.equal(12)
      expect(savedQuote.startDate).to.equal('2020-01-05')
      expect(savedQuote.createdAt).to.be.an.instanceof(Date)
      expect(savedQuote.updatedAt).to.be.an.instanceof(Date)

      const savedRisk = savedQuote.risk
      expect(savedRisk.id).to.be.a('string')
      expect(savedRisk.property.roomCount).to.equal(2)
      expect(savedRisk.property.address).to.equal('88 rue des prairies')
      expect(savedRisk.property.postalCode).to.equal('91100')
      expect(savedRisk.property.city).to.equal('Kyukamura')
      expect(savedRisk.property.type).to.equal('FLAT')
      expect(savedRisk.property.occupancy).to.equal('TENANT')
      expect(savedRisk.person!.firstname).to.equal('Jean-Jean')
      expect(savedRisk.person!.lastname).to.equal('Lapin')
      expect(savedRisk.otherPeople![0].firstname).to.equal('John')
      expect(savedRisk.otherPeople![0].lastname).to.equal('Doe')
      expect(savedRisk.createdAt).to.be.an.instanceof(Date)
      expect(savedRisk.updatedAt).to.be.an.instanceof(Date)

      const savedInsurance = savedQuote.insurance
      expect(savedInsurance.id).to.be.a('string')
      expect(savedInsurance.monthlyPrice).to.equal('5.820000')
      expect(savedInsurance.defaultDeductible).to.equal('150.000000')
      expect(savedInsurance.defaultCeiling).to.equal('7000.000000')
      expect(savedInsurance.currency).to.equal('EUR')
      expect(savedInsurance.simplifiedCovers).to.include('ACDDE', 'ACVOL')
      expect(savedInsurance.productCode).to.equal('APP999')
      expect(savedInsurance.productVersion).to.equal('v2020-02-01')
      expect(savedInsurance.contractualTerms).to.equal('/path/to/contractual/terms')
      expect(savedInsurance.ipid).to.equal('/path/to/ipid')
      expect(savedInsurance.createdAt).to.be.an.instanceof(Date)
      expect(savedInsurance.updatedAt).to.be.an.instanceof(Date)

      const savedPolicyHolder = savedQuote.policyHolder
      expect(savedInsurance.id).to.be.a('string')
      expect(savedPolicyHolder!.firstname).to.equal('Jean-Jean')
      expect(savedPolicyHolder!.lastname).to.equal('Lapin')
      expect(savedPolicyHolder!.address).to.equal('88 rue des prairies')
      expect(savedPolicyHolder!.postalCode).to.equal('91100')
      expect(savedPolicyHolder!.city).to.equal('Kyukamura')
      expect(savedPolicyHolder!.email).to.equal('jeanjean@email.com')
      expect(savedPolicyHolder!.phoneNumber).to.equal('+33684205510')
    })
  })

  describe('#get', async () => {
    it('should return the found quote', async () => {
      // Given
      const expectedQuote: Quote = createQuoteFixture({ id: 'DC82S0V' })
      await quoteRepository.save(expectedQuote)

      // When
      const result: Quote = await quoteRepository.get(expectedQuote.id)

      // Then
      expect(result).to.deep.equal(expectedQuote)
    })

    it('should throw an error if the quote does not exist', async () => {
      // Given
      const quoteId: string = 'JC7D89S'
      // When
      const getQuotePromise = quoteRepository.get(quoteId)

      // Then
      return expect(getQuotePromise).to.be.rejectedWith(QuoteNotFoundError, 'Could not find quote with id : JC7D89S')
    })
  })

  describe('#update', async () => {
    it('should update a given quote then return it', async () => {
      // Given
      const validationDate: Date = new Date('2020-01-13T00:00:00Z')
      const initialQuote: Quote = createQuoteFixture({
        id: 'RF85D4S'
      })
      const updatedQuote: Quote = createQuoteFixture({
        id: 'RF85D4S',
        premium: 101.65,
        nbMonthsDue: 12,
        risk: {
          property: {
            roomCount: 3,
            address: 'updated address',
            postalCode: '99999',
            city: 'updated city',
            type: PropertyType.FLAT,
            occupancy: Occupancy.TENANT
          },
          person: {
            firstname: 'updated-person-firstname',
            lastname: 'updated-person-lastname'
          },
          otherPeople: [
            {
              firstname: 'updated-first-otherPeople-firstname',
              lastname: 'updated-first-otherPeople-lastname'
            },
            {
              firstname: 'updated-second-otherPeople-firstname',
              lastname: 'updated-second-otherPeople-lastname'
            }
          ]
        },
        insurance: {
          estimate: {
            monthlyPrice: 99.99,
            defaultDeductible: 99,
            defaultCeiling: 99
          },
          currency: 'UPD',
          simplifiedCovers: ['UPD4T3D', 'C0V3R'],
          productCode: 'APPUPD4T3D',
          productVersion: 'vUPD4T3D',
          contractualTerms: '/updated/terms/path',
          ipid: '/updated/path/to/ipid'
        },
        policyHolder: {
          firstname: 'updated-policy-holder-firstname',
          lastname: 'updated-policy-holder-lastname',
          address: 'updated policy holder address',
          postalCode: '66666',
          city: 'updated policy holder city',
          email: 'updated@email.com',
          phoneNumber: '+UPD4T3DPHON3',
          emailValidatedAt: validationDate
        },
        specialOperationsCode: OperationCode.SEMESTER1,
        specialOperationsCodeAppliedAt: new Date('2020-01-05T00:00:00Z')
      })
      await quoteRepository.save(initialQuote)

      // When
      const quote = await quoteRepository.update(updatedQuote)

      // Then
      const result = await QuoteSqlModel.findAll({
        include: [{ all: true }, { model: QuoteRiskSqlModel, include: [{ all: true }] }]
      })

      expect(quote).to.deep.equal(updatedQuote)

      expect(result).to.have.lengthOf(1)

      const savedQuote = result[0]
      expect(savedQuote.id).to.equal('RF85D4S')
      expect(savedQuote.partnerCode).to.equal('myPartner')
      expect(savedQuote.premium).to.equal('101.650000')
      expect(savedQuote.nbMonthsDue).to.equal(12)

      const savedRisk = savedQuote.risk
      expect(savedRisk.property.roomCount).to.equal(3)
      expect(savedRisk.property.address).to.equal('updated address')
      expect(savedRisk.property.postalCode).to.equal('99999')
      expect(savedRisk.property.city).to.equal('updated city')
      expect(savedRisk.property.type).to.equal('FLAT')
      expect(savedRisk.property.occupancy).to.equal('TENANT')
      expect(savedRisk.person!.firstname).to.equal('updated-person-firstname')
      expect(savedRisk.person!.lastname).to.equal('updated-person-lastname')
      expect(savedRisk.otherPeople!.map(person => { return { firstname: person.firstname, lastname: person.lastname } }))
        .to.deep.include(
          { firstname: 'updated-first-otherPeople-firstname', lastname: 'updated-first-otherPeople-lastname' },
          { firstname: 'updated-second-otherPeople-firstname', lastname: 'updated-second-otherPeople-lastname' }
        )
      const savedInsurance = savedQuote.insurance
      expect(savedInsurance.monthlyPrice).to.equal('99.990000')
      expect(savedInsurance.defaultDeductible).to.equal('99.000000')
      expect(savedInsurance.defaultCeiling).to.equal('99.000000')
      expect(savedInsurance.currency).to.equal('UPD')
      expect(savedInsurance.simplifiedCovers).to.include('UPD4T3D', 'C0V3R')
      expect(savedInsurance.productCode).to.equal('APPUPD4T3D')
      expect(savedInsurance.productVersion).to.equal('vUPD4T3D')
      expect(savedInsurance.contractualTerms).to.equal('/updated/terms/path')
      expect(savedInsurance.ipid).to.equal('/updated/path/to/ipid')

      const savedPolicyHolder = savedQuote.policyHolder
      expect(savedPolicyHolder!.firstname).to.equal('updated-policy-holder-firstname')
      expect(savedPolicyHolder!.lastname).to.equal('updated-policy-holder-lastname')
      expect(savedPolicyHolder!.address).to.equal('updated policy holder address')
      expect(savedPolicyHolder!.postalCode).to.equal('66666')
      expect(savedPolicyHolder!.city).to.equal('updated policy holder city')
      expect(savedPolicyHolder!.email).to.equal('updated@email.com')
      expect(savedPolicyHolder!.phoneNumber).to.equal('+UPD4T3DPHON3')
      expect(savedPolicyHolder!.emailValidatedAt).to.deep.equal(validationDate)
    })

    it('should update with null when undefined quote values', async () => {
      // Given
      const initialQuote: Quote = createQuoteFixture({ id: 'RF85D4S' })
      const updatedQuote: Quote = createQuoteFixture({
        id: 'RF85D4S',
        premium: 101,
        nbMonthsDue: 12,
        risk: {
          property: {
            roomCount: 3,
            address: undefined,
            postalCode: undefined,
            city: undefined,
            type: undefined,
            occupancy: undefined
          },
          person: undefined,
          otherPeople: undefined
        },
        insurance: {
          estimate: {
            monthlyPrice: 99.99,
            defaultDeductible: 99,
            defaultCeiling: 99
          },
          currency: 'UPD',
          simplifiedCovers: ['UPD4T3D', 'C0V3R'],
          productCode: 'APPUPD4T3D',
          productVersion: 'vUPD4T3D',
          contractualTerms: '/updated/terms/path',
          ipid: '/updated/path/to/ipid'
        },
        policyHolder: undefined
      })

      await quoteRepository.save(initialQuote)

      // When
      const quote = await quoteRepository.update(updatedQuote)

      // Then
      const result = await QuoteSqlModel.findAll({
        include: [{ all: true }, { model: QuoteRiskSqlModel, include: [{ all: true }] }]
      })

      expect(quote).to.deep.equal(updatedQuote)

      expect(result).to.have.lengthOf(1)

      const savedQuote = result[0]
      const savedRisk = savedQuote.risk
      expect(savedRisk.property.roomCount).to.equal(3)
      expect(savedRisk.property.address).to.equal(null)
      expect(savedRisk.property.postalCode).to.equal(null)
      expect(savedRisk.property.city).to.equal(null)
      expect(savedRisk.property.type).to.equal(null)
      expect(savedRisk.property.occupancy).to.equal(null)
      expect(savedRisk.person!.firstname).to.equal(null)
      expect(savedRisk.person!.lastname).to.equal(null)

      const savedPolicyHolder = savedQuote.policyHolder
      expect(savedPolicyHolder!.firstname).to.equal(null)
      expect(savedPolicyHolder!.lastname).to.equal(null)
      expect(savedPolicyHolder!.address).to.equal(null)
      expect(savedPolicyHolder!.postalCode).to.equal(null)
      expect(savedPolicyHolder!.city).to.equal(null)
      expect(savedPolicyHolder!.phoneNumber).to.equal(null)
      expect(savedPolicyHolder!.email).to.equal(null)
      expect(savedPolicyHolder!.emailValidatedAt).to.equal(null)
    })
  })
})
