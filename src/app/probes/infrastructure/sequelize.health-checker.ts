import { DatabaseHealthChecker } from '../domain/database-health-checker'
import { getSequelize } from '../../../libs/sequelize'
import { Sequelize } from 'sequelize-typescript'

export class SequelizeHealthChecker implements DatabaseHealthChecker {
  async isConnectionEstablished (): Promise<boolean> {
    try {
      const sequalize: Sequelize = getSequelize()
      await sequalize.authenticate()
      return true
    } catch (error) {
      return false
    }
  }
}
