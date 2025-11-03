'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Layout } from '@/components/layout';
import { MediaSection } from '@/components/media';
import { SearchAndFilter } from '@/components/forms';
import { Button, NoSSR } from '@/components/ui';
import { useMedia } from '@/hooks/useMedia';
import { useCategories, useCountries } from '@/hooks/useCategories';
import { Media } from '@/types';

export default function RadiosPage() {
  const router = useRouter();
  const [currentPlayer, setCurrentPlayer] = useState<Media | null>(null);

  const { 
    media, 
    loading, 
    error, 
    pagination,
    filters,
    updateFilters,
    clearFilters
  } = useMedia({
    type: 'radio',
    limit: 12,
  });

  const { categories } = useCategories();
  const { countries } = useCountries();

  const handleMediaPlay = (media: Media) => {
    setCurrentPlayer(media);
    router.push(`/${media.type}/${media.slug}`);
  };

  const handleLoadMore = () => {
    if (pagination && pagination.page < pagination.totalPages) {
      updateFilters({ page: pagination.page + 1 });
    }
  };

  const handleSearch = (query: string) => {
    updateFilters({ search: query, page: 1 });
  };

  return (
    <Layout>
      <NoSSR>
        <div className="bg-secondary-50 min-h-screen">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white">
            <div className="container py-12">
              <div className="flex items-center mb-6">
                <Button
                  variant="ghost"
                  onClick={() => router.back()}
                  className="text-white hover:bg-white/20 mr-4"
                >
                  <ArrowLeftIcon className="w-4 h-4 mr-2" />
                  Volver
                </Button>
              </div>
              
              <div className="text-center">
                <div className="text-6xl mb-4">📻</div>
                <h1 className="text-4xl font-display font-bold mb-4">
                  Radios Online
                </h1>
                <p className="text-xl text-primary-100 max-w-2xl mx-auto">
                  Descubre las mejores estaciones de radio de todo el mundo
                </p>
                {media && media.length > 0 && pagination && (
                  <p className="text-primary-200 mt-2">
                    {pagination.total} {pagination.total === 1 ? 'radio encontrada' : 'radios encontradas'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white border-b border-secondary-200">
            <div className="container py-6">
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

          {/* Content */}
          <div className="container py-12">
            {error ? (
              <div className="text-center py-12">
                <div className="bg-error-50 border border-error-200 rounded-lg p-6 max-w-md mx-auto">
                  <h3 className="text-lg font-medium text-error-800 mb-2">
                    Error al cargar radios
                  </h3>
                  <p className="text-error-600 mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()}>
                    Reintentar
                  </Button>
                </div>
              </div>
            ) : (!media || media.length === 0) && !loading ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 opacity-50">📻</div>
                <h3 className="text-2xl font-bold text-secondary-900 mb-2">
                  No hay radios disponibles
                </h3>
                <p className="text-secondary-600 mb-6">
                  Aún no tenemos radios registradas en nuestro directorio.
                </p>
                <div className="space-x-4">
                  <Button onClick={() => router.push('/')}>
                    Explorar todo el contenido
                  </Button>
                  <Button variant="outline" onClick={() => router.push('/unete')}>
                    Agregar mi radio
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* Media Grid */}
                <MediaSection
                  title=""
                  media={media || []}
                  loading={loading}
                  onMediaPlay={handleMediaPlay}
                  columns={4}
                  className="bg-transparent"
                />

                {/* Load More */}
                {pagination && pagination.page < pagination.totalPages && (
                  <div className="text-center mt-12">
                    <Button
                      onClick={handleLoadMore}
                      variant="outline"
                      size="lg"
                      loading={loading}
                    >
                      Cargar más radios
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </NoSSR>
    </Layout>
  );
}