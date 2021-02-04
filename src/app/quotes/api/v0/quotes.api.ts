import * as Boom from '@hapi/boom'
import Joi from 'joi'
import * as HttpErrorSchema from '../../../core/HttpErrorSchema'
import { ServerRoute } from '@hapi/hapi'
import { CreateQuoteCommand } from '../../domain/create-quote-command'
import { createdQuoteToResource } from './created-quote-to-resource.mapper'
import { Container } from '../../quote.container'
import {
  NoPartnerInsuranceForRiskError,
  QuoteNotFoundError, QuotePartnerOwnershipError,
  QuoteRiskNumberOfRoommatesError, QuoteRiskOccupancyNotInsurableError,
  QuoteRiskPropertyRoomCountNotInsurableError, QuoteRiskPropertyTypeNotInsurableError,
  QuoteRiskRoommatesNotAllowedError,
  QuoteStartDateConsistencyError
} from '../../domain/quote.errors'
import { UpdateQuoteCommand } from '../../domain/update-quote-command'
import { quoteResponseBodySchema } from './schemas/quotes-response.schema'
import { quotePutRequestBodySchema } from './schemas/quotes-put-request.schema'
import { quotePostRequestBodySchema } from './schemas/quotes-post-request.schema'
import { requestToUpdateQuoteCommand } from './mappers/request-to-update-quote-command.mapper'
import { requestToCreateQuoteCommand } from './mappers/request-to-create-quote-command.mapper'
import { GetQuoteById } from '../../domain/get-quote-by-id.usecase'
import { commonHeadersSchema } from '../../../core/api/common-headers.schema'
import { quoteToResource } from './mappers/quote-to-resource.mapper'
import GetQuoteByIdQuery = GetQuoteById.GetQuoteByIdQuery

const TAGS = ['api', 'quotes']

export default function (container: Container): Array<ServerRoute> {
  return [
    {
      method: 'POST',
      path: '/v0/quotes',
      options: {
        tags: TAGS,
        description: 'Create a quote',
        validate: {
          payload: quotePostRequestBodySchema
        },
        response: {
          status: {
            201: Joi.object({
              id: Joi.string().description('Quote id').example('DU6C73X'),
              code: Joi.string().description('Code').example('myCode'),
              special_operations_code: Joi.string().allow(null).description('Operation special code applied').example('CODEPROMO1'),
              special_operations_code_applied_at: Joi.date().allow(null).description('Application date of operation special code').example('1957-03-02T10:09:09.000'),
            }),
            400: HttpErrorSchema.badRequestSchema,
            404: HttpErrorSchema.notFoundSchema,
            422: HttpErrorSchema.unprocessableEntitySchema,
            500: HttpErrorSchema.internalServerErrorSchema
          }
        }
      },
      handler: async (request, h) => {
        const createQuoteCommand: CreateQuoteCommand = requestToCreateQuoteCommand(request)
        try {
          const quote = await container.CreateQuote(createQuoteCommand)
          const quoteAsResource = createdQuoteToResource(quote)
          return h.response(quoteAsResource).code(201)
        } catch (error) {
          if (error instanceof NoPartnerInsuranceForRiskError ||
              error instanceof QuoteRiskPropertyTypeNotInsurableError ||
              error instanceof QuoteRiskOccupancyNotInsurableError) {
            throw Boom.badData(error.message)
          }

          throw Boom.internal(error.message)
        }
      }
    },
    {
      method: 'PUT',
      path: '/v0/quotes/{id}',
      options: {
        tags: TAGS,
        description: 'Update a quote',
        validate: {
          params: Joi.object({
            id: Joi.string().min(6).max(12).required().description('Quote id').example('DU6C73X')
          }),
          payload: quotePutRequestBodySchema
        },
        response: {
          status: {
            200: quoteResponseBodySchema,
            400: HttpErrorSchema.badRequestSchema,
            404: HttpErrorSchema.notFoundSchema,
            422: HttpErrorSchema.unprocessableEntitySchema,
            500: HttpErrorSchema.internalServerErrorSchema
          }
        }
      },
      handler: async (request, h) => {
        const updateQuoteCommand: UpdateQuoteCommand = requestToUpdateQuoteCommand(request)

        try {
          const quote = await container.UpdateQuote(updateQuoteCommand)
          const quoteAsResource = quoteToResource(quote)
          return h.response(quoteAsResource).code(200)
        } catch (error) {
          switch (true) {
            case error instanceof QuoteNotFoundError:
              throw Boom.notFound(error.message)
            case error instanceof QuoteRiskPropertyRoomCountNotInsurableError:
            case error instanceof QuoteStartDateConsistencyError:
            case error instanceof QuoteRiskRoommatesNotAllowedError:
            case error instanceof QuoteRiskNumberOfRoommatesError:
            case error instanceof QuoteRiskPropertyTypeNotInsurableError:
            case error instanceof QuoteRiskOccupancyNotInsurableError:
              throw Boom.badData(error.message)
            default:
              throw Boom.internal(error)
          }
        }
      }
    },
    {
      method: 'GET',
      path: '/v0/quotes/{id}',
      options: {
        tags: TAGS,
        description: 'Gets a quote',
        validate: {
          params: Joi.object({
            id: Joi.string().min(6).max(12).required().description('Quote id').example('DU6C73X')
          }),
          headers: commonHeadersSchema
        },
        response: {
          status: {
            200: quoteResponseBodySchema,
            400: HttpErrorSchema.badRequestSchema,
            404: HttpErrorSchema.notFoundSchema,
            500: HttpErrorSchema.internalServerErrorSchema
          }
        }
      },
      handler: async (request, h) => {
        const headers: any = request.headers
        const partnerCode: string = headers['x-consumer-username']
        const query: GetQuoteByIdQuery = { quoteId: request.params.id, partnerCode }

        try {
          const quote = await container.GetQuoteById(query)
          const quoteAsResource = quoteToResource(quote)
          return h.response(quoteAsResource).code(200)
        } catch (error) {
          switch (true) {
            case error instanceof QuoteNotFoundError:
            case error instanceof QuotePartnerOwnershipError:
              throw Boom.notFound(error.message)
            default:
              throw Boom.internal(error)
          }
        }
      }
    }
  ]
}
