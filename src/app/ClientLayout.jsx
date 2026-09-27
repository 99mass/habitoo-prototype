'use client';

import React, { useEffect, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { HabitooProvider } from '../context/HabitooContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { BottomNav } from '../components/BottomNav';
import { DepositModal } from '../components/DepositModal';
import { AuthModal } from '../components/AuthModal';
import { ProHeader } from '../components/ProHeader';
import { ProTunnelHeader } from '../components/ProTunnelHeader';

const ClientLayoutContent = ({ children }) => {
  const pathname = usePathname() || '/';
  const isPublishPage = pathname === '/publier' || pathname === '/publier-une-annonce';
  const isCheckoutPage = pathname === '/checkout' || pathname === '/reservation/paiement';
  const isDetailPage = pathname.startsWith('/bien/');
  const isProPage = pathname === '/professionnels' || pathname === '/pro';
  const isProTunnel = pathname === '/pro/inscription' || pathname === '/pro/en-attente';
  const isProApp = pathname.startsWith('/pro/app');
  const hideBottomNav = isPublishPage || isCheckoutPage || isDetailPage || isProPage || isProTunnel || isProApp;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="app-root-layout flex flex-col min-h-screen w-full max-w-full overflow-x-clip">
      {isProApp ? null : isProTunnel ? <ProTunnelHeader /> : isProPage ? <ProHeader /> : <Header />}

      <main className={`app-main-content flex-grow min-w-0 w-full overflow-x-clip ${
        isDetailPage 
          ? 'pb-[calc(74px+env(safe-area-inset-bottom,0px))] lg:pb-0' 
          : isPublishPage
            ? 'pb-[calc(80px+env(safe-area-inset-bottom,0px))] lg:pb-0'
            : (isCheckoutPage || isProPage || isProTunnel)
              ? 'pb-0'
              : isProApp
                ? 'pb-0 md:pb-[calc(64px+env(safe-area-inset-bottom,0px))]'
                : 'pb-[calc(62px+env(safe-area-inset-bottom,0px))] lg:pb-0'
      }`}>
        {children}
      </main>

      {!isPublishPage && !isProTunnel && !isProApp && <Footer />}

      {!hideBottomNav && <BottomNav />}

      {/* Global Modals */}
      <DepositModal />
      <AuthModal />
    </div>
  );
};

export const ClientLayout = ({ children }) => {
  return (
    <HabitooProvider>
      <Suspense fallback={<div className="min-h-screen w-full bg-[#F8F9FA]" />}>
        <ClientLayoutContent>{children}</ClientLayoutContent>
      </Suspense>
    </HabitooProvider>
  );
};

export default ClientLayout;
