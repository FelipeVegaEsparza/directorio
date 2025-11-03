'use client';

import { useAuth } from '@/hooks';
import { useDashboard } from '@/hooks/useDashboard';
import { StatsCard } from '@/components/admin/dashboard/StatsCard';
import { TopMediaList } from '@/components/admin/dashboard/TopMediaList';
import { DistributionChart } from '@/components/admin/dashboard/DistributionChart';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { 
  RadioIcon, 
  CheckCircleIcon, 
  DocumentTextIcon, 
  EyeIcon,
  PlayIcon,
  ArrowPathIcon,
  ChartBarIcon,
  PlusIcon,
  ClipboardDocumentListIcon,
  TvIcon
} from '@heroicons/react/24/outline';
import { BackendDiagnostic } from '@/components/admin/BackendDiagnostic';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { stats, loading, error, refreshStats } = useDashboard();

  const handleRefresh = () => {
    refreshStats();
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-medium text-red-800 mb-2">Error al cargar estadísticas</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={handleRefresh} variant="primary" size="sm">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Bienvenido de vuelta, {user?.username}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link href="/admin/analytics">
            <Button
              variant="primary"
              size="sm"
              className="flex items-center space-x-2"
            >
              <ChartBarIcon className="w-4 h-4" />
              <span>Analytics Avanzados</span>
            </Button>
          </Link>
          
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            loading={loading}
            className="flex items-center space-x-2"
          >
            <ArrowPathIcon className="w-4 h-4" />
            <span>Actualizar</span>
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Gestionar Solicitudes */}
          <Link href="/admin/requests">
            <div className="group cursor-pointer">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-primary-300 transition-all duration-200">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-yellow-100 rounded-xl group-hover:bg-yellow-200 transition-colors">
                    <ClipboardDocumentListIcon className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      Gestionar Solicitudes
                    </h3>
                    <p className="text-sm text-gray-600">
                      {loading ? 'Cargando...' : `${stats?.overview.pendingRequests || 0} pendientes`}
                    </p>
                  </div>
                  <div className="text-gray-400 group-hover:text-primary-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Agregar Radio */}
          <Link href="/admin/media?action=create&type=radio">
            <div className="group cursor-pointer">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-primary-300 transition-all duration-200">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                    <RadioIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      Agregar Radio
                    </h3>
                    <p className="text-sm text-gray-600">
                      Crear nueva estación de radio
                    </p>
                  </div>
                  <div className="text-gray-400 group-hover:text-primary-500 transition-colors">
                    <PlusIcon className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Agregar TV */}
          <Link href="/admin/media?action=create&type=tv">
            <div className="group cursor-pointer">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-primary-300 transition-all duration-200">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
                    <TvIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      Agregar Canal TV
                    </h3>
                    <p className="text-sm text-gray-600">
                      Crear nuevo canal de televisión
                    </p>
                  </div>
                  <div className="text-gray-400 group-hover:text-primary-500 transition-colors">
                    <PlusIcon className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Gestionar Medios */}
          <Link href="/admin/media">
            <div className="group cursor-pointer">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-primary-300 transition-all duration-200">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                    <RadioIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      Gestionar Medios
                    </h3>
                    <p className="text-sm text-gray-600">
                      {loading ? 'Cargando...' : `${stats?.overview.totalMedia || 0} medios totales`}
                    </p>
                  </div>
                  <div className="text-gray-400 group-hover:text-primary-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Backend Diagnostic (temporary) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-8">
          <BackendDiagnostic />
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Total Medios"
          value={loading ? '-' : stats?.overview.totalMedia || 0}
          icon={<RadioIcon className="w-5 h-5 text-white" />}
          color="blue"
        />
        
        <StatsCard
          title="Medios Activos"
          value={loading ? '-' : stats?.overview.activeMedia || 0}
          icon={<CheckCircleIcon className="w-5 h-5 text-white" />}
          color="green"
        />
        
        <StatsCard
          title="Solicitudes Pendientes"
          value={loading ? '-' : stats?.overview.pendingRequests || 0}
          icon={<DocumentTextIcon className="w-5 h-5 text-white" />}
          color="yellow"
        />
        
        <StatsCard
          title="Total Visitas"
          value={loading ? '-' : stats?.overview.totalViews || 0}
          icon={<EyeIcon className="w-5 h-5 text-white" />}
          color="purple"
          trend={stats?.growth.views ? {
            value: Math.round(stats.growth.views.percentage),
            isPositive: stats.growth.views.percentage >= 0
          } : undefined}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Medios Destacados"
          value={loading ? '-' : stats?.overview.featuredMedia || 0}
          icon={<span className="text-white text-sm font-bold">★</span>}
          color="yellow"
        />
        
        <StatsCard
          title="Medios Verificados"
          value={loading ? '-' : stats?.overview.verifiedMedia || 0}
          icon={<span className="text-white text-sm font-bold">✓</span>}
          color="green"
        />
        
        <StatsCard
          title="Total Reproducciones"
          value={loading ? '-' : stats?.overview.totalPlays || 0}
          icon={<PlayIcon className="w-5 h-5 text-white" />}
          color="red"
          trend={stats?.growth.plays ? {
            value: Math.round(stats.growth.plays.percentage),
            isPositive: stats.growth.plays.percentage >= 0
          } : undefined}
        />
        
        <StatsCard
          title="Solicitudes Aprobadas"
          value={loading ? '-' : stats?.overview.approvedRequests || 0}
          icon={<CheckCircleIcon className="w-5 h-5 text-white" />}
          color="blue"
        />
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Media by Views */}
        <TopMediaList
          title="Medios Más Visitados"
          media={stats?.topMedia.byViews || []}
          type="views"
          loading={loading}
        />
        
        {/* Top Media by Plays */}
        <TopMediaList
          title="Medios Más Reproducidos"
          media={stats?.topMedia.byPlays || []}
          type="plays"
          loading={loading}
        />
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribution by Category */}
        <DistributionChart
          title="Distribución por Categoría"
          data={stats?.distribution.byCategory || []}
          loading={loading}
        />
        
        {/* Distribution by Type */}
        <DistributionChart
          title="Distribución por Tipo"
          data={stats?.distribution.byType.map(item => ({
            name: item.type === 'radio' ? 'Radio' : 'TV',
            count: item.count
          })) || []}
          loading={loading}
        />
      </div>
    </div>
  );
}