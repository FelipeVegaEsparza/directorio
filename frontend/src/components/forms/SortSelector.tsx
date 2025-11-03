'use client';

import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { cn } from '@/utils';

interface SortOption {
  value: string;
  label: string;
}

interface SortSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: SortOption[];
  className?: string;
}

const SortSelector: React.FC<SortSelectorProps> = ({
  value,
  onChange,
  options,
  className,
}) => {
  const selectedOption = options.find(option => option.value === value);

  return (
    <div className={cn('relative', className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'appearance-none bg-white border border-secondary-300 rounded-lg',
          'px-4 py-2 pr-10 text-sm font-medium text-secondary-700',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          'hover:border-secondary-400 transition-colors cursor-pointer'
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {/* Custom dropdown arrow */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <ChevronDownIcon className="w-4 h-4 text-secondary-400" />
      </div>
    </div>
  );
};

export default SortSelector;