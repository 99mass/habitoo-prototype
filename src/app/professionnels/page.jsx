'use client';

import { Suspense } from 'react';
import { ProLandingPage } from '@/views/Professionnels/ProLandingPage';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-heading text-habitoo-gray">Chargement de l'espace pro...</div>}>
      <ProLandingPage />
    </Suspense>
  );
}
