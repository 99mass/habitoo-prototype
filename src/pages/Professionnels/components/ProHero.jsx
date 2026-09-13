import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, CreditCard, Globe, ArrowRight } from 'lucide-react';

export const ProHero = () => {
  const scrollToPricing = (e) => {
    e.preventDefault();
    const pricingEl = document.getElementById('tarifs');
    if (pricingEl) {
      pricingEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="habitoo-pro-hero">
      {/* Background Media & Directional Dark Luxury Gradient */}
      <div className="habitoo-pro-hero-bg-wrapper">
        <img 
          src="/assets/pro-african-business.jpg" 
          alt="Partenaires d'affaires immobiliers Habitoo PRO" 
          className="habitoo-pro-hero-bg-img"
        />
        <div className="habitoo-pro-hero-overlay" />
      </div>

      <div className="habitoo-pro-container">
        {/* Left: Value Proposition & Authority (Editorial Alignment) */}
        <div className="habitoo-pro-hero-content">
          <h1 className="habitoo-pro-hero-title">
            Développez votre activité immobilière
          </h1>
          
          <p className="habitoo-pro-hero-subtitle">
            La force d'un réseau vérifié pour les démarcheurs indépendants et la puissance 
            d'outils digitaux exclusifs pour les agences immobilières.
          </p>

          {/* CTAs */}
          <div className="habitoo-pro-hero-actions">
            <Link to="/pro/inscription" className="habitoo-pro-btn-primary">
              <span>Rejoindre Habitoo PRO</span>
              <ArrowRight size={18} />
            </Link>
            <a 
              href="#tarifs" 
              onClick={scrollToPricing} 
              className="habitoo-pro-btn-secondary"
            >
              Voir les offres et forfaits
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
