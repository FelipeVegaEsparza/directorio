'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { Layout } from '@/components/layout';
import { Button, Card, NoSSR } from '@/components/ui';

export default function ContactPage() {
  const router = useRouter();

  return (
    <Layout>
      <NoSSR>
        <div className="bg-secondary-50 min-h-screen">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white">
            <div className="container py-12">
              <div className="flex items-center mb-6">
                <Button
                  variant="ghost"
                  onClick={() => router.back()}
                  className="text-white hover:bg-white/20 mr-4"
                >
                  <ArrowLeftIcon className="w-4 h-4 mr-2" />
                  Volver
                </Button>
              </div>
              
              <div className="text-center">
                <div className="text-6xl mb-4">📞</div>
                <h1 className="text-4xl font-display font-bold mb-4">
                  Contacto
                </h1>
                <p className="text-xl text-primary-100 max-w-2xl mx-auto">
                  ¿Tienes preguntas? Estamos aquí para ayudarte
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="container py-12">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Info */}
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-secondary-900 mb-6">
                      Información de Contacto
                    </h2>
                    
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-primary-100 rounded-xl">
                          <EnvelopeIcon className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-secondary-900 mb-1">
                            Email
                          </h3>
                          <p className="text-secondary-600">
                            contacto@radiotvdirectorio.com
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-primary-100 rounded-xl">
                          <PhoneIcon className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-secondary-900 mb-1">
                            Teléfono
                          </h3>
                          <p className="text-secondary-600">
                            +1 (555) 123-4567
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-primary-100 rounded-xl">
                          <MapPinIcon className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-secondary-900 mb-1">
                            Dirección
                          </h3>
                          <p className="text-secondary-600">
                            123 Media Street<br />
                            Ciudad, País 12345
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                      Horarios de Atención
                    </h3>
                    <div className="space-y-2 text-secondary-600">
                      <p>Lunes - Viernes: 9:00 AM - 6:00 PM</p>
                      <p>Sábados: 10:00 AM - 4:00 PM</p>
                      <p>Domingos: Cerrado</p>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <Card className="p-8">
                  <h2 className="text-2xl font-display font-bold text-secondary-900 mb-6">
                    Envíanos un Mensaje
                  </h2>
                  
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Nombre
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Tu nombre"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="tu@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Asunto
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="¿En qué podemos ayudarte?"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Mensaje
                      </label>
                      <textarea
                        rows={6}
                        className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Escribe tu mensaje aquí..."
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                      Enviar Mensaje
                    </Button>
                  </form>
                </Card>
              </div>

              {/* FAQ Section */}
              <div className="mt-16">
                <h2 className="text-2xl font-display font-bold text-secondary-900 mb-8 text-center">
                  Preguntas Frecuentes
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h3 className="font-semibold text-secondary-900 mb-2">
                      ¿Cómo puedo agregar mi radio o canal de TV?
                    </h3>
                    <p className="text-secondary-600">
                      Puedes unirte a nuestra plataforma completando el formulario en la página "Únete". 
                      Revisaremos tu solicitud y te contactaremos pronto.
                    </p>
                  </Card>

                  <Card className="p-6">
                    <h3 className="font-semibold text-secondary-900 mb-2">
                      ¿Es gratuito usar la plataforma?
                    </h3>
                    <p className="text-secondary-600">
                      Sí, tanto para oyentes como para emisoras, nuestra plataforma es completamente gratuita.
                    </p>
                  </Card>

                  <Card className="p-6">
                    <h3 className="font-semibold text-secondary-900 mb-2">
                      ¿Qué requisitos técnicos necesito?
                    </h3>
                    <p className="text-secondary-600">
                      Solo necesitas una URL de stream válida y estable. Soportamos los formatos más comunes 
                      de audio y video streaming.
                    </p>
                  </Card>

                  <Card className="p-6">
                    <h3 className="font-semibold text-secondary-900 mb-2">
                      ¿Cómo reporto un problema técnico?
                    </h3>
                    <p className="text-secondary-600">
                      Puedes contactarnos a través de este formulario o enviarnos un email directamente. 
                      Responderemos lo antes posible.
                    </p>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </NoSSR>
    </Layout>
  );
}