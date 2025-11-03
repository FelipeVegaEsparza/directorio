'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Button, Input, Card } from '@/components/ui';
import { apiClient } from '@/lib/api';
import { useSiteConfig } from '@/hooks/useSiteConfig';

// Validation schema
const schema = yup.object({
    siteName: yup
        .string()
        .required('El nombre del sitio es requerido')
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(100, 'El nombre no puede exceder 100 caracteres'),
    siteDescription: yup
        .string()
        .default('')
        .max(500, 'La descripción no puede exceder 500 caracteres'),
    logoUrl: yup
        .string()
        .default('')
        .test('is-url', 'Debe ser una URL válida', (value) => {
            return !value || value === '' || /^https?:\/\/.+/.test(value);
        }),
    faviconUrl: yup
        .string()
        .default('')
        .test('is-url', 'Debe ser una URL válida', (value) => {
            return !value || value === '' || /^https?:\/\/.+/.test(value);
        }),
    primaryColor: yup
        .string()
        .required('El color primario es requerido')
        .matches(/^#[0-9A-F]{6}$/i, 'Debe ser un color hexadecimal válido'),
    secondaryColor: yup
        .string()
        .required('El color secundario es requerido')
        .matches(/^#[0-9A-F]{6}$/i, 'Debe ser un color hexadecimal válido'),
    showOnlyLogo: yup
        .boolean()
        .default(false),
}) as yup.ObjectSchema<SiteConfigForm>;

interface SiteConfigForm {
    siteName: string;
    siteDescription: string;
    logoUrl: string;
    faviconUrl: string;
    primaryColor: string;
    secondaryColor: string;
    showOnlyLogo: boolean;
}

export default function SiteConfigPage() {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const { refreshConfig } = useSiteConfig();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
    } = useForm<SiteConfigForm>({
        resolver: yupResolver(schema),
        defaultValues: {
            siteName: 'Radio TV Directory',
            siteDescription: '',
            logoUrl: '',
            faviconUrl: '',
            primaryColor: '#3B82F6',
            secondaryColor: '#6B7280',
            showOnlyLogo: false,
        },
    });

    // Load current configuration
    useEffect(() => {
        const loadConfig = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get('/api/admin/config');
                if (response.success && response.data) {
                    const config = response.data as any;
                    reset({
                        siteName: config.siteName || 'Radio TV Directory',
                        siteDescription: config.siteDescription || '',
                        logoUrl: config.logoUrl || '',
                        faviconUrl: config.faviconUrl || '',
                        primaryColor: config.primaryColor || '#3B82F6',
                        secondaryColor: config.secondaryColor || '#6B7280',
                    });
                }
            } catch (error) {
                console.error('Error loading config:', error);
                setMessage({ type: 'error', text: 'Error al cargar la configuración' });
            } finally {
                setLoading(false);
            }
        };

        loadConfig();
    }, [reset]);

    const onSubmit = async (data: SiteConfigForm) => {
        try {
            setSaving(true);
            setMessage(null);

            const response = await apiClient.put('/api/admin/config', data);

            if (response.success) {
                setMessage({ type: 'success', text: 'Configuración guardada exitosamente' });
                // Refresh the site config to update the UI
                refreshConfig();
            } else {
                throw new Error(response.message || 'Error al guardar la configuración');
            }
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || error.message || 'Error al guardar la configuración'
            });
        } finally {
            setSaving(false);
        }
    };

    const logoUrl = watch('logoUrl');
    const primaryColor = watch('primaryColor');
    const secondaryColor = watch('secondaryColor');

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Configuración del Sitio</h1>
                <p className="mt-1 text-sm text-gray-600">
                    Personaliza el logo, nombre y colores de tu directorio
                </p>
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${message.type === 'success'
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                    }`}>
                    {message.type === 'success' ? (
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    ) : (
                        <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                    )}
                    <p className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}>
                        {message.text}
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Information */}
                <Card className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Información Básica</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre del Sitio <span className="text-red-500">*</span>
                            </label>
                            <input
                                {...register('siteName')}
                                type="text"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Radio TV Directory"
                            />
                            {errors.siteName && (
                                <p className="mt-2 text-sm text-red-600">{errors.siteName.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción del Sitio
                            </label>
                            <textarea
                                {...register('siteDescription')}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Describe tu directorio de radios y TV..."
                            />
                            {errors.siteDescription && (
                                <p className="mt-2 text-sm text-red-600">{errors.siteDescription.message}</p>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Logo and Images */}
                <Card className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Logo e Imágenes</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                URL del Logo
                            </label>
                            <input
                                {...register('logoUrl')}
                                type="url"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="https://ejemplo.com/logo.png"
                            />
                            {errors.logoUrl && (
                                <p className="mt-2 text-sm text-red-600">{errors.logoUrl.message}</p>
                            )}

                            {logoUrl && (
                                <div className="mt-3 p-4 border border-gray-200 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
                                    <img
                                        src={logoUrl}
                                        alt="Logo preview"
                                        className="h-12 object-contain"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                URL del Favicon
                            </label>
                            <input
                                {...register('faviconUrl')}
                                type="url"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="https://ejemplo.com/favicon.ico"
                            />
                            {errors.faviconUrl && (
                                <p className="mt-2 text-sm text-red-600">{errors.faviconUrl.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Logo Display Option */}
                    <div className="mt-6">
                        <label className="flex items-center space-x-3">
                            <input
                                {...register('showOnlyLogo')}
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="text-sm font-medium text-gray-700">
                                Mostrar solo el logo (ocultar el nombre del sitio)
                            </span>
                        </label>
                        <p className="mt-1 text-sm text-gray-500">
                            Si está marcado, solo se mostrará el logo sin el texto del nombre del sitio
                        </p>
                    </div>
                </Card>

                {/* Colors */}
                <Card className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Colores del Tema</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Color Primario
                            </label>
                            <div className="flex items-center space-x-3">
                                <input
                                    type="color"
                                    {...register('primaryColor')}
                                    className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                                />
                                <input
                                    type="text"
                                    {...register('primaryColor')}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="#3B82F6"
                                />
                            </div>
                            {errors.primaryColor && (
                                <p className="mt-2 text-sm text-red-600">{errors.primaryColor.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Color Secundario
                            </label>
                            <div className="flex items-center space-x-3">
                                <input
                                    type="color"
                                    {...register('secondaryColor')}
                                    className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                                />
                                <input
                                    type="text"
                                    {...register('secondaryColor')}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="#6B7280"
                                />
                            </div>
                            {errors.secondaryColor && (
                                <p className="mt-2 text-sm text-red-600">{errors.secondaryColor.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Color Preview */}
                    <div className="mt-6 p-4 border border-gray-200 rounded-lg">
                        <p className="text-sm text-gray-600 mb-3">Vista previa de colores:</p>
                        <div className="flex items-center space-x-4">
                            <div
                                className="w-16 h-10 rounded border"
                                style={{ backgroundColor: primaryColor }}
                                title="Color Primario"
                            ></div>
                            <div
                                className="w-16 h-10 rounded border"
                                style={{ backgroundColor: secondaryColor }}
                                title="Color Secundario"
                            ></div>
                            <div className="text-sm text-gray-600">
                                <p>Primario: {primaryColor}</p>
                                <p>Secundario: {secondaryColor}</p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        loading={saving}
                        className="px-8"
                    >
                        Guardar Configuración
                    </Button>
                </div>
            </form>
        </div>
    );
}