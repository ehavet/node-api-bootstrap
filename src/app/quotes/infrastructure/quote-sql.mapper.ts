import { Quote } from '../domain/quote'
import { QuoteSqlModel } from './sql-models/quote-sql-model'
import { QuotePersonSqlModel } from './sql-models/quote-person-sql.model'
import { OperationCode } from '../../core/domain/operation-code'
import { Amount } from '../../core/domain/amount/amount'

export function sqlToDomain (quoteSql: QuoteSqlModel): Quote {
  return {
    id: quoteSql.id,
    partnerCode: quoteSql.partnerCode,
    premium: Amount.toAmount(quoteSql.premium),
    nbMonthsDue: quoteSql.nbMonthsDue,
    startDate: new Date(quoteSql.startDate),
    termStartDate: new Date(quoteSql.termStartDate),
    termEndDate: new Date(quoteSql.termEndDate),
    specialOperationsCode: quoteSql.specialOperationsCode ? OperationCode[quoteSql.specialOperationsCode!] : undefined,
    specialOperationsCodeAppliedAt: quoteSql.specialOperationsCodeAppliedAt ? new Date(quoteSql.specialOperationsCodeAppliedAt) : undefined,
    risk: _sqlToRiskMapper(quoteSql),
    insurance: _sqlToInsuranceMapper(quoteSql),
    policyHolder: (quoteSql.policyHolder) ? _sqlToPolicyHolderMapper(quoteSql.policyHolder) : undefined
  }
}

function _sqlToRiskMapper (quoteSql: QuoteSqlModel) {
  return {
    property: {
      roomCount: quoteSql.risk.property.roomCount,
      address: quoteSql.risk.property.address ? quoteSql.risk.property.address : undefined,
      postalCode: quoteSql.risk.property.postalCode ? quoteSql.risk.property.postalCode : undefined,
      city: quoteSql.risk.property.city ? quoteSql.risk.property.city : undefined,
      type: quoteSql.risk.property.type ? quoteSql.risk.property.type : undefined,
      occupancy: quoteSql.risk.property.occupancy ? quoteSql.risk.property.occupancy : undefined
    },
    person: (quoteSql.risk.person && quoteSql.risk.person.firstname && quoteSql.risk.person.lastname) ? {
      firstname: quoteSql.risk.person.firstname,
      lastname: quoteSql.risk.person.lastname
    } : undefined,
    otherPeople: quoteSql.risk.otherPeople ? quoteSql.risk.otherPeople.map(person => {
      return { firstname: person.firstname!, lastname: person.lastname! }
    }) : undefined
  }
}

function _sqlToInsuranceMapper (quoteSql: QuoteSqlModel) {
  return {
    estimate: {
      monthlyPrice: Amount.toAmount(quoteSql.insurance.monthlyPrice),
      defaultDeductible: Amount.toAmount(quoteSql.insurance.defaultDeductible),
      defaultCeiling: Amount.toAmount(quoteSql.insurance.defaultCeiling)
    },
    currency: quoteSql.insurance.currency,
    simplifiedCovers: quoteSql.insurance.simplifiedCovers,
    productCode: quoteSql.insurance.productCode,
    productVersion: quoteSql.insurance.productVersion,
    contractualTerms: quoteSql.insurance.contractualTerms,
    ipid: quoteSql.insurance.ipid
  }
}

function _sqlToPolicyHolderMapper (quotePersonSql: QuotePersonSqlModel) {
  const sql: QuotePersonSqlModel = quotePersonSql
  const policyHolderProperties = [
    sql.firstname, sql.lastname, sql.address, sql.postalCode, sql.city, sql.email, sql.phoneNumber
  ]

  if (policyHolderProperties.every(property => property === null)) { return undefined }

  return {
    firstname: sql.firstname ? sql.firstname : undefined,
    lastname: sql.lastname ? sql.lastname : undefined,
    address: sql.address ? sql.address : undefined,
    postalCode: sql.postalCode ? sql.postalCode : undefined,
    city: sql.city ? sql.city : undefined,
    email: sql.email ? sql.email : undefined,
    phoneNumber: sql.phoneNumber ? sql.phoneNumber : undefined,
    emailValidatedAt: sql.emailValidatedAt ? sql.emailValidatedAt : undefined
  }
}
