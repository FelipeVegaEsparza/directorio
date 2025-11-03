'use client';

import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui';

interface IpstreamCTAProps {
  variant?: 'banner' | 'card' | 'sidebar';
  className?: string;
}

const IpstreamCTA: React.FC<IpstreamCTAProps> = ({ 
  variant = 'card', 
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClick = () => {
    window.open('https://ipstream.cl', '_blank', 'noopener,noreferrer');
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  if (variant === 'banner') {
    return (
      <div className={`bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-lg shadow-lg ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-2xl">🚀</div>
            <div>
              <h3 className="font-semibold text-lg">¿Te gusta esta plataforma?</h3>
              <p className="text-blue-100 text-sm">Crea la tuya con ipstream.cl - Soluciones de streaming profesionales</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleClick}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Conocer más
            </Button>
            <button
              onClick={handleClose}
              className="text-white/70 hover:text-white p-1"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 ${className}`}>
        <div className="text-center space-y-4">
          <div className="text-3xl">💡</div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">¿Quieres tu propia plataforma?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Esta plataforma fue desarrollada con tecnología ipstream.cl. 
              Crea tu propio servicio de streaming profesional.
            </p>
          </div>
          <Button
            onClick={handleClick}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            Solicitar información
          </Button>
        </div>
      </div>
    );
  }

  // Default card variant
  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-lg">
            🚀
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">¿Te interesa el streaming?</h3>
            <p className="text-sm text-gray-500">Powered by ipstream.cl</p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 p-1"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Esta plataforma utiliza tecnología profesional de streaming. 
        Si necesitas tu propia solución, podemos ayudarte.
      </p>
      
      <div className="flex space-x-3">
        <Button
          onClick={handleClick}
          size="sm"
          className="flex-1"
        >
          Más información
        </Button>
      </div>
    </div>
  );
};

export default IpstreamCTA;