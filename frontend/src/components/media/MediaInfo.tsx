'use client';

import React from 'react';
import Link from 'next/link';
import { 
  EyeIcon, 
  PlayIcon, 
  CheckBadgeIcon,
  MapPinIcon,
  TagIcon,
  CalendarIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { cn, formatNumber, formatDate } from '@/utils';
import { Media } from '@/types';
import { Card, Badge, CountryFlag } from '@/components/ui';

interface MediaInfoProps {
  media: Media;
  className?: string;
}

const MediaInfo: React.FC<MediaInfoProps> = ({
  media,
  className,
}) => {
  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  return (
    <div className={cn('space-y-6 w-full', className)}>
      {/* Basic Info */}
      <Card className="overflow-hidden">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-display font-bold text-secondary-900">
                  {media.name}
                </h1>
                {media.isVerified && (
                  <CheckBadgeIcon className="w-6 h-6 text-success-500" title="Verificado" />
                )}
              </div>
              
              <div className="space-y-3">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={media.type === 'radio' ? 'primary' : 'secondary'}>
                    {media.type === 'radio' ? '📻 Radio' : '📺 TV'}
                  </Badge>

                  {media.isFeatured && (
                    <Badge variant="accent">
                      ⭐ Destacado
                    </Badge>
                  )}
                </div>

                {/* Location and Category */}
                <div className="flex flex-col space-y-2 text-sm text-secondary-600">
                  {/* Location */}
                  {(media.country || media.city) && (
                    <div className="flex items-center space-x-1">
                      <MapPinIcon className="w-4 h-4 flex-shrink-0" />
                      <div className="flex items-center space-x-2 truncate">
                        {media.country && (
                          <>
                            <CountryFlag country={media.country} size="sm" />
                            <span>{media.country}</span>
                          </>
                        )}
                        {media.city && media.country && <span>,</span>}
                        {media.city && <span>{media.city}</span>}
                      </div>
                    </div>
                  )}

                  {/* Category */}
                  {media.category && (
                    <div className="flex items-center space-x-1">
                      <TagIcon className="w-4 h-4 flex-shrink-0" />
                      <Link 
                        href={`/categoria/${media.category.slug}`}
                        className="hover:text-primary-600 transition-colors truncate"
                      >
                        {media.category.name}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Logo */}
            {media.logoUrl && (
              <div className="flex-shrink-0 ml-4">
                <img
                  src={media.logoUrl}
                  alt={media.name}
                  className="w-20 h-20 rounded-xl object-cover shadow-soft"
                />
              </div>
            )}
          </div>

          {/* Description */}
          {media.description && (
            <div>
              <p className="text-secondary-700 leading-relaxed">
                {media.description}
              </p>
            </div>
          )}

          {/* Stats */}
          <div className="pt-4 border-t border-secondary-200 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-secondary-600">
                <EyeIcon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{formatNumber(media.viewCount)}</span>
                <span className="text-sm">visualizaciones</span>
              </div>
              <div className="flex items-center space-x-2 text-secondary-600">
                <PlayIcon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{formatNumber(media.playCount)}</span>
                <span className="text-sm">reproducciones</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-secondary-600">
              <CalendarIcon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">Desde {formatDate(media.createdAt)}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Social Links */}
      {media.socialLinks && media.socialLinks.length > 0 && (
        <Card>
          <div>
            <h3 className="font-semibold text-lg text-secondary-900 mb-4 flex items-center">
              <GlobeAltIcon className="w-5 h-5 mr-2" />
              Redes Sociales
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {media.socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 p-3 bg-secondary-50 hover:bg-secondary-100 rounded-lg transition-colors group"
                >
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-soft group-hover:shadow-medium transition-shadow">
                    {getSocialIcon(link.platform)}
                  </div>
                  <span className="font-medium text-secondary-700">
                    {getPlatformName(link.platform)}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Schedule */}
      {media.schedules && media.schedules.length > 0 && (
        <Card>
          <div>
            <h3 className="font-semibold text-lg text-secondary-900 mb-4 flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2" />
              Programación
            </h3>
            <div className="space-y-3">
              {media.schedules
                .sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime))
                .map((schedule) => (
                  <div
                    key={schedule.id}
                    className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-secondary-900 min-w-[80px]">
                          {dayNames[schedule.dayOfWeek]}
                        </span>
                        <span className="text-secondary-600">
                          {schedule.startTime} - {schedule.endTime}
                        </span>
                      </div>
                      <div className="mt-1">
                        <span className="font-medium text-secondary-800">
                          {schedule.programName}
                        </span>
                        {schedule.description && (
                          <p className="text-sm text-secondary-600 mt-1">
                            {schedule.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

// Helper function to get social media icons
const getSocialIcon = (platform: string) => {
  const icons: Record<string, string> = {
    facebook: '📘',
    twitter: '🐦',
    instagram: '📷',
    youtube: '📺',
    tiktok: '🎵',
    linkedin: '💼',
    website: '🌐',
    whatsapp: '💬',
    telegram: '✈️',
  };

  return icons[platform.toLowerCase()] || '🔗';
};

// Helper function to get platform display name
const getPlatformName = (platform: string) => {
  const names: Record<string, string> = {
    facebook: 'Facebook',
    twitter: 'Twitter/X',
    instagram: 'Instagram',
    youtube: 'YouTube',
    tiktok: 'TikTok',
    linkedin: 'LinkedIn',
    website: 'Sitio Web',
    whatsapp: 'WhatsApp',
    telegram: 'Telegram',
  };

  return names[platform.toLowerCase()] || platform;
};

export default MediaInfo;