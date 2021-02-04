import { Server, ServerRoute } from '@hapi/hapi'
import { SuperTest, Test } from 'supertest'
import createServer from '../../src/server/server'
import { register } from 'prom-client'
import { logger } from '../../src/libs/logger'
import supertest = require('supertest')
const config = require('./config.test-utils')

export interface HttpServerForTesting {
  api (): SuperTest<Test>
}

// Creates a server the same way it is created for production
// Useful for end to end api tests
export const newProdLikeServer = async (): Promise<HttpServerForTesting> => {
  const hapiServer = await createServer(config, logger)
  return new HapiHttpServerForTesting(hapiServer)
}

// Creates a simple server with no configuration excepts the given PoliciesRoutesV0 to test
// Useful for specific api tests with mocked dependencies
export const newMinimalServer = (routesToTest: ServerRoute[]): HttpServerForTesting => {
  const hapiServer = new Server()
  // uncommented this line if you want to activate logs on test
  // hapiServer.events.on({ name: 'request', tags: true, filter: { tags: ['handler', 'error'], all: true } }, listenHandlerErrorsEvents(logger))
  hapiServer.route(routesToTest)
  return new HapiHttpServerForTesting(hapiServer)
}

class HapiHttpServerForTesting implements HttpServerForTesting {
  public server: Server

  constructor (hapiServer: Server) {
    this.server = hapiServer
    before(async () => {
      await this.server.start()
    })

    after(async () => {
      await this.server.stop()
      register.clear()
    })
  }

  api () {
    return supertest(this.server.listener)
  }
}
