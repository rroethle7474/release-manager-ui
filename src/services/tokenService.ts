/**
 * Token service for managing authentication tokens securely
 */

import { AuthResponse } from './auth';

// Storage keys
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const TOKEN_EXPIRATION_KEY = 'auth_token_expiration';
const USER_DATA_KEY = 'auth_user_data';

// User data interface
export interface UserData {
  userId: string;
  organizationId: string;
  organizationName: string;
  email: string;
  firstName: string;
  lastName: string;
}

/**
 * Store authentication data securely
 */
export const storeAuthData = (authResponse: AuthResponse): void => {
  if (typeof window === 'undefined') return;

  // Store tokens
  localStorage.setItem(TOKEN_KEY, authResponse.token);
  localStorage.setItem(REFRESH_TOKEN_KEY, authResponse.refreshToken);
  localStorage.setItem(TOKEN_EXPIRATION_KEY, authResponse.expiration);
  
  // Store user data separately
  const userData: UserData = {
    userId: authResponse.userId,
    organizationId: authResponse.organizationId,
    organizationName: authResponse.organizationName,
    email: authResponse.email,
    firstName: authResponse.firstName,
    lastName: authResponse.lastName,
  };
  
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
};

/**
 * Get the stored authentication token
 */
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Get the stored refresh token
 */
export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Get token expiration date
 */
export const getTokenExpiration = (): Date | null => {
  if (typeof window === 'undefined') return null;
  
  const expirationStr = localStorage.getItem(TOKEN_EXPIRATION_KEY);
  console.log("EXPIRATION", expirationStr)
  console.log("EXPIRATION VALUE", !expirationStr)
  if (!expirationStr) return null;
  
  return new Date(expirationStr);
};

/**
 * Check if the token is expired
 */
export const isTokenExpired = (): boolean => {
  console.log("CHECKING IF TOKEN IS EXPIRED")
  const expiration = getTokenExpiration();
  console.log("EXPIRATION", expiration)
  console.log("EXPIRATION VALUE", !expiration)
  if (!expiration) return true;
  
  // Add a small buffer (30 seconds) to account for network latency
  const buffer = 30 * 1000; // 30 seconds in milliseconds
  return expiration.getTime() - buffer < Date.now();
};

/**
 * Get the stored user data
 */
export const getUserData = (): UserData | null => {
  if (typeof window === 'undefined') return null;
  
  const userDataStr = localStorage.getItem(USER_DATA_KEY);
  if (!userDataStr) return null;
  
  try {
    return JSON.parse(userDataStr) as UserData;
  } catch (error) {
    console.error('Failed to parse user data:', error);
    return null;
  }
};

/**
 * Clear all authentication data
 */
export const clearAuthData = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRATION_KEY);
  localStorage.removeItem(USER_DATA_KEY);
};

/**
 * Get authorization header for API requests
 */
export const getAuthHeader = (): { Authorization: string } | undefined => {
  const token = getToken();
  if (!token) return undefined;
  
  return { Authorization: `Bearer ${token}` };
};
