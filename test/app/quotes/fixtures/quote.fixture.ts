import { Quote } from '../../../../src/app/quotes/domain/quote'
import { UpdateQuoteCommand } from '../../../../src/app/quotes/domain/update-quote-command'
import { PropertyType } from '../../../../src/app/core/domain/type/property-type'
import { Occupancy } from '../../../../src/app/core/domain/type/occupancy'

const now: Date = new Date('2020-01-05T00:00:00Z')

export function createQuoteFixture (attr:Partial<Quote> = {}): Quote {
  return {
    id: 'UD65X3A',
    partnerCode: 'myPartner',
    risk: {
      property: {
        roomCount: 2,
        address: '88 rue des prairies',
        postalCode: '91100',
        city: 'Kyukamura',
        type: PropertyType.FLAT,
        occupancy: Occupancy.TENANT
      },
      person: {
        firstname: 'Jean-Jean',
        lastname: 'Lapin'
      },
      otherPeople: [
        {
          firstname: 'John',
          lastname: 'Doe'
        }
      ]
    },
    insurance: {
      estimate: {
        monthlyPrice: 5.82,
        defaultDeductible: 150,
        defaultCeiling: 7000
      },
      currency: 'EUR',
      simplifiedCovers: ['ACDDE', 'ACVOL'],
      productCode: 'APP999',
      productVersion: 'v2020-02-01',
      contractualTerms: '/path/to/contractual/terms',
      ipid: '/path/to/ipid'
    },
    policyHolder: {
      firstname: 'Jean-Jean',
      lastname: 'Lapin',
      address: '88 rue des prairies',
      postalCode: '91100',
      city: 'Kyukamura',
      email: 'jeanjean@email.com',
      phoneNumber: '+33684205510',
      emailValidatedAt: undefined
    },
    premium: 69.84,
    nbMonthsDue: 12,
    specialOperationsCode: undefined,
    specialOperationsCodeAppliedAt: undefined,
    startDate: now,
    termStartDate: now,
    termEndDate: now,
    ...attr
  }
}

export function createQuotePolicyHolderFixture (attr:Partial<Quote.PolicyHolder> = {}): Quote.PolicyHolder {
  return {
    firstname: 'Jean-Jean',
    lastname: 'Lapin',
    address: '88 rue des prairies',
    postalCode: '91100',
    city: 'Kyukamura',
    email: 'jeanjean@email.com',
    phoneNumber: '+33684205510',
    emailValidatedAt: undefined,
    ...attr
  }
}

export function createQuoteInsuranceFixture (attr:Partial<Quote.Insurance> = {}): Quote.Insurance {
  return {
    estimate: {
      monthlyPrice: 5.82,
      defaultDeductible: 150,
      defaultCeiling: 7000
    },
    currency: 'EUR',
    simplifiedCovers: ['ACDDE', 'ACVOL'],
    productCode: 'APP999',
    productVersion: 'v2020-02-01',
    contractualTerms: '/path/to/contractual/terms',
    ipid: '/path/to/ipid',
    ...attr
  }
}

export function createQuoteRiskFixture (attr:Partial<Quote.Risk> = {}): Quote.Risk {
  return {
    property: {
      roomCount: 2,
      address: '88 rue des prairies',
      postalCode: '91100',
      city: 'Kyukamura',
      type: PropertyType.FLAT,
      occupancy: Occupancy.TENANT
    },
    person: {
      firstname: 'Jean-Jean',
      lastname: 'Lapin'
    },
    otherPeople: [
      {
        firstname: 'John',
        lastname: 'Doe'
      }
    ],
    ...attr
  }
}

export function createUpdateQuoteCommandFixture (attr:Partial<UpdateQuoteCommand> = {}): UpdateQuoteCommand {
  return {
    id: 'UD65X3A',
    risk: {
      property: {
        roomCount: 2,
        address: '88 rue des prairies',
        postalCode: '91100',
        city: 'Kyukamura',
        type: PropertyType.FLAT,
        occupancy: Occupancy.TENANT
      },
      person: {
        firstname: 'Jean-Jean',
        lastname: 'Lapin'
      },
      otherPeople: [
        {
          firstname: 'John',
          lastname: 'Doe'
        }
      ]
    },
    policyHolder: {
      firstname: 'Jean-Jean',
      lastname: 'Lapin',
      email: 'jeanjean@email.com',
      phoneNumber: '+33684205510',
      address: '88 rue des prairies',
      postalCode: '91100',
      city: 'Kyukamura'
    },
    startDate: now,
    ...attr
  }
}

export function createUpdateQuoteCommandPolicyHolderFixture (attr:Partial<UpdateQuoteCommand.PolicyHolder> = {}): UpdateQuoteCommand.PolicyHolder {
  return {
    firstname: 'Jean-Jean',
    lastname: 'Lapin',
    address: '88 rue des prairies',
    postalCode: '91100',
    city: 'Kyukamura',
    email: 'jeanjean@email.com',
    phoneNumber: '+33684205510',
    ...attr
  }
}

export function createUpdateQuoteCommandRiskFixture (attr:Partial<UpdateQuoteCommand.Risk> = {}): UpdateQuoteCommand.Risk {
  return {
    property: {
      roomCount: 2,
      address: '88 rue des prairies',
      postalCode: '91100',
      city: 'Kyukamura'
    },
    person: {
      firstname: 'Jean-Jean',
      lastname: 'Lapin'
    },
    otherPeople: [
      {
        firstname: 'Samy',
        lastname: 'Aza'
      },
      {
        firstname: 'Kasy',
        lastname: 'Ade'
      }
    ],
    ...attr
  }
}

export function createUpdateQuotePayloadFixture (attr:Partial<object> = {}) {
  return {
    start_date: '2020-01-05',
    spec_ops_code: 'SEMESTER1',
    risk: {
      property: {
        room_count: 2,
        address: '88 rue des prairies',
        postal_code: '91100',
        city: 'Kyukamura',
        type: PropertyType.FLAT,
        occupancy: Occupancy.TENANT
      },
      person: {
        firstname: 'Jean-Jean',
        lastname: 'Lapin'
      },
      other_people: [
        {
          firstname: 'Samy',
          lastname: 'Aza'
        },
        {
          firstname: 'Kasy',
          lastname: 'Ade'
        }
      ]
    },
    policy_holder: {
      firstname: 'Jean-Jean',
      lastname: 'Lapin',
      address: '88 rue des prairies',
      postal_code: '91100',
      city: 'Kyukamura',
      email: 'jeanjean@email.com',
      phone_number: '+33684205510'
    },
    ...attr
  }
}
