import { expect, sinon } from '../../../test-utils'
import { SequelizeHealthChecker } from '../../../../src/app/probes/infrastructure/sequelize.health-checker'
import { CheckApplicationReadiness } from '../../../../src/app/probes/domain/check-application-readiness.usecase'

describe('Usecase - Check Application Readiness', async () => {
  let usecase: CheckApplicationReadiness

  before(async () => {
    // GIVEN
    const healthChecker = sinon.createStubInstance(SequelizeHealthChecker, {
      isConnectionEstablished: sinon.stub().onFirstCall().resolves(true).onSecondCall().resolves(false)
    })

    usecase = CheckApplicationReadiness.factory(healthChecker)
  })

  it('should return true when application is ready', async () => {
    // WHEN
    const applicationReadiness = await usecase()
    // THEN
    expect(applicationReadiness).to.be.equal(true)
  })

  it('should return false when application is not ready', async () => {
    // WHEN
    const applicationReadiness = await usecase()
    // THEN
    expect(applicationReadiness).to.be.equal(false)
  })
})
