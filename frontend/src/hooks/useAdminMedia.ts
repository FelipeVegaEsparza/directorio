import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import { Media, MediaFilters, PaginatedResponse } from '@/types';

interface UseAdminMediaReturn {
  media: Media[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  fetchMedia: (filters?: MediaFilters) => Promise<void>;
  createMedia: (data: Partial<Media>) => Promise<Media>;
  updateMedia: (id: string, data: Partial<Media>) => Promise<Media>;
  deleteMedia: (id: string) => Promise<void>;
  toggleMediaStatus: (id: string) => Promise<void>;
  toggleFeatured: (id: string) => Promise<void>;
  toggleVerified: (id: string) => Promise<void>;
}

export function useAdminMedia(): UseAdminMediaReturn {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null>(null);

  const fetchMedia = useCallback(async (filters: MediaFilters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const url = `/api/admin/media?${params.toString()}`;
      const response = await apiClient.get<any>(url);
      
      if (response.success && response.data) {
        setMedia(response.data);
        setPagination(response.pagination);
      } else {
        console.error('❌ API response not successful:', response);
        throw new Error(response.message || 'Error al cargar medios');
      }
    } catch (err: any) {
      console.error('💥 Error fetching admin media:', err);
      console.error('💥 Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(err.message || 'Error al cargar medios');
      setMedia([]); // Ensure media is always an array
    } finally {
      setLoading(false);
    }
  }, []);

  const createMedia = useCallback(async (data: Partial<Media>): Promise<Media> => {
    try {
      const response = await apiClient.post<Media>('/api/admin/media', data);
      
      if (response.success && response.data) {
        // Refresh the media list
        await fetchMedia();
        return response.data;
      } else {
        throw new Error(response.message || 'Error al crear medio');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || err.message || 'Error al crear medio');
    }
  }, [fetchMedia]);

  const updateMedia = useCallback(async (id: string, data: Partial<Media>): Promise<Media> => {
    try {
      const response = await apiClient.put<Media>(`/api/admin/media/${id}`, data);
      
      if (response.success && response.data) {
        // Update the media in the list
        setMedia(prev => prev.map(item => 
          item.id === id ? { ...item, ...response.data } : item
        ));
        return response.data;
      } else {
        throw new Error(response.message || 'Error al actualizar medio');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || err.message || 'Error al actualizar medio');
    }
  }, []);

  const deleteMedia = useCallback(async (id: string): Promise<void> => {
    try {
      const response = await apiClient.delete(`/api/admin/media/${id}`);
      
      if (response.success) {
        // Remove the media from the list
        setMedia(prev => prev.filter(item => item.id !== id));
      } else {
        throw new Error(response.message || 'Error al eliminar medio');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || err.message || 'Error al eliminar medio');
    }
  }, []);

  const toggleMediaStatus = useCallback(async (id: string): Promise<void> => {
    try {
      const response = await apiClient.patch<Media>(`/api/admin/media/${id}/status`);
      
      if (response.success && response.data) {
        // Update the media in the list
        setMedia(prev => prev.map(item => 
          item.id === id ? { ...item, isActive: response.data!.isActive } : item
        ));
      } else {
        throw new Error(response.message || 'Error al cambiar estado del medio');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || err.message || 'Error al cambiar estado del medio');
    }
  }, []);

  const toggleFeatured = useCallback(async (id: string): Promise<void> => {
    try {
      const response = await apiClient.patch<Media>(`/api/admin/media/${id}/featured`);
      
      if (response.success && response.data) {
        // Update the media in the list
        setMedia(prev => prev.map(item => 
          item.id === id ? { ...item, isFeatured: response.data!.isFeatured } : item
        ));
      } else {
        throw new Error(response.message || 'Error al cambiar estado destacado');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || err.message || 'Error al cambiar estado destacado');
    }
  }, []);

  const toggleVerified = useCallback(async (id: string): Promise<void> => {
    try {
      const response = await apiClient.patch<Media>(`/api/admin/media/${id}/verified`);
      
      if (response.success && response.data) {
        // Update the media in the list
        setMedia(prev => prev.map(item => 
          item.id === id ? { ...item, isVerified: response.data!.isVerified } : item
        ));
      } else {
        throw new Error(response.message || 'Error al cambiar estado verificado');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || err.message || 'Error al cambiar estado verificado');
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  return {
    media,
    loading,
    error,
    pagination,
    fetchMedia,
    createMedia,
    updateMedia,
    deleteMedia,
    toggleMediaStatus,
    toggleFeatured,
    toggleVerified
  };
}