import { Container } from "../../../container";
import { ServerRoute } from "@hapi/hapi";
import * as Boom from "@hapi/boom";
import { Offer } from "../../domain/offer";
import Joi from "joi";
import { OfferInputApi } from "./offer.input-api";

export default function (container: Container): Array<ServerRoute> {
  return [
    {
      method: "GET",
      path: "/offers",
      options: {
        description: "return offers",
      },
      handler: async (_request, h) => {
        try {
          const offers: Offer[] = await container.GetOffers();
          return h.response({ offers }).code(200);
        } catch (error: any) {
          throw Boom.internal(error);
        }
      },
    },
    {
      method: "GET",
      path: "/offers/{id}",
      options: {
        description: "return an offer resource",
      },
      handler: async (_request, h) => {
        try {
          const offerId = _request.params.id;
          const offer: Offer = await container.GetOffer(offerId);
          return h.response(offer).code(200);
        } catch (error: any) {
          throw Boom.internal(error);
        }
      },
    },
    {
      method: "GET",
      path: "/offers/search",
      options: {
        description: "return an offer resource",
        validate: {
          query: {
            q: Joi.string().required(),
          }
        }
      },
      handler: async (_request, h) => {
        try {
          const searchQuery = _request.query.q;
          const offers: Offer[] = await container.SearchOffers(searchQuery);
          return h.response({ offers }).code(200);
        } catch (error: any) {
          throw Boom.internal(error);
        }
      },
    },
    {
      method: "POST",
      path: "/offers",
      options: {
        description: "create an offer resource",
        validate: {
          payload: Joi.object({
              title: Joi.string().required(),
              description: Joi.string().required(),
              price: Joi.number().required(),
              city: Joi.string().required(),
              street: Joi.string().required(),
              postal_code: Joi.string().required(),
          })
      }
      },
      handler: async (_request, h) => {
        try {
          const payload = _request.payload as OfferInputApi;
          const offer: Offer = await container.CreateOffer(
            payload.title,
            payload.description,
            payload.price,
            payload.city,
            payload.street,
            payload.postal_code
          );
          return h.response(offer).code(201);
        } catch (error: any) {
          throw Boom.internal(error);
        }
      },
    },
  ];
}
