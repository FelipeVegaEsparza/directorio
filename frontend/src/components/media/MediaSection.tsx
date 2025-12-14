'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { cn } from '@/utils';
import { Media } from '@/types';
import { MediaCard } from '@/components/media';
import { Loading } from '@/components/ui';

interface MediaSectionProps {
  title: string;
  subtitle?: string;
  media: Media[];
  loading?: boolean;
  error?: string | null;
  viewAllLink?: string;
  onMediaPlay?: (media: Media) => void;
  playingInstanceId?: string | null;
  sectionId?: string;
  className?: string;
  columns?: 2 | 3 | 4 | 6;
}

const MediaSection: React.FC<MediaSectionProps> = ({
  title,
  subtitle,
  media,
  loading = false,
  error,
  viewAllLink,
  onMediaPlay,
  playingInstanceId,
  sectionId = 'default',
  className,
  columns = 3,
}) => {
  // MediaSection component

  const gridClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  };

  if (loading) {
    return (
      <section className={cn('section-padding', className)}>
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-secondary-900">
                {title}
              </h2>
              {subtitle && (
                <p className="text-secondary-600 mt-2">{subtitle}</p>
              )}
            </div>
          </div>
          <div className="flex justify-center py-12">
            <Loading size="lg" text="Cargando contenido..." />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={cn('section-padding', className)}>
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-secondary-900">
                {title}
              </h2>
              {subtitle && (
                <p className="text-secondary-600 mt-2">{subtitle}</p>
              )}
            </div>
          </div>
          <div className="text-center py-12">
            <div className="text-error-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              Error al cargar contenido
            </h3>
            <p className="text-secondary-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!media || media.length === 0) {
    return (
      <section className={cn('section-padding', className)}>
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-secondary-900">
                {title}
              </h2>
              {subtitle && (
                <p className="text-secondary-600 mt-2">{subtitle}</p>
              )}
            </div>
          </div>
          <div className="text-center py-12">
            <div className="text-secondary-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              No hay contenido disponible
            </h3>
            <p className="text-secondary-600">
              No se encontraron medios para mostrar en esta sección.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={cn('section-padding', className)}>
      <div className="container">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-display font-bold text-secondary-900">
              {title}
            </h2>
            {subtitle && (
              <p className="text-secondary-600 mt-2">{subtitle}</p>
            )}
          </div>
          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium transition-colors group"
            >
              <span>Ver todos</span>
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {/* Media Grid */}
        <div className={cn(
          'grid gap-6',
          gridClasses[columns]
        )}>
          {media.map((item) => (
            <MediaCard
              key={item.id}
              media={item}
              onPlay={onMediaPlay}
              isPlaying={playingInstanceId === `${sectionId}-${item.id}`}
              className="animate-fade-in"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MediaSection;