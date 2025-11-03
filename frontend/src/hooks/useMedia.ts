'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { Media, MediaFilters, PaginatedResponse, ApiResponse } from '@/types';

export const useMedia = (initialFilters: MediaFilters = {}) => {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState<MediaFilters>({
    page: 1,
    limit: 12,
    ...initialFilters,
  });

  const fetchMedia = async (newFilters?: MediaFilters) => {
    try {
      setLoading(true);
      setError(null);

      const currentFilters = newFilters || filters;
      const params = new URLSearchParams();

      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response: ApiResponse<any> = await apiClient.get(
        `/api/media?${params.toString()}`
      );

      if (response.success && response.data) {
        // Handle both nested and direct response structures
        const mediaData = response.data.data || response.data;
        const paginationData = response.data.pagination || response.pagination;
        
        setMedia(mediaData);
        setPagination(paginationData);
      } else {
        throw new Error(response.error || 'Error al cargar los medios');
      }
    } catch (err: any) {
      let errorMessage = 'Error desconocido';
      
      if (err.response) {
        // Server responded with error status
        if (err.response.status === 429) {
          errorMessage = 'Demasiadas peticiones. Por favor, espera un momento e intenta de nuevo.';
        } else if (err.response.status >= 500) {
          errorMessage = 'Error del servidor. Por favor, intenta más tarde.';
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setMedia([]);
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters: MediaFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    fetchMedia(updatedFilters);
  };

  const clearFilters = () => {
    const clearedFilters: MediaFilters = {
      page: 1,
      limit: filters.limit,
    };
    setFilters(clearedFilters);
    fetchMedia(clearedFilters);
  };

  const loadMore = () => {
    if (pagination.page < pagination.totalPages) {
      updateFilters({ page: pagination.page + 1 });
    }
  };

  useEffect(() => {
    fetchMedia(filters);
  }, []); // Only run on mount with initial filters

  return {
    media,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    clearFilters,
    loadMore,
    refetch: () => fetchMedia(),
  };
};

export const useFeaturedMedia = () => {
  const [featuredMedia, setFeaturedMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedMedia = async (type?: 'radio' | 'tv', limit = 6) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (type) params.append('type', type);
      params.append('limit', limit.toString());

      const response: ApiResponse<Media[]> = await apiClient.get(
        `/api/media/featured?${params.toString()}`
      );

      if (response.success && response.data) {
        setFeaturedMedia(response.data);
      } else {
        throw new Error(response.error || 'Error al cargar medios destacados');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      setFeaturedMedia([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedMedia();
  }, []);

  return {
    featuredMedia,
    loading,
    error,
    refetch: fetchFeaturedMedia,
  };
};

export const usePopularMedia = () => {
  const [popularMedia, setPopularMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPopularMedia = async (type?: 'radio' | 'tv', limit = 6) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (type) params.append('type', type);
      params.append('limit', limit.toString());

      const response: ApiResponse<Media[]> = await apiClient.get(
        `/api/media/popular?${params.toString()}`
      );

      if (response.success && response.data) {
        setPopularMedia(response.data);
      } else {
        throw new Error(response.error || 'Error al cargar medios populares');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      setPopularMedia([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularMedia();
  }, []);

  return {
    popularMedia,
    loading,
    error,
    refetch: fetchPopularMedia,
  };
};

export const useRecentMedia = () => {
  const [recentMedia, setRecentMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentMedia = async (type?: 'radio' | 'tv', limit = 6) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (type) params.append('type', type);
      params.append('limit', limit.toString());

      const response: ApiResponse<Media[]> = await apiClient.get(
        `/api/media/recent?${params.toString()}`
      );

      if (response.success && response.data) {
        setRecentMedia(response.data);
      } else {
        throw new Error(response.error || 'Error al cargar medios recientes');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      setRecentMedia([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentMedia();
  }, []);

  return {
    recentMedia,
    loading,
    error,
    refetch: fetchRecentMedia,
  };
};