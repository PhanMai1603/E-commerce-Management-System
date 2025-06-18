/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';
import { BannerMetadata } from "@/interface/banner";

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
