import { Email, Mailer, MailerResponse } from '../domain/mailer'
import { MailDeliveryFailureError } from '../domain/mailer.errors'
import { logger } from '../../../libs/logger'

export class Nodemailer implements Mailer {
  constructor (private nodemailerTransporter) {
  }

  async send (email: Email) : Promise<MailerResponse> {
    const payload = _getMailPayload(email)
    try {
      const response = await this.nodemailerTransporter.sendMail(payload)
      return { messageId: response.messageId }
    } catch (error) {
      logger.error(error)
      throw new MailDeliveryFailureError(email.sender)
    }
  }
}

function _getMailPayload (email: Email) {
  const message = {
    from: email.sender,
    to: email.recipient,
    subject: email.subject,
    text: email.messageText,
    html: email.messageHtml,
    cc: email.cc
  }
  if (email.attachments === undefined) { return message }
  const attachments = { attachments: email.attachments }
  return { ...attachments, ...message }
}
