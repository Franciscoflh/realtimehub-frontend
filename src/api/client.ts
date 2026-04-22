import axios from 'axios';
import { API_BASE_URL } from '@/utils/constants';
import { clearStoredToken, getStoredToken } from '@/utils/token';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearStoredToken();
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }

    return Promise.reject(error);
  },
);
