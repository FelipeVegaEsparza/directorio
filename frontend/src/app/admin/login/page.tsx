'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

export default function AdminLoginPage() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(credentials);
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    }
  };

  const handleInputChange = (field: string) => (value: string) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-secondary-900 to-primary-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-accent-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="flex flex-col items-center">
          <img
            src="/images/logo.png"
            alt="Hostreams"
            className="h-16 w-auto mb-8 drop-shadow-lg"
          />
          <h2 className="text-center text-3xl font-bold text-white tracking-tight">
            Bienvenido de nuevo
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Ingresa tus credenciales para acceder al panel
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300 ml-1">Usuario</label>
                <div className="relative">
                  <Input
                    type="text"
                    value={credentials.username}
                    onChange={handleInputChange('username')}
                    placeholder="ej. admin"
                    required
                    disabled={loading}
                    className="bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300 ml-1">Contraseña</label>
                <div className="relative">
                  <Input
                    type="password"
                    value={credentials.password}
                    onChange={handleInputChange('password')}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    className="bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500/50"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 border-0 shadow-lg shadow-primary-500/20 py-3 text-lg font-semibold"
              loading={loading}
              disabled={loading || !credentials.username || !credentials.password}
            >
              {loading ? 'Iniciando sesión...' : 'Ingresar al Panel'}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Hostreams. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}