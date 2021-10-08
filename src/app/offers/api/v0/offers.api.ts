import { Container } from '../../../container'
import { ServerRoute } from '@hapi/hapi'
import * as Boom from '@hapi/boom'
import { Offer } from '../../domain/offer'

export default function (container: Container): Array<ServerRoute> {
  return [
    {
      method: 'GET',
      path: '/offers',
      options: {
        description: 'return offers',
        response: {
        }
      },
      handler: async (_request, h) => {
        try {
          const offers: Offer[] = await container.GetOffers()
          return h.response({ offers }).code(200)
        } catch (error: any) {
          throw Boom.internal(error)
        }
      }
    },
    {
      method: 'GET',
      path: '/offers/{id}',
      options: {
        description: 'return an offer resource',
        response: {
        }
      },
      handler: async (_request, h) => {
        try {
          const offerId = _request.params.id
          const offer: Offer = await container.GetOffer(offerId)
          return h.response(offer).code(200)
        } catch (error: any) {
          throw Boom.internal(error)
        }
      }
    }
  ]
}
