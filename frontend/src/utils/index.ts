import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format time duration
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Format date
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Format date and time
export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Format relative time
export function formatRelativeTime(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'hace unos segundos';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
  }

  return formatDate(date);
}

// Format number with commas
export function formatNumber(num: number): string {
  return num.toLocaleString('es-ES');
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Generate slug from text
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

// Validate URL
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Get media type icon
export function getMediaTypeIcon(type: 'radio' | 'tv'): string {
  return type === 'radio' ? '📻' : '📺';
}

// Get country flag emoji or fallback
export function getCountryFlag(country: string): string {
  // Try multiple approaches for better compatibility
  const flags: Record<string, string> = {
    // América Latina - usando emojis directos
    'Argentina': '🇦🇷',
    'Bolivia': '🇧🇴', 
    'Brasil': '🇧🇷',
    'Chile': '🇨🇱',
    'Colombia': '🇨🇴',
    'Costa Rica': '🇨🇷',
    'Cuba': '🇨🇺',
    'Ecuador': '🇪🇨',
    'El Salvador': '🇸🇻',
    'Guatemala': '🇬🇹',
    'Honduras': '🇭🇳',
    'México': '🇲🇽',
    'Nicaragua': '🇳🇮',
    'Panamá': '🇵🇦',
    'Paraguay': '🇵🇾',
    'Perú': '🇵🇪',
    'Puerto Rico': '🇵🇷',
    'República Dominicana': '🇩🇴',
    'Uruguay': '🇺🇾',
    'Venezuela': '🇻🇪',
    
    // Europa y otros
    'España': '🇪🇸',
    'Estados Unidos': '🇺🇸',
    'Alemania': '🇩🇪',
    'Francia': '🇫🇷',
    'Italia': '🇮🇹',
    'Reino Unido': '🇬🇧',
    'Canadá': '🇨🇦',
    'Australia': '🇦🇺',
    'Japón': '🇯🇵',
    'Corea del Sur': '🇰🇷',
    'China': '🇨🇳',
    'India': '🇮🇳',
    'Rusia': '🇷🇺',
    'Portugal': '🇵🇹',
    'Países Bajos': '🇳🇱',
    'Bélgica': '🇧🇪',
    'Suiza': '🇨🇭',
    'Austria': '🇦🇹',
    'Suecia': '🇸🇪',
    'Noruega': '🇳🇴',
    'Dinamarca': '🇩🇰',
    'Finlandia': '🇫🇮',
  };

  return flags[country] || '🌍';
}

// Get country ISO code for flag images
export function getCountryISO(country: string): string {
  const countryToISO: Record<string, string> = {
    'Argentina': 'ar',
    'Bolivia': 'bo',
    'Brasil': 'br',
    'Chile': 'cl',
    'Colombia': 'co',
    'Costa Rica': 'cr',
    'Cuba': 'cu',
    'Ecuador': 'ec',
    'El Salvador': 'sv',
    'Guatemala': 'gt',
    'Honduras': 'hn',
    'México': 'mx',
    'Nicaragua': 'ni',
    'Panamá': 'pa',
    'Paraguay': 'py',
    'Perú': 'pe',
    'Puerto Rico': 'pr',
    'República Dominicana': 'do',
    'Uruguay': 'uy',
    'Venezuela': 've',
    'España': 'es',
    'Estados Unidos': 'us',
    'Alemania': 'de',
    'Francia': 'fr',
    'Italia': 'it',
    'Reino Unido': 'gb',
    'Canadá': 'ca',
    'Australia': 'au',
    'Japón': 'jp',
    'Corea del Sur': 'kr',
    'China': 'cn',
    'India': 'in',
    'Rusia': 'ru',
    'Portugal': 'pt',
    'Países Bajos': 'nl',
    'Bélgica': 'be',
    'Suiza': 'ch',
    'Austria': 'at',
    'Suecia': 'se',
    'Noruega': 'no',
    'Dinamarca': 'dk',
    'Finlandia': 'fi',
  };
  
  return countryToISO[country] || '';
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Local storage helpers
export const storage = {
  get: (key: string) => {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  set: (key: string, value: any) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Handle storage errors silently
    }
  },

  remove: (key: string) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch {
      // Handle storage errors silently
    }
  },
};