import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Admin, LoginCredentials, AuthResponse } from '@/types';

interface AuthState {
  user: Admin | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true
  });
  const router = useRouter();

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      // Check if we're in the browser
      if (typeof window === 'undefined') {
        setAuthState({
          user: null,
          isAuthenticated: false,
          loading: false
        });
        return;
      }

      const token = localStorage.getItem('accessToken');
      if (!token) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          loading: false
        });
        return;
      }

      // Verify token with backend
      const response = await apiClient.get<Admin>('/api/admin/profile');
      if (response.success && response.data) {
        setAuthState({
          user: response.data,
          isAuthenticated: true,
          loading: false
        });
      } else {
        throw new Error('Invalid token');
      }
    } catch (error) {
      // Token is invalid, clear storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
      setAuthState({
        user: null,
        isAuthenticated: false,
        loading: false
      });
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setAuthState(prev => ({ ...prev, loading: true }));

    try {
      const response = await apiClient.post<AuthResponse>('/api/admin/login', credentials);
      
      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data;
        
        // Store tokens
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
        }
        
        setAuthState({
          user,
          isAuthenticated: true,
          loading: false
        });

        return response.data;
      } else {
        throw new Error(response.message || 'Error al iniciar sesión');
      }
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, loading: false }));
      throw new Error(error.response?.data?.message || error.message || 'Error al iniciar sesión');
    }
  }, []);

  const logout = useCallback(async () => {
    // Clear local storage and state
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
      
    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false
    });

    // Redirect to login
    router.push('/admin/login');
  }, [router]);

  const refreshToken = useCallback(async () => {
    try {
      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post<{ accessToken: string; refreshToken: string }>('/api/admin/refresh', {
        refreshToken
      });

      if (response.success && response.data) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        return response.data.accessToken;
      } else {
        throw new Error('Failed to refresh token');
      }
    } catch (error) {
      // Refresh failed, logout user
      logout();
      throw error;
    }
  }, [logout]);

  return {
    ...authState,
    login,
    logout,
    refreshToken,
    checkAuthStatus
  };
}