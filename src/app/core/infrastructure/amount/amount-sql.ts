import { DataType } from 'sequelize-typescript'

const SQL_DEFAULT_SCALE = 6
const SQL_DEFAULT_PRECISION = 14

export const AmountSQLDataType = DataType.DECIMAL(SQL_DEFAULT_PRECISION, SQL_DEFAULT_SCALE)
