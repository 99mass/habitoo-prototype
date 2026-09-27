'use client';

import { Suspense } from 'react';
import { ProRegisterPage } from '@/views/Professionnels/Onboarding/ProRegisterPage';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-heading text-habitoo-gray">Chargement du formulaire...</div>}>
      <ProRegisterPage />
    </Suspense>
  );
}
