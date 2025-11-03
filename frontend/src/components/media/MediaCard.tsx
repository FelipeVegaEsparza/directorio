'use client';

import React from 'react';
import Link from 'next/link';
import { PlayIcon, EyeIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import { cn, formatNumber } from '@/utils';
import { Media } from '@/types';
import { Card, Badge, CountryFlag } from '@/components/ui';

interface MediaCardProps {
  media: Media;
  onPlay?: (media: Media) => void;
  className?: string;
}

const MediaCard: React.FC<MediaCardProps> = ({
  media,
  onPlay,
  className,
}) => {
  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onPlay) {
      onPlay(media);
    }
  };

  return (
    <Card 
      className={cn(
        'group hover:shadow-large transition-all duration-300 hover:-translate-y-1',
        'cursor-pointer relative overflow-hidden',
        className
      )}
      padding="none"
    >
      <Link href={`/${media.type}/${media.slug}`}>
        {/* Image/Logo Section */}
        <div className="relative w-full h-[300px] overflow-hidden flex items-center justify-center">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-100 via-accent-50 to-primary-200 animate-gradient-xy"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-pulse"></div>
          
          {/* Logo - Always visible with high z-index */}
          <div className="relative z-20 flex items-center justify-center w-full h-full">
            {media.logoUrl || media.bannerUrl ? (
              <img
                src={media.logoUrl || media.bannerUrl}
                alt={media.name}
                className="w-[280px] h-[280px] object-contain group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-6xl opacity-50">
                  {media.type === 'radio' ? '📻' : '📺'}
                </span>
              </div>
            )}
          </div>

          {/* Floating Particles - Behind logo */}
          <div className="absolute inset-0 z-10">
            <div className="absolute top-4 left-4 w-2 h-2 bg-primary-300 rounded-full animate-bounce delay-100"></div>
            <div className="absolute top-8 right-8 w-1 h-1 bg-accent-400 rounded-full animate-ping delay-300"></div>
            <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-primary-400 rounded-full animate-pulse delay-500"></div>
            <div className="absolute bottom-4 right-4 w-1 h-1 bg-accent-300 rounded-full animate-bounce delay-700"></div>
          </div>
          
          {/* Play Button - Positioned in corner */}
          <div className="absolute bottom-4 right-4 z-30">
            <button
              onClick={handlePlayClick}
              className="opacity-80 group-hover:opacity-100 transform group-hover:scale-110 transition-all duration-300 bg-primary-600 hover:bg-primary-700 text-white rounded-full p-3 shadow-lg hover:shadow-xl"
            >
              <PlayIcon className="w-6 h-6" />
            </button>
          </div>


        </div>

        {/* Content Section */}
        <div className="p-4 space-y-3">
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
            
            {/* Quick Play Button */}
            <button
              onClick={handlePlayClick}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-3 py-1.5 text-xs font-medium"
            >
              Reproducir
            </button>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default MediaCard;