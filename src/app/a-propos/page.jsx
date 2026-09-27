'use client';

import { Suspense } from 'react';
import { AboutPage } from '@/views/About/AboutPage';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-heading text-habitoo-gray">Chargement d'Habitoo...</div>}>
      <AboutPage />
    </Suspense>
  );
}
