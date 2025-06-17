import * as Coupon from "@/interface/coupon";
import { toast } from "react-toastify";
import api from "./index";
import get from "lodash/get";

const COUPON_URL = "/coupon";

export const getAllCoupons = async (userId: string, accessToken: string, page: number, size: number): Promise<Coupon.getAllCouponsResponse> => {
    try {
      const response = await api.get(`${COUPON_URL}/all?page=${page}&size=${size}`, {
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

  export const createCoupon = async (data: Coupon.CouponData, userId: string, accessToken: string): Promise<Coupon.CouponDataResponse> => {
    try {
        const response = await api.post(`${COUPON_URL}`, data, {
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


export const getDetailCoupons = async (couponKey: string,userId: string, accessToken: string, page: number, size:number): Promise<Coupon.GetCouponResponse> => {
    try {
      const response = await api.get(`${COUPON_URL}/${couponKey}?page=${page}&size=${size}`, {
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
