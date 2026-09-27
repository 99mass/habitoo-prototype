'use client';

import { Suspense } from 'react';
import { CheckoutPage } from '@/views/Checkout/CheckoutPage';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-heading text-habitoo-gray">Chargement de la réservation...</div>}>
      <CheckoutPage />
    </Suspense>
  );
}
