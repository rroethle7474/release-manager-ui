import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { getToken, isTokenExpired, getAuthHeader } from './tokenService';
import config from '../config';
import emitter from '../events/loadingEvents';

/**
 * Base API service for making HTTP requests
 */
const api = axios.create({
  baseURL: config.api.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies for session management
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig> => {
    emitter.emit('loading_start');
    const token = getToken();
    if (token && !isTokenExpired()) {
      if (config.headers) {
        const authHeader = getAuthHeader();
        if (authHeader) {
          config.headers['Authorization'] = authHeader.Authorization;
        }
      }
    }
    return config;
  },
  (error: AxiosError) => {
    emitter.emit('loading_end');
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    emitter.emit('loading_end');
    return response;
  },
  (error: AxiosError) => {
    emitter.emit('loading_end');
    // TODO: Handle specific error codes (e.g., 401 for unauthorized)
    return Promise.reject(error);
  }
);

export default api;
