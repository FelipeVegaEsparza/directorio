'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { apiClient } from '@/lib/api';

interface SiteConfig {
  siteName: string;
  siteDescription: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  showOnlyLogo: boolean;
}

const defaultConfig: SiteConfig = {
  siteName: 'Radio TV Directory',
  siteDescription: 'Directorio de radios y canales de TV',
  logoUrl: '',
  faviconUrl: '',
  primaryColor: '#3B82F6',
  secondaryColor: '#6B7280',
  showOnlyLogo: false,
};

export const useSiteConfig = () => {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to load from API, but don't require authentication
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/api/config`);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.success && data.data) {
          const newConfig = {
            siteName: data.data.siteName || defaultConfig.siteName,
            siteDescription: data.data.siteDescription || defaultConfig.siteDescription,
            logoUrl: data.data.logoUrl || defaultConfig.logoUrl,
            faviconUrl: data.data.faviconUrl || defaultConfig.faviconUrl,
            primaryColor: data.data.primaryColor || defaultConfig.primaryColor,
            secondaryColor: data.data.secondaryColor || defaultConfig.secondaryColor,
            showOnlyLogo: data.data.showOnlyLogo || defaultConfig.showOnlyLogo,
          };
          setConfig(newConfig);
        }
      }
    } catch (err) {
      console.warn('Could not load site config, using defaults:', err);
      setError('Could not load site configuration');
    } finally {
      setLoading(false);
    }
  };

  const refreshConfig = () => {
    loadConfig();
  };

  useEffect(() => {
    loadConfig();
  }, []);

  return {
    config,
    loading,
    error,
    refreshConfig,
  };
};