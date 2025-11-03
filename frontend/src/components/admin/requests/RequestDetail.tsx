import React, { useState } from 'react';
import { JoinRequest } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { 
  CheckIcon, 
  XMarkIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  RadioIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

interface RequestDetailProps {
  request: JoinRequest;
  onApprove: (id: number) => void;
  onReject: (id: number, reason?: string) => void;
  onClose: () => void;
}

export function RequestDetail({ request, onApprove, onReject, onClose }: RequestDetailProps) {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [processing, setProcessing] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'approved':
        return 'Aprobada';
      case 'rejected':
        return 'Rechazada';
      default:
        return status;
    }
  };

  const handleApprove = async () => {
    if (confirm('¿Estás seguro de que quieres aprobar esta solicitud?')) {
      setProcessing(true);
      try {
        await onApprove(request.id);
      } finally {
        setProcessing(false);
      }
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Por favor, proporciona una razón para el rechazo');
      return;
    }

    if (confirm('¿Estás seguro de que quieres rechazar esta solicitud?')) {
      setProcessing(true);
      try {
        await onReject(request.id, rejectReason);
      } finally {
        setProcessing(false);
      }
    }
  };

  const handleShowRejectForm = () => {
    setShowRejectForm(true);
  };

  const handleCancelReject = () => {
    setShowRejectForm(false);
    setRejectReason('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {request.mediaName}
          </h2>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
              {getStatusText(request.status)}
            </span>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              request.mediaType === 'radio' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-purple-100 text-purple-800'
            }`}>
              {request.mediaType === 'radio' ? 'Radio' : 'TV'}
            </span>
          </div>
        </div>
      </div>

      {/* Request Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Solicitante */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Información del Solicitante</h3>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <EnvelopeIcon className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">{request.name}</p>
                <p className="text-sm text-gray-500">{request.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Medio */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Información del Medio</h3>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <RadioIcon className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">{request.mediaName}</p>
                <p className="text-sm text-gray-500">
                  {request.mediaType === 'radio' ? 'Radio' : 'Canal de TV'}
                </p>
              </div>
            </div>

            {(request.country || request.city) && (
              <div className="flex items-center space-x-2">
                <MapPinIcon className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-900">
                    {request.city && request.country 
                      ? `${request.city}, ${request.country}`
                      : request.country || request.city
                    }
                  </p>
                </div>
              </div>
            )}

            {request.website && (
              <div className="flex items-center space-x-2">
                <GlobeAltIcon className="w-4 h-4 text-gray-400" />
                <div>
                  <a 
                    href={request.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {request.website}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stream URL */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">URL de Streaming</h3>
        <div className="bg-gray-50 rounded-lg p-3">
          <code className="text-sm text-gray-800 break-all">
            {request.streamUrl}
          </code>
        </div>
      </div>

      {/* Description */}
      {request.description && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Descripción</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {request.description}
            </p>
          </div>
        </div>
      )}

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div>
          <p className="text-sm font-medium text-gray-900">Fecha de solicitud</p>
          <p className="text-sm text-gray-500">{formatDate(request.createdAt)}</p>
        </div>
        
        {request.processedAt && (
          <div>
            <p className="text-sm font-medium text-gray-900">Fecha de procesamiento</p>
            <p className="text-sm text-gray-500">{formatDate(request.processedAt)}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      {request.status === 'pending' && (
        <div className="pt-6 border-t border-gray-200">
          {!showRejectForm ? (
            <div className="flex justify-end space-x-3">
              <Button
                onClick={handleShowRejectForm}
                variant="outline"
                disabled={processing}
                className="flex items-center space-x-2"
              >
                <XMarkIcon className="w-4 h-4" />
                <span>Rechazar</span>
              </Button>
              
              <Button
                onClick={handleApprove}
                variant="primary"
                loading={processing}
                className="flex items-center space-x-2"
              >
                <CheckIcon className="w-4 h-4" />
                <span>Aprobar</span>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Input
                label="Razón del rechazo"
                value={rejectReason}
                onChange={setRejectReason}
                placeholder="Explica por qué se rechaza esta solicitud..."
                required
              />
              
              <div className="flex justify-end space-x-3">
                <Button
                  onClick={handleCancelReject}
                  variant="outline"
                  disabled={processing}
                >
                  Cancelar
                </Button>
                
                <Button
                  onClick={handleReject}
                  variant="danger"
                  loading={processing}
                  disabled={!rejectReason.trim()}
                  className="flex items-center space-x-2"
                >
                  <XMarkIcon className="w-4 h-4" />
                  <span>Confirmar Rechazo</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Close button for processed requests */}
      {request.status !== 'pending' && (
        <div className="pt-6 border-t border-gray-200 flex justify-end">
          <Button onClick={onClose} variant="outline">
            Cerrar
          </Button>
        </div>
      )}
    </div>
  );
}