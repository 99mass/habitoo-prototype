'use client';

import { Suspense } from 'react';
import { SerpPage } from '@/views/SerpPage';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-heading text-habitoo-gray">Chargement des annonces...</div>}>
      <SerpPage />
    </Suspense>
  );
}
