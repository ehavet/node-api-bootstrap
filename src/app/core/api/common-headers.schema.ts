import Joi from 'joi'

export const commonHeadersSchema: Joi.ObjectSchema = Joi.object({
  'x-consumer-username': Joi.string().required()
}).unknown().label('Headers').description('Request mandatory headers')
