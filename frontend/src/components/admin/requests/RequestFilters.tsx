import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface RequestFiltersProps {
  filters: {
    status?: string;
    page?: number;
    limit?: number;
  };
  onFiltersChange: (filters: any) => void;
  loading?: boolean;
}

export function RequestFilters({ filters, onFiltersChange, loading }: RequestFiltersProps) {
  const [localFilters, setLocalFilters] = useState({
    status: 'pending',
    ...filters
  });

  // Sync local filters with props when they change
  useEffect(() => {
    setLocalFilters(prev => ({
      status: 'pending',
      ...filters
    }));
  }, [filters]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setLocalFilters(prev => ({
      ...prev,
      status: value || undefined
    }));
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      page: 1,
      limit: filters.limit || 20
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.keys(localFilters).some(key => 
    key !== 'page' && key !== 'limit' && localFilters[key as keyof typeof localFilters] !== undefined
  );

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
        
        {hasActiveFilters && (
          <Button
            onClick={handleClearFilters}
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1 text-red-600"
          >
            <XMarkIcon className="w-4 h-4" />
            <span>Limpiar</span>
          </Button>
        )}
      </div>

      <div className="flex items-end space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          <select
            value={localFilters.status || ''}
            onChange={handleStatusChange}
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="approved">Aprobadas</option>
            <option value="rejected">Rechazadas</option>
          </select>
        </div>

        <Button
          onClick={handleApplyFilters}
          variant="primary"
          loading={loading}
          className="flex items-center space-x-2"
        >
          <MagnifyingGlassIcon className="w-4 h-4" />
          <span>Aplicar</span>
        </Button>
      </div>
    </div>
  );
}