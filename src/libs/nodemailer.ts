const nodemailer = require('nodemailer')
const config = require('../config')

const transport:string = config.get('FALCO_API_EMAIL_TRANSPORT')
const getTransportConfig = function (transport) {
  switch (transport) {
    case 'sendmail':
      return {
        sendmail: true,
        newline: 'unix',
        path: '/usr/sbin/sendmail'
      }
    default:
      return {
        streamTransport: true,
        newline: 'unix',
        buffer: true
      }
  }
}
export const nodemailerTransporter = nodemailer.createTransport(getTransportConfig(transport))
