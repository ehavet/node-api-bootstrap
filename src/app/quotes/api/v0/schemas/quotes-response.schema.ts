import Joi from 'joi'
import { POSTALCODE_REGEX } from '../../../../core/domain/regexp'

export const quoteResponseBodySchema: Joi.ObjectSchema = Joi.object({
  id: Joi.string().description('Quote id').example('DU6C73X'),
  code: Joi.string().description('Code').example('myCode'),
  risk: Joi.object({
    property: Joi.object({
      room_count: Joi.number().integer().max(5).description('Property number of rooms').example(3),
      address: Joi.string().max(100).description('Property address').example('112 rue du chêne rouge'),
      postal_code: Joi.string().regex(POSTALCODE_REGEX).description('Property postal code').example('95470'),
      city: Joi.string().max(50).description('Property city').example('Corbeil-Essonnes'),
      type: Joi.string().optional().allow(null).description('The type of property').example('FLAT'),
      occupancy: Joi.string().optional().allow(null).description('The occupancy').example('TENANT')
    }).description('Risks regarding the property').label('Risk.Property'),
    person: Joi.object({
      firstname: Joi.string().max(100).description('Person firstname').example('John'),
      lastname: Joi.string().max(100).description('Person lastname').example('Doe')
    }).allow(null).description('Risks regarding the person'),
    other_people: Joi.array().items(
      Joi.object({
        firstname: Joi.string().allow(null).max(100).description('Other person firstname').example('Jane'),
        lastname: Joi.string().allow(null).max(100).description('Other person lastname').example('Dose')
      }).description('Risks regarding other people')
    ).description('Risks regarding other people').example([{ firstname: 'Jane', lastname: 'Dose' }])
  }).description('Risks').label('Risk'),
  insurance: Joi.object({
    monthly_price: Joi.number().precision(2).description('Monthly price').example(5.43),
    default_deductible: Joi.number().precision(2).integer().description('Default deductible').example(150),
    default_cap: Joi.number().precision(2).description('Default cap').example(5000),
    currency: Joi.string().description('Monthly price currency').example('EUR'),
    simplified_covers: Joi.array().items(Joi.string()).description('Simplified covers').example(['ACDDE', 'ACVOL']),
    product_code: Joi.string().description('Product code').example('MRH-Loc-Etud'),
    product_version: Joi.string().description('Date of the product').example('v2020-02-01'),
    contractual_terms: Joi.string().description('Link to the Contractual Terms document').example('http://link/to.ct'),
    ipid: Joi.string().description('Link to the IPID document').example('http://link/to.ipid')
  }).description('Insurance').label('Quote.Insurance'),
  policy_holder: Joi.object({
    firstname: Joi.string().max(100).description('Policy holder firstname').example('John'),
    lastname: Joi.string().max(100).description('Policy holder lastname').example('Doe'),
    address: Joi.string().max(100).description('Property address').example('112 rue du chêne rouge'),
    postal_code: Joi.string().regex(POSTALCODE_REGEX).description('Property postal code').example('95470'),
    city: Joi.string().max(50).description('Property city').example('Corbeil-Essonnes'),
    email: Joi.string().email().allow(null).description('Policy holder email').example('john.doe@email.com'),
    phone_number: Joi.string().max(15).allow(null).description('Policy holder phone number').example('+33684205510'),
    email_validated_at: Joi.date().allow(null).description('Email validation date').example('2020-04-25T10:09:09.000')
  }).optional().allow(null).description('Policy holder contact'),
  start_date: Joi.date().description('Start date').example('2020-04-26'),
  term_start_date: Joi.date().description('Term start date').example('2020-04-26'),
  term_end_date: Joi.date().description('Term end date').example('2021-04-25'),
  premium: Joi.number().precision(2).description('Premium').example(60.43),
  nb_months_due: Joi.number().integer().min(1).max(12).description('Number of months due').example(8)
}).label('Quote')
