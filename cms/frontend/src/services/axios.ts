import axios from 'axios';
import { store } from '../store/store';
import { logout } from '../store/authSlice';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';

// Track if we're already redirecting to prevent multiple 401s from causing a loop
let isRedirectingToLogin = false;

// Create axios instance
export const axiosApi = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
axiosApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
axiosApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isRedirectingToLogin) {
      isRedirectingToLogin = true;
      // Clean up auth state through Redux (which also clears localStorage)
      store.dispatch(logout());
      // Use a small delay to let React re-render via ProtectedRoute redirect
      // instead of a hard window.location reload
      setTimeout(() => {
        isRedirectingToLogin = false;
      }, 1000);
    }
    return Promise.reject(error);
  }
);