'use client';

import { Suspense } from 'react';
import { ProDashboardLayout } from '@/views/Professionnels/App/ProDashboardLayout';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-heading text-habitoo-gray">Chargement de l'application pro...</div>}>
      <ProDashboardLayout />
    </Suspense>
  );
}
