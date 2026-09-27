'use client';

import { Suspense } from 'react';
import { ConciergeriePage } from '@/views/ConciergeriePage';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-heading text-habitoo-gray">Chargement des services de conciergerie...</div>}>
      <ConciergeriePage />
    </Suspense>
  );
}
