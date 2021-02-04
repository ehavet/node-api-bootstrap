import { Logger } from '../../libs/logger'
import { Boom } from '@hapi/boom'

// Event listener that will logs error events sent by the controllers (called handlers in HapiJS)
export function listenHandlerErrorsEvents (logger: Logger): any {
  // @ts-ignore
  return (request, event) => {
    const error = event.error as Boom

    if (error.isBoom) {
      const is5xx = error.output.statusCode >= 500
      const is4xx = error.output.statusCode >= 400 && error.output.statusCode < 500

      if (is5xx) {
        logger.error(error)
      }
      if (is4xx) {
        logger.info(error)
      }
    } else {
      logger.error(error)
    }
  }
}
