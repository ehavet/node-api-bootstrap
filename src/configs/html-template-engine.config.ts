import * as path from 'path'

export interface HtmlTemplateEngineConfig {
    templatesDirectoryPath: string
}

export const htmlTemplateEngineConfig: HtmlTemplateEngineConfig = {
  templatesDirectoryPath: path.join(process!.env.PWD!, '/src/templates')
}
