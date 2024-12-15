import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';

interface DecodedToken {
  exp: number;
  role: string;
}
interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
type UserRole = 'employee' | 'professor' | 'student';
type RouteSection = 'e' | 'a' | 'k' | 's' | 'p' | 'd';

const decodeToken = (token: string): DecodedToken | null => {
  try {
    if (!token || typeof token !== 'string') {
      console.error('Invalid token format');
      return null;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid token structure');
      return null;
    }

    const base64Url = parts[1];
    if (!base64Url) {
      console.error('Missing payload section');
      return null;
    }

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    return payload as DecodedToken;
  } catch (error) {
    console.error('Token decoding error:', error);
    return null;
  }
};

export const isTokenValid = (token?: string | null): boolean => {
  if (!token) return false;

  const decoded = decodeToken(token);
  if (!decoded) return false;

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp > currentTime;
};

// Route definitions
const ROUTES = {
  defaultRoutes: {
    employee: '/panel_uzytkownika/e/overview',
    professor: '/panel_uzytkownika/p/overview',
    student: '/panel_uzytkownika/d/overview'
  },
  allowedSections: {
    employee: ['e', 'a', 'k', 's'] as RouteSection[],
    professor: ['p', 'k', 's'] as RouteSection[],
    student: ['d', 'k', 's'] as RouteSection[]
  }
} as const;

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('authToken');
  if (!token || !isTokenValid(token)) {
    localStorage.removeItem('authToken');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const decoded = decodeToken(token);
  if (!decoded) {
    localStorage.removeItem('authToken');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = decoded.role.toLowerCase() as UserRole;
  const section = location.pathname.split('/')[2] as RouteSection;

  const userAllowedSections = ROUTES.allowedSections[userRole] || [];

  if (!section || !userAllowedSections.includes(section as RouteSection)) {
    const defaultRoute = ROUTES.defaultRoutes[userRole];
    return <Navigate to={defaultRoute} replace />;
  }

  return <>{children}</>;
};

export const useAuth = () => {
  return {
    isAuthenticated: isTokenValid(localStorage.getItem('authToken')),
    login: (tokens: AuthTokens) => {
      localStorage.setItem('authToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
    },
    logout: () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
    }
  };
};

export const setupAuthInterceptor = () => {
  let isRefreshing = false;
  let failedQueue: any[] = [];

  const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    failedQueue = [];
  };

  axios.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        // Check if token will expire in the next 5 minutes
        const tokenExp = decoded.exp;
        const currentTime = Math.floor(Date.now() / 1000);

        if (tokenExp - currentTime < 300 && !isRefreshing) { // 5 minutes
          isRefreshing = true;

          try {
            const newTokens = await refreshTokens();
            localStorage.setItem('authToken', newTokens.accessToken);
            localStorage.setItem('refreshToken', newTokens.refreshToken);
            config.headers['Authorization'] = `Bearer ${newTokens.accessToken}`;
            processQueue(null, newTokens.accessToken);
          } catch (error) {
            processQueue(error, null);
            throw error;
          } finally {
            isRefreshing = false;
          }
        } else {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      }
    }
    return config;
  });

  axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
                .then(token => {
                  originalRequest.headers['Authorization'] = `Bearer ${token}`;
                  return axios(originalRequest);
                })
                .catch(err => Promise.reject(err));
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            const newTokens = await refreshTokens();
            localStorage.setItem('authToken', newTokens.accessToken);
            localStorage.setItem('refreshToken', newTokens.refreshToken);
            axios.defaults.headers.common['Authorization'] = `Bearer ${newTokens.accessToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
  );
};

const refreshTokens = async (): Promise<AuthTokens> => {
  const refreshToken = localStorage.getItem('refreshToken');

  try {
    const response = await axios.post('/api/auth/refresh', { refreshToken });
    return response.data;
  } catch (error) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
    throw error;
  }
};