import React from 'react';
import { 
  ShieldCheck, 
  Building2, 
  UserCheck, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  FileCheck, 
  Award,
  Sparkles
} from 'lucide-react';

export const ProVirtualPass = ({ formData, currentStep }) => {
  const isAgence = formData.persona === 'agence';
  const planLabel = formData.selectedPlan === 'premium' 
    ? 'Pass Premium' 
    : formData.selectedPlan === 'pro' 
      ? 'Pass PRO' 
      : 'Pass Starter';

  const statusLabel = currentStep === 1 
    ? 'Étape 1 : Identification' 
    : currentStep === 2 
      ? (formData.idCardUploaded ? 'KYC en cours de transmission' : 'Étape 2 : Dossier & KYC') 
      : currentStep === 3 
        ? 'Étape 3 : Formule sélectionnée' 
        : 'Étape 4 : Règlement & Immatriculation';

  return (
    <aside className="habitoo-reg-showcase">
      <div className="habitoo-reg-showcase-inner">
        
        {/* Showcase Header */}
        <div className="habitoo-showcase-meta">
          <span className="habitoo-showcase-tag">Accréditation Officielle</span>
          <h2 className="habitoo-showcase-title">
            Votre Pass Partenaire Habitoo PRO
          </h2>
          <p className="habitoo-showcase-desc">
            Visualisez en direct votre titre d'habilitation professionnelle. Il sera activé sous 24h à 48h après validation de conformité juridique.
          </p>
        </div>

        {/* Dynamic Pass PRO Card */}
        <div className={`habitoo-pass-card habitoo-pass-card--${formData.selectedPlan}`}>
          
          {/* Card Top Row */}
          <div className="habitoo-pass-card-top">
            <div className="habitoo-pass-brand">
              <span className="habitoo-pass-brand-text">HABITOO</span>
              <span className="habitoo-pass-badge-pro">PRO</span>
            </div>
            <div className="habitoo-pass-plan-tag">
              {planLabel}
            </div>
          </div>

          {/* Micro Chip & Security Hologram */}
          <div className="habitoo-pass-chip-row">
            <div className="habitoo-pass-chip" aria-hidden="true">
              <div className="habitoo-pass-chip-line"></div>
              <div className="habitoo-pass-chip-line"></div>
            </div>
            <div className="habitoo-pass-status-pill">
              <span className="habitoo-pass-status-dot"></span>
              <span>{statusLabel}</span>
            </div>
          </div>

          {/* Card Body: Entity Info */}
          <div className="habitoo-pass-body">
            <div className="habitoo-pass-role-indicator">
              {isAgence ? <Building2 size={16} /> : <UserCheck size={16} />}
              <span>{isAgence ? 'Agence Immobilière Agréée' : 'Démarcheur Indépendant'}</span>
            </div>
            
            <div className="habitoo-pass-entity-name">
              {formData.entityName?.trim() || (isAgence ? 'Nom de votre agence' : 'Nom du démarcheur')}
            </div>

            <div className="habitoo-pass-location">
              <MapPin size={13} />
              <span>{formData.city || 'Abidjan'} • {formData.neighborhood || 'Secteur principal'}</span>
            </div>
          </div>

          {/* Card Footer: Metadata & Registration ID */}
          <div className="habitoo-pass-footer">
            <div className="habitoo-pass-meta-block">
              <span className="habitoo-pass-meta-label">Matricule Dossier</span>
              <span className="habitoo-pass-meta-value">{formData.dossierRef || 'HAB-PRO-8492'}</span>
            </div>
            <div className="habitoo-pass-meta-block habitoo-pass-meta-block--right">
              <span className="habitoo-pass-meta-label">Conformité KYC</span>
              <span className="habitoo-pass-meta-value">
                {formData.idCardUploaded ? (
                  <span className="habitoo-pass-kyc-ok">
                    <CheckCircle2 size={13} />
                    <span>Pièce chargée</span>
                  </span>
                ) : (
                  <span className="habitoo-pass-kyc-pending">
                    <Clock size={13} />
                    <span>À fournir</span>
                  </span>
                )}
              </span>
            </div>
          </div>

        </div>

        {/* 3 Micro-preuves de prestige institutionnelles */}
        <div className="habitoo-showcase-proofs">
          
          <div className="habitoo-proof-item">
            <div className="habitoo-proof-icon">
              <ShieldCheck size={18} />
            </div>
            <div className="habitoo-proof-content">
              <h4 className="habitoo-proof-title">Audit juridique sous 24 à 48h</h4>
              <p className="habitoo-proof-text">
                Contrôle scrupuleux des pièces d'identité et registres d'activité par notre équipe légale.
              </p>
            </div>
          </div>

          <div className="habitoo-proof-item">
            <div className="habitoo-proof-icon">
              <Award size={18} />
            </div>
            <div className="habitoo-proof-content">
              <h4 className="habitoo-proof-title">Accréditation officielle visible</h4>
              <p className="habitoo-proof-text">
                Un macaron vérifié distingue vos annonces et rassure immédiatement les acquéreurs solvables.
              </p>
            </div>
          </div>

          <div className="habitoo-proof-item">
            <div className="habitoo-proof-icon">
              <FileCheck size={18} />
            </div>
            <div className="habitoo-proof-content">
              <h4 className="habitoo-proof-title">Transactions sécurisées</h4>
              <p className="habitoo-proof-text">
                Encaissements Mobile Money et virements directs avec séquestre tiers de confiance garanti.
              </p>
            </div>
          </div>

        </div>

      </div>
    </aside>
  );
};

export default ProVirtualPass;
