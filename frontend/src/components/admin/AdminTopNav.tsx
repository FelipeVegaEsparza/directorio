'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks';
import { useAdminRequests } from '@/hooks/useAdminRequests';
import Button from '@/components/ui/Button';
import { 
  HomeIcon, 
  RadioIcon, 
  DocumentTextIcon, 
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  BellIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
  { name: 'Medios', href: '/admin/media', icon: RadioIcon },
  { name: 'Solicitudes', href: '/admin/requests', icon: DocumentTextIcon, badge: true },
  { name: 'Estadísticas', href: '/admin/analytics', icon: ChartBarIcon },
];

export function AdminTopNav() {
  const { user, logout } = useAuth();
  const { pagination } = useAdminRequests();
  const pathname = usePathname();

  // Get pending requests count for notification badge
  const pendingRequestsCount = pathname === '/admin/requests' ? 0 : (pagination?.total || 0);

  const handleLogout = () => {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      logout();
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900 mr-8">Admin Panel</h1>
            </div>
            
            {/* Main navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const showBadge = item.badge && pendingRequestsCount > 0;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    {item.name}
                    {showBadge && (
                      <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                        {pendingRequestsCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side - notifications and user menu */}
          <div className="flex items-center space-x-4">
            {/* Quick access to pending requests */}
            {pendingRequestsCount > 0 && pathname !== '/admin/requests' && (
              <Link
                href="/admin/requests"
                className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full"
                title={`${pendingRequestsCount} solicitudes pendientes`}
              >
                <BellIcon className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                  {pendingRequestsCount}
                </span>
              </Link>
            )}

            {/* User info */}
            <div className="flex items-center space-x-2">
              <UserIcon className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-700">{user?.username}</span>
            </div>
            
            {/* Logout button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-1"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              <span>Salir</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const showBadge = item.badge && pendingRequestsCount > 0;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative flex items-center justify-between pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </div>
                {showBadge && (
                  <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                    {pendingRequestsCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}