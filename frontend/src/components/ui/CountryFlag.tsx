'use client';

import React, { useState } from 'react';
import { getCountryFlag, getCountryISO } from '@/utils';

interface CountryFlagProps {
  country: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const CountryFlag: React.FC<CountryFlagProps> = ({ 
  country, 
  size = 'md',
  className = '' 
}) => {
  const [imageError, setImageError] = useState(false);
  
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  const flag = getCountryFlag(country);
  const isoCode = getCountryISO(country);

  // Try image first, then fallback to emoji
  if (isoCode && !imageError) {
    return (
      <img
        src={`https://flagcdn.com/w40/${isoCode}.png`}
        alt={`Bandera de ${country}`}
        className={`${sizeClasses[size]} object-contain rounded-sm shadow-sm ${className}`}
        onError={() => setImageError(true)}
        title={`Bandera de ${country}`}
      />
    );
  }

  // Fallback to emoji
  return (
    <span 
      className={`${sizeClasses[size]} inline-flex items-center justify-center text-2xl ${className}`}
      style={{ 
        fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, Twemoji Mozilla, sans-serif',
        fontVariantEmoji: 'emoji'
      }}
      title={`Bandera de ${country}`}
      role="img"
      aria-label={`Bandera de ${country}`}
    >
      {flag}
    </span>
  );
};

export default CountryFlag;