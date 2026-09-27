'use client';

import { Suspense } from 'react';
import { PublishPropertyPage } from '@/views/PublishPropertyPage';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-heading text-habitoo-gray">Chargement du tunnel de publication...</div>}>
      <PublishPropertyPage />
    </Suspense>
  );
}
