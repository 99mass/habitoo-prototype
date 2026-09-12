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
      <div className="habitoo-pro-container">
        <div className="habitoo-pro-hero-grid">
          
          {/* Left: Value Proposition & Authority */}
          <div className="habitoo-pro-hero-content">
            <span className="habitoo-pro-hero-badge">
              Écosystème Professionnel Habitoo
            </span>
            
            <h1 className="habitoo-pro-hero-title">
              Développez votre activité immobilière avec l'écosystème de référence en Afrique
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
                Voir les offres & forfaits
              </a>
            </div>

            {/* Trust Metrics */}
            <div className="habitoo-pro-trust-row">
              <div className="habitoo-pro-metric-pill">
                <span className="habitoo-pro-metric-icon">
                  <ShieldCheck size={16} />
                </span>
                <span>Vérification officielle sous 48h</span>
              </div>
              <div className="habitoo-pro-metric-pill">
                <span className="habitoo-pro-metric-icon">
                  <CreditCard size={16} />
                </span>
                <span>Commissions Mobile Money</span>
              </div>
              <div className="habitoo-pro-metric-pill">
                <span className="habitoo-pro-metric-icon">
                  <Globe size={16} />
                </span>
                <span>Réseau actif : Côte d'Ivoire, RDC, Congo</span>
              </div>
            </div>
          </div>

          {/* Right: Architectural Hero Visual */}
          <div className="habitoo-pro-hero-visual">
            <div className="habitoo-pro-hero-img-frame">
              <img 
                src="/assets/pro-african-business.jpg" 
                alt="Partenaires professionnels de l'immobilier Habitoo" 
                className="habitoo-pro-hero-img"
              />
              <div className="habitoo-pro-hero-floating-card">
                <div className="habitoo-pro-floating-icon">
                  <ShieldCheck size={20} />
                </div>
                <div className="habitoo-pro-floating-text">
                  <h4>Partenaire Certifié</h4>
                  <p>Identité & mandats audités</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
