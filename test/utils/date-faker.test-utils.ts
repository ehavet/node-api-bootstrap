const sinon = require('sinon')

export const dateFaker = (function () {
  let clock
  return {
    setCurrentDate: (date) => {
      clock = sinon.useFakeTimers({ now: date, toFake: ['Date'] })
    },
    restoreDate: () => {
      if (clock) clock.restore()
    }
  }
}())
