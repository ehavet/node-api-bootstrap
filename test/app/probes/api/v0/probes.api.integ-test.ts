import * as supertest from 'supertest'
import { HttpServerForTesting, newMinimalServer } from '../../../../utils/server.test-utils'
import { container, probesRoutes } from '../../../../../src/app/probes/probes.container'
import { expect, sinon } from '../../../../test-utils'

describe('Probes - API - Integ', async () => {
  let httpServer: HttpServerForTesting

  before(async () => {
    httpServer = await newMinimalServer(probesRoutes())
  })

  describe('GET /probes/readiness', () => {
    let response: supertest.Response

    describe('when application state is up', () => {
      beforeEach(async () => {
        sinon.stub(container, 'CheckApplicationReadiness').resolves(true)
        response = await httpServer.api().get('/probes/readiness')
      })

      it('should reply with status 200', async () => {
        expect(response).to.have.property('statusCode', 200)
      })

      it('should return an application state UP', async () => {
        expect(response.body).to.deep.equal({ state: 'UP' })
      })
    })

    describe('when application state is down', () => {
      beforeEach(async () => {
        sinon.stub(container, 'CheckApplicationReadiness').resolves(false)
        response = await httpServer.api().get('/probes/readiness')
      })

      it('should reply with status 200', async () => {
        expect(response).to.have.property('statusCode', 200)
      })

      it('should return an application state DOWN', async () => {
        expect(response.body).to.deep.equal({ state: 'DOWN' })
      })
    })

    describe('when there is an unknown error', () => {
      it('should reply with status 500 when unknown error', async () => {
        sinon.stub(container, 'CheckApplicationReadiness').rejects(new Error())

        response = await httpServer.api().get('/probes/readiness')

        expect(response).to.have.property('statusCode', 500)
      })
    })
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
