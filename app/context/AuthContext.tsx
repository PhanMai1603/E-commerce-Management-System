'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
    isLogin: boolean;
    setIsLogin: (value: boolean) => void;
    checkAccessToken: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLogin, setIsLogin] = useState<boolean>(false);

    
    const checkAccessToken = () => {
        const token = localStorage.getItem('accessToken');
        const timestamp = localStorage.getItem('tokenTimestamp');

        if (!token || !timestamp) return false;

        const currentTime = new Date().getTime();
        const oneDayInMillis = 24 * 60 * 60 * 1000;

        if (currentTime - Number(timestamp) > oneDayInMillis) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userId');
            localStorage.removeItem('tokenTimestamp');
            localStorage.removeItem('isLogin');
            return false;
        }

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiryTime = payload.exp * 1000;
            return Date.now() < expiryTime;
        } catch {
            return false;
        }
    };

    useEffect(() => {
        setIsLogin(checkAccessToken());
    }, []);

    return (
        <AuthContext.Provider value={{ isLogin, setIsLogin, checkAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};