export interface HtmlTemplateEngine {
    render(templateName: string, data?: HtmlTemplateEngine.Data): Promise<string>
}

export namespace HtmlTemplateEngine {
    export interface Data {
        [key: string]: string,
    }
}

export class HtmlTemplateEngineFileNotFoundError extends Error {
  constructor (path: string) {
    const message: string = `Could not find template file at : ${path}`
    super(message)
    this.name = 'HtmlTemplateEngineFileNotFoundError'
  }
}
