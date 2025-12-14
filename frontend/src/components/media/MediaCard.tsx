'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { PlayIcon, EyeIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import { cn, formatNumber } from '@/utils';
import { Media } from '@/types';
import { Card, Badge, CountryFlag } from '@/components/ui';
import { MediaPlayer } from '@/components/media';

interface MediaCardProps {
  media: Media;
  onPlay?: (media: Media) => void;
  isPlaying?: boolean;
  className?: string;
}

const MediaCard: React.FC<MediaCardProps> = ({
  media,
  onPlay,
  isPlaying = false,
  className,
}) => {
  const router = useRouter();

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onPlay) {
      onPlay(media);
    }
  };

  const handleOpenClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/${media.type}/${media.slug}`);
  };

  return (
    <Card
      className={cn(
        'group hover:shadow-large transition-all duration-300',
        'relative overflow-hidden',
        isPlaying ? 'ring-2 ring-primary-500' : 'hover:-translate-y-1 cursor-pointer',
        className
      )}
      padding="none"
    >
      <div onClick={!isPlaying ? () => router.push(`/${media.type}/${media.slug}`) : undefined}>
        {/* Image/Player Section */}
        <div className="relative w-full h-[300px] overflow-hidden flex items-center justify-center bg-black">
          {/* Background & Logo - Always rendered as base layer */}
          <div className="absolute inset-0 w-full h-full">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-100 via-accent-50 to-primary-200 animate-gradient-xy"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-pulse"></div>

            {/* Logo */}
            <div className="relative z-20 flex items-center justify-center w-full h-full">
              {media.logoUrl || media.bannerUrl ? (
                <img
                  src={media.logoUrl || media.bannerUrl}
                  alt={media.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-6xl opacity-50">
                    {media.type === 'radio' ? '📻' : '📺'}
                  </span>
                </div>
              )}
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 z-10">
              <div className="absolute top-4 left-4 w-2 h-2 bg-primary-300 rounded-full animate-bounce delay-100"></div>
              <div className="absolute top-8 right-8 w-1 h-1 bg-accent-400 rounded-full animate-ping delay-300"></div>
              <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-primary-400 rounded-full animate-pulse delay-500"></div>
              <div className="absolute bottom-4 right-4 w-1 h-1 bg-accent-300 rounded-full animate-bounce delay-700"></div>
            </div>
          </div>

          {/* Player Overlay - Only rendered when playing */}
          {isPlaying && (
            <div className="absolute inset-0 z-30 w-full h-full">
              <MediaPlayer
                media={media}
                autoplay={true}
                minimal={true}
              />
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-3 bg-white">
          {/* Title and Location */}
          <div>
            <h3 className="font-semibold text-lg text-secondary-900 group-hover:text-primary-600 transition-colors line-clamp-2">
              {media.name}
            </h3>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-2 mb-1">
              <Badge
                variant={media.type === 'radio' ? 'primary' : 'secondary'}
                size="sm"
              >
                {media.type === 'radio' ? '📻 Radio' : '📺 TV'}
              </Badge>
              {media.isFeatured && (
                <Badge variant="accent" size="sm">
                  ⭐ Destacado
                </Badge>
              )}
              {media.isVerified && (
                <Badge variant="success" size="sm">
                  <CheckBadgeIcon className="w-3 h-3 mr-1" />
                  Verificado
                </Badge>
              )}
            </div>

            {(media.city || media.country) && (
              <p className="text-secondary-600 text-sm flex items-center">
                {media.country && (
                  <>
                    <CountryFlag country={media.country} size="sm" className="mr-2" />
                    {media.country}
                  </>
                )}
                {media.city && media.country && ' • '}
                {media.city}
              </p>
            )}
          </div>

          {/* Description */}
          {media.description && (
            <p className="text-secondary-600 text-sm line-clamp-2">
              {media.description}
            </p>
          )}

          {/* Category */}
          {media.category && (
            <div>
              <Badge variant="secondary" size="sm">
                {media.category.name}
              </Badge>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-secondary-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <EyeIcon className="w-4 h-4" />
                <span>{formatNumber(media.viewCount)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <PlayIcon className="w-4 h-4" />
                <span>{formatNumber(media.playCount)}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenClick}
                className="bg-secondary-100 hover:bg-secondary-200 text-secondary-900 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
              >
                Abrir
              </button>
              <button
                onClick={handlePlayClick}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors shadow-sm",
                  isPlaying
                    ? "bg-error-600 hover:bg-error-700 text-white"
                    : "bg-primary-600 hover:bg-primary-700 text-white"
                )}
              >
                {isPlaying ? 'Detener' : 'Reproducir'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MediaCard;