import { Amount } from '../../core/domain/amount/amount'

export interface CreateQuoteCommand {
    code: string,
    rate: Amount,
    createdAt: Date,
    validityPeriodInMonth: number
}
