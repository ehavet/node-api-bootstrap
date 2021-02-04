import { sinon } from '../../../test-utils'

export function quoteRepositoryMock (attr = {}) {
  return {
    save: sinon.mock(),
    get: sinon.mock(),
    update: sinon.mock(),
    setEmailValidatedAt: sinon.mock(),
    ...attr
  }
}

export function quoteRepositoryStub (attr = {}) {
  return {
    save: sinon.stub(),
    get: sinon.stub(),
    update: sinon.stub(),
    setEmailValidatedAt: sinon.stub(),
    ...attr
  }
}
