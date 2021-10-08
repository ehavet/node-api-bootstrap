export class Offer {
  public id: string;
  public title: string;
  public description: string;
  public price: number;
  public address: {
    city: string;
    street: string;
    postal_code: string;
  };

  constructor(
    id: string,
    title: string,
    description: string,
    price: number,
    city: string,
    street: string,
    postal_code: string
  ) {
    if (
      id === null ||
      title === null ||
      description === null ||
      price === null ||
      city === null ||
      street === null ||
      postal_code === null
    ) {
      throw new Error("Offer is invalid");
    }
    this.id = id;
    this.title = title;
    this.description = description;
    this.price = price;
    this.address = {
      city,
      street,
      postal_code,
    };
  }
}
