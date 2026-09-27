'use client';

import { Suspense } from 'react';
import { PropertyDetailPage } from '@/views/PropertyDetailPage';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-heading text-habitoo-gray">Chargement du bien...</div>}>
      <PropertyDetailPage />
    </Suspense>
  );
}
