import React from 'react';
import { UserCheck, Building2, CheckCircle2, ArrowRight } from 'lucide-react';

export const StepPersona = ({ formData, updateFormData, onNext }) => {
  const handleSelect = (persona) => {
    updateFormData({ persona });
  };

  return (
    <div className="habitoo-reg-step-content">
      
      {/* Header of Step */}
      <div className="habitoo-step-header">
        <span className="habitoo-step-counter">Étape 01 sur 04</span>
        <h1 className="habitoo-step-title">
          Votre profil professionnel
        </h1>
        <p className="habitoo-step-lead">
          Sélectionnez votre modalité d'exercice pour adapter votre tableau de bord et vos pièces justificatives.
        </p>
      </div>

      {/* 2 Visual Role Pickers */}
      <div className="habitoo-role-grid">
        
        {/* Role 1: Démarcheur Indépendant */}
        <div 
          className={`habitoo-role-card ${formData.persona === 'demarcheur' ? 'habitoo-role-card--active' : ''}`}
          onClick={() => handleSelect('demarcheur')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelect('demarcheur'); }}
        >
          <div className="habitoo-role-card-header">
            <div className="habitoo-role-icon-wrap">
              <UserCheck size={22} />
            </div>
            <div className="habitoo-role-check">
              <CheckCircle2 size={18} />
            </div>
          </div>

          <h2 className="habitoo-role-title">Démarcheur Indépendant</h2>
          <p className="habitoo-role-desc">
            Négociateur autonome, mandataire individuel ou apporteur d'affaires de terrain.
          </p>

          <div className="habitoo-role-tags">
            <span className="habitoo-role-mini-tag">Commissions directes</span>
            <span className="habitoo-role-mini-tag">Diffusion mobile</span>
          </div>
        </div>

        {/* Role 2: Agence Immobilière */}
        <div 
          className={`habitoo-role-card ${formData.persona === 'agence' ? 'habitoo-role-card--active' : ''}`}
          onClick={() => handleSelect('agence')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelect('agence'); }}
        >
          <div className="habitoo-role-card-header">
            <div className="habitoo-role-icon-wrap">
              <Building2 size={22} />
            </div>
            <div className="habitoo-role-check">
              <CheckCircle2 size={18} />
            </div>
          </div>

          <h2 className="habitoo-role-title">Agence Immobilière</h2>
          <p className="habitoo-role-desc">
            Structure commerciale, cabinet de gestion ou promoteur gérant un portefeuille d'actifs.
          </p>

          <div className="habitoo-role-tags">
            <span className="habitoo-role-mini-tag">Multi-collaborateurs</span>
            <span className="habitoo-role-mini-tag">Vitrine dédiée</span>
          </div>
        </div>

      </div>

      {/* Step Actions */}
      <div className="habitoo-step-actions-row">
        <div className="habitoo-step-actions-hint">
          Statut modifiable ultérieurement depuis vos paramètres.
        </div>
        <button 
          type="button" 
          onClick={onNext}
          className="habitoo-reg-btn-primary"
        >
          <span>Continuer vers les justificatifs</span>
          <ArrowRight size={16} />
        </button>
      </div>

    </div>
  );
};

export default StepPersona;
