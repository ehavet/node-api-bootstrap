import { initSequelize } from '../../src/libs/sequelize'
import { config } from '../test-utils'
import { Sequelize } from 'sequelize-typescript'

export const dbTestUtils = (function () {
  let sequelize: Sequelize
  return {
    initDB: async () => {
      sequelize = await initSequelize(config)
    },
    closeDB: async () => {
      if (sequelize) await sequelize.close()
    }
  }
}())
