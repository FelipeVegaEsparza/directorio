'use client';

import React from 'react';
import { cn } from '@/utils';
import { InputProps } from '@/types';

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  error,
  disabled = false,
  required = false,
  className,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={cn(
            'w-full px-4 py-3 border rounded-xl transition-all duration-200',
            'placeholder:text-secondary-400',
            'focus:outline-none focus:ring-2 focus:ring-offset-1',
            error
              ? 'border-error-300 focus:border-error-500 focus:ring-error-500'
              : 'border-secondary-300 focus:border-primary-500 focus:ring-primary-500',
            disabled && 'bg-secondary-50 cursor-not-allowed',
            'hover:border-secondary-400'
          )}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-error-600 flex items-center">
          <svg
            className="w-4 h-4 mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;