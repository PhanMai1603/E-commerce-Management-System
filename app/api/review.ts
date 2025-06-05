import * as Review from "@/interface/review";
import { toast } from "react-toastify";
import api from "./index";
import get from "lodash/get";

const REVIEW_URL = "/review";

export const getAllReview = async (userId: string, accessToken: string): Promise<Review.ReviewResponse> => {
    try {
        const response = await api.get(`${REVIEW_URL}/unreplied`, {
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

export const getUnreplied = async (userId: string, accessToken: string): Promise<Review.ReviewResponse> => {
    try {
        const response = await api.get(`${REVIEW_URL}/unreplied?isReplied=false`, {
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

export const getReplied = async (userId: string, accessToken: string): Promise<Review.ReviewResponse> => {
    try {
        const response = await api.get(`${REVIEW_URL}/unreplied?isReplied=true`, {
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

export const getReviewDetail = async (reviewId: string, userId: string, accessToken: string): Promise<Review.ReviewDataResponse> => {
    try {
        const response = await api.get(`${REVIEW_URL}/${reviewId}`, {
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


export const replyReview = async (reviewId: string, userId: string, accessToken: string, content: string): Promise<Review.ReplyResponse> => {
    try {
        const response = await api.post(`${REVIEW_URL}/${reviewId}/reply`, { content }, {
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



export const hideReview= async (reviewId: string, userId: string, accessToken: string): Promise<Review.HideReview> => {
    try {
        const response = await api.put(`${REVIEW_URL}/${reviewId}/hide`,{},{
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
