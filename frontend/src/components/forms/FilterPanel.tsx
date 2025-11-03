'use client';

import React, { useState } from 'react';
import { ChevronDownIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/utils';
import { MediaFilters, Category } from '@/types';
import { Button, Badge } from '@/components/ui';

interface FilterPanelProps {
  filters: MediaFilters;
  categories: Category[];
  countries: string[];
  onFiltersChange: (filters: MediaFilters) => void;
  onClearFilters: () => void;
  className?: string;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  categories,
  countries,
  onFiltersChange,
  onClearFilters,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key: keyof MediaFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    // Reset page when filters change
    if (key !== 'page') {
      newFilters.page = 1;
    }
    onFiltersChange(newFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.country) count++;
    if (filters.type) count++;
    if (filters.featured) count++;
    if (filters.verified) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className={cn('relative', className)}>
      {/* Filter Toggle Button */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <FunnelIcon className="w-4 h-4 mr-2" />
        Filtros
        <ChevronDownIcon 
          className={cn(
            'w-4 h-4 ml-2 transition-transform duration-200',
            isOpen && 'rotate-180'
          )} 
        />
        {activeFiltersCount > 0 && (
          <Badge 
            variant="primary" 
            size="sm" 
            className="absolute -top-2 -right-2 min-w-[1.25rem] h-5 flex items-center justify-center p-0"
          >
            {activeFiltersCount}
          </Badge>
        )}
      </Button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-secondary-200 rounded-xl shadow-large z-10 p-6 min-w-80">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg text-secondary-900">
                Filtros
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-secondary-400 hover:text-secondary-600 rounded-lg hover:bg-secondary-100 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Tipo de Medio
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleFilterChange('type', undefined)}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    !filters.type
                      ? 'bg-primary-100 text-primary-700 border border-primary-200'
                      : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                  )}
                >
                  Todos
                </button>
                <button
                  onClick={() => handleFilterChange('type', 'radio')}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    filters.type === 'radio'
                      ? 'bg-primary-100 text-primary-700 border border-primary-200'
                      : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                  )}
                >
                  📻 Radio
                </button>
                <button
                  onClick={() => handleFilterChange('type', 'tv')}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    filters.type === 'tv'
                      ? 'bg-primary-100 text-primary-700 border border-primary-200'
                      : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                  )}
                >
                  📺 TV
                </button>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Categoría
              </label>
              <select
                value={filters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Country Filter */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                País
              </label>
              <select
                value={filters.country || ''}
                onChange={(e) => handleFilterChange('country', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Todos los países</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* Special Filters */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Especiales
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.featured || false}
                    onChange={(e) => handleFilterChange('featured', e.target.checked || undefined)}
                    className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-secondary-700">
                    ⭐ Solo destacados
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.verified || false}
                    onChange={(e) => handleFilterChange('verified', e.target.checked || undefined)}
                    className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-secondary-700">
                    ✅ Solo verificados
                  </span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4 border-t border-secondary-200">
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                disabled={activeFiltersCount === 0}
                className="flex-1"
              >
                Limpiar filtros
              </Button>
              <Button
                size="sm"
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Aplicar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default FilterPanel;