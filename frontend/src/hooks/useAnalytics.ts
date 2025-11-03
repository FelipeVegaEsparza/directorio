'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api';

interface MediaAnalytics {
  media: {
    id: string;
    name: string;
    type: string;
  };
  totals: {
    views: number;
    plays: number;
  };
  period: {
    days: number;
    views: number;
    plays: number;
  };
  daily: Array<{
    date: string;
    eventType: 'view' | 'play';
    count: number;
  }>;
  hourly: Array<{
    hour: number;
    eventType: 'view' | 'play';
    count: number;
  }>;
}

interface TopMedia {
  period: number;
  topByViews: Array<{
    id: string;
    name: string;
    type: string;
    country: string;
    logoUrl?: string;
    recentViews: number;
  }>;
  topByPlays: Array<{
    id: string;
    name: string;
    type: string;
    country: string;
    logoUrl?: string;
    recentPlays: number;
  }>;
}

interface RealTimeStats {
  lastHour: {
    views: number;
    plays: number;
  };
  last24Hours: {
    views: number;
    plays: number;
  };
  activeStreams: number;
  timestamp: string;
}

export const useMediaAnalytics = (mediaId: string, period: number = 30) => {
  const [analytics, setAnalytics] = useState<MediaAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    if (!mediaId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get<MediaAnalytics>(
        `/api/admin/stats/media/${mediaId}?period=${period}`
      );

      if (response.success && response.data) {
        setAnalytics(response.data);
      } else {
        throw new Error(response.message || 'Error al cargar analytics');
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar analytics');
      console.error('Error fetching media analytics:', err);
    } finally {
      setLoading(false);
    }
  }, [mediaId, period]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics,
  };
};

export const useTopMedia = (period: number = 30, type?: 'radio' | 'tv') => {
  const [topMedia, setTopMedia] = useState<TopMedia | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTopMedia = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        period: period.toString(),
        limit: '10',
      });

      if (type) {
        params.append('type', type);
      }

      const response = await apiClient.get<TopMedia>(
        `/api/admin/stats/top?${params.toString()}`
      );

      if (response.success && response.data) {
        setTopMedia(response.data);
      } else {
        throw new Error(response.message || 'Error al cargar top media');
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar top media');
      console.error('Error fetching top media:', err);
    } finally {
      setLoading(false);
    }
  }, [period, type]);

  useEffect(() => {
    fetchTopMedia();
  }, [fetchTopMedia]);

  return {
    topMedia,
    loading,
    error,
    refetch: fetchTopMedia,
  };
};

export const useRealTimeStats = (refreshInterval: number = 30000) => {
  const [stats, setStats] = useState<RealTimeStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get<RealTimeStats>('/api/admin/stats/realtime');

      if (response.success && response.data) {
        setStats(response.data);
      } else {
        throw new Error(response.message || 'Error al cargar estadísticas en tiempo real');
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar estadísticas en tiempo real');
      console.error('Error fetching real-time stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();

    // Set up interval for real-time updates
    const interval = setInterval(fetchStats, refreshInterval);

    return () => clearInterval(interval);
  }, [fetchStats, refreshInterval]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};