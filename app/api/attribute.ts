import * as Attribute from "@/interface/attribute"

import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';

const ATTRIBUTE_URL = '/attributes';

export const getAllAttributes = async (userId: string, accessToken: string): Promise<Attribute.AllAttributeResponse> => {
    try {
        const response = await api.get(`${ATTRIBUTE_URL}/all`,{
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

export const createAttribute = async (userId: string, accessToken: string, data: Attribute.AttributeData): Promise<Attribute.AttributeResponse> => {
    try {
       const response = await api.post(`${ATTRIBUTE_URL}/`, data, {
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

export const addValueToAttribute = async (userId: string, accessToken: string, data: Attribute.addValueToAttribute): Promise<Attribute.addValueToAttributeResponse> => {
    try {
        const response = await api.post(`${ATTRIBUTE_URL}/values`, data, {
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