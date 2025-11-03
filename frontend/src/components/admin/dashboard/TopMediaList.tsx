import React from 'react';
import { Media } from '@/types';
import { PlayIcon, EyeIcon } from '@heroicons/react/24/outline';
import { CountryFlag } from '@/components/ui';

interface TopMediaListProps {
  title: string;
  media: Media[];
  type: 'views' | 'plays';
  loading?: boolean;
}

export function TopMediaList({ title, media, type, loading }: TopMediaListProps) {
  const Icon = type === 'views' ? EyeIcon : PlayIcon;
  const getCount = (item: Media) => type === 'views' ? item.viewCount : item.playCount;

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            {title}
          </h3>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          {title}
        </h3>
        
        {media.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No hay datos disponibles
          </p>
        ) : (
          <div className="space-y-3">
            {media.slice(0, 5).map((item, index) => (
              <div key={item.id} className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                    {index + 1}
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  {item.logoUrl ? (
                    <img
                      src={item.logoUrl}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-500">
                        {item.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.name}
                  </p>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <span>{item.type === 'radio' ? 'Radio' : 'TV'}</span>
                    <span>•</span>
                    {item.country ? (
                      <>
                        <CountryFlag country={item.country} size="sm" />
                        <span>{item.country}</span>
                      </>
                    ) : (
                      <span>Sin país</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Icon className="w-4 h-4" />
                  <span>{getCount(item).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}