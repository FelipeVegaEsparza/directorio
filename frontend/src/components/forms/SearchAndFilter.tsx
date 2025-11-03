'use client';

import React from 'react';
import { cn } from '@/utils';
import { MediaFilters, Category } from '@/types';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import SortSelector from './SortSelector';

interface SearchAndFilterProps {
    filters: MediaFilters;
    categories: Category[];
    countries: string[];
    onFiltersChange: (filters: MediaFilters) => void;
    onSearch: (search: string) => void;
    onClearFilters: () => void;
    className?: string;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
    filters,
    categories,
    countries,
    onFiltersChange,
    onSearch,
    onClearFilters,
    className,
}) => {
    const sortOptions = [
        { value: 'relevance', label: 'Más relevantes' },
        { value: 'popular', label: 'Más populares' },
        { value: 'recent', label: 'Más recientes' },
        { value: 'name', label: 'Nombre A-Z' },
        { value: 'views', label: 'Más vistos' },
        { value: 'plays', label: 'Más reproducidos' },
    ];

    const handleSortChange = (sortValue: string) => {
        onFiltersChange({ ...filters, sort: sortValue, page: 1 });
    };

    return (
        <div className={cn('space-y-4', className)}>
            {/* Search Bar */}
            <div className="w-full">
                <SearchBar
                    value={filters.search}
                    onSearch={onSearch}
                    size="lg"
                    placeholder="Buscar radios, canales de TV, países..."
                />
            </div>

            {/* Filters and Sort */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                {/* Left side - Filters */}
                <div className="flex flex-wrap gap-3 items-center">
                    <FilterPanel
                        filters={filters}
                        categories={categories}
                        countries={countries}
                        onFiltersChange={onFiltersChange}
                        onClearFilters={onClearFilters}
                    />

                    {/* Quick type filters */}
                    <div className="hidden sm:flex items-center space-x-2">
                        <button
                            onClick={() => onFiltersChange({ ...filters, type: undefined, page: 1 })}
                            className={cn(
                                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                                !filters.type
                                    ? 'bg-primary-100 text-primary-700 border border-primary-200'
                                    : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                            )}
                        >
                            Todos
                        </button>
                        <button
                            onClick={() => onFiltersChange({ ...filters, type: 'radio', page: 1 })}
                            className={cn(
                                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                                filters.type === 'radio'
                                    ? 'bg-primary-100 text-primary-700 border border-primary-200'
                                    : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                            )}
                        >
                            📻 Radios
                        </button>
                        <button
                            onClick={() => onFiltersChange({ ...filters, type: 'tv', page: 1 })}
                            className={cn(
                                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                                filters.type === 'tv'
                                    ? 'bg-primary-100 text-primary-700 border border-primary-200'
                                    : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                            )}
                        >
                            📺 TV
                        </button>
                    </div>
                </div>

                {/* Right side - Sort */}
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-secondary-600 whitespace-nowrap">
                        Ordenar por:
                    </span>
                    <SortSelector
                        value={filters.sort || 'relevance'}
                        onChange={handleSortChange}
                        options={sortOptions}
                    />
                </div>
            </div>
        </div>
    );
};

export default SearchAndFilter;