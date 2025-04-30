import * as Variant from "@/interface/variant"

import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';

const VARIANT_URL = '/variants'

export const publishVariant = async (id: string, userId: string, accessToken: string): Promise<Variant.PublishVariantResponse> => {
  try {
    const response = await api.patch(`${VARIANT_URL}/public/${id}`, null, {
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

export const unPublishVariant = async (id: string, userId: string, accessToken: string): Promise<Variant.PublishVariantResponse> => {
  try {
    const response = await api.patch(`${VARIANT_URL}/unpublic/${id}`, null, {
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

export const publishAllVariant = async (id: string, userId: string, accessToken: string): Promise<Variant.PublishAllVariantResponse> => {
  try {
    const response = await api.patch(`${VARIANT_URL}/product/public/${id}`, null, {
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

export const unPublishAllVariant = async (id: string, userId: string, accessToken: string): Promise<Variant.PublishAllVariantResponse> => {
  try {
    const response = await api.patch(`${VARIANT_URL}/product/unpublic/${id}`, null, {
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