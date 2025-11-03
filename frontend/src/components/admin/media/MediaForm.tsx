import React, { useState, useEffect } from 'react';
import { Media, Category } from '@/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { FileUpload } from '@/components/ui';
import { COUNTRIES } from '@/utils/countries';

interface MediaFormProps {
  media?: Media | null;
  categories: Category[];
  preselectedType?: 'radio' | 'tv' | null;
  onSubmit: (data: Partial<Media>) => Promise<void>;
  onCancel: () => void;
}

interface FormData {
  name: string;
  type: 'radio' | 'tv';
  description: string;
  streamUrl: string;
  logoUrl: string;
  bannerUrl: string;
  country: string;
  city: string;
  categoryId: string;
  isActive: boolean;
  isFeatured: boolean;
  isVerified: boolean;
  // Social Media
  website: string;
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
}

export function MediaForm({ media, categories, preselectedType, onSubmit, onCancel }: MediaFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    type: 'radio',
    description: '',
    streamUrl: '',
    logoUrl: '',
    bannerUrl: '',
    country: '',
    city: '',
    categoryId: '',
    isActive: true,
    isFeatured: false,
    isVerified: false,
    // Social Media
    website: '',
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: ''
  });
  
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);
  const [socialLinksLoading, setSocialLinksLoading] = useState(false);

  // Initialize form with media data if editing or preselected type
  useEffect(() => {
    if (media) {
      setFormData({
        name: media.name || '',
        type: media.type || 'radio',
        description: media.description || '',
        streamUrl: media.streamUrl || '',
        logoUrl: media.logoUrl || '',
        bannerUrl: media.bannerUrl || '',
        country: media.country || '',
        city: media.city || '',
        categoryId: media.categoryId?.toString() || '',
        isActive: media.isActive ?? true,
        isFeatured: media.isFeatured ?? false,
        isVerified: media.isVerified ?? false,
        // Initialize social media fields
        website: '',
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: ''
      });

      // Load social links if editing existing media
      if (media.socialLinks && media.socialLinks.length > 0) {
        const socialData = {
          website: '',
          facebook: '',
          instagram: '',
          twitter: '',
          youtube: ''
        };

        media.socialLinks.forEach(link => {
          if (link.platform in socialData) {
            socialData[link.platform as keyof typeof socialData] = link.url;
          }
        });

        setFormData(prev => ({
          ...prev,
          ...socialData
        }));
      }
    }
  }, [media]);

  // Set preselected type when creating new media
  useEffect(() => {
    if (!media && preselectedType) {
      setFormData(prev => ({
        ...prev,
        type: preselectedType
      }));
    }
  }, [media, preselectedType]);

  const handleInputChange = (field: keyof FormData) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSelectChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleCheckboxChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.checked
    }));
  };

  const handleFileUpload = (field: 'logoUrl' | 'bannerUrl') => (url: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: url
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.streamUrl.trim()) {
      newErrors.streamUrl = 'La URL de streaming es requerida';
    } else {
      try {
        new URL(formData.streamUrl);
      } catch {
        newErrors.streamUrl = 'La URL de streaming no es válida';
      }
    }

    if (formData.logoUrl && formData.logoUrl.trim()) {
      const logoUrl = formData.logoUrl.trim();
      // Allow relative URLs (starting with /) or absolute URLs
      if (!logoUrl.startsWith('/') && !logoUrl.startsWith('http')) {
        try {
          new URL(logoUrl);
        } catch {
          newErrors.logoUrl = 'La URL del logo no es válida';
        }
      }
    }

    if (formData.bannerUrl && formData.bannerUrl.trim()) {
      const bannerUrl = formData.bannerUrl.trim();
      // Allow relative URLs (starting with /) or absolute URLs
      if (!bannerUrl.startsWith('/') && !bannerUrl.startsWith('http')) {
        try {
          new URL(bannerUrl);
        } catch {
          newErrors.bannerUrl = 'La URL del banner no es válida';
        }
      }
    }

    // Validate social media URLs
    const socialFields = ['website', 'facebook', 'instagram', 'twitter', 'youtube'] as const;
    socialFields.forEach(field => {
      if (formData[field] && formData[field].trim()) {
        try {
          new URL(formData[field].trim());
        } catch {
          newErrors[field] = `La URL de ${field} no es válida`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const submitData: Partial<Media> = {
        name: formData.name.trim(),
        type: formData.type,
        description: formData.description.trim() || undefined,
        streamUrl: formData.streamUrl.trim(),
        logoUrl: formData.logoUrl.trim() || undefined,
        bannerUrl: formData.bannerUrl.trim() || undefined,
        country: formData.country.trim() || undefined,
        city: formData.city.trim() || undefined,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : undefined,
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        isVerified: formData.isVerified
      };

      // Prepare social links data
      const socialLinks = [];
      if (formData.website.trim()) {
        socialLinks.push({ platform: 'website', url: formData.website.trim() });
      }
      if (formData.facebook.trim()) {
        socialLinks.push({ platform: 'facebook', url: formData.facebook.trim() });
      }
      if (formData.instagram.trim()) {
        socialLinks.push({ platform: 'instagram', url: formData.instagram.trim() });
      }
      if (formData.twitter.trim()) {
        socialLinks.push({ platform: 'twitter', url: formData.twitter.trim() });
      }
      if (formData.youtube.trim()) {
        socialLinks.push({ platform: 'youtube', url: formData.youtube.trim() });
      }

      // Submit media data with social links
      const submitDataWithSocial = {
        ...submitData,
        socialLinks
      };

      await onSubmit(submitDataWithSocial as any);
    } catch (error: any) {
      // Handle specific field errors from API
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert(error.message || 'Error al guardar el medio');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Información Básica</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre del Medio"
            value={formData.name}
            onChange={handleInputChange('name')}
            error={errors.name}
            required
            disabled={loading}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.type}
              onChange={handleSelectChange('type')}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="radio">Radio</option>
              <option value="tv">TV</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description')(e.target.value)}
            disabled={loading}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Descripción del medio..."
          />
        </div>

        <Input
          label="URL de Streaming"
          value={formData.streamUrl}
          onChange={handleInputChange('streamUrl')}
          error={errors.streamUrl}
          type="url"
          required
          disabled={loading}
          placeholder="https://..."
        />
      </div>

      {/* Media Files */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Archivos Multimedia</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo
            </label>
            <FileUpload
              onUpload={handleFileUpload('logoUrl')}
              accept="image/*"
              currentUrl={formData.logoUrl}
              disabled={loading}
            />
            {errors.logoUrl && (
              <p className="mt-1 text-sm text-red-600">{errors.logoUrl}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banner
            </label>
            <FileUpload
              onUpload={handleFileUpload('bannerUrl')}
              accept="image/*"
              currentUrl={formData.bannerUrl}
              disabled={loading}
            />
            {errors.bannerUrl && (
              <p className="mt-1 text-sm text-red-600">{errors.bannerUrl}</p>
            )}
          </div>
        </div>
      </div>

      {/* Location and Category */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Ubicación y Categoría</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              País
            </label>
            <select
              value={formData.country}
              onChange={handleSelectChange('country')}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar país</option>
              {COUNTRIES.map(country => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Ciudad"
            value={formData.city}
            onChange={handleInputChange('city')}
            disabled={loading}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select
              value={formData.categoryId}
              onChange={handleSelectChange('categoryId')}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sin categoría</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Redes Sociales y Sitio Web</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Sitio Web"
            value={formData.website}
            onChange={handleInputChange('website')}
            error={errors.website}
            type="url"
            disabled={loading}
            placeholder="https://www.ejemplo.com"
          />
          
          <Input
            label="Facebook"
            value={formData.facebook}
            onChange={handleInputChange('facebook')}
            error={errors.facebook}
            type="url"
            disabled={loading}
            placeholder="https://facebook.com/pagina"
          />
          
          <Input
            label="Instagram"
            value={formData.instagram}
            onChange={handleInputChange('instagram')}
            error={errors.instagram}
            type="url"
            disabled={loading}
            placeholder="https://instagram.com/cuenta"
          />
          
          <Input
            label="Twitter/X"
            value={formData.twitter}
            onChange={handleInputChange('twitter')}
            error={errors.twitter}
            type="url"
            disabled={loading}
            placeholder="https://twitter.com/cuenta"
          />
          
          <Input
            label="YouTube"
            value={formData.youtube}
            onChange={handleInputChange('youtube')}
            error={errors.youtube}
            type="url"
            disabled={loading}
            placeholder="https://youtube.com/canal"
          />
        </div>
      </div>

      {/* Status Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Estado</h3>
        
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={handleCheckboxChange('isActive')}
              disabled={loading}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Activo</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={handleCheckboxChange('isFeatured')}
              disabled={loading}
              className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Destacado</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isVerified}
              onChange={handleCheckboxChange('isVerified')}
              disabled={loading}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Verificado</span>
          </label>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          disabled={loading}
        >
          Cancelar
        </Button>
        
        <Button
          type="submit"
          variant="primary"
          loading={loading}
        >
          {media ? 'Actualizar' : 'Crear'} Medio
        </Button>
      </div>
    </form>
  );
}