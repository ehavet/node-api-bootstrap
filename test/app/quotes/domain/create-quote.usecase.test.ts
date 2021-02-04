import { dateFaker, expect, sinon } from '../../../test-utils'
import { Quote } from '../../../../src/app/quotes/domain/quote'
import { CreateQuoteCommand } from '../../../../src/app/quotes/domain/create-quote-command'
import {
  QuoteRiskOccupancyNotInsurableError,
  QuoteRiskPropertyRoomCountNotInsurableError,
  QuoteRiskPropertyTypeNotInsurableError
} from '../../../../src/app/quotes/domain/quote.errors'
import { CreateQuote } from '../../../../src/app/quotes/domain/create-quote.usecase'
import { quoteRepositoryMock } from '../fixtures/quote-repository.test-doubles'
import { OperationCode } from '../../../../src/app/core/domain/operation-code'
import { defaultCapAdviceRepositoryStub } from '../fixtures/default-cap-advice-repository.test-doubles'
import { DefaultCapAdviceNotFoundError } from '../../../../src/app/quotes/domain/default-cap-advice/default-cap-advice.errors'
import { PropertyType } from '../../../../src/app/core/domain/type/property-type'
import { createPartnerFixture } from '../../partners/fixtures/partner.fixture'
import { coverMonthlyPriceRepositoryStub } from '../fixtures/cover-monthly-price-repository.test-doubles'
import { Occupancy } from '../../../../src/app/core/domain/type/occupancy'
import { pricingZoneRepositoryStub } from '../fixtures/pricing-zone-repository.test-doubles'
import { CoverPricingZone } from '../../../../src/app/quotes/domain/cover-pricing-zone/cover-pricing-zone'

describe('Quotes - Usecase - Create Quote', async () => {
  let createQuote: CreateQuote
  const quoteRepository = quoteRepositoryMock()
  const partnerRepository = { getByCode: sinon.stub(), getCallbackUrl: sinon.stub(), getOperationCodes: sinon.stub() }
  const defaultCapAdviceRepository = defaultCapAdviceRepositoryStub()
  const partnerOffer = {
    defaultDeductible: 150,
    simplifiedCovers: ['ACDDE', 'ACVOL'],
    productCode: 'MRH_Etudiant',
    productVersion: '1.0',
    contractualTerms: '/path/to/contractual/terms',
    ipid: '/path/to/ipid',
    operationCodes: [
      OperationCode.SEMESTER1,
      OperationCode.SEMESTER2,
      OperationCode.FULLYEAR
    ]
  }
  const partner = createPartnerFixture({ code: 'MyPartner', offer: partnerOffer })
  const coverMonthlyPriceRepository = coverMonthlyPriceRepositoryStub()
  const expectedQuote: Quote = {
    id: '',
    partnerCode: 'myPartner',
    risk: {
      property: {
        roomCount: 2,
        address: '15 Rue Des Amandiers',
        postalCode: '91110',
        city: 'Les Ulysses',
        type: PropertyType.FLAT,
        occupancy: Occupancy.TENANT
      }
    },
    insurance: {
      estimate: {
        monthlyPrice: 5.82,
        defaultDeductible: 150,
        defaultCeiling: 6000
      },
      currency: 'EUR',
      simplifiedCovers: ['ACDDE', 'ACVOL'],
      productCode: 'MRH_Etudiant',
      productVersion: '1.0',
      contractualTerms: '/path/to/contractual/terms',
      ipid: '/path/to/ipid'
    },
    nbMonthsDue: 12,
    premium: 69.84,
    specialOperationsCode: null,
    specialOperationsCodeAppliedAt: null
  }
  const now = new Date('2020-04-18T10:09:08Z')
  const pricingZoneRepository = pricingZoneRepositoryStub()
  const pricingZones: CoverPricingZone[] = [
    { zone: 'ZD1', cover: 'DDEAUX' },
    { zone: 'ZB2', cover: 'INCEND' },
    { zone: 'ZC3', cover: 'VOLXXX' }
  ]

  beforeEach(() => {
    dateFaker.setCurrentDate(now)
    partnerRepository.getByCode.withArgs('myPartner').returns(partner)
    createQuote = CreateQuote.factory(quoteRepository, partnerRepository, defaultCapAdviceRepository, coverMonthlyPriceRepository, pricingZoneRepository)
  })

  afterEach(() => {
    quoteRepository.save.reset()
  })

  describe('should return the quote', async () => {
    beforeEach(() => {
      quoteRepository.save.resolves()
      defaultCapAdviceRepository.get.withArgs('myPartner', 2).resolves({ value: 6000 })
      pricingZoneRepository.getAllForProductByLocation.resolves(pricingZones)
      coverMonthlyPriceRepository.getAllForPartnerByPricingZone.resolves([{ price: '0.82000', cover: 'DDEAUX' }, { price: '5.00000', cover: 'INCEND' }])
      coverMonthlyPriceRepository.getAllForPartnerWithoutZone.resolves([{ price: '0.82000', cover: 'DDEAUX' }, { price: '5.00000', cover: 'INCEND' }])
    })
    afterEach(() => {
      defaultCapAdviceRepository.get.reset()
      pricingZoneRepository.getAllForProductByLocation.reset()
      coverMonthlyPriceRepository.getAllForPartnerByPricingZone.reset()
      coverMonthlyPriceRepository.getAllForPartnerWithoutZone.reset()
    })

    it('with the partner code and the risk', async () => {
      // When
      const quote: Quote = await createQuote({ partnerCode: 'myPartner', specOpsCode: OperationCode.BLANK, risk: { property: { roomCount: 2, address: '15 Rue Des Amandiers', postalCode: '91110', city: 'Les Ulysses', type: PropertyType.FLAT, occupancy: Occupancy.TENANT } } })

      // Then
      expect(quote).to.deep.include({ partnerCode: expectedQuote.partnerCode })
      expect(quote).to.deep.include({ risk: expectedQuote.risk })
    })

    it('with the risk.property.type provided by default by partner if not provided in command', async () => {
      // When
      const quote: Quote = await createQuote({ partnerCode: 'myPartner', specOpsCode: OperationCode.BLANK, risk: { property: { roomCount: 2, address: '15 Rue Des Amandiers', postalCode: '91110', city: 'Les Ulysses', occupancy: Occupancy.TENANT } } })

      // Then
      expect(quote.risk.property.type).to.be.equal(PropertyType.FLAT)
    })

    it('with the default occupancy provided by partner if not provided in command', async () => {
      // When
      const quote: Quote = await createQuote({ partnerCode: 'myPartner', specOpsCode: OperationCode.BLANK, risk: { property: { roomCount: 2, address: '15 Rue Des Amandiers', postalCode: '91110', city: 'Les Ulysses', type: PropertyType.FLAT } } })

      // Then
      expect(quote.risk.property.occupancy).to.be.equal(Occupancy.TENANT)
    })

    it('with the insurance', async () => {
      // Given
      const createQuoteCommand: CreateQuoteCommand = {
        partnerCode: 'myPartner',
        specOpsCode: OperationCode.BLANK,
        risk: {
          property: { roomCount: 2, type: PropertyType.FLAT, occupancy: Occupancy.TENANT }
        }
      }
      const expectedInsurance: Quote.Insurance = expectedQuote.insurance

      // When
      const quote: Quote = await createQuote(createQuoteCommand)

      // Then
      expect(quote).to.deep.include({ insurance: expectedInsurance })
    })

    describe('with the special operations code', async () => {
      it('SEMESTER1 setting the number of months due to 5', async () => {
        // Given
        const createQuoteCommand: CreateQuoteCommand = { partnerCode: 'myPartner', specOpsCode: OperationCode.SEMESTER1, risk: { property: { roomCount: 2, type: PropertyType.FLAT, occupancy: Occupancy.TENANT } } }

        // When
        const quote: Quote = await createQuote(createQuoteCommand)

        // Then
        expect(quote).to.deep.include({
          specialOperationsCode: 'SEMESTER1',
          specialOperationsCodeAppliedAt: now,
          nbMonthsDue: 5,
          premium: 29.1
        })
      })

      it('SEMESTER2 setting the number of months due to 5', async () => {
        // Given
        const createQuoteCommand: CreateQuoteCommand = { partnerCode: 'myPartner', specOpsCode: OperationCode.SEMESTER2, risk: { property: { roomCount: 2, type: PropertyType.FLAT, occupancy: Occupancy.TENANT } } }

        // When
        const quote: Quote = await createQuote(createQuoteCommand)

        // Then
        expect(quote).to.deep.include({
          specialOperationsCode: 'SEMESTER2',
          specialOperationsCodeAppliedAt: now,
          nbMonthsDue: 5,
          premium: 29.1
        })
      })

      it('FULLYEAR setting the number of months due to 10', async () => {
        // Given
        const createQuoteCommand: CreateQuoteCommand = { partnerCode: 'myPartner', specOpsCode: OperationCode.FULLYEAR, risk: { property: { roomCount: 2, type: PropertyType.FLAT, occupancy: Occupancy.TENANT } } }

        // When
        const quote: Quote = await createQuote(createQuoteCommand)

        // Then
        expect(quote).to.deep.include({
          specialOperationsCode: 'FULLYEAR',
          specialOperationsCodeAppliedAt: now,
          nbMonthsDue: 10,
          premium: 58.2
        })
      })

      it('BLANK setting the number of months due to 12', async () => {
        // Given
        const createQuoteCommand: CreateQuoteCommand = { partnerCode: 'myPartner', specOpsCode: OperationCode.BLANK, risk: { property: { roomCount: 2, type: PropertyType.FLAT, occupancy: Occupancy.TENANT } } }

        // When
        const quote: Quote = await createQuote(createQuoteCommand)

        // Then
        expect(quote).to.deep.include({
          specialOperationsCode: null,
          specialOperationsCodeAppliedAt: null,
          nbMonthsDue: 12,
          premium: 69.84
        })
      })
    })

    describe('with a generated alphanumerical id that', async () => {
      it('has 7 characters', async () => {
        // Given
        const createQuoteCommand: CreateQuoteCommand = { partnerCode: 'myPartner', specOpsCode: OperationCode.BLANK, risk: { property: { roomCount: 2, type: PropertyType.FLAT, occupancy: Occupancy.TENANT } } }

        // When
        const quote: Quote = await createQuote(createQuoteCommand)

        // Then
        expect(quote.id.length).to.equal(7)
      })

      it('has no I nor l nor O nor 0', async () => {
        // Given
        const createQuoteCommand: CreateQuoteCommand = { partnerCode: 'myPartner', specOpsCode: OperationCode.BLANK, risk: { property: { roomCount: 2, type: PropertyType.FLAT, occupancy: Occupancy.TENANT } } }

        // When
        const quote: Quote = await createQuote(createQuoteCommand)

        // Then
        expect(quote.id).to.not.have.string('O')
        expect(quote.id).to.not.have.string('I')
        expect(quote.id).to.not.have.string('l')
        expect(quote.id).to.not.have.string('0')
      })

      it('is returned within the quote', async () => {
        // Given
        const createQuoteCommand: CreateQuoteCommand = { partnerCode: 'myPartner', specOpsCode: OperationCode.BLANK, risk: { property: { roomCount: 2, type: PropertyType.FLAT, occupancy: Occupancy.TENANT } } }

        // When
        const quote: Quote = await createQuote(createQuoteCommand)

        // Then
        expect(quote).to.include.keys('id')
      })
    })
  })

  it('should save the quote', async () => {
    // Given
    const city = 'Les Ulysses'
    const postalCode = '91110'
    const createQuoteCommand: CreateQuoteCommand = {
      partnerCode: 'myPartner',
      specOpsCode: OperationCode.BLANK,
      risk: {
        property: {
          roomCount: 2,
          address: '15 Rue Des Amandiers',
          postalCode,
          city,
          type: PropertyType.FLAT,
          occupancy: Occupancy.TENANT
        }
      }
    }
    const pricingZones: CoverPricingZone[] = [
      { zone: 'ZD1', cover: 'DDEAUX' },
      { zone: 'ZB2', cover: 'INCEND' }
    ]
    quoteRepository.save.resolves()
    defaultCapAdviceRepository.get.withArgs('myPartner', 2).resolves({ value: 6000 })
    pricingZoneRepository.getAllForProductByLocation.withArgs(partner.offer.productCode, city, postalCode).resolves(pricingZones)
    coverMonthlyPriceRepository.getAllForPartnerByPricingZone
      .withArgs('myPartner', pricingZones, 2)
      .resolves([
        { price: '0.82000', cover: 'DDEAUX' },
        { price: '5.00000', cover: 'INCEND' }
      ])

    // When
    const quote = await createQuote(createQuoteCommand)

    // Then
    const saveSpy = quoteRepository.save.getCall(0)
    expectedQuote.id = quote.id
    return expect(saveSpy).to.have.been.calledWith(expectedQuote)
  })

  it('should throw an error if the property type is not insured by the partner', async () => {
    // Given
    const createQuoteCommand: CreateQuoteCommand = {
      partnerCode: 'myPartner',
      specOpsCode: OperationCode.BLANK,
      risk: {
        property: {
          roomCount: 2,
          type: PropertyType.HOUSE
        }
      }
    }

    // When
    const quotePromise = createQuote(createQuoteCommand)

    // Then
    return expect(quotePromise)
      .to.be.rejectedWith(
        QuoteRiskPropertyTypeNotInsurableError,
        'Cannot create quote, HOUSE is not insured by this partner'
      )
  })

  it('should throw an error if the occupancy is not insured by the partner', async () => {
    // Given
    const createQuoteCommand: CreateQuoteCommand = {
      partnerCode: 'myPartner',
      specOpsCode: OperationCode.BLANK,
      risk: {
        property: {
          roomCount: 2,
          occupancy: Occupancy.LANDLORD
        }
      }
    }
    defaultCapAdviceRepository.get.withArgs('myPartner', 2).resolves({ value: 6000 })
    coverMonthlyPriceRepository.getAllForPartnerByPricingZone.withArgs('myPartner', pricingZones, 2).resolves([{ price: '0.820000', cover: 'DDEAUX' }, { price: '5.000000', cover: 'INCEND' }])

    // When
    const quotePromise = createQuote(createQuoteCommand)

    // Then
    return expect(quotePromise)
      .to.be.rejectedWith(
        QuoteRiskOccupancyNotInsurableError,
        'Cannot create quote, LANDLORD is not insured by this partner'
      )
  })

  it('should throw an error if there is no insurance for the given risk', async () => {
    // Given
    const createQuoteCommand: CreateQuoteCommand = { partnerCode: 'myPartner', specOpsCode: OperationCode.BLANK, risk: { property: { roomCount: 3, type: PropertyType.FLAT, occupancy: Occupancy.TENANT } } }
    coverMonthlyPriceRepository.getAllForPartnerByPricingZone.withArgs('myPartner', pricingZones, 3).resolves([])

    // When
    const quotePromise = createQuote(createQuoteCommand)

    // Then
    return expect(quotePromise)
      .to.be.rejectedWith(
        QuoteRiskPropertyRoomCountNotInsurableError,
        '3 room(s) property is not insurable'
      )
  })

  it('should throw an error if there is no default cap advices for a given partner and room count', async () => {
    // GIVEN
    const createQuoteCommand: CreateQuoteCommand = { partnerCode: 'myPartner', specOpsCode: OperationCode.BLANK, risk: { property: { roomCount: 2, address: '15 Rue Des Amandiers', postalCode: '91110', city: 'Les Ulysses' } } }
    defaultCapAdviceRepository.get.withArgs('myPartner', 2).rejects(new DefaultCapAdviceNotFoundError('myPartner', 2))

    // WHEN
    const quotePromise = createQuote(createQuoteCommand)

    // THEN
    return expect(quotePromise).to.be.rejectedWith(DefaultCapAdviceNotFoundError)
  })

  it('should return cover monthly prices when no city or postal code are found', async () => {
    // Given
    const postalCode = '66666'
    const city = 'Babylone'
    const partnerCode = 'myPartner'

    const createQuoteCommand: CreateQuoteCommand = {
      partnerCode,
      specOpsCode: OperationCode.BLANK,
      risk: {
        property: {
          roomCount: 2,
          address: '15 Rue Des Amandiers',
          postalCode,
          city,
          type: PropertyType.FLAT,
          occupancy: Occupancy.TENANT
        }
      }
    }

    pricingZoneRepository.getAllForProductByLocation.withArgs(partner.offer.productCode, city, postalCode).resolves([])
    defaultCapAdviceRepository.get.withArgs(partnerCode, 2).resolves({ value: 6000 })
    coverMonthlyPriceRepository.getAllForPartnerWithoutZone.resolves([{ price: '0.25233', cover: 'ZNOTFOUND' }])

    // When
    await createQuote(createQuoteCommand)

    // Then
    sinon.assert.calledWithExactly(coverMonthlyPriceRepository.getAllForPartnerWithoutZone, partnerCode, 2)
  })

  it('should return cover monthly prices when no city or postal code are provided', async () => {
    // Given
    const postalCode = '75019'
    const city = undefined
    const partnerCode = 'myPartner'

    const createQuoteCommand: CreateQuoteCommand = {
      partnerCode,
      specOpsCode: OperationCode.BLANK,
      risk: {
        property: {
          roomCount: 2,
          address: '15 Rue Des Amandiers',
          postalCode,
          city,
          type: PropertyType.FLAT,
          occupancy: Occupancy.TENANT
        }
      }
    }

    coverMonthlyPriceRepository.getAllForPartnerWithoutZone.resolves([{ price: '0.25233', cover: 'ZNOTFOUND' }])
    defaultCapAdviceRepository.get.withArgs('myPartner', 2).resolves({ value: 6000 })

    // When
    await createQuote(createQuoteCommand)

    // Then
    sinon.assert.calledWithExactly(coverMonthlyPriceRepository.getAllForPartnerWithoutZone, partnerCode, 2)
  })
})
