'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  HomeIcon,
  RadioIcon,
  TvIcon,
  GlobeAltIcon,
  UserPlusIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/utils';
import { Button } from '@/components/ui';
import { useSiteConfig } from '@/hooks/useSiteConfig';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { config } = useSiteConfig();

  const navigation = [
    { name: 'Inicio', href: '/', icon: HomeIcon },
    { name: 'Radios', href: '/radios', icon: RadioIcon },
    { name: 'TV Online', href: '/tv-online', icon: TvIcon },
    { name: 'Países', href: '/paises', icon: GlobeAltIcon },
    { name: 'Únete', href: '/unete', icon: UserPlusIcon },
  ];

  const handleIpstreamClick = () => {
    window.open('https://ipstream.cl', '_blank', 'noopener,noreferrer');
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="bg-white shadow-soft sticky top-0 z-40">
      {/* Enhanced ipstream.cl branding banner with animations */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b border-blue-100 overflow-hidden relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-200 rounded-full -translate-x-16 -translate-y-16 animate-pulse"></div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-200 rounded-full translate-x-12 -translate-y-12 animate-pulse delay-1000"></div>
        </div>

        <div className="container-wide relative">
          <div className="flex items-center justify-center py-3 px-4 min-h-[44px]">
            <div className="text-center animate-fade-in">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg animate-bounce">⚡</span>
                <span className="text-sm text-slate-700 hidden sm:inline">Tecnología de streaming profesional por</span>
                <a
                  href="https://ipstream.cl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-blue-700 hover:text-blue-800 transition-all duration-300 hover:scale-105 underline decoration-blue-300 hover:decoration-blue-500 decoration-2"
                >
                  ipstream.cl
                </a>
                <span className="text-xs text-slate-500 hidden md:inline ml-2 animate-pulse">
                  ¿Necesitas tu plataforma?
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-wide">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-3">
              {config.logoUrl ? (
                <img
                  src={config.logoUrl}
                  alt={config.siteName}
                  className="h-8 w-auto"
                  onError={(e) => {
                    // Si falla la imagen, mostrar el logo por defecto
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className={cn(
                  "w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center",
                  config.logoUrl ? "hidden" : "flex"
                )}
                style={{ display: config.logoUrl ? 'none' : 'flex' }}
              >
                <span className="text-white font-bold text-lg">📻</span>
              </div>
              {!config.showOnlyLogo && (
                <span className="font-display font-bold text-xl text-secondary-900">
                  {config.siteName}
                </span>
              )}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav flex items-center space-x-6">
            {navigation.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
                  )}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Search, Streaming CTA and Admin */}
          <div className="desktop-actions flex items-center space-x-4">
            <button
              onClick={() => router.push('/buscar')}
              className="p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded-lg transition-colors"
              title="Buscar"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>

            {/* Subtle CTA for ipstream.cl */}
            <button
              onClick={handleIpstreamClick}
              className="hidden lg:flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-medium rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
              title="¿Necesitas tu propia plataforma de streaming?"
            >
              <span>🚀</span>
              <span>¿Tu streaming?</span>
            </button>

            <Link href="/admin">
              <Button variant="outline" size="sm">
                Admin
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 transition-colors"
            >
              <span className="sr-only">Abrir menú</span>
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-secondary-200">
              {navigation.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium transition-colors',
                      isActive(item.href)
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-secondary-200 space-y-1">
                <button
                  onClick={() => {
                    router.push('/buscar');
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 transition-colors w-full text-left"
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                  <span>Buscar</span>
                </button>

                {/* Mobile CTA for ipstream.cl */}
                <button
                  onClick={() => {
                    handleIpstreamClick();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all w-full text-left"
                >
                  <span className="text-lg">🚀</span>
                  <span>¿Necesitas tu streaming?</span>
                </button>

                <Link
                  href="/admin"
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <CogIcon className="w-5 h-5" />
                  <span>Admin</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;