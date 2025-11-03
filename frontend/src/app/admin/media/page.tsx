'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAdminMedia } from '@/hooks/useAdminMedia';
import { useCategories } from '@/hooks';
import { MediaList, MediaForm, MediaFilters } from '@/components/admin/media';
import Button from '@/components/ui/Button';
import { Modal } from '@/components/ui';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Media, MediaFilters as MediaFiltersType } from '@/types';

export default function AdminMediaPage() {
  const searchParams = useSearchParams();
  const {
    media,
    loading,
    error,
    pagination,
    fetchMedia,
    createMedia,
    updateMedia,
    deleteMedia,
    toggleMediaStatus,
    toggleFeatured,
    toggleVerified
  } = useAdminMedia();
  
  const { categories } = useCategories();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<Media | null>(null);
  const [preselectedType, setPreselectedType] = useState<'radio' | 'tv' | null>(null);
  const [filters, setFilters] = useState<MediaFiltersType>({
    page: 1,
    limit: 20
  });

  // Check URL parameters on component mount
  useEffect(() => {
    const action = searchParams.get('action');
    const type = searchParams.get('type') as 'radio' | 'tv';
    
    if (action === 'create' && (type === 'radio' || type === 'tv')) {
      setPreselectedType(type);
      setEditingMedia(null);
      setIsFormOpen(true);
    }
  }, [searchParams]);

  const handleCreateMedia = () => {
    setEditingMedia(null);
    setPreselectedType(null);
    setIsFormOpen(true);
  };

  const handleEditMedia = (media: Media) => {
    setEditingMedia(media);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingMedia(null);
    setPreselectedType(null);
  };

  const handleSubmitForm = async (data: Partial<Media>) => {
    try {
      if (editingMedia) {
        await updateMedia(editingMedia.id, data);
      } else {
        await createMedia(data);
      }
      handleCloseForm();
    } catch (error) {
      // Error handling is done in the form component
      throw error;
    }
  };

  const handleDeleteMedia = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este medio? Esta acción no se puede deshacer.')) {
      try {
        await deleteMedia(id);
      } catch (error: any) {
        alert(error.message);
      }
    }
  };

  const handleFiltersChange = (newFilters: MediaFiltersType) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    fetchMedia(updatedFilters);
  };

  const handlePageChange = (page: number) => {
    const updatedFilters = { ...filters, page };
    setFilters(updatedFilters);
    fetchMedia(updatedFilters);
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-medium text-red-800 mb-2">Error al cargar medios</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => fetchMedia(filters)} variant="primary" size="sm">
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
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Medios</h1>
          <p className="mt-1 text-sm text-gray-600">
            Administra radios y canales de TV del directorio
          </p>
        </div>
        <Button
          onClick={handleCreateMedia}
          variant="primary"
          className="flex items-center space-x-2"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Agregar Medio</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <MediaFilters
          filters={filters}
          categories={categories}
          onFiltersChange={handleFiltersChange}
          loading={loading}
        />
      </div>

      {/* Media List */}
      <MediaList
        media={media}
        loading={loading}
        pagination={pagination}
        onEdit={handleEditMedia}
        onDelete={handleDeleteMedia}
        onToggleStatus={toggleMediaStatus}
        onToggleFeatured={toggleFeatured}
        onToggleVerified={toggleVerified}
        onPageChange={handlePageChange}
      />

      {/* Media Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={editingMedia ? 'Editar Medio' : 'Agregar Nuevo Medio'}
        size="lg"
      >
        <MediaForm
          media={editingMedia}
          categories={categories}
          preselectedType={preselectedType}
          onSubmit={handleSubmitForm}
          onCancel={handleCloseForm}
        />
      </Modal>
    </div>
  );
}