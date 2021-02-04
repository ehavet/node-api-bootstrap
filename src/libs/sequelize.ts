import { Sequelize } from 'sequelize-typescript'
import { Logger, logger } from './logger'
import { quoteSqlModels } from '../app/quotes/quote.container'
import { DatabaseInitializationError } from '../app/core/domain/database.errors'

let sequelize: Sequelize

export async function initSequelize (config) {
  sequelize = new Sequelize(config.get('FALCO_API_DATABASE_URL'), {
    dialect: 'postgres',
    logging: logDbStatement(logger, config.get('FALCO_API_APP_NAME'), config.get('FALCO_API_DATABASE_URL')),
    pool: {
      max: config.get('SEQUELIZE_MAX_CONNECTIONS'),
      min: 0,
      acquire: 10000,
      idle: 10000
    }
  })
  sequelize.addModels(quoteSqlModels)

  return sequelize
}

export function getSequelize () {
  return sequelize || new DatabaseInitializationError()
}

function logDbStatement (logger: Logger, db: string, databaseUrl: string) {
  return function (statement: string) {
    logger.trace(statement, { db, databaseUrl })
  }
}
