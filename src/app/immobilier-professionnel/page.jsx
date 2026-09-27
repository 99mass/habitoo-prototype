'use client';

import { Suspense } from 'react';
import { ProRealEstatePage } from '@/views/ProRealEstatePage';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-heading text-habitoo-gray">Chargement de l'espace immobilier pro...</div>}>
      <ProRealEstatePage />
    </Suspense>
  );
}
