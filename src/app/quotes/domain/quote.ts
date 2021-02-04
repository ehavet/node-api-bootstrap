import dayjs from '../../../libs/dayjs'
import { CreateQuoteCommand } from './create-quote-command'
import { Amount } from '../../core/domain/amount/amount'

export interface Quote {
    id: string,
    code: string,
    rate: Amount,
    createdAt: Date,
    validityPeriodInMonth: number
}

export namespace Quote {

    export function create (
      command: CreateQuoteCommand
    ): Quote {
      const quote = {
        id: nextId(),
        code: command.code,
        rate: command.rate,
        createdAt: _getUtcDate(new Date()),
        validityPeriodInMonth: 6
      }
      return quote
    }

    function _getUtcDate (date: Date): Date {
      return dayjs(date).utc().toDate()
    }

    export function applyNbMonthsDue (quote: Quote, nbMonthsDue: number): void {
      quote.premium = Amount.multiply(nbMonthsDue, quote.insurance.estimate.monthlyPrice)
      quote.nbMonthsDue = nbMonthsDue

      if (quote.startDate) {
        quote.termEndDate = _computeTermEndDate(quote.startDate, nbMonthsDue)
      }
    }

    function _computeTermEndDate (termStartDate: Date, durationInMonths: number): Date {
      termStartDate.setUTCHours(0, 0, 0, 0)
      const termEndDate: Date = dayjs(termStartDate).utc()
        .add(durationInMonths, 'month')
        .subtract(1, 'day').toDate()
      return termEndDate
    }

    export function nextId (): string {
      return generate({ length: 7, charset: 'alphanumeric', readable: true, capitalization: 'uppercase' })
    }
}
