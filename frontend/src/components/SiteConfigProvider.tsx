'use client';

import { useEffect } from 'react';
import { useSiteConfig } from '@/hooks/useSiteConfig';

interface SiteConfigProviderProps {
  children: React.ReactNode;
}

export function SiteConfigProvider({ children }: SiteConfigProviderProps) {
  const { config, loading } = useSiteConfig();

  useEffect(() => {
    if (!loading && typeof window !== 'undefined') {
      // Update document title
      if (config.siteName) {
        document.title = config.siteName;
      }
      
      // Update meta description
      if (config.siteDescription) {
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', config.siteDescription);
        }
      }
      
      // Update favicon if provided
      if (config.faviconUrl) {
        let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
        if (!favicon) {
          favicon = document.createElement('link');
          favicon.rel = 'icon';
          document.head.appendChild(favicon);
        }
        favicon.href = config.faviconUrl;
      }
      
      // Update CSS custom properties for colors
      if (config.primaryColor) {
        document.documentElement.style.setProperty('--primary-color', config.primaryColor);
      }
      if (config.secondaryColor) {
        document.documentElement.style.setProperty('--secondary-color', config.secondaryColor);
      }
    }
  }, [config, loading]);

  return <>{children}</>;
}