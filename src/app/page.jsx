'use client';

import { Suspense } from 'react';
import { HomePage } from '@/views/HomePage';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-heading text-habitoo-gray">Chargement d'Habitoo...</div>}>
      <HomePage />
    </Suspense>
  );
}
