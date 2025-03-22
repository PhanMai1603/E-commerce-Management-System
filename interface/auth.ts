/* eslint-disable @typescript-eslint/no-explicit-any */
export interface LoginData {
    email: string;
    password: string;
    deviceToken: string,
    deviceName: string,
}
export interface LoginDataResponse {
    user: {
        id: string;
        email: string;
        name: string;
        avatar: string;
    };
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
}

export interface ForgotPasswordData {
    email: string;  
    isPanel: boolean;
}