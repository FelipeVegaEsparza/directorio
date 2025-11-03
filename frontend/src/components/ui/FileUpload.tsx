import React, { useState, useRef } from 'react';
import { apiClient } from '@/lib/api';
import Button from './Button';
import { CloudArrowUpIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface FileUploadProps {
  onUpload: (url: string) => void;
  accept?: string;
  currentUrl?: string;
  disabled?: boolean;
  maxSize?: number; // in MB
}

export function FileUpload({ 
  onUpload, 
  accept = 'image/*', 
  currentUrl, 
  disabled = false,
  maxSize = 5 
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`El archivo debe ser menor a ${maxSize}MB`);
      return;
    }

    // Validate file type
    if (accept && !file.type.match(accept.replace('*', '.*'))) {
      setError('Tipo de archivo no válido');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post<{ data: { url: string } }>('/api/admin/upload/single', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.success) {
        // Try different possible response structures
        const url = response.data?.data?.url || response.data?.url || response.url;
        
        if (url) {
          onUpload(url);
        } else {
          throw new Error('No se pudo obtener la URL del archivo subido');
        }
      } else {
        throw new Error(response.message || 'Error al subir archivo');
      }
    } catch (err: any) {
      let errorMessage = 'Error al subir archivo';
      
      if (err.response) {
        if (err.response.status === 404) {
          errorMessage = 'Endpoint de upload no encontrado. Verifica que el backend esté ejecutándose.';
        } else if (err.response.status === 401) {
          errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
        } else if (err.response.status === 413) {
          errorMessage = `Archivo demasiado grande. Máximo ${maxSize}MB.`;
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.request) {
        errorMessage = 'No se pudo conectar con el servidor.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setUploading(false);
      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onUpload('');
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        disabled={disabled || uploading}
        className="hidden"
      />

      {currentUrl ? (
        <div className="relative">
          <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={currentUrl}
              alt="Uploaded file"
              className="w-full h-full object-cover"
            />
          </div>
          
          {!disabled && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          onClick={handleClick}
          className={`w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-sm text-gray-500">Subiendo...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <CloudArrowUpIcon className="w-8 h-8 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                Haz clic para subir archivo
              </p>
              <p className="text-xs text-gray-400">
                Máximo {maxSize}MB
              </p>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}