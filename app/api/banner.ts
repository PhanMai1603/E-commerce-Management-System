/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';
import { BannerDetailMetadata, BannerMetadata, BannerRequest, BannerResponseResponse, Status } from "@/interface/banner";

const BANNER_URL = '/banner';

export const getAll = async (
  userId: string,
  accessToken: string,
  position?: "SLIDE" | "FOOTER" | "CATEGORY" // truyền thêm tham số lọc vị trí banner
): Promise<BannerMetadata> => {
  try {
    const params: any = {};
    if (position) params.position = position;

    const response = await api.get(BANNER_URL, {
      headers: {
        "x-client-id": userId,
        Authorization: accessToken,
      },
      params, // axios sẽ tự nối query param vào URL
    });
    return response.data.metadata as BannerMetadata;
  } catch (error: any) {
    const errorMessage = get(error, "response.data.error.message", "");
    if (errorMessage) {
      toast.error(errorMessage);
    }
    throw new Error(errorMessage || "An unknown error occurred.");
  }
};


export const createBanner = async (data: BannerRequest , clientId: string, accessToken: string): Promise<BannerResponseResponse> => {
    try {
        const response = await api.post(`${BANNER_URL}`, data, {
            headers: {
                'x-client-id': clientId,
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

export const publishBanner = async (bannerId: string, userId: string, accessToken: string): Promise<Status> => {
  try {
    const response = await api.patch(`${BANNER_URL}/${bannerId}/publish`, null, {
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

export const unPublishBanner = async (bannerId: string, userId: string, accessToken: string): Promise<Status> => {
  try {
    const response = await api.patch(`${BANNER_URL}/${bannerId}/unpublish`, null, {
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


export const getDetail = async (bannerId: string,userId: string, accessToken: string): Promise<BannerDetailMetadata> => {
    try {
      const response = await api.get(`${BANNER_URL}/${bannerId}`, {
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
