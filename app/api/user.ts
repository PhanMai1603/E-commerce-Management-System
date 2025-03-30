import * as User from "@/interface/user"
import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';

const USER_URL ='/users'

export const getAllUser = async (userId: string, accessToken: string): Promise<User.UserDataResponse> => {
    try {
        const response = await api.get(`${USER_URL}/all`,{
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

export const changePassword = async (data: User.ChangeData ,userId: string, accessToken: string)=> {
    try {
        const response = await api.patch(`${USER_URL}/change-password`,data, {
            headers: {
                'x-client-id': userId,
                'Authorization': accessToken,
              },
        });
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');
        throw new Error(errorMessage || 'An unknown error occurred.');
    }
};


export const blockUser = async (id: string, userId: string, accessToken: string) : Promise<{ status: string }> => {
    try {
      const response = await api.patch(`${USER_URL}/block/${id}`, {}, {
        headers: {
          'x-client-id': userId,
          'Authorization': accessToken,
        },
      });
      return response.data.metadata; 
    } catch (error) {
      const errorMessage = get(error, 'response.data.error.message', '');
      throw new Error(errorMessage || 'An unknown error occurred.');
    }
  };
  
  export const unblockUser = async (id: string, userId: string, accessToken: string) : Promise<{ status: string }> => {
    try {
      const response = await api.patch(`${USER_URL}/unblock/${id}`, {}, {
        headers: {
          'x-client-id': userId,
          'Authorization': accessToken,
        },
      });
      return response.data.metadata;
    } catch (error) {
      const errorMessage = get(error, 'response.data.error.message', '');
      throw new Error(errorMessage || 'An unknown error occurred.');
    }
  };

  export const assignRole = async (roleId: string, id: string, userId: string, accessToken: string): Promise<User.RoleResponse> => {
    try {
      const response = await api.patch(
        `${USER_URL}/assign-role/${id}`,
        {roleId},
        {
          headers: {
            "x-client-id": userId,
            "Authorization": accessToken,
          },
        }
      );
      return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');
        throw new Error(errorMessage || 'An unknown error occurred.');
    }
  };
