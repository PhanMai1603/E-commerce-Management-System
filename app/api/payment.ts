import * as Payment from "@/interface/payment"
import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';


const Payment_URL = '/payment';

export const getPayment = async (transactionId: string, userId: string, accessToken: string): Promise<Payment.PaymentResponse> => {
  try {
    const response = await api.get(`${Payment_URL}/admin/transactions/${transactionId}`,
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

export const getTransactions = async (userId: string, accessToken: string): Promise<Payment.TransactionResponse> => {
  try {
    const response = await api.get(`${Payment_URL}/admin/transactions`,
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


export const manualRefund = async (data:Payment.Bank ,paymentTransactionId: string, userId: string, accessToken: string): Promise<Payment.ManualRefund> => {
  try {
    const response = await api.post(`${Payment_URL}/manual/${paymentTransactionId}/refund`, data,
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


export const codManualRefund = async (data:Payment.Bank ,orderId: string, userId: string, accessToken: string): Promise<Payment.CODManual> => {
  try {
    const response = await api.post(`${Payment_URL}/cod/${orderId}/manual`, data,
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