import createServer from './server/server'
import { logger } from './libs/logger'
const config = require('./config')

async function startServer () {
  try {
    const server = await createServer(config, logger)
    await server.start()
    logger.info(`Server running at: ${server.info.uri}`)
  } catch (error) {
    logger.fatal('Could not start server', { error })
    process.exit(1)
  }
}

process.on('unhandledRejection', (error) => {
  if (error && !logger) {
    // @ts-ignore
    console.error(error.stack) // eslint-disable-line no-console
    process.exit(1)
  }
  // @ts-ignore
  logger.fatal(`Caught unhandled rejection ${error}`, error && error.stack ? error.stack : { error })
  process.exit(1)
})

startServer()
