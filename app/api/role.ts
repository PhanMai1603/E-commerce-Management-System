import * as Role from "@/interface/role"
import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';

const ROLE_URL ='/role'

export const getAllRole = async (userId: string, accessToken: string, page: number, size: number): Promise<Role.RoleResponse> => {
    try {
        const response = await api.get(`${ROLE_URL}`,{
            headers: {
                'x-client-id': userId,
                'Authorization': accessToken,
              },
              params:{
                page,
                size,
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