import * as Address from "@/interface/address"

import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';

const ADDRESS_URL = '/address';

export const getDefaultAddress = async (userId: string, accessToken: string): Promise<Address.AddressResponse> => {
    try {
        const response = await api.get(`${ADDRESS_URL}/default`, {
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
}

export const createAddress = async (data: Address.Address, clientId: string, accessToken: string): Promise<Address.AddressResponse[]> => {
    try {
        const response = await api.post(`${ADDRESS_URL}`, data, {
            headers: {
                'x-client-id': clientId,
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
}

export const setDefault = async (id: string, clientId: string, accessToken: string) => {
    try {
        const response = await api.patch(`${ADDRESS_URL}/default/${id}`, null, {
            headers: {
                'x-client-id': clientId,
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
}

export const deleteAddress = async (id: string, clientId: string, accessToken: string) => {
    try {
        const response = await api.delete(`${ADDRESS_URL}/${id}`, {
            headers: {
                'x-client-id': clientId,
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
}