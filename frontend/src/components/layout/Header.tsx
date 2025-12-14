'use client';

import React, { useState, useEffect } from 'react';
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
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/utils';
import { useSiteConfig } from '@/hooks/useSiteConfig';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { config } = useSiteConfig();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-md py-2"
          : "bg-white shadow-sm py-4"
      )}
    >
      <div className="container-wide">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0 transition-transform duration-300 hover:scale-105">
            <Link href="/" className="flex items-center">
              <img
                src="/images/logo.png"
                alt="Hostreams"
                className={cn(
                  "w-auto transition-all duration-300",
                  scrolled ? "h-10" : "h-12"
                )}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const IconComponent = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                    active
                      ? 'bg-primary-50 text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  )}
                >
                  <IconComponent className={cn("w-4 h-4", active && "stroke-2")} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Search & CTA */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={() => router.push('/buscar')}
              className="p-2.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all duration-200"
              title="Buscar"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>

            <button
              onClick={handleIpstreamClick}
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 text-white text-sm font-semibold rounded-full hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              <RocketLaunchIcon className="w-4 h-4 group-hover:animate-pulse" />
              <span>Planes de Streaming</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors"
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
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg animate-fade-in-down">
            <div className="p-4 space-y-2">
              {navigation.map((item) => {
                const IconComponent = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-colors',
                      active
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              <div className="pt-4 mt-2 border-t border-gray-100 space-y-3">
                <button
                  onClick={() => {
                    router.push('/buscar');
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors w-full text-left"
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                  <span>Buscar</span>
                </button>

                <button
                  onClick={() => {
                    handleIpstreamClick();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/20"
                >
                  <RocketLaunchIcon className="w-5 h-5" />
                  <span>Planes de Streaming</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;