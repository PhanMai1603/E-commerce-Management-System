import * as   Product from "@/interface/product"

import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';

const PRODUCT_URL = '/products'

export const getAllProduct = async (userId: string, accessToken: string, page: number, size: number): Promise<Product.ProductResponse> => {
    try {
      const response = await api.get(`${PRODUCT_URL}/?page=${page}&size=${size}`, {
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