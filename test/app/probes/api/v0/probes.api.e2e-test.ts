import * as supertest from 'supertest'
import { expect, HttpServerForTesting, newProdLikeServer } from '../../../../test-utils'

describe('Probes - API - E2E', async () => {
  let httpServer: HttpServerForTesting
  before(async () => {
    httpServer = await newProdLikeServer()
  })

  describe('GET /probes/version', () => {
    let response: supertest.Response

    it('should return an application version resource', async () => {
      const { version } = require('../../../../../package.json')
      const expectedResource = { version: version }
      response = await httpServer.api()
        .get('/probes/version')
      expect(response.body).to.deep.equal(expectedResource)
    })
  })
})
