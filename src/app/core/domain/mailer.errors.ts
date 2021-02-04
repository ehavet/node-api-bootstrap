export class MailDeliveryFailureError extends Error {
  constructor (emailAddress: string) {
    const message: string = `Unable to deliver validation email : ${emailAddress}`
    super(message)
    this.name = 'MailDeliveryFailureError'
  }
}
