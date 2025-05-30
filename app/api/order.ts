import * as Order from "@/interface/order"

import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';

const ORDER_URL = '/order';

export const getAllOrder = async (userId: string,accessToken: string): Promise<Order.OrderResponse> => {
  try {
    const response = await api.get(`${ORDER_URL}/`, {
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

export const getOrderDetail = async (id: string, userId: string, accessToken: string):Promise<Order.OrderMetaResponse> => {
  try {
    const response = await api.get(`${ORDER_URL}/${id}`, {
      headers: {
        "x-client-id": userId,
        Authorization: accessToken,
      },
    });
    return response.data.metadata ;// Trả về đúng đối tượng
  } catch (error) {
    const errorMessage = get(error, "response.data.error.message", "");
    if (errorMessage) {
      toast.error(errorMessage);  
    }
    throw new Error(errorMessage || "An unknown error occurred.");
  }
};

export const updateOrderStatus = async (orderId: string, userId: string, accessToken: string) => {
  try {
    const response = await api.patch(
      `/order/${orderId}/status`, {},
      {
        headers: {
          "x-client-id": userId,
          Authorization: accessToken,
        },
      }
    );
    return response.data.metadata;
  } catch (error) {
    const errorMessage = get(error, "response.data.error.message", "");
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};
