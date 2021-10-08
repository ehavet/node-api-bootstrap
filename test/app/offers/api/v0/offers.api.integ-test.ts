import * as supertest from 'supertest'
import { HttpServerForTesting, newMinimalServer } from '../../../../utils/server.test-utils'
import { container, offersRoutes } from '../../../../../src/app/container'
import { expect, sinon } from '../../../../test-utils'

describe('Offers - API - Integ', async () => {
  let httpServer: HttpServerForTesting

  before(async () => {
    httpServer = await newMinimalServer(offersRoutes())
  })

  describe('GET /offers/{id}', () => {
    let response: supertest.Response

    describe('when success', () => {
      const expectedApplicationVersion = { id: '3' }

      beforeEach(async () => {
        sinon.stub(container, 'GetOffers').resolves(expectedApplicationVersion)
        response = await httpServer.api()
          .get('/offers/3')
      })

      it('should reply with status 200', async () => {
        expect(response).to.have.property('statusCode', 200)
      })

      it('should return an offer object', async () => {
        expect(response.body).to.deep.equal(expectedApplicationVersion)
      })
    })

    describe('when there is an unknown error', () => {
      it('should reply with status 500 when unknown error', async () => {
        sinon.stub(container, 'GetOffers').rejects(Error)
        response = await httpServer.api()
          .get('/offers/3')

        expect(response).to.have.property('statusCode', 500)
      })
    })
  })
})
