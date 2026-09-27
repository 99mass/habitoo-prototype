'use client';

import { Suspense } from 'react';
import { DashboardPage } from '@/views/DashboardPage';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-heading text-habitoo-gray">Chargement du tableau de bord...</div>}>
      <DashboardPage />
    </Suspense>
  );
}
