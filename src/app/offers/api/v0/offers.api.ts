import { Container } from '../../../container'
import { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import * as HttpErrorSchema from '../../../HttpErrorSchema'
import * as Boom from '@hapi/boom'
import { Offer } from '../../domain/offer'

export default function (container: Container): Array<ServerRoute> {
  return [
    {
      method: 'GET',
      path: '/offers/{id}',
      options: {
        description: 'return an offer resource',
        response: {
          status: {
            200: Joi.object({
              id: Joi.string().example('6789')
            }),
            500: HttpErrorSchema.internalServerErrorSchema
          }
        }
      },
      handler: async (_request, h) => {
        try {
          const offerId = _request.params.id
          const offer: Offer = await container.GetOffers(offerId)
          return h.response(offer).code(200)
        } catch (error) {
          throw Boom.internal(error)
        }
      }
    }
  ]
}
