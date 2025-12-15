import React from 'react';
import { Media } from '@/types';
import Button from '@/components/ui/Button';
import { CountryFlag } from '@/components/ui';
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  StarIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid, CheckBadgeIcon as CheckBadgeIconSolid } from '@heroicons/react/24/solid';
import { getImageUrl } from '@/utils/imageUrl';

interface MediaListProps {
  media: Media[];
  loading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  onEdit: (media: Media) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onToggleFeatured: (id: string) => void;
  onToggleVerified: (id: string) => void;
  onPageChange: (page: number) => void;
}

export function MediaList({
  media,
  loading,
  pagination,
  onEdit,
  onDelete,
  onToggleStatus,
  onToggleFeatured,
  onToggleVerified,
  onPageChange
}: MediaListProps) {
  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="flex space-x-2">
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!media || media.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-12 text-center">
          <p className="text-gray-500">No se encontraron medios</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Medio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ubicación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estadísticas
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(media || []).map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      {item.logoUrl ? (
                        <img
                          src={getImageUrl(item.logoUrl)}
                          alt={item.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-500">
                            {item.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 flex items-center space-x-2">
                        <span>{item.name}</span>
                        {item.isFeatured && (
                          <StarIconSolid className="w-4 h-4 text-yellow-500" title="Destacado" />
                        )}
                        {item.isVerified && (
                          <CheckBadgeIconSolid className="w-4 h-4 text-blue-500" title="Verificado" />
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.category?.name || 'Sin categoría'}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.type === 'radio'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800'
                    }`}>
                    {item.type === 'radio' ? 'Radio' : 'TV'}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center space-x-2">
                    {item.country && <CountryFlag country={item.country} size="sm" />}
                    <span>
                      {item.city && item.country ? `${item.city}, ${item.country}` :
                        item.country || item.city || 'No especificado'}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                    }`}>
                    {item.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="space-y-1">
                    <div>Vistas: {item.viewCount.toLocaleString()}</div>
                    <div>Reproducciones: {item.playCount.toLocaleString()}</div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    {/* Toggle Status */}
                    <button
                      onClick={() => onToggleStatus(item.id)}
                      className={`p-1 rounded-md hover:bg-gray-100 ${item.isActive ? 'text-green-600' : 'text-red-600'
                        }`}
                      title={item.isActive ? 'Desactivar' : 'Activar'}
                    >
                      {item.isActive ? (
                        <EyeIcon className="w-4 h-4" />
                      ) : (
                        <EyeSlashIcon className="w-4 h-4" />
                      )}
                    </button>

                    {/* Toggle Featured */}
                    <button
                      onClick={() => onToggleFeatured(item.id)}
                      className={`p-1 rounded-md hover:bg-gray-100 ${item.isFeatured ? 'text-yellow-500' : 'text-gray-400'
                        }`}
                      title={item.isFeatured ? 'Quitar destacado' : 'Marcar como destacado'}
                    >
                      {item.isFeatured ? (
                        <StarIconSolid className="w-4 h-4" />
                      ) : (
                        <StarIcon className="w-4 h-4" />
                      )}
                    </button>

                    {/* Toggle Verified */}
                    <button
                      onClick={() => onToggleVerified(item.id)}
                      className={`p-1 rounded-md hover:bg-gray-100 ${item.isVerified ? 'text-blue-500' : 'text-gray-400'
                        }`}
                      title={item.isVerified ? 'Quitar verificación' : 'Marcar como verificado'}
                    >
                      {item.isVerified ? (
                        <CheckBadgeIconSolid className="w-4 h-4" />
                      ) : (
                        <CheckBadgeIcon className="w-4 h-4" />
                      )}
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => onEdit(item)}
                      className="p-1 rounded-md text-blue-600 hover:bg-blue-50"
                      title="Editar"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-1 rounded-md text-red-600 hover:bg-red-50"
                      title="Eliminar"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              variant="outline"
              size="sm"
            >
              Anterior
            </Button>
            <Button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              variant="outline"
              size="sm"
            >
              Siguiente
            </Button>
          </div>

          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando{' '}
                <span className="font-medium">
                  {((pagination.page - 1) * pagination.limit) + 1}
                </span>{' '}
                a{' '}
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{' '}
                de{' '}
                <span className="font-medium">{pagination.total}</span>{' '}
                resultados
              </p>
            </div>

            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <Button
                  onClick={() => onPageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  variant="outline"
                  size="sm"
                  className="rounded-r-none"
                >
                  Anterior
                </Button>

                {/* Page numbers */}
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      variant={pagination.page === pageNum ? 'primary' : 'outline'}
                      size="sm"
                      className="rounded-none"
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                <Button
                  onClick={() => onPageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  variant="outline"
                  size="sm"
                  className="rounded-l-none"
                >
                  Siguiente
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}