import * as Role from "@/interface/role"
import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';
import { RoleData } from "@/interface/role";

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

export const createRole = async (data: RoleData, userId: string, accessToken: string): Promise<Role.RoleDetailResponse> => {
    try {
      const response = await api.post(`${ROLE_URL}`, data, {
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

  export const getRoleDetail = async (id: string, userId: string, accessToken: string): Promise<Role.RoleDetailResponse> => {
    try {
      const response = await api.get(`${ROLE_URL}/${id}`, {
        headers: {
          'x-client-id': userId,
          'Authorization': accessToken,
        },
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

  export const deleteRole = async (id: string, userId: string, accessToken: string) => {
    try {
        const response = await api.delete(`${ROLE_URL}/${id}`,{
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

export const updateRole = async (id: string, data: RoleData ,userId: string, accessToken: string): Promise<Role.RoleDetailResponse> => {
    try {
      const response = await api.put(`${ROLE_URL}/${id}`,data,{ // Use 'name' as part of the URL
        headers: {
          'x-client-id': userId,
          'Authorization': accessToken,
        },
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