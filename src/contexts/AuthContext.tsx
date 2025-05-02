'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, AuthResponse } from '@/services/auth';
import { getUserData, UserData, isTokenExpired, getToken } from '@/services/tokenService';
import emitter from '@/events/loadingEvents'; // Import the event emitter

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already authenticated using token service
    const checkAuthStatus = async () => {
      try {
        // Check if token exists and is valid
        const token = getToken();
        if (token && !isTokenExpired()) {
          // Get user data from token service
          const userData = getUserData();
          if (userData) {
            setUser(userData);
          }
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setError('Failed to verify authentication status');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();

    // Event listeners for loading state
    const handleLoadingStart = () => setIsLoading(true);
    const handleLoadingEnd = () => setIsLoading(false);

    emitter.on('loading_start', handleLoadingStart);
    emitter.on('loading_end', handleLoadingEnd);

    // Cleanup listeners on component unmount
    return () => {
      emitter.off('loading_start', handleLoadingStart);
      emitter.off('loading_end', handleLoadingEnd);
    };
  }, []);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(email, password);
      
      if (response.success) {
        // Get user data from token service after successful login
        const userData = getUserData();
        if (userData) {
          setUser(userData);
        }
      } else {
        setError(response.message || 'Login failed');
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      return {
        token: '',
        refreshToken: '',
        expiration: '',
        userId: '',
        organizationId: '',
        organizationName: '',
        email: '',
        firstName: '',
        lastName: '',
        success: false,
        message: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to logout');
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
