import { OffersRepository } from "../domain/offers-repository";
import { Offer } from "../domain/offer";

export class OffersRepositoryImpl implements OffersRepository {
  constructor() {}

  private offers: Offer[] = [
    {
      id: "27259FC9-C1CC-4A1F-BFED-1D144B00C6D6",
      title: "Appartement cozy dans le Nord",
      description:
        "Dans très belle campagne, chambre de 15 m2 expo sud dans maison contemporaine très lumineuse. Tout confort. Wifi et décodeur tv orange.(fibre). Avec jardin et terrasse , parking clôture . Voiture recommandée car peu de transports en commun. 15 minutes de Lille en voiture.",
      price: 523,
      address: {
        city: "Villeneuve",
        street: "15 rue Saint Joseph",
        postal_code: "59009",
      },
    },
    {
      id: "C23C652F-596A-45A4-8890-2C8EC094EC9D",
      title: "Chambre ideal Etudiant",
      description:
        "Très beau petit Appart avec Mezzanine (chambre) et haut plafond. Dans Le beau quartier Mazarin, à 3mn à pied du cours Mirabeau agréable pour petits et longs séjours. Peut accueillir jusqu'à 2 personnes.Cuisine toute équipée.",
      price: 1215,
      address: {
        city: "Aix-en-Provence",
        street: "42 rue Mazarin",
        postal_code: "13001",
      },
    },
  ];

  getAll(): Offer[] {
    return this.offers;
  }

  get(offerId: string): Offer {
    const offerFounded = this.offers.find(offer => offer.id === offerId);
    if (offerFounded === undefined) throw new Error("Offer not found");
    
    return offerFounded;
  }

  create(newOffer: Offer): void {
    this.offers.push(newOffer);
  }
}
