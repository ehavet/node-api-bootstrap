import { Request, ResponseToolkit, Server } from '@hapi/hapi'
import Joi from 'joi'
import { Boom } from '@hapi/boom'
import { happiSwaggerPlugin } from './plugins/swagger'
import { offersRoutes } from '../app/container'
import { Logger } from '../libs/logger'
import { listenHandlerErrorsEvents } from './event-listeners/on-handler-error.event-listener'

export default async (config: Map<string, any>, logger: Logger): Promise<Server> => {
  const server = new Server({
    port: config.get('API_PORT'),
    routes: {
      cors: {
        exposedHeaders: ['WWW-Authenticate', 'Server-Authorization', 'Location', 'Etag']
      },
      validate: {
        failAction: async (_request, _h, err) => {
          if (err) logger.debug(err)
          throw err
        },
        options: {
          abortEarly: false
        }
      }
    }
  })

  server.ext('onPreResponse', setBoomErrorDataToResponse)
  server.validator(Joi)
  server.route(offersRoutes())
  await server.register(happiSwaggerPlugin(config))

  server.events.on({ name: 'request', tags: true, filter: { tags: ['handler', 'error'], all: true } }, listenHandlerErrorsEvents(logger))

  return server
}

function setBoomErrorDataToResponse (request: Request, h: ResponseToolkit) {
  const response = request.response as Boom
  if (!response.isBoom) {
    return h.continue
  }
  const is4xx = response.output.statusCode >= 400 && response.output.statusCode < 500
  if (is4xx && response.data) {
    // @ts-ignore
    response.output.payload.data = response.data
  }
  return h.continue
}
