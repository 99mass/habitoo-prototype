import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HabitooProvider } from './context/HabitooContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { BottomNav } from './components/BottomNav';
import { DepositModal } from './components/DepositModal';
import { AuthModal } from './components/AuthModal';

import { HomePage } from './pages/HomePage';
import { SerpPage } from './pages/SerpPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { DashboardPage } from './pages/DashboardPage';
import { ConciergeriePage } from './pages/ConciergeriePage';
import { PublishPropertyPage } from './pages/PublishPropertyPage';
import { AboutPage } from './pages/About/AboutPage';
import { CheckoutPage } from './pages/Checkout/CheckoutPage';
import { ProLandingPage } from './pages/Professionnels/ProLandingPage';
import { ProRegisterPage } from './pages/Professionnels/Onboarding/ProRegisterPage';
import { ProPendingPass } from './pages/Professionnels/Onboarding/ProPendingPass';
import { ProHeader } from './components/ProHeader';
import { ProTunnelHeader } from './components/ProTunnelHeader';
import { ProDashboardLayout } from './pages/Professionnels/App/ProDashboardLayout';
import { VitrinePage } from './pages/VitrinePage';

// Auto scroll to top on navigation
const ScrollToTop = () => {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);
  return null;
};

const AppContent = () => {
  const location = useLocation();
  const isPublishPage = location.pathname === '/publier' || location.pathname === '/publier-une-annonce';
  const isCheckoutPage = location.pathname === '/checkout' || location.pathname === '/reservation/paiement';
  const isDetailPage = location.pathname.startsWith('/bien/');
  const isProPage = location.pathname === '/professionnels' || location.pathname === '/pro';
  const isProTunnel = location.pathname === '/pro/inscription' || location.pathname === '/pro/en-attente';
  const isProApp = location.pathname.startsWith('/pro/app');
  const hideBottomNav = isPublishPage || isCheckoutPage || isDetailPage || isProPage || isProTunnel || isProApp;

  return (
    <div className="app-root-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', maxWidth: '100%', overflowX: 'clip' }}>
      {isProApp ? null : isProTunnel ? <ProTunnelHeader /> : isProPage ? <ProHeader /> : <Header />}
      
      <main className="app-main-content" style={{ flexGrow: 1, minWidth: 0, width: '100%', overflowX: 'clip' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/recherche" element={<SerpPage />} />
          <Route path="/bien/:id" element={<PropertyDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/reservation/paiement" element={<CheckoutPage />} />
          <Route path="/mon-compte" element={<DashboardPage />} />
          <Route path="/conciergerie" element={<ConciergeriePage />} />
          <Route path="/a-propos" element={<AboutPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/professionnels" element={<ProLandingPage />} />
          <Route path="/pro" element={<ProLandingPage />} />
          <Route path="/pro/inscription" element={<ProRegisterPage />} />
          <Route path="/pro/en-attente" element={<ProPendingPass />} />
          <Route path="/pro/app" element={<ProDashboardLayout />} />
          <Route path="/pro/app/dashboard" element={<ProDashboardLayout />} />
          <Route path="/vitrine" element={<VitrinePage />} />
          <Route path="/vitrine/:proId" element={<VitrinePage />} />
          <Route path="/publier" element={<PublishPropertyPage />} />
          <Route path="/publier-une-annonce" element={<PublishPropertyPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {!isPublishPage && !isProTunnel && !isProApp && <Footer />}

      {/* PWA Mobile Bottom Navigation (masquée sur l'Espace PRO, les tunnels transactionnels et la fiche détail) */}
      {!hideBottomNav && <BottomNav />}

      {/* Global Modals */}
      <DepositModal />
      <AuthModal />

      <style>{`
        @media (max-width: 1024px) {
          .app-main-content {
            padding-bottom: ${
              isDetailPage 
                ? 'calc(74px + env(safe-area-inset-bottom, 0px))' 
                : isPublishPage
                  ? 'calc(80px + env(safe-area-inset-bottom, 0px))'
                  : (isCheckoutPage || isProPage || isProTunnel)
                    ? '0px' 
                    : isProApp
                      ? '0px'
                      : 'calc(62px + env(safe-area-inset-bottom, 0px))'
            };
          }
        }
        @media (max-width: 768px) {
          .app-main-content {
            ${isProApp ? 'padding-bottom: calc(64px + env(safe-area-inset-bottom, 0px)) !important;' : ''}
          }
        }
      `}</style>
    </div>
  );
};

export const App = () => {
  return (
    <HabitooProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </HabitooProvider>
  );
};

export default App;
