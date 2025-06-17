import * as Inventory from "@/interface/inventory"

import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';

const INVENTORY_URL = '/inventory';

export const getInvventory = async (userId: string, accessToken: string): Promise<Inventory.InventoryResponse> => {
    try {
        const response = await api.get(`${INVENTORY_URL}`, {
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

export const getDetailInvventory = async (inventoryKey: string, userId: string, accessToken: string): Promise<Inventory.InventoryDetailResponse> => {
    try {
        const response = await api.get(`${INVENTORY_URL}/${inventoryKey}`, {
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

export const importStock = async (data: Inventory.ImportRequest, userId: string, accessToken: string): Promise<Inventory.ImportResponse> => {
  try {
    const response = await api.post(`${INVENTORY_URL}/import-stock`, data, {
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
