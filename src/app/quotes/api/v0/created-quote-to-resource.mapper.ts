import { Quote } from '../../domain/quote'

// TODO refacto : the quote returned by the POST /quotes should use the quote-to-resource.mapper.ts
export function createdQuoteToResource (quote: Quote) {
  return {
    id: quote.id,
    code: quote.partnerCode,
    special_operations_code: quote.specialOperationsCode,
    special_operations_code_applied_at: quote.specialOperationsCodeAppliedAt ? new Date(quote.specialOperationsCodeAppliedAt) : null,
    risk: _toRisk(quote.risk),
    insurance: _toInsurance(quote.insurance)
  }
}

function _toRisk (risk: Quote.Risk) {
  return {
    property: {
      room_count: risk.property.roomCount,
      address: risk.property.address,
      postal_code: risk.property.postalCode,
      city: risk.property.city,
      type: risk.property.type,
      occupancy: risk.property.occupancy
    }
  }
}

function _toInsurance (insurance: Quote.Insurance) {
  return {
    monthly_price: insurance.estimate.monthlyPrice,
    default_deductible: insurance.estimate.defaultDeductible,
    default_ceiling: insurance.estimate.defaultCeiling,
    currency: insurance.currency,
    simplified_covers: insurance.simplifiedCovers,
    product_code: insurance.productCode,
    product_version: insurance.productVersion,
    contractual_terms: insurance.contractualTerms,
    ipid: insurance.ipid
  }
}
