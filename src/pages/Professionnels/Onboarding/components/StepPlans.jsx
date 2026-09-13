import React from 'react';
import { Check, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';

export const StepPlans = ({ 
  formData, 
  updateFormData, 
  onNext, 
  onPrev,
  onCompleteStarter 
}) => {
  const billingCycle = formData.billingCycle || 'monthly';
  const isAnnual = billingCycle === 'annual';

  const handleCycleToggle = (cycle) => {
    updateFormData({ billingCycle: cycle });
  };

  const handleSelectPlan = (plan) => {
    updateFormData({ selectedPlan: plan });
  };

  const isStarter = formData.selectedPlan === 'starter';

  const handleContinue = () => {
    if (isStarter) {
      onCompleteStarter();
    } else {
      onNext();
    }
  };

  return (
    <div className="habitoo-reg-step-content">
      
      {/* Header */}
      <div className="habitoo-step-header">
        <span className="habitoo-step-counter">Étape 03 sur 04</span>
        <h1 className="habitoo-step-title">
          Formule d'adhésion
        </h1>
        <p className="habitoo-step-lead">
          Sélectionnez votre forfait professionnel selon vos volumes de publication.
        </p>
      </div>

      {/* Monthly / Annual Cycle Toggle */}
      <div className="habitoo-cycle-toggle-wrap">
        <div className="habitoo-cycle-toggle">
          <button
            type="button"
            className={`habitoo-cycle-btn ${!isAnnual ? 'habitoo-cycle-btn--active' : ''}`}
            onClick={() => handleCycleToggle('monthly')}
          >
            Facturation mensuelle
          </button>
          <button
            type="button"
            className={`habitoo-cycle-btn ${isAnnual ? 'habitoo-cycle-btn--active' : ''}`}
            onClick={() => handleCycleToggle('annual')}
          >
            <span>Annuelle</span>
            <span className="habitoo-cycle-discount-tag">2 mois offerts</span>
          </button>
        </div>
      </div>

      {/* 3 Pricing Cards */}
      <div className="habitoo-plans-grid">
        
        {/* Plan 1: STARTER */}
        <div 
          className={`habitoo-plan-card ${formData.selectedPlan === 'starter' ? 'habitoo-plan-card--active' : ''}`}
          onClick={() => handleSelectPlan('starter')}
          role="button"
          tabIndex={0}
        >
          <div className="habitoo-plan-card-header">
            <div className="habitoo-plan-name">STARTER</div>
            <div className="habitoo-plan-price-row">
              <span className="habitoo-plan-price-val">0</span>
              <span className="habitoo-plan-currency">FCFA</span>
            </div>
            <p className="habitoo-plan-period">Sans engagement</p>
          </div>

          <ul className="habitoo-plan-features-list">
            <li>
              <Check size={14} className="habitoo-plan-check-icon" />
              <span>3 annonces simultanées</span>
            </li>
            <li>
              <Check size={14} className="habitoo-plan-check-icon" />
              <span>Attribution du matricule</span>
            </li>
            <li>
              <Check size={14} className="habitoo-plan-check-icon" />
              <span>Tableau de bord standard</span>
            </li>
          </ul>

          <div className="habitoo-plan-card-footer">
            <div className={`habitoo-plan-select-pill ${formData.selectedPlan === 'starter' ? 'habitoo-plan-select-pill--selected' : ''}`}>
              {formData.selectedPlan === 'starter' ? 'Sélectionné' : 'Choisir Starter'}
            </div>
          </div>
        </div>

        {/* Plan 2: PRO (Featured) */}
        <div 
          className={`habitoo-plan-card habitoo-plan-card--popular ${formData.selectedPlan === 'pro' ? 'habitoo-plan-card--active' : ''}`}
          onClick={() => handleSelectPlan('pro')}
          role="button"
          tabIndex={0}
        >
          <div className="habitoo-plan-popular-ribbon">
            Recommandé
          </div>

          <div className="habitoo-plan-card-header">
            <div className="habitoo-plan-name">PRO</div>
            <div className="habitoo-plan-price-row">
              <span className="habitoo-plan-price-val">
                {isAnnual ? '150 000' : '15 000'}
              </span>
              <span className="habitoo-plan-currency">FCFA</span>
            </div>
            <p className="habitoo-plan-period">
              {isAnnual ? 'Par an (12 500 / mois)' : 'Par mois • Démarcheurs actifs'}
            </p>
          </div>

          <ul className="habitoo-plan-features-list">
            <li>
              <Check size={14} className="habitoo-plan-check-icon" />
              <span>15 annonces actives</span>
            </li>
            <li>
              <Check size={14} className="habitoo-plan-check-icon" />
              <span>Badge PRO certifié</span>
            </li>
            <li>
              <Check size={14} className="habitoo-plan-check-icon" />
              <span>1 boost offert par mois</span>
            </li>
          </ul>

          <div className="habitoo-plan-card-footer">
            <div className={`habitoo-plan-select-pill ${formData.selectedPlan === 'pro' ? 'habitoo-plan-select-pill--selected' : ''}`}>
              {formData.selectedPlan === 'pro' ? 'Sélectionné' : 'Choisir PRO'}
            </div>
          </div>
        </div>

        {/* Plan 3: PREMIUM */}
        <div 
          className={`habitoo-plan-card habitoo-plan-card--premium ${formData.selectedPlan === 'premium' ? 'habitoo-plan-card--active' : ''}`}
          onClick={() => handleSelectPlan('premium')}
          role="button"
          tabIndex={0}
        >
          <div className="habitoo-plan-card-header">
            <div className="habitoo-plan-name">PREMIUM</div>
            <div className="habitoo-plan-price-row">
              <span className="habitoo-plan-price-val">
                {isAnnual ? '350 000' : '35 000'}
              </span>
              <span className="habitoo-plan-currency">FCFA</span>
            </div>
            <p className="habitoo-plan-period">
              {isAnnual ? 'Par an (29 160 / mois)' : 'Par mois • Agences et Flottes'}
            </p>
          </div>

          <ul className="habitoo-plan-features-list">
            <li>
              <Check size={14} className="habitoo-plan-check-icon" />
              <span>Annonces illimitées</span>
            </li>
            <li>
              <Check size={14} className="habitoo-plan-check-icon" />
              <span>Vitrine personnalisée</span>
            </li>
            <li>
              <Check size={14} className="habitoo-plan-check-icon" />
              <span>3 boosts offerts par mois</span>
            </li>
          </ul>

          <div className="habitoo-plan-card-footer">
            <div className={`habitoo-plan-select-pill ${formData.selectedPlan === 'premium' ? 'habitoo-plan-select-pill--selected' : ''}`}>
              {formData.selectedPlan === 'premium' ? 'Sélectionné' : 'Choisir Premium'}
            </div>
          </div>
        </div>

      </div>

      {/* Actions */}
      <div className="habitoo-step-actions-row">
        <button 
          type="button" 
          onClick={onPrev}
          className="habitoo-reg-btn-ghost"
        >
          <ArrowLeft size={16} />
          <span>Retour</span>
        </button>

        <button 
          type="button" 
          onClick={handleContinue}
          className="habitoo-reg-btn-primary"
        >
          {isStarter ? (
            <>
              <ShieldCheck size={16} />
              <span>Valider l'adhésion (0 FCFA)</span>
            </>
          ) : (
            <>
              <span>Continuer vers le règlement</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>

    </div>
  );
};

export default StepPlans;
