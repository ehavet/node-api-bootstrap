import { Offer } from "./offer";
import { OffersRepository } from "./offers-repository";
const { 
  v4: uuidv4,
} = require('uuid');

export interface CreateOffer {
  (
    title: string,
    description: string,
    price: number,
    city: string,
    street: string,
    postal_code: string
  ): Offer;
}

export namespace CreateOfferUsecaseFactory {
  export function factory(offersRepository: OffersRepository): CreateOffer {
    return (
      title: string,
      description: string,
      price: number,
      city: string,
      street: string,
      postal_code: string
    ) => {
      const newOffer = new Offer(
        uuidv4(),
        title,
        description,
        price,
        city,
        street,
        postal_code
      );
      offersRepository.create(newOffer);

      return newOffer;
    };
  }
}
