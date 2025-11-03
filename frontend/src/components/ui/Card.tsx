'use client';

import React from 'react';
import { cn } from '@/utils';
import { CardProps } from '@/types';

const Card: React.FC<CardProps> = ({
  children,
  className,
  padding = 'md',
  shadow = 'soft',
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const shadowClasses = {
    none: '',
    soft: 'shadow-soft',
    medium: 'shadow-medium',
    large: 'shadow-large',
  };

  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-secondary-200',
        'transition-all duration-200 hover:shadow-medium',
        paddingClasses[padding],
        shadowClasses[shadow],
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;