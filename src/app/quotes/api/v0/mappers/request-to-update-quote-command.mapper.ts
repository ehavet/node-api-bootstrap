import { UpdateQuoteCommand } from '../../../domain/update-quote-command'

export function requestToUpdateQuoteCommand (request): UpdateQuoteCommand {
  const payload = request.payload
  return {
    id: request.params.id,
    risk: _toRisk(payload.risk),
    policyHolder: payload.policy_holder ? _toPolicyHolder(payload.policy_holder) : undefined,
    startDate: payload.start_date ? new Date(payload.start_date) : undefined,
    specOpsCode: payload.spec_ops_code ? payload.spec_ops_code : undefined
  }
}

function _toRisk (risk): UpdateQuoteCommand.Risk {
  return {
    property: {
      roomCount: risk.property.room_count,
      address: risk.property.address ? risk.property.address : undefined,
      postalCode: risk.property.postal_code ? risk.property.postal_code : undefined,
      city: risk.property.city ? risk.property.city : undefined,
      type: risk.property.type ? risk.property.type : undefined,
      occupancy: risk.property.occupancy ? risk.property.occupancy : undefined
    },
    person: risk.person ? { firstname: risk.person.firstname, lastname: risk.person.lastname } : undefined,
    otherPeople: risk.other_people ? risk.other_people.map(person => {
      return { firstname: person.firstname, lastname: person.lastname }
    }) : undefined
  }
}

function _toPolicyHolder (policyHolder): UpdateQuoteCommand.PolicyHolder {
  return {
    firstname: policyHolder.firstname ?? undefined,
    lastname: policyHolder.lastname ?? undefined,
    address: policyHolder.address ?? undefined,
    postalCode: policyHolder.postal_code ?? undefined,
    city: policyHolder.city ?? undefined,
    email: policyHolder.email ?? undefined,
    phoneNumber: policyHolder.phone_number ?? undefined
  }
}
