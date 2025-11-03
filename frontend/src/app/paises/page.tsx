'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Layout } from '@/components/layout';
import { Button, Card, NoSSR, CountryFlag } from '@/components/ui';
import { useCountries } from '@/hooks/useCategories';

export default function CountriesPage() {
  const router = useRouter();
  const { countries, loading, error } = useCountries();

  const handleCountryClick = (country: string) => {
    router.push(`/buscar?country=${encodeURIComponent(country)}`);
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
                <div className="text-6xl mb-4">🌍</div>
                <h1 className="text-4xl font-display font-bold mb-4">
                  Países
                </h1>
                <p className="text-xl text-primary-100 max-w-2xl mx-auto">
                  Explora radios y canales de TV de todo el mundo
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="container py-12">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-secondary-600">Cargando países...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="bg-error-50 border border-error-200 rounded-lg p-6 max-w-md mx-auto">
                  <h3 className="text-lg font-medium text-error-800 mb-2">
                    Error al cargar países
                  </h3>
                  <p className="text-error-600 mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()}>
                    Reintentar
                  </Button>
                </div>
              </div>
            ) : countries && countries.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {countries.map((country) => (
                  <div
                    key={country}
                    className="cursor-pointer group"
                    onClick={() => handleCountryClick(country)}
                  >
                    <Card className="p-6 hover:shadow-medium hover:scale-105 transition-all duration-200">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl group-hover:from-primary-100 group-hover:to-primary-200 transition-all duration-200 shadow-soft">
                          <CountryFlag 
                            country={country} 
                            size="lg"
                            className="filter drop-shadow-sm"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg text-secondary-900 group-hover:text-primary-600 transition-colors truncate">
                            {country}
                          </h3>
                          <p className="text-sm text-secondary-500 group-hover:text-primary-500 transition-colors">
                            Ver contenido
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 opacity-50">🌍</div>
                <h3 className="text-2xl font-bold text-secondary-900 mb-2">
                  No hay países disponibles
                </h3>
                <p className="text-secondary-600 mb-6">
                  Aún no tenemos contenido organizado por países.
                </p>
                <Button onClick={() => router.push('/')}>
                  Explorar todo el contenido
                </Button>
              </div>
            )}
          </div>
        </div>
      </NoSSR>
    </Layout>
  );
}