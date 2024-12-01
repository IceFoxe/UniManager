import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Interface for decoded token
interface DecodedToken {
  exp?: number;
  [key: string]: any;
}

// Function to check if token is valid
export const isTokenValid = (token?: string | null): boolean => {
  if (!token) return false;

  try {
    // Manual token parsing (base64 decode)
    const [, payloadBase64] = token.split('.');
    if (!payloadBase64) return false;

    // Decode base64 payload
    const payload = JSON.parse(
      decodeURIComponent(
        atob(payloadBase64.replace('-', '+').replace('_', '/'))
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
    ) as DecodedToken;

    // Check expiration
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

// Protected Route Component
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('authToken'); // Adjust storage method as needed

  // If no token or invalid token, redirect to login
  if (!isTokenValid(token)) {
    return <Navigate
      to="/login"
      state={{ from: location }}
      replace
    />;
  }

  // If token is valid, render the children
  return <>{children}</>;
};

// Custom Hook for Authentication
export const useAuth = () => {
  const token = localStorage.getItem('token');

  return {
    isAuthenticated: isTokenValid(token),
    token,
    login: (newToken: string) => {
      localStorage.setItem('token', newToken);
    },
    logout: () => {
      localStorage.removeItem('token');
    }
  };
};

// Axios Interceptor for automatic token handling (optional)
import axios from 'axios';

export const setupAuthInterceptor = () => {
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
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
      // If unauthorized, redirect to login
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};