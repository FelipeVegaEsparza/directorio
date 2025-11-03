'use client';

import { useState } from 'react';
import { useAdminRequests } from '@/hooks/useAdminRequests';
import { RequestsList, RequestDetail, RequestFilters } from '@/components/admin/requests';
import Button from '@/components/ui/Button';
import { Modal } from '@/components/ui';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { JoinRequest } from '@/types';

export default function AdminRequestsPage() {
  const {
    requests,
    loading,
    error,
    pagination,
    fetchRequests,
    approveRequest,
    rejectRequest
  } = useAdminRequests();
  
  const [selectedRequest, setSelectedRequest] = useState<JoinRequest | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'pending',
    page: 1,
    limit: 20
  });

  const handleViewRequest = (request: JoinRequest) => {
    setSelectedRequest(request);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedRequest(null);
  };

  const handleApproveRequest = async (id: number) => {
    try {
      await approveRequest(id);
      // Close detail if it's the same request
      if (selectedRequest?.id === id) {
        handleCloseDetail();
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleRejectRequest = async (id: number, reason?: string) => {
    try {
      await rejectRequest(id, reason);
      // Close detail if it's the same request
      if (selectedRequest?.id === id) {
        handleCloseDetail();
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    fetchRequests(updatedFilters);
  };

  const handlePageChange = (page: number) => {
    const updatedFilters = { ...filters, page };
    setFilters(updatedFilters);
    fetchRequests(updatedFilters);
  };

  const handleRefresh = () => {
    fetchRequests(filters);
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-medium text-red-800 mb-2">Error al cargar solicitudes</h3>
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
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Solicitudes</h1>
          <p className="mt-1 text-sm text-gray-600">
            Revisa y gestiona las solicitudes de adhesión al directorio
          </p>
        </div>
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

      {/* Filters */}
      <div className="mb-6">
        <RequestFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          loading={loading}
        />
      </div>

      {/* Requests List */}
      <RequestsList
        requests={requests}
        loading={loading}
        pagination={pagination}
        onView={handleViewRequest}
        onApprove={handleApproveRequest}
        onReject={handleRejectRequest}
        onPageChange={handlePageChange}
      />

      {/* Request Detail Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        title="Detalles de la Solicitud"
        size="lg"
      >
        {selectedRequest && (
          <RequestDetail
            request={selectedRequest}
            onApprove={handleApproveRequest}
            onReject={handleRejectRequest}
            onClose={handleCloseDetail}
          />
        )}
      </Modal>
    </div>
  );
}