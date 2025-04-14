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

export const createProduct = async (data: Product.ProductData, userId: string, accessToken: string): Promise<Product.ProductDataResponse> => {
  try {
    const response = await api.post(`${PRODUCT_URL}/`, data, {
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

export const publishProduct = async (id: string, userId: string, accessToken: string): Promise<Product.PublishProductResponse> => {
  try {
    const response = await api.patch(`${PRODUCT_URL}/publish/${id}`, null, {
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

export const unPublishProduct = async (id: string, userId: string, accessToken: string): Promise<Product.PublishProductResponse> => {
  try {
    const response = await api.patch(`${PRODUCT_URL}/unpublish/${id}`, null, {
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


export const deleteProduct = async (id: string, userId: string, accessToken: string) => {
  try {
      const response = await api.delete(`${PRODUCT_URL}/${id}`,{
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

export const getProductDetail = async (id: string, userId: string, accessToken: string): Promise<Product.ProductDetailResponse> => {
  try {
    const response = await api.get(`${PRODUCT_URL}/${id}`, {
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


export const updateProduct = async ( product: Product.ProductDetail, userId: string,accessToken: string): Promise<Product.ProductUpdateResponse> => {
  try {
    const payload = {
      productKey: product.code,
      name: product.name,
      description: product.description,
      originalPrice: product.originalPrice,
      attribute: product.attributes,
      variants: product.variants,
      returnDays: product.returnDays,
      quantity: product.quantity,
      discountType: product.discountType,
      discountValue: product.discountValue,
      discountStart: product.discountStart || undefined,
      discountEnd: product.discountEnd || undefined,
      variantAttributes: product.variantAttributes,
      skulist: product.skuList,
    };

    const response = await api.patch(`${PRODUCT_URL}`, payload, {
      headers: {
        'x-client-id': userId,
        'Authorization': accessToken,
      },
    });

    return response.data.metadata;
  } catch (error) {
    const errorMessage = get(error, 'response.data.error.message', '');
    if (errorMessage) toast.error(errorMessage);
    throw new Error(errorMessage || 'Đã có lỗi xảy ra khi cập nhật sản phẩm.');
  }
};

export const importProduct = async (data: Product.ImportProductData, userId: string, accessToken: string): Promise<Product.ImportProductResponse> => {
  try {
    const response = await api.patch(`${PRODUCT_URL}/update-quantity`, data,
      {
        headers: {
          'x-client-id': userId,
          'Authorization': accessToken
        }
      }
    );
      return response.data.metadata;; // Indicating successful update
  } catch (error) {
    // Detailed error handling
    const errorMessage = get(error, 'response.data.error.message', 'An unknown error occurred.');
    toast.error(errorMessage);
    throw new Error(errorMessage); // Propagate the error for further handling
  }
};
