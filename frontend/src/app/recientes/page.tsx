'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Layout } from '@/components/layout';
import { MediaSection } from '@/components/media';
import { Button, NoSSR } from '@/components/ui';
import { useRecentMedia } from '@/hooks/useMedia';
import { Media } from '@/types';

export default function RecentPage() {
  const router = useRouter();
  const [currentPlayer, setCurrentPlayer] = useState<Media | null>(null);

  const { recentMedia, loading, error } = useRecentMedia();

  const handleMediaPlay = (media: Media) => {
    setCurrentPlayer(media);
    router.push(`/${media.type}/${media.slug}`);
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
                <div className="text-6xl mb-4">🆕</div>
                <h1 className="text-4xl font-display font-bold mb-4">
                  Recién Agregados
                </h1>
                <p className="text-xl text-primary-100 max-w-2xl mx-auto">
                  Los últimos canales y radios que se han unido a nuestra plataforma
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="container py-12">
            <MediaSection
              title=""
              media={recentMedia || []}
              loading={loading}
              error={error}
              onMediaPlay={handleMediaPlay}
              columns={4}
              className="bg-transparent"
            />

            {!loading && !error && (!recentMedia || recentMedia.length === 0) && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 opacity-50">🆕</div>
                <h3 className="text-2xl font-bold text-secondary-900 mb-2">
                  No hay contenido reciente
                </h3>
                <p className="text-secondary-600 mb-6">
                  Aún no tenemos contenido reciente disponible.
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