'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout';
import HeroSection from '@/components/layout/HeroSection';
import { MediaSection } from '@/components/media';
import { NoSSR } from '@/components/ui';
import { useFeaturedMedia, usePopularMedia, useRecentMedia } from '@/hooks/useMedia';
import { Media } from '@/types';

export default function HomePage() {
  const router = useRouter();
  const [currentPlayer, setCurrentPlayer] = useState<Media | null>(null);

  // Fetch data using custom hooks
  const { featuredMedia, loading: featuredLoading, error: featuredError } = useFeaturedMedia();
  const { popularMedia, loading: popularLoading, error: popularError } = usePopularMedia();
  const { recentMedia, loading: recentLoading, error: recentError } = useRecentMedia();

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleMediaPlay = (media: Media) => {
    setCurrentPlayer(media);
    // TODO: Open media player modal or navigate to media page
    router.push(`/${media.type}/${media.slug}`);
  };

  return (
    <Layout>
      <NoSSR>
        {/* Hero Section */}
        <HeroSection onSearch={handleSearch} />

        {/* Featured Media */}
        <MediaSection
          title="Contenido Destacado"
          subtitle="Los mejores canales y radios seleccionados especialmente para ti"
          media={featuredMedia}
          loading={featuredLoading}
          error={featuredError}
          viewAllLink="/destacados"
          onMediaPlay={handleMediaPlay}
          columns={4}
          className="bg-white"
        />

        {/* Popular Media */}
        <MediaSection
          title="Más Populares"
          subtitle="Los canales y radios con mayor audiencia"
          media={popularMedia}
          loading={popularLoading}
          error={popularError}
          viewAllLink="/populares"
          onMediaPlay={handleMediaPlay}
          columns={4}
          className="bg-secondary-50"
        />

        {/* Recent Media */}
        <MediaSection
          title="Recién Agregados"
          subtitle="Los últimos canales y radios que se han unido a nuestra plataforma"
          media={recentMedia}
          loading={recentLoading}
          error={recentError}
          viewAllLink="/recientes"
          onMediaPlay={handleMediaPlay}
          columns={4}
          className="bg-white"
        />

      {/* Categories Preview */}
      <section className="section-padding bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-secondary-900 mb-4">
              Explora por Categorías
            </h2>
            <p className="text-secondary-600 max-w-2xl mx-auto">
              Encuentra exactamente lo que buscas navegando por nuestras categorías especializadas
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Música', icon: '🎵', count: '150+', href: '/categoria/musica' },
              { name: 'Noticias', icon: '📰', count: '80+', href: '/categoria/noticias' },
              { name: 'Deportes', icon: '⚽', count: '60+', href: '/categoria/deportes' },
              { name: 'Entretenimiento', icon: '🎭', count: '120+', href: '/categoria/entretenimiento' },
              { name: 'Educativa', icon: '📚', count: '40+', href: '/categoria/educativa' },
              { name: 'Cristiana', icon: '✝️', count: '70+', href: '/categoria/cristiana' },
              { name: 'Regional', icon: '🏛️', count: '90+', href: '/categoria/regional' },
              { name: 'Talk Show', icon: '🎙️', count: '50+', href: '/categoria/talk-show' },
            ].map((category) => (
              <button
                key={category.name}
                onClick={() => router.push(category.href)}
                className="group p-6 bg-white rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 text-center"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <h3 className="font-semibold text-secondary-900 mb-1 group-hover:text-primary-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-secondary-500">
                  {category.count} canales
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              ¿Tienes una radio o canal de TV?
            </h2>
            <p className="text-xl text-primary-100">
              Únete a nuestra plataforma y llega a miles de oyentes y espectadores en todo el mundo
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <button
                onClick={() => router.push('/unete')}
                className="bg-white text-primary-600 hover:bg-primary-50 px-8 py-3 rounded-xl font-semibold transition-colors shadow-large hover:shadow-xl"
              >
                Únete Gratis
              </button>
              <button
                onClick={() => router.push('/contacto')}
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                Más Información
              </button>
            </div>
          </div>
        </div>
      </section>
      </NoSSR>
    </Layout>
  );
}