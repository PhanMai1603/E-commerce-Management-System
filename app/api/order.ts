import * as Order from "@/interface/order"

import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';

const ORDER_URL = '/order';

export const getAllOrder = async (userId: string,accessToken: string,page: number, size: number): Promise<Order.OrderResponse> => {
  try {
    const response = await api.get(`${ORDER_URL}/all/?page=${page}&size=${size}`, {
      headers: {
        "x-client-id": userId,
        Authorization: accessToken,
      },
    
    });
    return response.data.metadata;
  } catch (error) {
    const errorMessage = get(error, "response.data.error.message", "");
    if (errorMessage) {
      toast.error(errorMessage);
    }
    throw new Error(errorMessage || "An unknown error occurred.");
  }
};

export const getOrderDetail = async (id: string, userId: string,accessToken: string):Promise<Order.OrderMetadata> => {
  try {
    const response = await api.get(`${ORDER_URL}/all/${id}`, {
      headers: {
        "x-client-id": userId,
        Authorization: accessToken,
      },
    });
    return response.data.metadata.orders; // Trả về đúng đối tượng
  } catch (error) {
    const errorMessage = get(error, "response.data.error.message", "");
    if (errorMessage) {
      toast.error(errorMessage);
    }
    throw new Error(errorMessage || "An unknown error occurred.");
  }
};

export const updateOrderStatus = async (id: string, userId: string, accessToken: string) => {
  try {
    const response = await api.patch(`${ORDER_URL}/next-status/${id}`,{
      headers: {
        'x-client-id': userId,
        Authorization: accessToken,
      },
    });
    return response.data.metadata; // Kiểm tra lại dữ liệu trả về
  } catch (error) {
    const errorMessage = get(error, 'response.data.error.message', 'An unknown error occurred.');
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};


