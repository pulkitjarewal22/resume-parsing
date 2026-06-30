import axios, { type AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../constants';

// --- Axios Instance ---
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Request Interceptor ---
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Request logging
    console.log(
      `%c[API] ${config.method?.toUpperCase()} ${config.url}`,
      'color: #818cf8; font-weight: bold;',
      config.data || ''
    );

    return config;
  },
  (error: AxiosError) => {
    console.error('[API] Request Error:', error);
    return Promise.reject(error);
  }
);

// --- Response Interceptor ---
apiClient.interceptors.response.use(
  (response) => {
    console.log(
      `%c[API] ✓ ${response.status} ${response.config.url}`,
      'color: #10b981; font-weight: bold;'
    );
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Retry logic for 5xx errors
    if (
      error.response &&
      error.response.status >= 500 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      await new Promise((r) => setTimeout(r, 1000));
      return apiClient(originalRequest);
    }

    console.error(
      `%c[API] ✗ ${error.response?.status || 'NETWORK'} ${error.config?.url}`,
      'color: #ef4444; font-weight: bold;',
      error.response?.data || error.message
    );

    return Promise.reject(error);
  }
);

export default apiClient;
