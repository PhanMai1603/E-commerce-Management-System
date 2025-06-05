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
