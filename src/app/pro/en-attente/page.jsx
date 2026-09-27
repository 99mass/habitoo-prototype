'use client';

import { Suspense } from 'react';
import { ProPendingPass } from '@/views/Professionnels/Onboarding/ProPendingPass';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-heading text-habitoo-gray">Chargement...</div>}>
      <ProPendingPass />
    </Suspense>
  );
}
