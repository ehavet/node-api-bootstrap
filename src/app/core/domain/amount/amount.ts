import currency from 'currency.js'
const currentLibrary = currency

export type Amount = number

export namespace Amount {
  const DEFAULT_PRECISION = 2
  const options = {
    precision: DEFAULT_PRECISION
  }

  export function toAmount (value: string | number): Amount {
    return currentLibrary(value, options).value
  }

  export function multiply (firstNumber: number, secondNumber: number): Amount {
    return currentLibrary(firstNumber, options).multiply(secondNumber).value
  }

  export function divide (numerator: number, denominator: number): Amount {
    return currentLibrary(numerator, options).divide(denominator).value
  }

  export function convertCentsToEuro (value: number): Amount {
    return currentLibrary(value, { ...options, fromCents: true }).value
  }

  export function convertEuroToCents (value: number): Amount {
    return multiply(value, 100)
  }
}
