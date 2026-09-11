import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HabitooProvider } from './context/HabitooContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DepositModal } from './components/DepositModal';
import { AuthModal } from './components/AuthModal';

import { HomePage } from './pages/HomePage';
import { SerpPage } from './pages/SerpPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { DashboardPage } from './pages/DashboardPage';
import { ConciergeriePage } from './pages/ConciergeriePage';
import { PublishPropertyPage } from './pages/PublishPropertyPage';

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      <Header />
      
      <main style={{ flexGrow: 1, minWidth: 0, width: '100%', overflowX: 'hidden' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/recherche" element={<SerpPage />} />
          <Route path="/bien/:id" element={<PropertyDetailPage />} />
          <Route path="/mon-compte" element={<DashboardPage />} />
          <Route path="/conciergerie" element={<ConciergeriePage />} />
          <Route path="/publier" element={<PublishPropertyPage />} />
          <Route path="/publier-une-annonce" element={<PublishPropertyPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {!isPublishPage && <Footer />}

      {/* Global Modals */}
      <DepositModal />
      <AuthModal />
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
