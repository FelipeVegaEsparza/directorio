'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { cn, isValidUrl } from '@/utils';
import { COUNTRIES } from '@/utils/countries';
import { JoinRequestForm as JoinRequestFormData } from '@/types';
import { useJoinRequest } from '@/hooks/useJoinRequest';
import { Button, Input, Card } from '@/components/ui';

// Validation schema
const schema = yup.object({
  name: yup
    .string()
    .required('El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  email: yup
    .string()
    .required('El email es requerido')
    .email('Ingresa un email válido'),
  mediaName: yup
    .string()
    .required('El nombre del medio es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  mediaType: yup
    .string()
    .required('Selecciona el tipo de medio')
    .oneOf(['radio', 'tv'], 'Tipo de medio inválido') as yup.StringSchema<'radio' | 'tv'>,
  streamUrl: yup
    .string()
    .required('La URL del stream es requerida')
    .test('is-url', 'Ingresa una URL válida', (value) => {
      return value ? isValidUrl(value) : false;
    }),
  description: yup
    .string()
    .notRequired()
    .max(500, 'La descripción no puede exceder 500 caracteres'),
  country: yup
    .string()
    .notRequired()
    .max(50, 'El país no puede exceder 50 caracteres'),
  city: yup
    .string()
    .notRequired()
    .max(50, 'La ciudad no puede exceder 50 caracteres'),
  website: yup
    .string()
    .notRequired()
    .test('is-url', 'Ingresa una URL válida', (value) => {
      return !value || value === '' || isValidUrl(value);
    }),
  facebook: yup
    .string()
    .notRequired()
    .test('is-url', 'Ingresa una URL válida', (value) => {
      return !value || value === '' || isValidUrl(value);
    }),
  instagram: yup
    .string()
    .notRequired()
    .test('is-url', 'Ingresa una URL válida', (value) => {
      return !value || value === '' || isValidUrl(value);
    }),
  twitter: yup
    .string()
    .notRequired()
    .test('is-url', 'Ingresa una URL válida', (value) => {
      return !value || value === '' || isValidUrl(value);
    }),
  youtube: yup
    .string()
    .notRequired()
    .test('is-url', 'Ingresa una URL válida', (value) => {
      return !value || value === '' || isValidUrl(value);
    }),
}) as yup.ObjectSchema<JoinRequestFormData>;

interface JoinRequestFormProps {
  onSuccess?: () => void;
  className?: string;
}

const JoinRequestForm: React.FC<JoinRequestFormProps> = ({
  onSuccess,
  className,
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const { loading, error, success, submitRequest, reset } = useJoinRequest();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    getValues,
    reset: resetForm,
    setValue,
    watch,
    trigger,
  } = useForm<JoinRequestFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      mediaName: '',
      mediaType: undefined,
      streamUrl: '',
      description: '',
      country: '',
      city: '',
      website: '',
      facebook: '',
      instagram: '',
      twitter: '',
      youtube: '',
    },
  });

  const onSubmit = async (data: JoinRequestFormData) => {
    try {
      // Filter out empty strings for optional fields
      const cleanedData = {
        ...data,
        description: data.description?.trim() || undefined,
        country: data.country?.trim() || undefined,
        city: data.city?.trim() || undefined,
        website: data.website?.trim() || undefined,
        facebook: data.facebook?.trim() || undefined,
        instagram: data.instagram?.trim() || undefined,
        twitter: data.twitter?.trim() || undefined,
        youtube: data.youtube?.trim() || undefined,
      };

      // Remove undefined fields
      const filteredData = Object.fromEntries(
        Object.entries(cleanedData).filter(([_, value]) => value !== undefined && value !== '')
      ) as JoinRequestFormData;

      await submitRequest(filteredData);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleReset = () => {
    resetForm();
    reset();
    setShowPreview(false);
  };

  if (success) {
    return (
      <Card className={cn('text-center', className)}>
        <div className="space-y-6">
          <div className="text-success-500">
            <CheckCircleIcon className="w-16 h-16 mx-auto" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-secondary-900 mb-2">
              ¡Solicitud Enviada!
            </h3>
            <p className="text-secondary-600 mb-6">
              Hemos recibido tu solicitud correctamente. Nuestro equipo la revisará
              y te contactaremos pronto por email con una respuesta.
            </p>
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 text-left">
              <h4 className="font-semibold text-primary-900 mb-2">
                ¿Qué sigue?
              </h4>
              <ul className="text-sm text-primary-800 space-y-1">
                <li>• Revisaremos tu solicitud en 24-48 horas</li>
                <li>• Verificaremos que tu stream funcione correctamente</li>
                <li>• Te enviaremos un email con la respuesta</li>
                <li>• Si es aprobada, tu medio aparecerá en el directorio</li>
              </ul>
            </div>
          </div>
          <Button onClick={handleReset} variant="outline">
            Enviar otra solicitud
          </Button>
        </div>
      </Card>
    );
  }

  if (showPreview) {
    const formData = getValues();
    return (
      <Card className={className}>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-secondary-900 mb-2">
              Revisar Solicitud
            </h3>
            <p className="text-secondary-600">
              Por favor revisa la información antes de enviar tu solicitud.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Tu Nombre
                </label>
                <p className="text-secondary-900">{formData.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Email
                </label>
                <p className="text-secondary-900">{formData.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Nombre del Medio
                </label>
                <p className="text-secondary-900">{formData.mediaName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Tipo
                </label>
                <p className="text-secondary-900">
                  {formData.mediaType === 'radio' ? '📻 Radio' : '📺 TV'}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                URL del Stream
              </label>
              <p className="text-secondary-900 break-all">{formData.streamUrl}</p>
            </div>

            {formData.description && (
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Descripción
                </label>
                <p className="text-secondary-900">{formData.description}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.country && (
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    País
                  </label>
                  <p className="text-secondary-900">{formData.country}</p>
                </div>
              )}
              {formData.city && (
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Ciudad
                  </label>
                  <p className="text-secondary-900">{formData.city}</p>
                </div>
              )}
            </div>

            {formData.website && (
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Sitio Web
                </label>
                <p className="text-secondary-900 break-all">{formData.website}</p>
              </div>
            )}

            {/* Social Media Links Preview */}
            {(formData.facebook || formData.instagram || formData.twitter || formData.youtube) && (
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Redes Sociales
                </label>
                <div className="space-y-2">
                  {formData.facebook && (
                    <p className="text-secondary-900 text-sm">
                      <span className="font-medium">Facebook:</span> {formData.facebook}
                    </p>
                  )}
                  {formData.instagram && (
                    <p className="text-secondary-900 text-sm">
                      <span className="font-medium">Instagram:</span> {formData.instagram}
                    </p>
                  )}
                  {formData.twitter && (
                    <p className="text-secondary-900 text-sm">
                      <span className="font-medium">Twitter:</span> {formData.twitter}
                    </p>
                  )}
                  {formData.youtube && (
                    <p className="text-secondary-900 text-sm">
                      <span className="font-medium">YouTube:</span> {formData.youtube}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center space-x-3 p-4 bg-error-50 border border-error-200 rounded-lg">
              <ExclamationTriangleIcon className="w-5 h-5 text-error-500 flex-shrink-0" />
              <p className="text-error-700 text-sm">{error}</p>
            </div>
          )}

          <div className="flex space-x-4">
            <Button
              onClick={() => setShowPreview(false)}
              variant="outline"
              className="flex-1"
            >
              Editar
            </Button>
            <Button
              onClick={() => handleSubmit(onSubmit)()}
              loading={loading}
              className="flex-1"
            >
              Enviar Solicitud
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <form onSubmit={handleSubmit(() => setShowPreview(true))} className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-secondary-900 mb-2">
            Únete a Nuestro Directorio
          </h3>
          <p className="text-secondary-600">
            Completa el formulario para solicitar que tu radio o canal de TV sea incluido en nuestro directorio.
          </p>
        </div>

        {/* Personal Information */}
        <div className="space-y-4">
          <h4 className="font-semibold text-secondary-900">Información Personal</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Tu Nombre"
              placeholder="Ingresa tu nombre completo"
              value={watch('name') || ''}
              onChange={async (value) => {
                setValue('name', value);
                await trigger('name');
              }}
              error={errors.name?.message}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="tu@email.com"
              value={watch('email') || ''}
              onChange={async (value) => {
                setValue('email', value);
                await trigger('email');
              }}
              error={errors.email?.message}
              required
            />
          </div>
        </div>

        {/* Media Information */}
        <div className="space-y-4">
          <h4 className="font-semibold text-secondary-900">Información del Medio</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre del Medio"
              placeholder="Ej: Radio Música FM"
              value={watch('mediaName') || ''}
              onChange={async (value) => {
                setValue('mediaName', value);
                await trigger('mediaName');
              }}
              error={errors.mediaName?.message}
              required
            />
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Tipo de Medio <span className="text-error-500">*</span>
              </label>
              <select
                value={watch('mediaType') || ''}
                onChange={async (e) => {
                  setValue('mediaType', e.target.value as 'radio' | 'tv');
                  await trigger('mediaType');
                }}
                className={cn(
                  'w-full px-4 py-3 border rounded-xl transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-offset-1',
                  errors.mediaType
                    ? 'border-error-300 focus:border-error-500 focus:ring-error-500'
                    : 'border-secondary-300 focus:border-primary-500 focus:ring-primary-500'
                )}
              >
                <option value="">Selecciona el tipo</option>
                <option value="radio">📻 Radio</option>
                <option value="tv">📺 TV</option>
              </select>
              {errors.mediaType && (
                <p className="mt-2 text-sm text-error-600">{errors.mediaType.message}</p>
              )}
            </div>
          </div>

          <Input
            label="URL del Stream"
            type="url"
            placeholder="https://stream.ejemplo.com/radio"
            value={watch('streamUrl') || ''}
            onChange={async (value) => {
              setValue('streamUrl', value);
              await trigger('streamUrl');
            }}
            error={errors.streamUrl?.message}
            required
          />

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Descripción
            </label>
            <textarea
              value={watch('description') || ''}
              onChange={async (e) => {
                setValue('description', e.target.value);
                await trigger('description');
              }}
              placeholder="Describe brevemente tu radio o canal de TV..."
              rows={4}
              className={cn(
                'w-full px-4 py-3 border rounded-xl transition-all duration-200',
                'placeholder:text-secondary-400 resize-none',
                'focus:outline-none focus:ring-2 focus:ring-offset-1',
                errors.description
                  ? 'border-error-300 focus:border-error-500 focus:ring-error-500'
                  : 'border-secondary-300 focus:border-primary-500 focus:ring-primary-500'
              )}
            />
            {errors.description && (
              <p className="mt-2 text-sm text-error-600">{errors.description.message}</p>
            )}
          </div>
        </div>

        {/* Location Information */}
        <div className="space-y-4">
          <h4 className="font-semibold text-secondary-900">Ubicación (Opcional)</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                País
              </label>
              <select
                value={watch('country') || ''}
                onChange={async (e) => {
                  setValue('country', e.target.value);
                  await trigger('country');
                }}
                className={cn(
                  'w-full px-4 py-3 border rounded-xl transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-offset-1',
                  errors.country
                    ? 'border-error-300 focus:border-error-500 focus:ring-error-500'
                    : 'border-secondary-300 focus:border-primary-500 focus:ring-primary-500'
                )}
              >
                <option value="">Seleccionar país</option>
                {COUNTRIES.map(country => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              {errors.country && (
                <p className="mt-2 text-sm text-error-600">{errors.country.message}</p>
              )}
            </div>
            <Input
              label="Ciudad"
              placeholder="Ej: Santiago"
              value={watch('city') || ''}
              onChange={async (value) => {
                setValue('city', value);
                await trigger('city');
              }}
              error={errors.city?.message}
            />
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <h4 className="font-semibold text-secondary-900">Información Adicional (Opcional)</h4>

          <Input
            label="Sitio Web"
            type="url"
            placeholder="https://www.ejemplo.com"
            value={watch('website') || ''}
            onChange={async (value) => {
              setValue('website', value);
              await trigger('website');
            }}
            error={errors.website?.message}
          />

          {/* Social Media Links */}
          <div className="space-y-3">
            <h5 className="font-medium text-secondary-800">Redes Sociales</h5>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Facebook"
                type="url"
                placeholder="https://facebook.com/tu-pagina"
                value={watch('facebook') || ''}
                onChange={async (value) => {
                  setValue('facebook', value);
                  await trigger('facebook');
                }}
                error={errors.facebook?.message}
              />
              <Input
                label="Instagram"
                type="url"
                placeholder="https://instagram.com/tu-cuenta"
                value={watch('instagram') || ''}
                onChange={async (value) => {
                  setValue('instagram', value);
                  await trigger('instagram');
                }}
                error={errors.instagram?.message}
              />
              <Input
                label="Twitter/X"
                type="url"
                placeholder="https://twitter.com/tu-cuenta"
                value={watch('twitter') || ''}
                onChange={async (value) => {
                  setValue('twitter', value);
                  await trigger('twitter');
                }}
                error={errors.twitter?.message}
              />
              <Input
                label="YouTube"
                type="url"
                placeholder="https://youtube.com/tu-canal"
                value={watch('youtube') || ''}
                onChange={async (value) => {
                  setValue('youtube', value);
                  await trigger('youtube');
                }}
                error={errors.youtube?.message}
              />
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
          <p className="text-sm text-secondary-700">
            Al enviar esta solicitud, confirmas que tienes los derechos necesarios para
            transmitir el contenido y aceptas nuestros términos de servicio.
            Nos reservamos el derecho de revisar y aprobar todas las solicitudes.
          </p>
        </div>

        <Button
          type="submit"
          disabled={!isValid}
          className="w-full"
          size="lg"
        >
          Revisar Solicitud
        </Button>
        
        {/* Debug info - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="text-xs text-gray-500 mt-2">
            <p>Form valid: {isValid ? 'Yes' : 'No'}</p>
            <p>Errors: {Object.keys(errors).length > 0 ? Object.keys(errors).join(', ') : 'None'}</p>
          </div>
        )}
      </form>
    </Card>
  );
};

export default JoinRequestForm;