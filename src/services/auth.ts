import config from '@/config';
import api from './api';
import { storeAuthData, clearAuthData, getToken, isTokenExpired, getRefreshToken, getUserData } from './tokenService';

/**
 * Authentication response from the API
 */
export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiration: string; // ISO date string
  userId: string; // Guid as string
  organizationId: string; // Guid as string
  email: string;
  firstName: string;
  lastName: string;
  success?: boolean; // Added for client-side error handling
  message?: string; // Added for client-side error handling
}

/**
 * Registration request data
 */
export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  organizationName: string;
  timeZone: string;
  [key: string]: unknown;
}

/**
 * Registration response from the API
 */
export interface RegisterResponse {
  success: boolean;
  message?: string;
}

/**
 * Authentication service for handling login/logout operations
 */
export const authService = {
  /**
   * Login with email and password
   */
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      console.log("LOGIN ATTEMPT", email, password)
      console.log("API URL", config.api.baseUrl)
      const response = await api.post<AuthResponse>('/auth/login', { email, password });
      
      // Store the authentication data
      if (response.token) {
        storeAuthData(response);
        return { ...response, success: true };
      }
      
      return { 
        ...response, 
        success: false, 
        message: 'Invalid response from server' 
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        token: '',
        refreshToken: '',
        expiration: '',
        userId: '',
        organizationId: '',
        email: '',
        firstName: '',
        lastName: '',
        success: false,
        message: error instanceof Error ? error.message : 'Login failed',
      };
    }
  },

  /**
   * Register a new user
   */
  register: async (registerData: RegisterRequest): Promise<RegisterResponse> => {
    try {
      const response = await api.post<RegisterResponse>('/auth/register', registerData);
      return { 
        ...response,
        success: true 
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed',
      };
    }
  },

  /**
   * Logout the current user
   */
  logout: async (): Promise<void> => {
    try {
      // Call logout endpoint if needed
      await api.post<{ success: boolean }>('/auth/logout', {});
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local auth data regardless of API response
      clearAuthData();
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    const token = getToken();
    return !!token && !isTokenExpired();
  },

  /**
   * Refresh the authentication token
   */
  refreshToken: async (): Promise<boolean> => {
    const refreshToken = getRefreshToken();
    
    if (!refreshToken) {
      return false;
    }
    
    try {
      const response = await api.post<AuthResponse>('/auth/refresh', { refreshToken });
      
      if (response.token) {
        storeAuthData(response);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  },

  /**
   * Get the current user data
   */
  getCurrentUser: () => {
    return getUserData();
  }
};

// Export register function for direct use
export const registerUser = authService.register;
