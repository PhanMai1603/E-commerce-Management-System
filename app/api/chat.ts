import * as Chat from "@/interface/chat"

import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';

const CHAT_URL = '/chats';

export const getAllConversations = async (userId: string, accessToken: string): Promise<Chat.getAllConversations> => {
    try {
        const response = await api.get(`${CHAT_URL}/conversations`, {
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


export const getMessage = async (conversationId: string,userId: string, accessToken: string): Promise<Chat.getMessage> => {
    try {
        const response = await api.get(`${CHAT_URL}/conversations/${conversationId}`, {
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


export const postMessage = async (data: Chat.PostMessage, conversationId: string,userId: string, accessToken: string): Promise<Chat.PostMessage> => {
    try {
        const response = await api.post(`${CHAT_URL}/conversations/${conversationId}`, data, {
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

export const postUpdate = async (data: Chat.PostMessage, conversationId: string,userId: string, accessToken: string): Promise<Chat.PostMessage> => {
    try {
        const response = await api.post(`${CHAT_URL}/conversations/${conversationId}`, data, {
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


export const updateSeen = async (conversationId: string, userId: string, accessToken: string) : Promise<Chat.Seen> => {
  try {
    const response = await api.put(`/conversations/${conversationId}/seen`,
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



