'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon, ShareIcon } from '@heroicons/react/24/outline';
import { Layout } from '@/components/layout';
import { MediaPlayer, MediaInfo, MediaSection } from '@/components/media';
import { Button, Loading, NoSSR } from '@/components/ui';
import IpstreamCTA from '@/components/IpstreamCTA';
import { useMediaDetail } from '@/hooks/useMediaDetail';
import { useMedia } from '@/hooks/useMedia';
import { Media } from '@/types';

export default function MediaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const type = params.type as 'radio' | 'tv';
  const slug = params.slug as string;

  const [showPlayer, setShowPlayer] = useState(false);

  // Fetch media details
  const { media, loading, error, recordPlay } = useMediaDetail(slug);

  // Media loaded

  // Fetch related media
  const { 
    media: relatedMedia, 
    loading: relatedLoading 
  } = useMedia({
    type,
    category: media?.category?.slug,
    limit: 6,
  });

  const handlePlay = () => {
    setShowPlayer(true);
    recordPlay();
  };

  const handleShare = async () => {
    if (navigator.share && media) {
      try {
        await navigator.share({
          title: media.name,
          text: media.description || `Escucha ${media.name} en vivo`,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback to clipboard
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    // TODO: Show toast notification
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
          <Loading size="lg" text="Cargando contenido..." />
        </div>
      </Layout>
    );
  }

  if (error || !media) {
    return (
      <Layout>
        <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-error-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              Contenido no encontrado
            </h1>
            <p className="text-secondary-600 mb-6">
              {error || 'El contenido que buscas no existe o ha sido eliminado.'}
            </p>
            <div className="space-x-4">
              <Button onClick={() => router.back()}>
                Volver atrás
              </Button>
              <Button variant="outline" onClick={() => router.push('/')}>
                Ir al inicio
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Filter out current media from related
  const filteredRelatedMedia = relatedMedia?.filter(item => item.id !== media.id) || [];

  return (
    <Layout>
      <div className="bg-secondary-50 min-h-screen">
        {/* Hero Section */}
        <div className="relative">
          {/* Banner Image */}
          {media.bannerUrl && (
            <div className="h-64 md:h-80 relative overflow-hidden">
              <img
                src={media.bannerUrl}
                alt={media.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>
          )}

          {/* Navigation */}
          <div className="absolute top-4 left-4 z-10">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </div>

          {/* Share Button */}
          <div className="absolute top-4 right-4 z-10">
            <Button
              variant="ghost"
              onClick={handleShare}
              className="bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm"
            >
              <ShareIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className={`py-8 ${media.type === 'radio' ? 'max-w-6xl mx-auto px-6' : 'container'}`}>
          {media.type === 'radio' ? (
            /* Radio Layout - Two Columns */
            <div className="space-y-12">
              {/* Radio Player and Info Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Left Column - Logo and Play Button */}
                <div className="text-center">
                  {showPlayer ? (
                    <div className="max-w-md mx-auto">
                      <MediaPlayer
                        media={media}
                        autoplay={true}
                        onPlay={recordPlay}
                      />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Radio Logo/Image */}
                      <div className="flex justify-center">
                        <div className="w-64 h-64 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full overflow-hidden relative shadow-xl">
                          {media.logoUrl || media.bannerUrl ? (
                            <img
                              src={media.logoUrl || media.bannerUrl}
                              alt={media.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-6xl opacity-50">📻</span>
                            </div>
                          )}
                          
                          {/* Live Indicator */}
                          <div className="absolute top-4 left-4">
                            <div className="flex items-center space-x-2 px-3 py-1 bg-error-500 text-white rounded-full text-sm font-medium">
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                              <span>EN VIVO</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Play Button */}
                      <div className="flex justify-center">
                        <Button
                          onClick={handlePlay}
                          size="lg"
                          className="px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        >
                          <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                          🎧 Escuchar en vivo
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Radio Info */}
                <div className="flex items-center justify-center lg:justify-start">
                  <div className="w-full max-w-md">
                    <MediaInfo media={media} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* TV Layout - Full Width */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Player */}
                <div>
                  {showPlayer ? (
                    <MediaPlayer
                      media={media}
                      autoplay={true}
                      onPlay={recordPlay}
                    />
                  ) : (
                    <div className="relative">
                      {/* Player Preview */}
                      <div className="aspect-video bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl overflow-hidden relative">
                        {media.bannerUrl || media.logoUrl ? (
                          <img
                            src={media.bannerUrl || media.logoUrl}
                            alt={media.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-8xl opacity-50">📺</span>
                          </div>
                        )}
                        
                        {/* Play Overlay */}
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <Button
                            onClick={handlePlay}
                            size="lg"
                            className="bg-white/90 hover:bg-white text-primary-600 rounded-full p-6 shadow-large hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                          >
                            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </Button>
                        </div>

                        {/* Live Indicator */}
                        <div className="absolute top-4 left-4">
                          <div className="flex items-center space-x-2 px-3 py-1 bg-error-500 text-white rounded-full text-sm font-medium">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            <span>EN VIVO</span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex justify-center mt-6">
                        <Button onClick={handlePlay} size="lg">
                          📺 Ver en vivo
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <MediaInfo media={media} />
              </div>
            </div>
          )}

          {/* ipstream.cl Banner CTA */}
          <div className="mt-12">
            <IpstreamCTA variant="banner" />
          </div>

          {/* Related Content */}
          <NoSSR>
            {filteredRelatedMedia.length > 0 && (
              <div className="mt-16">
                <MediaSection
                  title="Contenido Relacionado"
                  subtitle={`Más ${media.type === 'radio' ? 'radios' : 'canales'} que te pueden interesar`}
                  media={filteredRelatedMedia}
                  loading={relatedLoading}
                  columns={3}
                  className="bg-transparent"
                />
              </div>
            )}
          </NoSSR>
        </div>
      </div>
    </Layout>
  );
}