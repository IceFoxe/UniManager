import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface DecodedToken {
  exp?: number;
  [key: string]: any;
}

export const isTokenValid = (token?: string | null): boolean => {
  if (!token) return false;

  try {
    const [, payloadBase64] = token.split('.');
    if (!payloadBase64) return false;

    const payload = JSON.parse(
      decodeURIComponent(
        atob(payloadBase64.replace('-', '+').replace('_', '/'))
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
    ) as DecodedToken;

    if (payload.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    }

    return true;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('authToken'); // Adjust storage method as needed

  if (!isTokenValid(token)) {
    return <Navigate
      to="/login"
      state={{ from: location }}
      replace
    />;
  }

  return <>{children}</>;
};

export const useAuth = () => {
  const token = localStorage.getItem('authToken');

  return {
    isAuthenticated: isTokenValid(token),
    token,
    login: (newToken: string) => {
      localStorage.setItem('authToken', newToken);
    },
    logout: () => {
      localStorage.removeItem('authToken');
    }
  };
};

import axios from 'axios';

export const setupAuthInterceptor = () => {
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};