import config from '@/config';
import { getToken, isTokenExpired, getAuthHeader } from './tokenService';

/**
 * Base API service for making HTTP requests
 */
export const api = {
  /**
   * Make a GET request to the API
   */
  get: async <T>(endpoint: string): Promise<T> => {
    // Check if token is expired
    if (getToken() && isTokenExpired()) {
      // Token is expired, we should handle refresh here
      // This could be implemented with a refreshToken function
      // For now, we'll just throw an error
      throw new Error('Authentication token expired');
    }

    // Get auth header if available
    const authHeader = getAuthHeader();
    
    const response = await fetch(`${config.api.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader || {}),
      },
      credentials: 'include', // Include cookies for session management
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  },

  /**
   * Make a POST request to the API
   */
  post: async <T, D = Record<string, unknown>>(endpoint: string, data: D): Promise<T> => {
    // Check if token is expired (except for auth endpoints)
    if (!endpoint.includes('/auth/login') && !endpoint.includes('/auth/register') && !endpoint.includes('/auth/refresh') && 
        getToken() && isTokenExpired()) {
      // Token is expired, we should handle refresh here
      // This could be implemented with a refreshToken function
      // For now, we'll just throw an error
      throw new Error('Authentication token expired');
    }

    // Get auth header if available and not an auth endpoint that doesn't require authentication
    const authHeader = !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register') 
      ? getAuthHeader() 
      : undefined;
    
    const response = await fetch(`${config.api.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader || {}),
      },
      body: JSON.stringify(data),
      credentials: 'include', // Include cookies for session management
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  },
};
