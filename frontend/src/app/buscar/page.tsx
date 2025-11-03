import { Suspense } from 'react';
import SearchPageClient from './SearchPageClient';
import { Layout } from '@/components/layout';
import { Loading } from '@/components/ui';

export default function SearchPage() {
  return (
    <Layout>
      <Suspense fallback={
        <div className="flex justify-center items-center min-h-screen">
          <Loading size="lg" text="Cargando página de búsqueda..." />
        </div>
      }>
        <SearchPageClient />
      </Suspense>
    </Layout>
  );
}
