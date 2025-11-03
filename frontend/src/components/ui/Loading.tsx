'use client';

import React from 'react';
import { cn } from '@/utils';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  text,
  className,
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-secondary-200 border-t-primary-600',
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="mt-3 text-sm text-secondary-600 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default Loading;