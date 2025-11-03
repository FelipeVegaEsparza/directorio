'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { Media, ApiResponse } from '@/types';

export const useMediaDetail = (id: string) => {
  const [media, setMedia] = useState<Media | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMedia = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const response: ApiResponse<Media> = await apiClient.get(`/api/media/${id}`);

      // Media detail loaded successfully

      if (response.success && response.data) {
        setMedia(response.data);
      } else {
        throw new Error(response.error || 'Error al cargar el medio');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      setMedia(null);
    } finally {
      setLoading(false);
    }
  };

  const recordView = async () => {
    if (!media) return;

    try {
      await apiClient.post(`/api/stats/view/${media.id}`, {
        eventType: 'view'
      });
    } catch (err) {
      // Silently fail for analytics
      console.warn('Failed to record view:', err);
    }
  };

  const recordPlay = async () => {
    if (!media) return;

    try {
      await apiClient.post(`/api/stats/play/${media.id}`, {
        eventType: 'play'
      });
    } catch (err) {
      // Silently fail for analytics
      console.warn('Failed to record play:', err);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [id]);

  useEffect(() => {
    if (media) {
      recordView();
    }
  }, [media]);

  return {
    media,
    loading,
    error,
    refetch: fetchMedia,
    recordPlay,
  };
};