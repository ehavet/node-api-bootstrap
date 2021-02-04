export class DatabaseInitializationError extends Error {
  constructor () {
    const message: string = 'Database has not been initialized'
    super(message)
    this.name = 'DatabaseInitializationError'
  }
}
