export interface Offer {
    id: string
    title: string
    description: string
    price: number
    address: {
        city: string
        street: string
        postal_code: string
    }
}
