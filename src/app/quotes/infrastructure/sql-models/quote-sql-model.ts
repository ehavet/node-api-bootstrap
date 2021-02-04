import { Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript'
import { AmountSQLDataType } from '../../../core/infrastructure/amount/amount-sql'

@Table({ timestamps: true, tableName: 'quote', underscored: true })
export class QuoteSqlModel extends Model {
    @PrimaryKey
    @Column
    id!: string

    @Column
    code!: string

    @Column(AmountSQLDataType)
    rate!: number

    @Column({ type: DataType.DATEONLY })
    createdAt!: Date

    @Column
    validityPeriodInMonth!: number
}
