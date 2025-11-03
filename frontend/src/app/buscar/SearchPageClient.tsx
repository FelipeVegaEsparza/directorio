'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchAndFilter } from '@/components/forms';
import { MediaCard } from '@/components/media';
import { Loading, Button } from '@/components/ui';
import { useMedia } from '@/hooks/useMedia';
import { useCategories, useCountries } from '@/hooks/useCategories';
import { Media, MediaFilters } from '@/types';
import { formatNumber } from '@/utils';

export default function SearchPageClient() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [currentPlayer, setCurrentPlayer] = useState<Media | null>(null);
  
  // Initialize filters with search query
  const initialFilters: MediaFilters = {
    search: initialQuery,
    page: 1,
    limit: 12,
  };

  const {
    media,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    clearFilters,
    loadMore,
  } = useMedia(initialFilters);

  const { categories } = useCategories();
  const { countries } = useCountries();

  const handleMediaPlay = (media: Media) => {
    setCurrentPlayer(media);
    // TODO: Open media player modal
  };

  const handleSearch = (query: string) => {
    updateFilters({ search: query, page: 1 });
  };

  const handleLoadMore = () => {
    if (pagination.page < pagination.totalPages) {
      updateFilters({ page: pagination.page + 1 });
    }
  };

  return (
      <div className="bg-secondary-50 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-secondary-200">
          <div className="container py-8">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-display font-bold text-secondary-900">
                  {initialQuery ? `Resultados para "${initialQuery}"` : 'Buscar Contenido'}
                </h1>
                <p className="text-secondary-600 mt-2">
                  Encuentra radios y canales de TV de todo el mundo
                </p>
              </div>

              {/* Search and Filters */}
              <SearchAndFilter
                filters={filters}
                categories={categories}
                countries={countries}
                onFiltersChange={updateFilters}
                onSearch={handleSearch}
                onClearFilters={clearFilters}
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="container py-8">
          {/* Results Header */}
          {!loading && (
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-secondary-600">
                {pagination.total > 0 ? (
                  <>
                    Mostrando {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} de {formatNumber(pagination.total)} resultados
                  </>
                ) : (
                  'No se encontraron resultados'
                )}
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && pagination.page === 1 && (
            <div className="flex justify-center py-12">
              <Loading size="lg" text="Buscando contenido..." />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="text-error-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                Error en la búsqueda
              </h3>
              <p className="text-secondary-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Intentar nuevamente
              </Button>
            </div>
          )}

          {/* No Results */}
          {!loading && !error && media.length === 0 && (
            <div className="text-center py-12">
              <div className="text-secondary-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                No se encontraron resultados
              </h3>
              <p className="text-secondary-600 mb-4">
                Intenta con otros términos de búsqueda o ajusta los filtros
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            </div>
          )}

          {/* Results Grid */}
          {!loading && media.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {media.map((item) => (
                  <MediaCard
                    key={item.id}
                    media={item}
                    onPlay={handleMediaPlay}
                    className="animate-fade-in"
                  />
                ))}
              </div>

              {/* Load More */}
              {pagination.page < pagination.totalPages && (
                <div className="text-center mt-12">
                  <Button
                    onClick={handleLoadMore}
                    loading={loading}
                    size="lg"
                    variant="outline"
                  >
                    {loading ? 'Cargando...' : 'Cargar más resultados'}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
  );
}