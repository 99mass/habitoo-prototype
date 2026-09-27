'use client';

import { Suspense } from 'react';
import { VitrinePage } from '@/views/VitrinePage';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-heading text-habitoo-gray">Chargement de la vitrine...</div>}>
      <VitrinePage />
    </Suspense>
  );
}
