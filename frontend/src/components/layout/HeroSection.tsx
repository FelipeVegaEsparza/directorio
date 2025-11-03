'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { PlayIcon, TvIcon, RadioIcon } from '@heroicons/react/24/solid';
import { useStats } from '@/hooks/useStats';
import { formatNumber } from '@/utils';
import { cn } from '@/utils';
import { Button } from '@/components/ui';
import { SearchBar } from '@/components/forms';

interface HeroSectionProps {
  onSearch?: (query: string) => void;
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  className,
}) => {
  const router = useRouter();
  const { stats: statsData, loading: statsLoading } = useStats();
  
  const stats = [
    { 
      label: 'Radios Online', 
      value: statsLoading ? '...' : `${statsData?.totalRadios || 0}+`, 
      icon: RadioIcon 
    },
    { 
      label: 'Canales de TV', 
      value: statsLoading ? '...' : `${statsData?.totalTV || 0}+`, 
      icon: TvIcon 
    },
    { 
      label: 'Países', 
      value: statsLoading ? '...' : `${statsData?.totalCountries || 0}+`, 
      icon: '🌍' 
    },
    { 
      label: 'Reproducciones', 
      value: statsLoading ? '...' : formatNumber(statsData?.totalPlays || 0), 
      icon: PlayIcon 
    },
  ];

  return (
    <section className={cn('relative overflow-hidden min-h-[80vh] flex items-center', className)}>
      {/* Animated Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-accent-600 animate-gradient-xy"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-pulse"></div>
      
      {/* Geometric Shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-float delay-0"></div>
        <div className="absolute top-20 right-20 w-24 h-24 bg-accent-300/20 rounded-full animate-float delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-primary-300/15 rounded-full animate-float delay-2000"></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 bg-white/15 rounded-full animate-float delay-3000"></div>
        
        {/* Floating Icons */}
        <div className="absolute top-1/4 left-1/4 animate-bounce-slow delay-500">
          <RadioIcon className="w-8 h-8 text-white/30" />
        </div>
        <div className="absolute top-1/3 right-1/3 animate-bounce-slow delay-1500">
          <TvIcon className="w-10 h-10 text-white/25" />
        </div>
        <div className="absolute bottom-1/3 left-1/3 animate-bounce-slow delay-2500">
          <PlayIcon className="w-6 h-6 text-white/35" />
        </div>
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/6 w-2 h-2 bg-white/40 rounded-full animate-ping delay-100"></div>
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-accent-200/60 rounded-full animate-ping delay-700"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-white/50 rounded-full animate-ping delay-1200"></div>
        <div className="absolute top-3/4 right-1/6 w-1 h-1 bg-primary-200/60 rounded-full animate-ping delay-1800"></div>
      </div>

      {/* Mesh Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10"></div>

      <div className="relative container section-padding z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Main Heading */}
          <div className="space-y-4 animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white drop-shadow-lg">
              Descubre el mejor{' '}
              <span className="text-accent-200 animate-pulse">
                contenido online
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto text-balance drop-shadow-md">
              El directorio más completo de radios y canales de TV online. 
              Disfruta de transmisiones en vivo desde cualquier lugar del mundo.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto animate-fade-in-up delay-300">
            <SearchBar
              placeholder="Buscar radios, canales de TV, países..."
              onSearch={onSearch}
              size="lg"
              className="shadow-2xl backdrop-blur-sm bg-white/95"
            />
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-500">
            <Button 
              size="lg" 
              className="min-w-[160px] bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              onClick={() => router.push('/radios')}
            >
              <RadioIcon className="w-5 h-5 mr-2" />
              Ver Radios
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="min-w-[160px] bg-white/10 hover:bg-white/20 text-white border-white/40 backdrop-blur-sm shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              onClick={() => router.push('/tv-online')}
            >
              <TvIcon className="w-5 h-5 mr-2" />
              Ver TV Online
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 animate-fade-in-up delay-700">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
                style={{ animationDelay: `${800 + index * 100}ms` }}
              >
                <div className="flex justify-center mb-3">
                  {typeof stat.icon === 'string' ? (
                    <span className="text-3xl filter drop-shadow-sm">{stat.icon}</span>
                  ) : (
                    <stat.icon className="w-8 h-8 text-white drop-shadow-sm" />
                  )}
                </div>
                <div className="text-2xl font-bold text-white mb-1 drop-shadow-sm">
                  {stat.value}
                </div>
                <div className="text-sm text-white/80">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;