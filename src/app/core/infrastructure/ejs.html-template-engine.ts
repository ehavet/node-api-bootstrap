import { HtmlTemplateEngine, HtmlTemplateEngineFileNotFoundError } from '../domain/html-template-engine'
import { HtmlTemplateEngineConfig } from '../../../configs/html-template-engine.config'
import path from 'path'
import * as fs from 'fs'
const ejs = require('ejs')

export class EjsHtmlTemplateEngine implements HtmlTemplateEngine {
  constructor (private config: HtmlTemplateEngineConfig) {}

  async render (templateName: string, data?: HtmlTemplateEngine.Data): Promise<string> {
    const templatePath: string = await path.join(this.config.templatesDirectoryPath, `/${templateName}.ejs`)

    try {
      const template = await fs.readFileSync(templatePath).toString()
      return ejs.render(template, data)
    } catch (error) {
      switch (true) {
        case error.code === 'ENOENT':
          throw new HtmlTemplateEngineFileNotFoundError(templatePath)
        default:
          throw error
      }
    }
  }
}
