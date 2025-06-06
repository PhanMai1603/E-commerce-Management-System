import * as Refund from "@/interface/refund"
import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';



const REFUND_URL = '/refund';

export const approveRequest = async (refundLogId: string, userId: string, accessToken: string): Promise<Refund.RefundResponse> => {
  try {
    const response = await api.patch(`${REFUND_URL}/${refundLogId}/approve`,
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

export const rejectRequest = async (data: Refund.RejectReason, refundLogId: string, userId: string, accessToken: string): Promise<Refund.RejectReasonResponse> => {
  try {
    const response = await api.patch(`${REFUND_URL}/${refundLogId}/reject`, data,
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

//
export const confirmRequest = async (data:Refund.ConfirmRequest, refundLogId: string, userId: string, accessToken: string): Promise<Refund.RefundResponse> => {
  try {
    const response = await api.post(`${REFUND_URL}/${refundLogId}/confirm`, data,
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

export const getRefund  = async (userId: string, accessToken: string): Promise<Refund.RefundData> => {
  try {
    const response = await api.get(`${REFUND_URL}`,
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

export const getRefundDetail  = async (refundLogId: string, userId: string, accessToken: string): Promise<Refund.RefundDataDetail> => {
  try {
    const response = await api.get(`${REFUND_URL}/${refundLogId}`,
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

