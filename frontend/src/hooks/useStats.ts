'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { ApiResponse } from '@/types';

interface StatsData {
  totalRadios: number;
  totalTV: number;
  totalCountries: number;
  totalPlays: number;
  totalViews: number;
}

export const useStats = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response: ApiResponse<StatsData> = await apiClient.get('/api/stats/overview');

      if (response.success && response.data) {
        setStats(response.data);
      } else {
        throw new Error(response.error || 'Error al cargar estadísticas');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};