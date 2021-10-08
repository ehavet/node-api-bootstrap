import * as supertest from 'supertest'
import { expect, HttpServerForTesting, newProdLikeServer } from '../../../../test-utils'

describe('Offers - API - E2E', async () => {
  let httpServer: HttpServerForTesting
  before(async () => {
    httpServer = await newProdLikeServer()
  })

  describe('GET /offers/{id}', () => {
    let response: supertest.Response

    it('should return an offer resource', async () => {
      const expectedResource = { id: '4' }
      response = await httpServer.api()
        .get('/offers/4')
      expect(response.body).to.deep.equal(expectedResource)
    })
  })
})
