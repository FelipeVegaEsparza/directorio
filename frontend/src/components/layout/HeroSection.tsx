'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { PlayIcon, TvIcon, RadioIcon } from '@heroicons/react/24/solid';
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

  return (
    <section className={cn('relative overflow-hidden min-h-[85vh] flex items-center', className)}>
      {/* Animated Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-700 to-accent-800 animate-gradient-xy"></div>

      {/* Dynamic Overlay Pattern */}
      <div className="absolute inset-0 opacity-20 bg-[url('/images/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      {/* Glowing Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Geometric Shapes & Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Icons with Glass Effect */}
        <div className="absolute top-20 left-[10%] animate-float delay-0">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl transform rotate-12">
            <RadioIcon className="w-8 h-8 text-white/80" />
          </div>
        </div>

        <div className="absolute bottom-32 right-[10%] animate-float delay-1500">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-xl">
            <TvIcon className="w-10 h-10 text-white/80" />
          </div>
        </div>

        <div className="absolute top-1/3 right-[15%] animate-float delay-2000">
          <div className="w-12 h-12 bg-accent-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/10 shadow-lg transform -rotate-6">
            <PlayIcon className="w-6 h-6 text-white/70" />
          </div>
        </div>

        {/* Abstract Shapes */}
        <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-accent-300 rounded-full animate-ping delay-700 opacity-75"></div>
        <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-primary-300 rounded-full animate-ping delay-1200 opacity-75"></div>
      </div>

      <div className="relative container section-padding z-10">
        <div className="max-w-5xl mx-auto text-center space-y-10">
          {/* Main Heading */}
          <div className="space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-4">
              <span className="flex h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
              <span className="text-sm font-medium text-white/90">Miles de canales en vivo</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-bold text-white tracking-tight leading-tight drop-shadow-2xl">
              Explora el universo del <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-300 via-white to-primary-300 animate-gradient-x">
                contenido digital
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-primary-100/90 max-w-3xl mx-auto text-balance font-light leading-relaxed">
              Tu puerta de entrada a las mejores radios y canales de TV del mundo.
              Sin límites, sin cortes, totalmente gratis.
            </p>
          </div>

          {/* Search Bar Container */}
          <div className="max-w-3xl mx-auto animate-fade-in-up delay-200">
            <div className="p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl">
              <SearchBar
                placeholder="¿Qué quieres ver o escuchar hoy?"
                onSearch={onSearch}
                size="lg"
                className="bg-white/95 hover:bg-white transition-colors border-0 shadow-inner"
              />
            </div>
            <div className="mt-3 flex flex-wrap justify-center gap-2 text-sm text-white/60">
              <span>Tendencias:</span>
              <button className="hover:text-white transition-colors underline decoration-white/30">Noticias</button>
              <button className="hover:text-white transition-colors underline decoration-white/30">Deportes</button>
              <button className="hover:text-white transition-colors underline decoration-white/30">Música Latina</button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center animate-fade-in-up delay-300 pt-4">
            <Button
              size="xl"
              className="min-w-[180px] bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-400 hover:to-accent-500 text-white border-0 shadow-lg shadow-accent-500/30 transform hover:-translate-y-1 transition-all duration-300 font-bold text-lg group"
              onClick={() => router.push('/radios')}
            >
              <RadioIcon className="w-6 h-6 mr-2 group-hover:animate-bounce" />
              Explorar Radios
            </Button>
            <Button
              size="xl"
              className="min-w-[180px] bg-white text-primary-900 hover:bg-gray-50 border-0 shadow-lg shadow-white/10 transform hover:-translate-y-1 transition-all duration-300 font-bold text-lg group"
              onClick={() => router.push('/tv-online')}
            >
              <TvIcon className="w-6 h-6 mr-2 text-primary-600 group-hover:animate-pulse" />
              Ver TV Online
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none"></div>
    </section>
  );
};

export default HeroSection;