import { expect, sinon } from '../../../test-utils'
import { SequelizeHealthChecker } from '../../../../src/app/probes/infrastructure/sequelize.health-checker'
import { Sequelize } from 'sequelize-typescript'
import * as SequelizeModule from '../../../../src/libs/sequelize'
import { SinonStubbedInstance } from 'sinon'

describe('Sequelize Health Checker', async () => {
  let healthChecker: SequelizeHealthChecker
  let sequelize: SinonStubbedInstance<Sequelize>

  before(async () => {
    sequelize = sinon.createStubInstance(Sequelize, {
      authenticate: sinon.stub()
        .onFirstCall().resolves({})
        .onSecondCall().rejects(Error)
    })
    healthChecker = new SequelizeHealthChecker()
  })

  describe('isConnectionEstablished', async () => {
    it('should return true is connection with database is established', async () => {
      sinon.stub(SequelizeModule, 'getSequelize').returns(sequelize)
      const response = await healthChecker.isConnectionEstablished()
      expect(response).to.be.equal(true)
    })

    it('should return false is connection with database is not established', async () => {
      sinon.stub(SequelizeModule, 'getSequelize').returns(sequelize)
      const response = await healthChecker.isConnectionEstablished()
      expect(response).to.be.equal(false)
    })
  })
})
