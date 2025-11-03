'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, PlayIcon, GlobeAltIcon, UsersIcon, HeartIcon } from '@heroicons/react/24/outline';
import { Layout } from '@/components/layout';
import { Button, Card, NoSSR } from '@/components/ui';

export default function AboutPage() {
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
                <div className="text-6xl mb-4">📻</div>
                <h1 className="text-4xl font-display font-bold mb-4">
                  Acerca de Nosotros
                </h1>
                <p className="text-xl text-primary-100 max-w-2xl mx-auto">
                  Conectando el mundo a través de la radio y televisión
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="container py-12">
            <div className="max-w-4xl mx-auto space-y-12">
              {/* Mission */}
              <div className="text-center">
                <h2 className="text-3xl font-display font-bold text-secondary-900 mb-6">
                  Nuestra Misión
                </h2>
                <p className="text-lg text-secondary-600 leading-relaxed">
                  Somos una plataforma dedicada a conectar a las personas con las mejores radios y canales de televisión 
                  de todo el mundo. Creemos en el poder de los medios para informar, entretener y unir comunidades, 
                  sin importar las fronteras geográficas.
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="p-8 text-center">
                  <div className="p-4 bg-primary-100 rounded-2xl w-fit mx-auto mb-4">
                    <GlobeAltIcon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                    Alcance Global
                  </h3>
                  <p className="text-secondary-600">
                    Contenido de radios y canales de TV de múltiples países y culturas, 
                    todo en una sola plataforma.
                  </p>
                </Card>

                <Card className="p-8 text-center">
                  <div className="p-4 bg-primary-100 rounded-2xl w-fit mx-auto mb-4">
                    <PlayIcon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                    Streaming de Calidad
                  </h3>
                  <p className="text-secondary-600">
                    Tecnología optimizada para ofrecer la mejor experiencia de 
                    streaming de audio y video.
                  </p>
                </Card>

                <Card className="p-8 text-center">
                  <div className="p-4 bg-primary-100 rounded-2xl w-fit mx-auto mb-4">
                    <UsersIcon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                    Comunidad
                  </h3>
                  <p className="text-secondary-600">
                    Una plataforma abierta donde emisoras y oyentes se conectan 
                    para compartir contenido de calidad.
                  </p>
                </Card>
              </div>

              {/* Story */}
              <div className="bg-white rounded-2xl p-8 md:p-12">
                <h2 className="text-3xl font-display font-bold text-secondary-900 mb-6">
                  Nuestra Historia
                </h2>
                <div className="prose prose-lg max-w-none text-secondary-600">
                  <p>
                    Nuestro directorio nació de la pasión por los medios de comunicación y la necesidad 
                    de crear un espacio donde las emisoras de radio y televisión pudieran llegar a una 
                    audiencia global sin barreras técnicas o geográficas.
                  </p>
                  <p>
                    Comenzamos como un pequeño proyecto para catalogar estaciones de radio locales, 
                    pero rápidamente nos dimos cuenta del potencial de crear algo más grande: una 
                    plataforma que democratizara el acceso a contenido de calidad de todo el mundo.
                  </p>
                  <p>
                    Hoy, trabajamos incansablemente para mejorar la experiencia tanto de las emisoras 
                    que confían en nosotros para distribuir su contenido, como de los millones de 
                    oyentes y espectadores que nos visitan cada día.
                  </p>
                </div>
              </div>

              {/* Values */}
              <div>
                <h2 className="text-3xl font-display font-bold text-secondary-900 mb-8 text-center">
                  Nuestros Valores
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-success-100 rounded-xl flex-shrink-0">
                      <HeartIcon className="w-6 h-6 text-success-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary-900 mb-2">
                        Pasión por los Medios
                      </h3>
                      <p className="text-secondary-600">
                        Creemos en el poder transformador de la radio y televisión para 
                        conectar personas y culturas.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-primary-100 rounded-xl flex-shrink-0">
                      <GlobeAltIcon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary-900 mb-2">
                        Accesibilidad Universal
                      </h3>
                      <p className="text-secondary-600">
                        Trabajamos para que el contenido de calidad sea accesible 
                        para todos, sin importar su ubicación.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-accent-100 rounded-xl flex-shrink-0">
                      <UsersIcon className="w-6 h-6 text-accent-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary-900 mb-2">
                        Comunidad Primero
                      </h3>
                      <p className="text-secondary-600">
                        Nuestra plataforma existe para servir tanto a emisoras 
                        como a oyentes, creando valor para ambos.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-warning-100 rounded-xl flex-shrink-0">
                      <PlayIcon className="w-6 h-6 text-warning-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary-900 mb-2">
                        Innovación Continua
                      </h3>
                      <p className="text-secondary-600">
                        Constantemente mejoramos nuestra tecnología para ofrecer 
                        la mejor experiencia de streaming.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-8 md:p-12 text-white text-center">
                <h2 className="text-3xl font-display font-bold mb-4">
                  ¿Quieres Ser Parte de Nuestra Historia?
                </h2>
                <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                  Únete a nuestra comunidad de emisoras y lleva tu contenido a una audiencia global
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => router.push('/unete')}
                    className="bg-white text-primary-600 hover:bg-primary-50"
                    size="lg"
                  >
                    Únete Ahora
                  </Button>
                  <Button
                    onClick={() => router.push('/contacto')}
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-primary-600"
                    size="lg"
                  >
                    Contáctanos
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </NoSSR>
    </Layout>
  );
}