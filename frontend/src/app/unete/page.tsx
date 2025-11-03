'use client';

import React from 'react';
import { Layout } from '@/components/layout';
import JoinRequestForm from '@/components/forms/JoinRequestForm';
import { Card } from '@/components/ui';

export default function JoinPage() {
  return (
    <Layout>
      <div className="bg-secondary-50 min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary-900">
                Únete a Nuestro{' '}
                <span className="gradient-text">Directorio</span>
              </h1>
              <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
                Lleva tu radio o canal de TV a miles de oyentes y espectadores en todo el mundo. 
                Es gratis y fácil de configurar.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-display font-bold text-secondary-900 mb-4">
                  ¿Por qué unirte a nosotros?
                </h2>
                <p className="text-secondary-600 max-w-2xl mx-auto">
                  Obtén todos estos beneficios al formar parte de nuestro directorio
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {[
                  {
                    icon: '🌍',
                    title: 'Alcance Global',
                    description: 'Llega a audiencias de todo el mundo y expande tu alcance más allá de las fronteras locales.',
                  },
                  {
                    icon: '📈',
                    title: 'Mayor Visibilidad',
                    description: 'Aparece en búsquedas y recomendaciones, aumentando tu audiencia de forma orgánica.',
                  },
                  {
                    icon: '🎯',
                    title: 'Audiencia Segmentada',
                    description: 'Conecta con oyentes interesados en tu tipo de contenido a través de nuestras categorías.',
                  },
                  {
                    icon: '📊',
                    title: 'Estadísticas Detalladas',
                    description: 'Accede a métricas de reproducciones y visualizaciones para entender mejor a tu audiencia.',
                  },
                  {
                    icon: '🚀',
                    title: 'Fácil Integración',
                    description: 'Solo necesitas tu URL de stream. Nosotros nos encargamos del resto.',
                  },
                  {
                    icon: '💰',
                    title: 'Completamente Gratis',
                    description: 'Sin costos ocultos, sin comisiones. Tu contenido, tu audiencia, sin restricciones.',
                  },
                ].map((benefit, index) => (
                  <Card key={index} className="text-center hover:shadow-large transition-all duration-300">
                    <div className="text-4xl mb-4">{benefit.icon}</div>
                    <h3 className="font-semibold text-lg text-secondary-900 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-secondary-600 text-sm">
                      {benefit.description}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <JoinRequestForm />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-display font-bold text-secondary-900 mb-4">
                  Preguntas Frecuentes
                </h2>
                <p className="text-secondary-600">
                  Resolvemos las dudas más comunes sobre el proceso de adhesión
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    question: '¿Cuánto tiempo toma la aprobación?',
                    answer: 'Normalmente revisamos las solicitudes en 24-48 horas. Te contactaremos por email con la respuesta.',
                  },
                  {
                    question: '¿Qué requisitos debe cumplir mi stream?',
                    answer: 'Tu stream debe estar funcionando correctamente, tener contenido apropiado y cumplir con las leyes de derechos de autor.',
                  },
                  {
                    question: '¿Puedo cambiar la información después?',
                    answer: 'Sí, una vez aprobado podrás contactarnos para actualizar la información de tu medio.',
                  },
                  {
                    question: '¿Hay algún costo por estar en el directorio?',
                    answer: 'No, el servicio es completamente gratuito. No cobramos por incluir tu medio en nuestro directorio.',
                  },
                  {
                    question: '¿Qué pasa si mi solicitud es rechazada?',
                    answer: 'Te explicaremos los motivos del rechazo y podrás corregir los problemas para enviar una nueva solicitud.',
                  },
                  {
                    question: '¿Puedo tener múltiples medios en el directorio?',
                    answer: 'Sí, puedes enviar solicitudes separadas para cada radio o canal de TV que tengas.',
                  },
                ].map((faq, index) => (
                  <Card key={index} className="hover:shadow-medium transition-all duration-300">
                    <div>
                      <h3 className="font-semibold text-lg text-secondary-900 mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-secondary-600">
                        {faq.answer}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-gradient-to-r from-primary-600 to-accent-600 text-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl font-display font-bold">
                ¿Necesitas Ayuda?
              </h2>
              <p className="text-xl text-primary-100">
                Nuestro equipo está aquí para ayudarte en todo el proceso
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <a
                  href="mailto:soporte@radiotvdirectory.com"
                  className="bg-white text-primary-600 hover:bg-primary-50 px-8 py-3 rounded-xl font-semibold transition-colors shadow-large hover:shadow-xl"
                >
                  📧 Contactar Soporte
                </a>
                <a
                  href="/contacto"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 rounded-xl font-semibold transition-colors"
                >
                  💬 Más Información
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}