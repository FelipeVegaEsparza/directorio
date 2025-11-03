import React, { useState } from 'react';
import { Category, MediaFilters as MediaFiltersType } from '@/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface MediaFiltersProps {
  filters: MediaFiltersType;
  categories: Category[];
  onFiltersChange: (filters: MediaFiltersType) => void;
  loading?: boolean;
}

export function MediaFilters({ filters, categories, onFiltersChange, loading }: MediaFiltersProps) {
  const [localFilters, setLocalFilters] = useState<MediaFiltersType>(filters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleInputChange = (field: keyof MediaFiltersType) => (value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value || undefined
    }));
  };

  const handleSelectChange = (field: keyof MediaFiltersType) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setLocalFilters(prev => ({
      ...prev,
      [field]: value || undefined
    }));
  };

  const handleBooleanChange = (field: keyof MediaFiltersType) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setLocalFilters(prev => ({
      ...prev,
      [field]: value === '' ? undefined : value === 'true'
    }));
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters: MediaFiltersType = {
      page: 1,
      limit: filters.limit || 20
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.keys(localFilters).some(key => 
    key !== 'page' && key !== 'limit' && localFilters[key as keyof MediaFiltersType] !== undefined
  );

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setShowAdvanced(!showAdvanced)}
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1"
          >
            <FunnelIcon className="w-4 h-4" />
            <span>{showAdvanced ? 'Ocultar' : 'Más'} filtros</span>
          </Button>
          
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
      </div>

      <div className="space-y-4">
        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Buscar"
            placeholder="Nombre del medio..."
            value={localFilters.search || ''}
            onChange={handleInputChange('search')}
            disabled={loading}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
            <select
              value={localFilters.type || ''}
              onChange={handleSelectChange('type')}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los tipos</option>
              <option value="radio">Radio</option>
              <option value="tv">TV</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select
              value={localFilters.category || ''}
              onChange={handleSelectChange('category')}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas las categorías</option>
              {categories.map(category => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
            <Input
              label="País"
              placeholder="País..."
              value={localFilters.country || ''}
              onChange={handleInputChange('country')}
              disabled={loading}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={localFilters.featured === undefined ? '' : localFilters.featured.toString()}
                onChange={handleBooleanChange('featured')}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos</option>
                <option value="true">Solo destacados</option>
                <option value="false">No destacados</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verificación
              </label>
              <select
                value={localFilters.verified === undefined ? '' : localFilters.verified.toString()}
                onChange={handleBooleanChange('verified')}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos</option>
                <option value="true">Solo verificados</option>
                <option value="false">No verificados</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ordenar por
              </label>
              <select
                value={localFilters.sort || ''}
                onChange={handleSelectChange('sort')}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Más recientes</option>
                <option value="name">Nombre A-Z</option>
                <option value="-name">Nombre Z-A</option>
                <option value="views">Menos vistas</option>
                <option value="-views">Más vistas</option>
                <option value="plays">Menos reproducciones</option>
                <option value="-plays">Más reproducciones</option>
              </select>
            </div>
          </div>
        )}

        {/* Apply Button */}
        <div className="flex justify-end pt-4">
          <Button
            onClick={handleApplyFilters}
            variant="primary"
            loading={loading}
            className="flex items-center space-x-2"
          >
            <MagnifyingGlassIcon className="w-4 h-4" />
            <span>Aplicar Filtros</span>
          </Button>
        </div>
      </div>
    </div>
  );
}