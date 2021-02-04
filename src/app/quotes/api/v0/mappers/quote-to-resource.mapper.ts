import { Quote } from '../../../domain/quote'
import dayjs from '../../../../../libs/dayjs'

// This mapper should be the reference for all the endpoints returning a quote
export function quoteToResource (quote: Quote) {
  return {
    id: quote.id,
    code: quote.partnerCode,
    risk: _toRisk(quote.risk),
    insurance: _toInsurance(quote.insurance),
    policy_holder: quote.policyHolder ? _toPolicyHolder(quote.policyHolder) : null,
    start_date: quote.startDate ? dayjs(quote.startDate).format('YYYY-MM-DD') : null,
    term_start_date: quote.termStartDate ? dayjs(quote.termStartDate).format('YYYY-MM-DD') : null,
    term_end_date: quote.termEndDate ? dayjs(quote.termEndDate).format('YYYY-MM-DD') : null,
    premium: quote.premium,
    nb_months_due: quote.nbMonthsDue
  }
}

function _toRisk (risk: Quote.Risk) {
  return {
    property: {
      room_count: risk.property.roomCount,
      address: risk.property.address ? risk.property.address : null,
      postal_code: risk.property.postalCode ? risk.property.postalCode : null,
      city: risk.property.city ? risk.property.city : null,
      type: risk.property.type ? risk.property.type : null,
      occupancy: risk.property.occupancy ? risk.property.occupancy : null
    },
    person: risk.person ? {
      firstname: risk.person.firstname,
      lastname: risk.person.lastname
    } : null,
    other_people: risk.otherPeople ? _toOtherPeople(risk.otherPeople) : null
  }
}

function _toOtherPeople (otherInsured: Quote.Risk.Person[]) {
  return otherInsured.map(insured => {
    return { firstname: insured.firstname, lastname: insured.lastname }
  })
}

function _toInsurance (insurance: Quote.Insurance) {
  return {
    monthly_price: insurance.estimate.monthlyPrice,
    default_deductible: insurance.estimate.defaultDeductible,
    default_cap: insurance.estimate.defaultCeiling,
    currency: insurance.currency,
    simplified_covers: insurance.simplifiedCovers,
    product_code: insurance.productCode,
    product_version: insurance.productVersion,
    contractual_terms: insurance.contractualTerms,
    ipid: insurance.ipid
  }
}

function _toPolicyHolder (policyHolder: Quote.PolicyHolder) {
  return {
    firstname: policyHolder.firstname ? policyHolder.firstname : null,
    lastname: policyHolder.lastname ? policyHolder.lastname : null,
    address: policyHolder.address ? policyHolder.address : null,
    postal_code: policyHolder.postalCode ? policyHolder.postalCode : null,
    city: policyHolder.city ? policyHolder.city : null,
    email: policyHolder.email ? policyHolder.email : null,
    phone_number: policyHolder.phoneNumber ? policyHolder.phoneNumber : null,
    email_validated_at: policyHolder.emailValidatedAt ? policyHolder.emailValidatedAt : null
  }
}
