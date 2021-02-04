const { parse } = require('pg-connection-string')
require('dotenv').config()
// eslint-disable-next-line no-process-env
const FALCO_API_DATABASE_URL = process.env.FALCO_API_DATABASE_URL || 'postgres://test:test@localhost:54334/test'
const { host, port, database, user, password } = parse(FALCO_API_DATABASE_URL)

module.exports = {
  development: {
    username: user,
    password: password,
    database: database,
    host: host,
    port: port,
    dialect: 'postgres',
    migrationStorageTableName: 'sequelize_meta',
    seederStorageTableName: 'sequelize_seeder',
    migrationStorageTableSchema: 'sequelize',
    seederStorageTableSchema: 'sequelize',
    logging: true
  },
  production: {
    username: user,
    password: password,
    database: database,
    host: host,
    port: port,
    dialect: 'postgres',
    migrationStorageTableName: 'sequelize_meta',
    seederStorageTableName: 'sequelize_seeder',
    migrationStorageTableSchema: 'sequelize',
    seederStorageTableSchema: 'sequelize',
    logging: true
  }
}
