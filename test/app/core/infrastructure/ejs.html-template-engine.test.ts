import { EjsHtmlTemplateEngine } from '../../../../src/app/core/infrastructure/ejs.html-template-engine'
import { HtmlTemplateEngineConfig } from '../../../../src/configs/html-template-engine.config'
import { expect } from '../../../test-utils'
import { HtmlTemplateEngine, HtmlTemplateEngineFileNotFoundError } from '../../../../src/app/core/domain/html-template-engine'
import path from 'path'

describe('Common API - Infrastructure - EJS Html template engine', async () => {
  let templateEngine: EjsHtmlTemplateEngine
  let config : HtmlTemplateEngineConfig

  before(async () => {
    config = { templatesDirectoryPath: path.join(__dirname) }
    templateEngine = new EjsHtmlTemplateEngine(config)
  })

  describe('render', async () => {
    it('should throw HtmlTemplateEngineFileNotFoundError when template is not found', async () => {
      // WHEN
      const promise: Promise<string> = templateEngine.render('non-existent-template', {})

      // THEN
      return expect(promise).to.be.rejectedWith(HtmlTemplateEngineFileNotFoundError, 'Could not find template file at :')
    })

    it('should combine template with provided data then return html string', async () => {
      // GIVEN
      const data: HtmlTemplateEngine.Data = { title: 'appenin' }
      const expectedHtml: string = '<!DOCTYPE html>\n' +
            '<html>\n' +
            '    <head>\n' +
            '        <title>appenin</title>\n' +
            '    </head>\n' +
            '    <body>\n' +
            '        <p>hello world</p>\n' +
            '    </body>\n' +
            '</html>'
      // WHEN
      const html = await templateEngine.render('template-test', data)

      // THEN
      expect(html).to.be.eql(expectedHtml)
    })
  })
})
