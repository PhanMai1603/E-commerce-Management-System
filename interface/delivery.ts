export interface DeliveriesData{
    id: string;
    name: string;
    description: string;
    isActive: boolean;
}

export interface DeliveriesDataResponse{
    deliveries:DeliveriesData[];
}
