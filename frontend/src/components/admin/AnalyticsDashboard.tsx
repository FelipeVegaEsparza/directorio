'use client';

import React, { useState } from 'react';
import { 
  ChartBarIcon, 
  EyeIcon, 
  PlayIcon, 
  TvIcon,
  RadioIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { Card, Button, Loading, CountryFlag } from '@/components/ui';
import { useRealTimeStats, useTopMedia } from '@/hooks';
import { cn } from '@/utils';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  growth?: {
    percentage: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  growth, 
  className 
}) => (
  <Card className={cn("p-6", className)}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-secondary-600">{title}</p>
        <p className="text-2xl font-bold text-secondary-900">
          {value.toLocaleString()}
        </p>
        {growth && (
          <div className={cn(
            "flex items-center mt-2 text-sm",
            growth.isPositive ? "text-success-600" : "text-error-600"
          )}>
            {growth.isPositive ? (
              <ArrowUpIcon className="w-4 h-4 mr-1" />
            ) : (
              <ArrowDownIcon className="w-4 h-4 mr-1" />
            )}
            {Math.abs(growth.percentage).toFixed(1)}%
          </div>
        )}
      </div>
      <div className="p-3 bg-primary-100 rounded-xl">
        {icon}
      </div>
    </div>
  </Card>
);

interface TopMediaItemProps {
  media: {
    id: string;
    name: string;
    type: string;
    country: string;
    logoUrl?: string;
    recentViews?: number;
    recentPlays?: number;
  };
  rank: number;
  metric: 'views' | 'plays';
}

const TopMediaItem: React.FC<TopMediaItemProps> = ({ media, rank, metric }) => (
  <div className="flex items-center space-x-3 p-3 hover:bg-secondary-50 rounded-lg transition-colors">
    <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
      <span className="text-sm font-semibold text-primary-700">#{rank}</span>
    </div>
    
    {media.logoUrl ? (
      <img
        src={media.logoUrl}
        alt={media.name}
        className="w-10 h-10 rounded-lg object-cover"
      />
    ) : (
      <div className="w-10 h-10 bg-secondary-200 rounded-lg flex items-center justify-center">
        {media.type === 'tv' ? (
          <TvIcon className="w-5 h-5 text-secondary-500" />
        ) : (
          <RadioIcon className="w-5 h-5 text-secondary-500" />
        )}
      </div>
    )}
    
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-secondary-900 truncate">
        {media.name}
      </p>
      <div className="flex items-center space-x-1 text-xs text-secondary-500">
        <span>{media.type === 'tv' ? '📺' : '📻'}</span>
        {media.country && (
          <>
            <CountryFlag country={media.country} size="sm" />
            <span>{media.country}</span>
          </>
        )}
      </div>
    </div>
    
    <div className="text-right">
      <p className="text-sm font-semibold text-secondary-900">
        {metric === 'views' ? media.recentViews : media.recentPlays}
      </p>
      <p className="text-xs text-secondary-500">
        {metric === 'views' ? 'vistas' : 'reproducciones'}
      </p>
    </div>
  </div>
);

const AnalyticsDashboard: React.FC = () => {
  const [period, setPeriod] = useState(30);
  const [selectedType, setSelectedType] = useState<'radio' | 'tv' | undefined>();
  
  const { stats: realTimeStats, loading: realTimeLoading } = useRealTimeStats();
  const { topMedia, loading: topMediaLoading } = useTopMedia(period, selectedType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">
            Analytics Avanzados
          </h1>
          <p className="text-secondary-600">
            Estadísticas detalladas y métricas de rendimiento
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={period}
            onChange={(e) => setPeriod(Number(e.target.value))}
            className="px-3 py-2 border border-secondary-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value={7}>Últimos 7 días</option>
            <option value={30}>Últimos 30 días</option>
            <option value={90}>Últimos 90 días</option>
          </select>
          
          <select
            value={selectedType || ''}
            onChange={(e) => setSelectedType(e.target.value as 'radio' | 'tv' || undefined)}
            className="px-3 py-2 border border-secondary-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Todos los tipos</option>
            <option value="radio">Solo Radios</option>
            <option value="tv">Solo TV</option>
          </select>
        </div>
      </div>

      {/* Real-time Stats */}
      {realTimeLoading ? (
        <Card className="p-6">
          <Loading size="md" />
        </Card>
      ) : realTimeStats && (
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <ClockIcon className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-secondary-900">
              Estadísticas en Tiempo Real
            </h2>
            <span className="text-xs text-secondary-500">
              Actualizado: {new Date(realTimeStats.timestamp).toLocaleTimeString()}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Vistas (última hora)"
              value={realTimeStats.lastHour.views}
              icon={<EyeIcon className="w-6 h-6 text-primary-600" />}
              className="bg-gradient-to-br from-blue-50 to-blue-100"
            />
            <StatCard
              title="Reproducciones (última hora)"
              value={realTimeStats.lastHour.plays}
              icon={<PlayIcon className="w-6 h-6 text-primary-600" />}
              className="bg-gradient-to-br from-green-50 to-green-100"
            />
            <StatCard
              title="Vistas (24 horas)"
              value={realTimeStats.last24Hours.views}
              icon={<EyeIcon className="w-6 h-6 text-primary-600" />}
              className="bg-gradient-to-br from-purple-50 to-purple-100"
            />
            <StatCard
              title="Streams Activos"
              value={realTimeStats.activeStreams}
              icon={<ChartBarIcon className="w-6 h-6 text-primary-600" />}
              className="bg-gradient-to-br from-orange-50 to-orange-100"
            />
          </div>
        </div>
      )}

      {/* Top Media */}
      {topMediaLoading ? (
        <Card className="p-6">
          <Loading size="md" />
        </Card>
      ) : topMedia && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top by Views */}
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <EyeIcon className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-secondary-900">
                Más Visitados ({period} días)
              </h3>
            </div>
            
            <div className="space-y-2">
              {topMedia.topByViews.slice(0, 5).map((media, index) => (
                <TopMediaItem
                  key={media.id}
                  media={media}
                  rank={index + 1}
                  metric="views"
                />
              ))}
            </div>
          </Card>

          {/* Top by Plays */}
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <PlayIcon className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-secondary-900">
                Más Reproducidos ({period} días)
              </h3>
            </div>
            
            <div className="space-y-2">
              {topMedia.topByPlays.slice(0, 5).map((media, index) => (
                <TopMediaItem
                  key={media.id}
                  media={media}
                  rank={index + 1}
                  metric="plays"
                />
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Activity Chart Placeholder */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <ChartBarIcon className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-secondary-900">
            Actividad por Día
          </h3>
        </div>
        
        <div className="h-64 bg-secondary-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <ChartBarIcon className="w-12 h-12 text-secondary-400 mx-auto mb-2" />
            <p className="text-secondary-600">
              Gráfico de actividad diaria
            </p>
            <p className="text-sm text-secondary-500">
              (Se puede integrar con Chart.js o similar)
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;