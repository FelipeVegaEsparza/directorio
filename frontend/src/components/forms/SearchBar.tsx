'use client';

import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { cn, debounce } from '@/utils';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showClearButton?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Buscar radios y canales...',
  value = '',
  onChange,
  onSearch,
  className,
  size = 'md',
  showClearButton = true,
}) => {
  const [searchValue, setSearchValue] = useState(value);

  // Debounced search function
  const debouncedSearch = debounce((searchTerm: string) => {
    if (onSearch) {
      onSearch(searchTerm);
    }
  }, 300);

  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  useEffect(() => {
    debouncedSearch(searchValue);
  }, [searchValue]); // Remove debouncedSearch from dependencies to avoid infinite loops

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleClear = () => {
    setSearchValue('');
    if (onChange) {
      onChange('');
    }
    if (onSearch) {
      onSearch('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  const sizeClasses = {
    sm: 'h-10 text-sm',
    md: 'h-12 text-base',
    lg: 'h-14 text-lg',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <MagnifyingGlassIcon 
            className={cn('text-secondary-400', iconSizes[size])} 
            aria-hidden="true" 
          />
        </div>

        {/* Input */}
        <input
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={cn(
            'w-full pl-12 pr-12 border border-secondary-300 rounded-xl',
            'bg-white placeholder:text-secondary-400 text-secondary-900',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            'hover:border-secondary-400 transition-all duration-200',
            'shadow-soft hover:shadow-medium focus:shadow-medium',
            sizeClasses[size]
          )}
        />

        {/* Clear Button */}
        {showClearButton && searchValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-secondary-400 hover:text-secondary-600 transition-colors"
          >
            <XMarkIcon className={cn(iconSizes[size])} aria-hidden="true" />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;