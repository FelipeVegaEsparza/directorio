'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api';
import { JoinRequestForm, ApiResponse } from '@/types';

export const useJoinRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitRequest = async (data: JoinRequestForm) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response: ApiResponse = await apiClient.post('/api/requests', data);

      if (response.success) {
        setSuccess(true);
        return response.data;
      } else {
        throw new Error(response.error || 'Error al enviar la solicitud');
      }
    } catch (err: any) {
      let errorMessage = 'Error desconocido';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      // Handle specific error cases
      if (err.response?.status === 400) {
        if (errorMessage.includes('pending request already exists')) {
          errorMessage = 'Ya existe una solicitud pendiente con este email o URL de stream. Por favor verifica el estado de tu solicitud anterior.';
        } else if (errorMessage.includes('Validation failed')) {
          errorMessage = 'Por favor verifica que todos los campos requeridos estén completos y las URLs sean válidas.';
        }
      } else if (err.response?.status === 429) {
        errorMessage = 'Has enviado demasiadas solicitudes. Por favor espera antes de intentar nuevamente.';
      } else if (err.response?.status >= 500) {
        errorMessage = 'Error del servidor. Por favor intenta nuevamente más tarde.';
      }
      
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkRequestStatus = async (email: string, streamUrl?: string) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append('email', email);
      if (streamUrl) params.append('streamUrl', streamUrl);

      const response: ApiResponse = await apiClient.get(
        `/api/requests/status?${params.toString()}`
      );

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Error al consultar el estado');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
    setLoading(false);
  };

  return {
    loading,
    error,
    success,
    submitRequest,
    checkRequestStatus,
    reset,
  };
};