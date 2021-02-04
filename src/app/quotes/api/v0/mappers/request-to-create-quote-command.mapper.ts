import { CreateQuoteCommand } from '../../../domain/create-quote-command'

export function requestToCreateQuoteCommand (request: any): CreateQuoteCommand {
  const payload: any = request.payload
  return {
    partnerCode: payload.code,
    specOpsCode: payload.spec_ops_code,
    risk: {
      property: {
        roomCount: payload.risk.property.room_count,
        address: payload.risk.property.address,
        city: payload.risk.property.city,
        postalCode: payload.risk.property.postal_code,
        type: payload.risk.property.type,
        occupancy: payload.risk.property.occupancy
      }
    }
  }
}
