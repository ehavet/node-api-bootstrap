import { Container } from '../../probes.container'
import { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import * as HttpErrorSchema from '../../../core/HttpErrorSchema'
import * as Boom from '@hapi/boom'
import { DatabaseInitializationError } from '../../../core/domain/database.errors'
import { ApplicationVersion } from '../../domain/application-version'

export default function (container: Container): Array<ServerRoute> {
  return [
    {
      method: 'GET',
      path: '/probes/readiness',
      options: {
        description: 'return application readiness status',
        response: {
          status: {
            200: Joi.object({
              state: Joi.string().valid('UP', 'DOWN').example('UP')
            }),
            500: HttpErrorSchema.internalServerErrorSchema
          }
        }
      },
      handler: async (_request, h) => {
        try {
          const readinessStatus = await container.CheckApplicationReadiness() ? 'UP' : 'DOWN'
          return h.response({ state: readinessStatus }).code(200)
        } catch (error) {
          if (error instanceof DatabaseInitializationError) {
            return h.response({ state: 'DOWN' }).code(200)
          }
          throw Boom.internal(error)
        }
      }
    },
    {
      method: 'GET',
      path: '/probes/version',
      options: {
        description: 'return application version',
        response: {
          status: {
            200: Joi.object({
              version: Joi.string().example('0.1.11')
            }),
            500: HttpErrorSchema.internalServerErrorSchema
          }
        }
      },
      handler: async (_request, h) => {
        try {
          const version: ApplicationVersion = await container.GetApplicationVersion()
          return h.response({ version: version.version }).code(200)
        } catch (error) {
          throw Boom.internal(error)
        }
      }
    }
  ]
}
