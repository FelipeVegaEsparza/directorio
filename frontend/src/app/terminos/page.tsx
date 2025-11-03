'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Layout } from '@/components/layout';
import { Button, Card, NoSSR } from '@/components/ui';

export default function TermsPage() {
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
                <div className="text-6xl mb-4">📋</div>
                <h1 className="text-4xl font-display font-bold mb-4">
                  Términos y Condiciones
                </h1>
                <p className="text-xl text-primary-100 max-w-2xl mx-auto">
                  Condiciones de uso de nuestra plataforma
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="container py-12">
            <div className="max-w-4xl mx-auto">
              <Card className="p-8 md:p-12">
                <div className="prose prose-lg max-w-none">
                  <p className="text-secondary-600 mb-8">
                    <strong>Última actualización:</strong> {new Date().toLocaleDateString('es-ES')}
                  </p>

                  <h2 className="text-2xl font-display font-bold text-secondary-900 mb-4">
                    1. Aceptación de los Términos
                  </h2>
                  <p className="text-secondary-600 mb-6">
                    Al acceder y utilizar este directorio de radio y televisión, usted acepta estar sujeto a estos 
                    términos y condiciones de uso. Si no está de acuerdo con alguna parte de estos términos, 
                    no debe utilizar nuestro servicio.
                  </p>

                  <h2 className="text-2xl font-display font-bold text-secondary-900 mb-4">
                    2. Descripción del Servicio
                  </h2>
                  <p className="text-secondary-600 mb-6">
                    Nuestro servicio proporciona un directorio de estaciones de radio y canales de televisión 
                    disponibles en línea. Actuamos como intermediarios, facilitando el acceso a contenido 
                    transmitido por terceros. No somos propietarios del contenido transmitido.
                  </p>

                  <h2 className="text-2xl font-display font-bold text-secondary-900 mb-4">
                    3. Uso Aceptable
                  </h2>
                  <div className="text-secondary-600 mb-6">
                    <p className="mb-3">Usted se compromete a:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Utilizar el servicio únicamente para fines legales y legítimos</li>
                      <li>No interferir con el funcionamiento del servicio</li>
                      <li>No intentar acceder a áreas restringidas del sistema</li>
                      <li>Respetar los derechos de propiedad intelectual de terceros</li>
                      <li>No transmitir contenido malicioso o dañino</li>
                    </ul>
                  </div>

                  <h2 className="text-2xl font-display font-bold text-secondary-900 mb-4">
                    4. Contenido de Terceros
                  </h2>
                  <p className="text-secondary-600 mb-6">
                    El contenido de audio y video disponible a través de nuestro directorio es proporcionado 
                    por estaciones de radio y canales de televisión independientes. No controlamos ni somos 
                    responsables del contenido, la calidad, la exactitud o la legalidad de las transmisiones.
                  </p>

                  <h2 className="text-2xl font-display font-bold text-secondary-900 mb-4">
                    5. Registro de Emisoras
                  </h2>
                  <div className="text-secondary-600 mb-6">
                    <p className="mb-3">Las emisoras que deseen unirse a nuestro directorio deben:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Proporcionar información veraz y actualizada</li>
                      <li>Poseer los derechos legales para transmitir su contenido</li>
                      <li>Cumplir con las leyes aplicables en su jurisdicción</li>
                      <li>Mantener la calidad y estabilidad de su transmisión</li>
                      <li>Notificar cambios en su información de contacto o transmisión</li>
                    </ul>
                  </div>

                  <h2 className="text-2xl font-display font-bold text-secondary-900 mb-4">
                    6. Privacidad y Datos
                  </h2>
                  <p className="text-secondary-600 mb-6">
                    Recopilamos información limitada para mejorar nuestro servicio, incluyendo estadísticas 
                    de uso anónimas. No vendemos ni compartimos información personal con terceros sin 
                    consentimiento. Para más detalles, consulte nuestra Política de Privacidad.
                  </p>

                  <h2 className="text-2xl font-display font-bold text-secondary-900 mb-4">
                    7. Limitación de Responsabilidad
                  </h2>
                  <p className="text-secondary-600 mb-6">
                    Nuestro servicio se proporciona "tal como está". No garantizamos la disponibilidad 
                    continua del servicio ni la calidad de las transmisiones de terceros. No seremos 
                    responsables de daños directos, indirectos, incidentales o consecuentes derivados 
                    del uso de nuestro servicio.
                  </p>

                  <h2 className="text-2xl font-display font-bold text-secondary-900 mb-4">
                    8. Propiedad Intelectual
                  </h2>
                  <p className="text-secondary-600 mb-6">
                    El diseño, la estructura y el código de nuestro directorio están protegidos por 
                    derechos de autor. El contenido transmitido pertenece a sus respectivos propietarios. 
                    Respetamos los derechos de propiedad intelectual y esperamos que nuestros usuarios 
                    hagan lo mismo.
                  </p>

                  <h2 className="text-2xl font-display font-bold text-secondary-900 mb-4">
                    9. Modificaciones del Servicio
                  </h2>
                  <p className="text-secondary-600 mb-6">
                    Nos reservamos el derecho de modificar, suspender o discontinuar cualquier aspecto 
                    de nuestro servicio en cualquier momento, con o sin previo aviso. También podemos 
                    actualizar estos términos periódicamente.
                  </p>

                  <h2 className="text-2xl font-display font-bold text-secondary-900 mb-4">
                    10. Terminación
                  </h2>
                  <p className="text-secondary-600 mb-6">
                    Podemos terminar o suspender el acceso a nuestro servicio inmediatamente, sin previo 
                    aviso, por cualquier motivo, incluyendo el incumplimiento de estos términos.
                  </p>

                  <h2 className="text-2xl font-display font-bold text-secondary-900 mb-4">
                    11. Ley Aplicable
                  </h2>
                  <p className="text-secondary-600 mb-6">
                    Estos términos se rigen por las leyes aplicables en nuestra jurisdicción. 
                    Cualquier disputa se resolverá en los tribunales competentes de dicha jurisdicción.
                  </p>

                  <h2 className="text-2xl font-display font-bold text-secondary-900 mb-4">
                    12. Contacto
                  </h2>
                  <p className="text-secondary-600 mb-6">
                    Si tiene preguntas sobre estos términos y condiciones, puede contactarnos a través 
                    de nuestra página de contacto o enviando un correo electrónico a: 
                    <a href="mailto:legal@radiotvdirectorio.com" className="text-primary-600 hover:text-primary-700">
                      legal@radiotvdirectorio.com
                    </a>
                  </p>

                  <div className="bg-secondary-50 rounded-lg p-6 mt-8">
                    <p className="text-sm text-secondary-600">
                      <strong>Nota:</strong> Estos términos y condiciones pueden ser actualizados 
                      periódicamente. Le recomendamos revisar esta página regularmente para estar 
                      al tanto de cualquier cambio.
                    </p>
                  </div>
                </div>
              </Card>

              {/* CTA */}
              <div className="text-center mt-8">
                <p className="text-secondary-600 mb-4">
                  ¿Tienes preguntas sobre nuestros términos?
                </p>
                <Button onClick={() => router.push('/contacto')}>
                  Contáctanos
                </Button>
              </div>
            </div>
          </div>
        </div>
      </NoSSR>
    </Layout>
  );
}