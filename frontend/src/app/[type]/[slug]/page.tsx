'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon, ShareIcon, PlayIcon } from '@heroicons/react/24/outline';
import { Layout } from '@/components/layout';
import { MediaPlayer, MediaInfo, MediaSection } from '@/components/media';
import { Button, Loading, NoSSR } from '@/components/ui';
import IpstreamCTA from '@/components/IpstreamCTA';
import { useMediaDetail } from '@/hooks/useMediaDetail';
import { useMedia } from '@/hooks/useMedia';
import { getImageUrl } from '@/utils/imageUrl';

export default function MediaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const type = params.type as 'radio' | 'tv';
  const slug = params.slug as string;

  const [showPlayer, setShowPlayer] = useState(false);

  // Fetch media details
  const { media, loading, error, recordPlay } = useMediaDetail(slug);

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
      <div className="bg-secondary-50 min-h-screen pb-12">
        {/* Hero Background - Blurred */}
        <div className="absolute top-0 left-0 w-full h-96 overflow-hidden z-0">
          {media.bannerUrl ? (
            <>
              <img
                src={media.bannerUrl}
                alt=""
                className="w-full h-full object-cover filter blur-xl opacity-50 scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-secondary-50/50 to-secondary-50" />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-primary-100/50 to-secondary-50" />
          )}
        </div>

        {/* Navigation Bar */}
        <div className="relative z-10 px-4 py-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="bg-white/50 hover:bg-white/80 backdrop-blur-sm shadow-sm"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Volver
            </Button>

            <Button
              variant="ghost"
              onClick={handleShare}
              className="bg-white/50 hover:bg-white/80 backdrop-blur-sm shadow-sm"
            >
              <ShareIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4">
          {/* Card Container */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-secondary-100">

            {media.type === 'radio' ? (
              /* RADIO LAYOUT */
              <>
                {/* Banner for Radio */}
                {media.bannerUrl && (
                  <div className="w-full h-32 sm:h-48 relative">
                    <img
                      src={media.bannerUrl}
                      alt={media.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                  {/* Left Column - Visual & Player */}
                  <div className="md:col-span-5 bg-gradient-to-br from-secondary-50 to-white p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-secondary-100 relative overflow-hidden">
                    {/* Decorative Background Circles */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
                      <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary-200 rounded-full blur-3xl"></div>
                      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-accent-200 rounded-full blur-3xl"></div>
                    </div>

                    <div className="relative z-10 w-full max-w-xs mx-auto text-center space-y-8">
                      {/* Radio Logo Container */}
                      <div className="relative mx-auto w-48 h-48 sm:w-56 sm:h-56">
                        <div className="w-full h-full rounded-full shadow-2xl overflow-hidden border-4 border-white bg-white relative z-10">
                          {media.logoUrl || media.bannerUrl ? (
                            <img
                              src={getImageUrl(media.logoUrl || media.bannerUrl)}
                              alt={media.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-secondary-100">
                              <span className="text-6xl opacity-30">📻</span>
                            </div>
                          )}
                        </div>

                        {/* Live Pulse Effect */}
                        <div className="absolute -inset-4 bg-primary-500/20 rounded-full animate-pulse z-0"></div>
                      </div>

                      {/* Radio Player Controls */}
                      <div className="w-full">
                        {showPlayer ? (
                          <div className="bg-white rounded-xl shadow-lg p-2 border border-secondary-100">
                            <MediaPlayer
                              media={media}
                              autoplay={true}
                              onPlay={recordPlay}
                            />
                          </div>
                        ) : (
                          <Button
                            onClick={handlePlay}
                            size="lg"
                            className="w-full py-4 text-lg font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 rounded-xl flex items-center justify-center gap-3"
                          >
                            <div className="bg-white/20 p-1 rounded-full">
                              <PlayIcon className="w-6 h-6" />
                            </div>
                            Escuchar en vivo
                          </Button>
                        )}
                      </div>

                      {/* Live Indicator */}
                      <div className="flex items-center justify-center space-x-2 text-error-500 font-medium bg-error-50 px-4 py-1.5 rounded-full inline-flex mx-auto">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-error-500"></span>
                        </span>
                        <span className="text-sm tracking-wide">TRANSMITIENDO EN VIVO</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Info & Details */}
                  <div className="md:col-span-7 p-8 md:p-10 flex flex-col h-full">
                    <div className="flex-1">
                      <MediaInfo media={media} />
                    </div>

                    {/* Additional Metadata */}
                    <div className="mt-8 pt-8 border-t border-secondary-100">
                      <div className="flex flex-wrap gap-4 justify-between items-center text-sm text-secondary-500">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-secondary-100 rounded text-xs font-medium uppercase tracking-wider">
                            {media.category?.name || 'Radio'}
                          </span>
                          <span>•</span>
                          <span>{media.city}, {media.country}</span>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1" title="Reproducciones">
                            <PlayIcon className="w-4 h-4" />
                            <span>{media.playCount || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* TV LAYOUT - Prominent Player */
              <div className="flex flex-col">
                {/* Player Section - Full Width at Top */}
                <div className="w-full bg-black relative">
                  <div className="aspect-video w-full max-h-[70vh] mx-auto">
                    {showPlayer ? (
                      <MediaPlayer
                        media={media}
                        autoplay={true}
                        onPlay={recordPlay}
                        minimal={true}
                      />
                    ) : (
                      <div className="relative w-full h-full group cursor-pointer" onClick={handlePlay}>
                        {/* Preview Image */}
                        {media.bannerUrl || media.logoUrl ? (
                          <img
                            src={getImageUrl(media.bannerUrl || media.logoUrl)}
                            alt={media.name}
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-secondary-900">
                            <span className="text-6xl opacity-20">📺</span>
                          </div>
                        )}

                        {/* Play Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-24 h-24 bg-primary-600/90 text-white rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300 backdrop-blur-sm">
                            <PlayIcon className="w-12 h-12 ml-1" />
                          </div>
                        </div>

                        {/* Live Indicator */}
                        <div className="absolute top-6 left-6">
                          <div className="flex items-center space-x-2 px-4 py-2 bg-error-600 text-white rounded-lg text-base font-bold shadow-md">
                            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                            <span>EN VIVO</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-8 md:p-10 bg-white">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Left: Main Info */}
                    <div className="flex-1">
                      <MediaInfo media={media} />
                    </div>

                    {/* Right: Metadata & Stats */}
                    <div className="md:w-72 flex-shrink-0 flex flex-col gap-4 pt-4 md:pt-0 md:border-l border-secondary-100 md:pl-8">
                      <div className="flex items-center gap-2 text-secondary-600">
                        <span className="px-2.5 py-1 bg-secondary-100 rounded text-xs font-medium uppercase tracking-wider">
                          {media.category?.name || 'TV'}
                        </span>
                        <span>•</span>
                        <span>{media.city}, {media.country}</span>
                      </div>

                      <div className="flex items-center gap-2 text-secondary-600" title="Reproducciones">
                        <PlayIcon className="w-5 h-5" />
                        <span className="font-medium">{media.playCount || 0} reproducciones</span>
                      </div>

                      <Button onClick={handleShare} variant="outline" className="w-full justify-center mt-2">
                        <ShareIcon className="w-4 h-4 mr-2" />
                        Compartir
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ipstream.cl Banner CTA */}
          <div className="mt-12">
            <IpstreamCTA variant="banner" />
          </div>

          {/* Related Content */}
          <NoSSR>
            {filteredRelatedMedia.length > 0 && (
              <div className="mt-16">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-secondary-900">
                    También te podría gustar
                  </h2>
                  <div className="h-1 flex-1 bg-secondary-100 ml-6 rounded-full"></div>
                </div>

                <MediaSection
                  title=""
                  subtitle=""
                  media={filteredRelatedMedia}
                  loading={relatedLoading}
                  columns={3}
                  className="bg-transparent p-0"
                />
              </div>
            )}
          </NoSSR>
        </div>
      </div>
    </Layout>
  );
}