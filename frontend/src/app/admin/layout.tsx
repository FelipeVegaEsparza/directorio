'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthGuard } from '@/components/admin/AuthGuard';
import { useSiteConfig } from '@/hooks/useSiteConfig';

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  const { config } = useSiteConfig();

  // Don't wrap login page with AuthGuard
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Simple top navigation */}
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-3">
                  {config.logoUrl && (
                    <img 
                      src={config.logoUrl} 
                      alt={config.siteName}
                      className="h-8 w-auto"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <h1 className="text-xl font-bold">{config.siteName} - Admin</h1>
                </div>
                <div className="flex space-x-4">
                  <Link 
                    href="/admin/dashboard" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === '/admin/dashboard' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/admin/media" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === '/admin/media' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Medios
                  </Link>
                  <Link 
                    href="/admin/requests" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === '/admin/requests' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Solicitudes
                  </Link>
                  <Link 
                    href="/admin/analytics" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === '/admin/analytics' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Estadísticas
                  </Link>
                  <Link 
                    href="/admin/config" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === '/admin/config' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Configuración
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                <button 
                  onClick={() => {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/admin/login';
                  }}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm"
                >
                  Salir
                </button>
              </div>
            </div>
          </div>
        </nav>
        
        {/* Content */}
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}