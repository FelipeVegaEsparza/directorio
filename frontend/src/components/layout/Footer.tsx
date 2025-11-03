'use client';

import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    directory: [
      { name: 'Radios', href: '/radios' },
      { name: 'TV Online', href: '/tv-online' },
      { name: 'Países', href: '/paises' },
    ],
    company: [
      { name: 'Acerca de', href: '/acerca-de' },
      { name: 'Únete', href: '/unete' },
      { name: 'Contacto', href: '/contacto' },
      { name: 'Términos', href: '/terminos' },
    ],
    social: [
      { name: 'Facebook', href: '#', icon: '📘' },
      { name: 'Twitter', href: '#', icon: '🐦' },
      { name: 'Instagram', href: '#', icon: '📷' },
      { name: 'YouTube', href: '#', icon: '📺' },
    ],
  };

  return (
    <footer className="bg-secondary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">📻</span>
              </div>
              <span className="font-display font-bold text-xl">
                RadioTV Directory
              </span>
            </div>
            <p className="text-secondary-300 mb-6 max-w-md">
              El directorio más completo de radios y canales de TV online. 
              Descubre y disfruta de contenido de calidad desde cualquier lugar.
            </p>
            <div className="flex space-x-4">
              {footerLinks.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="w-10 h-10 bg-secondary-800 rounded-lg flex items-center justify-center hover:bg-secondary-700 transition-colors"
                  title={item.name}
                >
                  <span className="text-lg">{item.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Directory Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Directorio</h3>
            <ul className="space-y-2">
              {footerLinks.directory.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-secondary-300 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Empresa</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-secondary-300 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-secondary-400 text-sm">
            © {currentYear} RadioTV Directory. Todos los derechos reservados.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-secondary-400 text-sm">Desarrollado por</span>
            <a
              href="https://hover.cl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors"
            >
              Hover.cl
            </a>
            <span className="text-secondary-600">•</span>
            <a
              href="https://hostreams.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors"
            >
              Hostreams.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;