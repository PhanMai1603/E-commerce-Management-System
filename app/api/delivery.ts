import * as Delivery from "@/interface/delivery"

import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';

const DELIVERY_URL = '/delivery';

export const getAllDelivery = async (userId: string, accessToken: string): Promise<Delivery.DeliveriesDataResponse> => {
    try {
        const response = await api.get(`${DELIVERY_URL}/all`,{
            headers: {
                'x-client-id': userId,
                'Authorization': accessToken
            }
        });
        return response.data.metadata; 
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');
        if (errorMessage) {
            toast.error(errorMessage);
        }
        throw new Error(errorMessage || 'An unknown error occurred.');
    }
};

export const createDelivery = async (data: Delivery.DeliveryData, userId: string, accessToken: string): Promise<Delivery.DeliveryDataResponse> => {
    try {
        const response = await api.post(`${DELIVERY_URL}`, data, {
            headers: {
                'x-client-id': userId,
                'Authorization': accessToken
            }
        });
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');

        if (errorMessage) {
            toast.error(errorMessage);
        }
        throw new Error(errorMessage || 'An unknown error occurred.');
    }
};


