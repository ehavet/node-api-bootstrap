import Inert from '@hapi/inert'
import Vision from '@hapi/vision'
import { ServerRegisterPluginObject } from '@hapi/hapi'
import { RegisterOptions } from 'hapi-swagger'

const HapiSwagger = require('hapi-swagger')

function swaggerOptions (config: Map<string, any>) : RegisterOptions {
  return {
    schemes: ['https', 'http'],
    info: {
      title: 'API Documentation',
      contact: {
        name: 'node bootstrap api',
        url: 'https://www.octo.com/'
      }
    },
    basePath: `${config.get('FALCO_API_URL_PREFIX')}`,
    grouping: 'tags'
  }
}

export function happiSwaggerPlugin (config: Map<string, any>): Array<ServerRegisterPluginObject<any>> {
  return [
    { plugin: Inert },
    { plugin: Vision },
    {
      plugin: HapiSwagger,
      options: swaggerOptions(config)
    }
  ]
}
