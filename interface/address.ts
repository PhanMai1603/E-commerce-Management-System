export interface AddressResponse {
    id: string,
    userId: string,
    name: string,
    phone: string,
    placeId: string,
    street: string,
    ward: string,
    district: string,
    city: string,
    location: {
        lat: string,
        lng: string,
    },
    type: string,
}

export interface Address {
    name: string,
    phone: string,
    street: string,
    ward: string,
    district: string,
    city: string,
}
