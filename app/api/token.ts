import * as Token from '@/interface/token';
import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';

const TOKEN_URL = '/token';

export const getAccessToken = async (userId: string, refreshToken: string): Promise<Token.Token> => {
    try {
        const response = await api.get(`${TOKEN_URL}/refresh-token`, {
            headers: {
                'x-client-id': userId,
                'x-refresh-token': refreshToken
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