import { HtmlTemplateEngine } from './domain/html-template-engine'
import { EjsHtmlTemplateEngine } from './infrastructure/ejs.html-template-engine'
import { htmlTemplateEngineConfig } from '../../configs/html-template-engine.config'
import { Mailer } from './domain/mailer'
import { Nodemailer } from './infrastructure/nodemailer.mailer'
import { nodemailerTransporter } from '../../libs/nodemailer'

export interface Container {
    htmlTemplateEngine: HtmlTemplateEngine,
    mailer: Mailer
}

const htmlTemplateEngine: HtmlTemplateEngine = new EjsHtmlTemplateEngine(htmlTemplateEngineConfig)
const mailer: Mailer = new Nodemailer(nodemailerTransporter)

export const container: Container = {
  htmlTemplateEngine: htmlTemplateEngine,
  mailer: mailer
}
