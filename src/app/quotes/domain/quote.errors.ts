import { Quote } from './quote'

export class NoPartnerInsuranceForRiskError extends Error {
  constructor (partnerCode: string, risk: Quote.Risk) {
    const message: string = `Partner with code ${partnerCode} does not have an insurance for risk ${JSON.stringify(risk)}`
    super(message)
    this.name = 'NoPartnerInsuranceForRiskError'
  }
}

export class QuoteNotFoundError extends Error {
  constructor (quoteId: string) {
    const message: string = `Could not find quote with id : ${quoteId}`
    super(message)
    this.name = 'QuoteNotFoundError'
  }
}

export class QuotePolicyHolderEmailNotFoundError extends Error {
  constructor (quoteId: string) {
    const message: string = `Could not find email address for policy holder attached to quote with id : ${quoteId}`
    super(message)
    this.name = 'QuotePolicyHolderEmailNotFoundError'
  }
}

export class QuoteRiskPropertyRoomCountNotInsurableError extends Error {
  constructor (roomCount: number) {
    const message: string = `${roomCount} room(s) property is not insurable`
    super(message)
    this.name = 'QuoteRiskPropertyRoomCountNotInsurableError'
  }
}

export class QuoteStartDateConsistencyError extends Error {
  constructor () {
    const message: string = 'Start date cannot be earlier than today'
    super(message)
    this.name = 'QuoteStartDateConsistencyError'
  }
}

export class QuoteRiskRoommatesNotAllowedError extends Error {
  constructor (roomCount: number) {
    const message: string = `${roomCount} room(s) property does not allow roommates`
    super(message)
    this.name = 'QuoteRiskRoommatesNotAllowedError'
  }
}

export class QuoteRiskNumberOfRoommatesError extends Error {
  constructor (maxRoommateNumber: number, roomCount: number) {
    const message: string = `${roomCount} room(s) property allows a maximum of ${maxRoommateNumber} roommate(s)`
    super(message)
    this.name = 'QuoteRiskNumberOfRoommatesError'
  }
}

export class QuotePartnerOwnershipError extends Error {
  constructor (quoteId: string, partnerCode: string) {
    const message: string = `Could not find the quote ${quoteId} for partner ${partnerCode}`
    super(message)
    this.name = 'QuotePartnerOwnershipError'
  }
}

export class QuoteRiskPropertyTypeNotInsurableError extends Error {
  constructor (propertyType: string) {
    const message: string = `Cannot create quote, ${propertyType} is not insured by this partner`
    super(message)
    this.name = 'QuoteRiskPropertyTypeNotInsurableError'
  }
}

export class QuoteRiskOccupancyNotInsurableError extends Error {
  constructor (occupancy: string) {
    const message: string = `Cannot create quote, ${occupancy} is not insured by this partner`
    super(message)
    this.name = 'QuoteRiskOccupancyNotInsurableError'
  }
}
