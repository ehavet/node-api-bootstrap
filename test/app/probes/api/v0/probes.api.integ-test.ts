import * as supertest from 'supertest'
import { HttpServerForTesting, newMinimalServer } from '../../../../utils/server.test-utils'
import { container, probesRoutes } from '../../../../../src/app/probes/probes.container'
import { expect, sinon } from '../../../../test-utils'

describe('Probes - API - Integ', async () => {
  let httpServer: HttpServerForTesting

  before(async () => {
    httpServer = await newMinimalServer(probesRoutes())
  })

  describe('GET /probes/version', () => {
    let response: supertest.Response

    describe('when success', () => {
      const expectedApplicationVersion = { version: '1.1.11' }

      beforeEach(async () => {
        sinon.stub(container, 'GetApplicationVersion').resolves(expectedApplicationVersion)
        response = await httpServer.api()
          .get('/probes/version')
      })

      it('should reply with status 200', async () => {
        expect(response).to.have.property('statusCode', 200)
      })

      it('should return an application version object', async () => {
        expect(response.body).to.deep.equal(expectedApplicationVersion)
      })
    })

    describe('when there is an unknown error', () => {
      it('should reply with status 500 when unknown error', async () => {
        sinon.stub(container, 'GetApplicationVersion').rejects(Error)
        response = await httpServer.api()
          .get('/probes/version')

        expect(response).to.have.property('statusCode', 500)
      })
    })
  })
})
