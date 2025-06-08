import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';

const UPLOAD_URL = '/uploads'

export const uploadProductImage = async (data: File, userId: string, accessToken: string): Promise<string> => {
    try {
        const formData = new FormData();
        if (data) {
            formData.append("products", data);
        }

        const response = await api.post(`${UPLOAD_URL}/products`, formData, {
            headers: {
                "x-client-id": userId,
                Authorization: accessToken,
            },
        });

        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, "response.data.error.message", "Unknown error occurred.");
        toast.error(errorMessage);
        throw new Error(errorMessage);
    }
};


export const deleteProductImage = async (url: string, userId: string, accessToken: string) => {
    try {
        const response = await api.delete(`${UPLOAD_URL}/products`, {
            headers: {
                'x-client-id': userId,
                'Authorization': accessToken
            },
            data: {
                imageUrl: url,
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


export const uploadTransfer = async (data: File, userId: string, accessToken: string): Promise<string> => {
    try {
        const formData = new FormData();
        if (data) {
            formData.append("transfer", data);
        }

        const response = await api.post(`${UPLOAD_URL}/transfers`, formData, {
            headers: {
                "x-client-id": userId,
                Authorization: accessToken,
            },
        });

        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, "response.data.error.message", "Unknown error occurred.");
        toast.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const uploadReviewImage = async (data: File, userId: string, accessToken: string): Promise<string> => {
    try {
        const formData = new FormData();
        if (data) {
            formData.append("review", data);
        }

        const response = await api.patch(`${UPLOAD_URL}/reviews`, formData, {
            headers: {
                "x-client-id": userId,
                Authorization: accessToken,
            },
        });

        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, "response.data.error.message", "Unknown error occurred.");
        toast.error(errorMessage);
        throw new Error(errorMessage);
    }
};