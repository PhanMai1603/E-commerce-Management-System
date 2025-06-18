import * as Statistics from '@/interface/statistics';
import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';


const STATISTICS_URL = '/statistics'

export const getSale = async (userId: string, accessToken: string): Promise<Statistics.Sales> => {
  try {
    const response = await api.get(`${STATISTICS_URL}/count`, {
      headers: {
        'x-client-id': userId,
        'Authorization': accessToken,
      },
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


export const getOrderRecords = async (userId: string, accessToken: string): Promise<Statistics.OrderRecords> => {
  try {
    const response = await api.get(`${STATISTICS_URL}/basic`, {
      headers: {
        'x-client-id': userId,
        'Authorization': accessToken,
      },
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



export const getBestSeller = async (userId: string, accessToken: string): Promise<Statistics.BestSellerMetadata> => {
  try {
    const response = await api.get(`${STATISTICS_URL}/products/top-selling`, {
      headers: {
        'x-client-id': userId,
        'Authorization': accessToken,
      },
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

///chua lam
export const getReturn = async (userId: string, accessToken: string): Promise<Statistics.ReturnRateMetadata> => {
  try {
    const response = await api.get(`${STATISTICS_URL}/orders/return-rate`, {
      headers: {
        'x-client-id': userId,
        'Authorization': accessToken,
      },
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

export const getReview = async (userId: string, accessToken: string, startDate: string,
  endDate: string): Promise<Statistics.ReviewStatisticsMetadata> => {
  try {
    const response = await api.get(`${STATISTICS_URL}/reviews?startDate=${startDate}&endDate=${endDate}`, {
      headers: {
        'x-client-id': userId,
        'Authorization': accessToken,
      },
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

export const getCategory = async (
  userId: string,
  accessToken: string,
  startDate: string,
  endDate: string
): Promise<Statistics.CategoryRevenue[]> => {
  try {
    const response = await api.get(`${STATISTICS_URL}/revenue/category?startDate=${startDate}&endDate=${endDate}`, {
      headers: {
        'x-client-id': userId,
        'Authorization': accessToken,
      },
    });

    return response.data.metadata; // metadata là mảng
  } catch (error) {
    const errorMessage = get(error, 'response.data.error.message', '');
    if (errorMessage) {
      toast.error(errorMessage);
    }
    throw new Error(errorMessage || 'An unknown error occurred.');
  }
};

export const getTrend = async (
  userId: string,
  accessToken: string,
  startDate: string,
  endDate: string,
  groupBy: "day" | "week" | "month" = "day"
): Promise<Statistics.DoanhThu[]> => {
  try {
    const response = await api.get(
      `${STATISTICS_URL}/revenue/trend?startDate=${startDate}&endDate=${endDate}&groupBy=${groupBy}`,
      {
        headers: {
          'x-client-id': userId,
          Authorization: accessToken,
        },
      }
    );

    return response.data.metadata;
  } catch (error) {
    const errorMessage = get(error, 'response.data.error.message', '');
    if (errorMessage) toast.error(errorMessage);
    throw new Error(errorMessage || 'An unknown error occurred.');
  }
};
