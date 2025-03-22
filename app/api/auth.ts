import * as Auth from "@/interface/auth"

import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';

const AUTH_URL = '/auth';

export const loginRequest = async (data: Auth.LoginData): Promise<Auth.LoginDataResponse> => {
    try {
        const response = await api.post(`${AUTH_URL}/login`, data);
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');
        if (errorMessage) {
            toast.error(errorMessage);
        }
        throw new Error(errorMessage || 'An unknown error occurred.');
    }
};

export const checkAdmin = async (userId: string, accessToken: string) => {
    try {
        const response = await api.get(`${AUTH_URL}/admin-panel`, {
            headers: {
                'x-client-id': userId,
                'Authorization': accessToken,
            },
        });
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', 'An unknown error occurred.');
        toast.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const forgotPassword = async (data: Auth.ForgotPasswordData) => {
    try {
        const response = await api.post(`${AUTH_URL}/forgot-password`, data, {
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

export const resetPassword = async (data: Auth.ResetPasswordData) => {
    try {
        const response = await api.post(`${AUTH_URL}/reset-password`, data);
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');
        if (errorMessage) {
            toast.error(errorMessage);
        }
        throw new Error(errorMessage || 'An unknown error occurred.');
    }
};


export const logoutRequest = async (userId: string, accessToken: string) => {
    try {
        const response = await api.post(`${AUTH_URL}/logout`, null, {
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

export const uploadAvatar = async (
    data: Auth.UploadAvatar,
    userId: string,
    accessToken: string
  ): Promise<Auth.UploadAvatarResponse> => {
    try {
      const formData = new FormData();
      if (data.file) {
        formData.append("avatar", data.file);
      }
  
      const response = await api.patch(`${AUTH_URL}/avatar`, formData, {
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