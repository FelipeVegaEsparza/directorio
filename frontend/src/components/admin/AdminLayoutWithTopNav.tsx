'use client';

import { AdminTopNav } from './AdminTopNav';

interface AdminLayoutWithTopNavProps {
  children: React.ReactNode;
}

export function AdminLayoutWithTopNav({ children }: AdminLayoutWithTopNavProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation */}
      <AdminTopNav />

      {/* Main content */}
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}