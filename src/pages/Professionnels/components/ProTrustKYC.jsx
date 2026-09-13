import React from 'react';
import { ShieldCheck, Clock, CheckCircle2, Lock, FileCheck } from 'lucide-react';

const KYC_STEPS = [
  {
    step: "01",
    title: "Inscription et Dépôt des pièces",
    timeBadge: "2 minutes chrono",
    desc: "Renseignez vos coordonnées professionnelles et transmettez votre pièce d'identité officielle (CNI ou passeport) ou le registre de commerce (RCCM) de votre agence.",
    isGreenBadge: false
  },
  {
    step: "02",
    title: "Audit et Validation sous 48h",
    timeBadge: "Sous 48h ouvrées",
    desc: "Nos experts conformité contrôlent l'authenticité de vos pièces et l'historique de vos mandats afin de préserver l'intégrité et la réputation de notre communauté.",
    isGreenBadge: false
  },
  {
    step: "03",
    title: "Activation du Badge PRO Certifié",
    timeBadge: "Accès opérationnel",
    desc: "Dès validation, le badge officiel est apposé sur toutes vos annonces et vous accédez sans délai à l'ensemble des fonctionnalités de votre tableau de bord.",
    isGreenBadge: true
  }
];

export const ProTrustKYC = () => {
  return (
    <section id="reassurance" className="habitoo-pro-section habitoo-pro-kyc-section">
      <div className="habitoo-pro-container">
        
        <div className="habitoo-pro-section-header">
          <span className="habitoo-pro-tag">Confiance et Rigueur</span>
          <h2 className="habitoo-pro-title">
            Un processus d'accréditation rigoureux et rapide
          </h2>
          <p className="habitoo-pro-lead">
            Pour garantir un standard d'excellence irréprochable aux acquéreurs et locataires, chaque professionnel est individuellement audité.
          </p>
        </div>

        {/* Horizontal Illustrated Step Flow */}
        <div className="habitoo-pro-flow-wrapper">
          <div className="habitoo-pro-flow-steps">
            {KYC_STEPS.map((stepItem, idx) => (
              <div key={idx} className="habitoo-pro-flow-card">
                <div className="habitoo-pro-flow-head">
                  <div className="habitoo-pro-flow-num">{stepItem.step}</div>
                  <span className={`habitoo-pro-flow-badge ${stepItem.isGreenBadge ? 'habitoo-pro-flow-badge--green' : ''}`}>
                    {stepItem.timeBadge}
                  </span>
                </div>
                <h4>{stepItem.title}</h4>
                <p>{stepItem.desc}</p>
              </div>
            ))}
          </div>

          {/* Audit Guarantee Bar */}
          <div className="habitoo-pro-audit-guarantee">
            <div className="habitoo-pro-guarantee-item">
              <ShieldCheck size={20} className="habitoo-pro-guarantee-icon" />
              <span>100% des profils PRO audités manuellement</span>
            </div>
            <div className="habitoo-pro-guarantee-item">
              <Clock size={20} className="habitoo-pro-guarantee-icon" />
              <span>Délai moyen d'activation sous 48 heures</span>
            </div>
            <div className="habitoo-pro-guarantee-item">
              <Lock size={20} className="habitoo-pro-guarantee-icon" />
              <span>Données personnelles et mandats sécurisés</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
