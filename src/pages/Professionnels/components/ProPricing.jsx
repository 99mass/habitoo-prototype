import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Sparkles } from 'lucide-react';

export const ProPricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual'

  return (
    <section id="tarifs" className="habitoo-pro-section habitoo-pro-pricing-section">
      <div className="habitoo-pro-container">
        
        <div className="habitoo-pro-section-header">
          <span className="habitoo-pro-tag">Grille Tarifaire</span>
          <h2 className="habitoo-pro-title">
            Des formules claires, adaptées à votre rythme
          </h2>
          <p className="habitoo-pro-lead">
            Tarifs transparents en FCFA, sans engagement contraignant. Évoluez ou résiliez librement selon vos besoins.
          </p>
        </div>

        {/* Monthly / Annual Billing Toggle */}
        <div className="habitoo-pro-billing-toggle-wrap">
          <div className="habitoo-pro-billing-toggle">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`habitoo-pro-toggle-btn ${billingCycle === 'monthly' ? 'habitoo-pro-toggle-btn--active' : ''}`}
            >
              Facturation mensuelle
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('annual')}
              className={`habitoo-pro-toggle-btn ${billingCycle === 'annual' ? 'habitoo-pro-toggle-btn--active' : ''}`}
            >
              <span>Facturation annuelle</span>
              <span className="habitoo-pro-discount-pill">2 mois offerts</span>
            </button>
          </div>
        </div>

        {/* 3 Modern Pricing Cards */}
        <div className="habitoo-pro-pricing-grid">
          
          {/* Card 1: STARTER */}
          <div className="habitoo-pro-pricing-card">
            <div className="habitoo-pro-card-header">
              <div className="habitoo-pro-card-plan-name">STARTER</div>
              <div className="habitoo-pro-card-price-row">
                <span className="habitoo-pro-card-price-val">Gratuit</span>
              </div>
              <p className="habitoo-pro-card-period">Pour démarrer et tester la plateforme</p>
            </div>

            <ul className="habitoo-pro-card-features-list">
              <li className="habitoo-pro-card-feature-li">
                <Check size={18} className="habitoo-pro-feature-check-icon" />
                <span>Jusqu'à <strong>3 annonces simultanées</strong></span>
              </li>
              <li className="habitoo-pro-card-feature-li">
                <Check size={18} className="habitoo-pro-feature-check-icon" />
                <span>Badge PRO officiel (en cours de validation)</span>
              </li>
              <li className="habitoo-pro-card-feature-li">
                <Check size={18} className="habitoo-pro-feature-check-icon" />
                <span>Tableau de bord de suivi standard</span>
              </li>
              <li className="habitoo-pro-card-feature-li">
                <Check size={18} className="habitoo-pro-feature-check-icon" />
                <span>CNI obligatoire pour activation</span>
              </li>
              <li className="habitoo-pro-card-feature-li">
                <Check size={18} className="habitoo-pro-feature-check-icon" />
                <span>Support d'assistance par email</span>
              </li>
            </ul>

            <Link 
              to="/pro/inscription?forfait=starter" 
              className="habitoo-pro-btn-outline"
            >
              Démarrer gratuitement
            </Link>
          </div>

          {/* Card 2: PRO (Featured) */}
          <div className="habitoo-pro-pricing-card habitoo-pro-pricing-card--popular">
            <div className="habitoo-pro-popular-badge">
              Le plus populaire
            </div>

            <div className="habitoo-pro-card-header">
              <div className="habitoo-pro-card-plan-name">PRO</div>
              <div className="habitoo-pro-card-price-row">
                <span className="habitoo-pro-card-price-val">
                  {billingCycle === 'monthly' ? '15 000' : '150 000'}
                </span>
                <span className="habitoo-pro-card-currency">FCFA</span>
              </div>
              <p className="habitoo-pro-card-period">
                {billingCycle === 'monthly' 
                  ? 'Par mois — Idéal pour démarcheurs actifs' 
                  : 'Par an (soit 12 500 FCFA/mois — Économisez 30 000 FCFA)'}
              </p>
            </div>

            <ul className="habitoo-pro-card-features-list">
              <li className="habitoo-pro-card-feature-li">
                <Check size={18} className="habitoo-pro-feature-check-icon" />
                <span>Jusqu'à <strong>15 annonces actives</strong></span>
              </li>
              <li className="habitoo-pro-card-feature-li">
                <Check size={18} className="habitoo-pro-feature-check-icon" />
                <span><strong>Badge PRO officiel validé</strong> & visible</span>
              </li>
              <li className="habitoo-pro-card-feature-li">
                <Check size={18} className="habitoo-pro-feature-check-icon" />
                <span>Statistiques complètes de performance</span>
              </li>
              <li className="habitoo-pro-card-feature-li">
                <Check size={18} className="habitoo-pro-feature-check-icon" />
                <span><strong>1 boost « Mise en avant »</strong> offert par mois</span>
              </li>
              <li className="habitoo-pro-card-feature-li">
                <Check size={18} className="habitoo-pro-feature-check-icon" />
                <span>Accès illimité aux formations Habitoo Académie</span>
              </li>
              <li className="habitoo-pro-card-feature-li">
                <Check size={18} className="habitoo-pro-feature-check-icon" />
                <span>Support dédié prioritaire</span>
              </li>
            </ul>

            <Link 
              to={`/pro/inscription?forfait=pro&cycle=${billingCycle}`} 
              className="habitoo-pro-btn-primary"
            >
              <span>Choisir le forfait PRO</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Card 3: PREMIUM */}
          <div className="habitoo-pro-pricing-card">
            <div className="habitoo-pro-card-header">
              <div className="habitoo-pro-card-plan-name">PREMIUM</div>
              <div className="habitoo-pro-card-price-row">
                <span className="habitoo-pro-card-price-val">
                  {billingCycle === 'monthly' ? '35 000' : '350 000'}
                </span>
                <span className="habitoo-pro-card-currency">FCFA</span>
              </div>
              <p className="habitoo-pro-card-period">
                {billingCycle === 'monthly' 
                  ? 'Par mois — Pour agences & promoteurs' 
                  : 'Par an (soit 29 160 FCFA/mois — Économisez 70 000 FCFA)'}
              </p>
            </div>

            <ul className="habitoo-pro-card-features-list">
              <li className="habitoo-pro-card-feature-li">
                <Check size={18} className="habitoo-pro-feature-check-icon" />
                <span><strong>Annonces illimitées</strong></span>
              </li>
              <li className="habitoo-pro-card-feature-li">
                <Check size={18} className="habitoo-pro-feature-check-icon" />
                <span>Badge PRO Premium certifié d'agence</span>
              </li>
              <li className="habitoo-pro-card-feature-li">
                <Check size={18} className="habitoo-pro-feature-check-icon" />
                <span>Statistiques avancées avec export des données</span>
              </li>
              <li className="habitoo-pro-card-feature-li">
                <Check size={18} className="habitoo-pro-feature-check-icon" />
                <span><strong>3 boosts « Mise en avant »</strong> offerts par mois</span>
              </li>
              <li className="habitoo-pro-card-feature-li">
                <Check size={18} className="habitoo-pro-feature-check-icon" />
                <span><strong>Vitrine d'agence personnalisée</strong> avec logo</span>
              </li>
              <li className="habitoo-pro-card-feature-li">
                <Check size={18} className="habitoo-pro-feature-check-icon" />
                <span>Support prioritaire 7j/7 & réseau inter-agences</span>
              </li>
            </ul>

            <Link 
              to={`/pro/inscription?forfait=premium&cycle=${billingCycle}`} 
              className="habitoo-pro-btn-outline"
            >
              Choisir l'offre Premium
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
};
