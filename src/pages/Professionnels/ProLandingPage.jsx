import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './ProLanding.css';

import { ProHero } from './components/ProHero';
import { ProBentoAdvantages } from './components/ProBentoAdvantages';
import { ProTargetAudience } from './components/ProTargetAudience';
import { ProPricing } from './components/ProPricing';
import { ProTrustKYC } from './components/ProTrustKYC';
import { ProAppPromo } from './components/ProAppPromo';
import { ProFaq } from './components/ProFaq';
import { ProFinalCta } from './components/ProFinalCta';

export const ProLandingPage = () => {
  const location = useLocation();

  useEffect(() => {
    const originalTitle = document.title;
    document.title = "Habitoo PRO - L'écosystème immobilier de référence en Afrique";

    // Favicon Habitoo PRO (Logo blanc Code_Generated_Image (4).png sur fond noir)
    const faviconLink = document.getElementById('favicon') || document.querySelector("link[rel*='icon']");
    const originalFavicon = faviconLink ? faviconLink.getAttribute('href') : '/favicon.png';
    const proFavicon = '/favicon-pro.png';

    if (faviconLink) {
      faviconLink.href = proFavicon;
    }

    return () => {
      document.title = originalTitle;
      if (faviconLink) {
        faviconLink.href = originalFavicon;
      }
    };
  }, []);

  // Scroll vers la section cible passée via navigation state
  useEffect(() => {
    const sectionId = location.state?.scrollTo;
    if (!sectionId) return;
    // Petit délai pour laisser le DOM se rendre
    const timer = setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [location.state]);

  return (
    <div className="habitoo-pro-page">
      {/* 1. Hero Section (Authority, Dual Audience, Metrics & High-Res Frame) */}
      <ProHero />

      {/* 2. Strategic Advantages (Visual Cards with Images on Top) */}
      <ProBentoAdvantages />

      {/* 3. Dedicated Approach (Interactive Split-Screen Carousel) */}
      <ProTargetAudience />

      {/* 4. Pricing (Summary Cards + Full Line-by-Line Matrix Comparison Table) */}
      <ProPricing />

      {/* 5. Trust & KYC (Horizontal Illustrated Step Flow) */}
      <ProTrustKYC />

      {/* 6. Mobile App Promo (Signature Red Banner - Exact HomePage Match) */}
      <ProAppPromo />

      {/* 7. FAQ Section (Accordion with Plus/Minus Indicators - Exact HomePage Match) */}
      <ProFaq />

      {/* 8. Final Action Banner (Prestige Dark Background, Direct Conversion) */}
      <ProFinalCta />
    </div>
  );
};

export default ProLandingPage;
