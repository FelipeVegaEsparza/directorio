import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import { JoinRequest, PaginatedResponse } from '@/types';

interface UseAdminRequestsReturn {
  requests: JoinRequest[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  fetchRequests: (filters?: { status?: string; page?: number; limit?: number }) => Promise<void>;
  approveRequest: (id: number) => Promise<void>;
  rejectRequest: (id: number, reason?: string) => Promise<void>;
}

export function useAdminRequests(): UseAdminRequestsReturn {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null>(null);

  const fetchRequests = useCallback(async (filters: { status?: string; page?: number; limit?: number } = {}) => {
    try {
      setLoading(true);
      setError(null);

      // Set default values
      const defaultFilters = {
        page: 1,
        limit: 10,
        status: 'pending',
        ...filters
      };

      const params = new URLSearchParams();
      Object.entries(defaultFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const url = `/api/admin/requests?${params.toString()}`;
      console.log('Fetching requests with URL:', url);
      console.log('Filters:', defaultFilters);

      const response = await apiClient.getPaginated<JoinRequest>(url);
      
      console.log('Response received:', response);

      if (response.success && response.data) {
        console.log('Requests data:', response.data.data);
        console.log('Pagination:', response.data.pagination);
        setRequests(response.data.data);
        setPagination(response.data.pagination);
      } else {
        console.error('Response error:', response);
        throw new Error(response.message || 'Error al cargar solicitudes');
      }
    } catch (err: any) {
      let errorMessage = 'Error al cargar solicitudes';
      
      if (err.response) {
        // Server responded with error status
        if (err.response.status === 400) {
          errorMessage = 'Petición inválida. Verifica los parámetros.';
        } else if (err.response.status === 401) {
          errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
        } else if (err.response.status === 404) {
          errorMessage = 'Endpoint no encontrado. Verifica que el backend esté ejecutándose.';
        } else if (err.response.status >= 500) {
          errorMessage = 'Error del servidor. Por favor, intenta más tarde.';
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose en el puerto 3001.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setRequests([]); // Ensure requests is always an array
      console.error('Error fetching admin requests:', err);
      console.error('Error details:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const approveRequest = useCallback(async (id: number): Promise<void> => {
    try {
      const response = await apiClient.put<JoinRequest>(`/api/admin/requests/${id}`, {
        status: 'approved'
      });
      
      if (response.success && response.data) {
        // Update the request in the list
        setRequests(prev => prev.map(item => 
          item.id === id ? { ...item, status: 'approved', processedAt: new Date().toISOString() } : item
        ));
      } else {
        throw new Error(response.message || 'Error al aprobar solicitud');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || err.message || 'Error al aprobar solicitud');
    }
  }, []);

  const rejectRequest = useCallback(async (id: number, reason?: string): Promise<void> => {
    try {
      const response = await apiClient.put<JoinRequest>(`/api/admin/requests/${id}`, {
        status: 'rejected',
        reason
      });
      
      if (response.success && response.data) {
        // Update the request in the list
        setRequests(prev => prev.map(item => 
          item.id === id ? { ...item, status: 'rejected', processedAt: new Date().toISOString() } : item
        ));
      } else {
        throw new Error(response.message || 'Error al rechazar solicitud');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || err.message || 'Error al rechazar solicitud');
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return {
    requests,
    loading,
    error,
    pagination,
    fetchRequests,
    approveRequest,
    rejectRequest
  };
}