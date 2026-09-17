import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Play, 
  ArrowRight, 
  ExternalLink, 
  FileText, 
  Sparkles,
  MapPin,
  Building2,
  UserCheck,
  Smartphone,
  LayoutDashboard
} from 'lucide-react';
import './ProOnboarding.css';

export const ProPendingPass = () => {
  const location = useLocation();
  const rawData = location.state?.applicationData;

  // Resilient fallback data in case of direct URL access or page reload
  const data = rawData || {
    dossierRef: 'HAB-PRO-8492',
    entityName: 'Ivoire Prestige Immobilier',
    persona: 'agence',
    city: 'Abidjan',
    neighborhood: 'Cocody Riviera Golf',
    selectedPlan: 'pro',
    billingCycle: 'monthly',
    isStarter: false,
    idCardFileName: 'cni_recto_verso.pdf',
    submittedAt: 'Aujourd\'hui à 11:42'
  };

  const isAgence = data.persona === 'agence';

  const planLabel = !isAgence
    ? 'Accès Démarcheur PRO'
    : data.selectedPlan === 'premium'
      ? 'Formule Premium'
      : data.selectedPlan === 'pro'
        ? 'Formule PRO'
        : 'Formule Starter';

  return (
    <div className="habitoo-pending-page">
      <div className="habitoo-pending-container">
        
        {/* Top Header */}
        <div className="habitoo-pending-header">
          <div className="habitoo-pending-badge-pill">
            <span className="habitoo-pending-pulse-dot" aria-hidden="true"></span>
            <span>Audit de conformité en cours (24h - 48h)</span>
          </div>
          <h1 className="habitoo-pending-title">
            Votre dossier d'accréditation a été transmis
          </h1>
          <p className="habitoo-pending-lead">
            Félicitations. Votre demande d'habilitation Habitoo PRO est actuellement entre les mains de notre comité juridique. Conservez précieusement votre numéro d'enregistrement.
          </p>
        </div>

        {/* The Credential Boarding Pass */}
        <div className="habitoo-boarding-pass">
          
          {/* Top Pass Strip */}
          <div className="habitoo-pass-strip">
            <div className="habitoo-pass-strip-brand">
              <span className="habitoo-pass-strip-logo">HABITOO</span>
              <span className="habitoo-pass-strip-badge">PRO</span>
            </div>
            <div className="habitoo-pass-strip-status">
              <Clock size={15} />
              <span>Attestation provisoire</span>
            </div>
          </div>

          {/* Pass Content Grid */}
          <div className="habitoo-pass-grid">
            
            <div className="habitoo-pass-col">
              <span className="habitoo-pass-field-lbl">Titulaire accrédité</span>
              <strong className="habitoo-pass-field-val habitoo-pass-field-val--large">
                {data.entityName}
              </strong>
              <span className="habitoo-pass-field-sub">
                {isAgence ? 'Agence Immobilière Agréée' : 'Démarcheur Indépendant Certifié'}
              </span>
            </div>

            <div className="habitoo-pass-col">
              <span className="habitoo-pass-field-lbl">Numéro de dossier unique</span>
              <strong className="habitoo-pass-field-val habitoo-pass-field-val--mono">
                {data.dossierRef}
              </strong>
              <span className="habitoo-pass-field-sub">
                Déposé le {data.submittedAt}
              </span>
            </div>

            <div className="habitoo-pass-col">
              <span className="habitoo-pass-field-lbl">Formule souscrite</span>
              <strong className="habitoo-pass-field-val">
                {planLabel}
              </strong>
              <span className="habitoo-pass-field-sub">
                {!isAgence ? "Exempté d'abonnement • Droits PRO actifs" : data.billingCycle === 'annual' ? 'Cycle annuel' : 'Cycle mensuel'}
              </span>
            </div>

            <div className="habitoo-pass-col">
              <span className="habitoo-pass-field-lbl">Zone de compétence</span>
              <strong className="habitoo-pass-field-val">
                {data.city}
              </strong>
              <span className="habitoo-pass-field-sub">
                {data.neighborhood || 'District principal'}
              </span>
            </div>

          </div>

          {/* Perforated Separator */}
          <div className="habitoo-pass-perforation" aria-hidden="true">
            <div className="habitoo-pass-notch habitoo-pass-notch--left"></div>
            <div className="habitoo-pass-dash-line"></div>
            <div className="habitoo-pass-notch habitoo-pass-notch--right"></div>
          </div>

          {/* Pass Footer Barcode & Security Stamp */}
          <div className="habitoo-pass-bottom">
            <div className="habitoo-pass-stamp">
              <ShieldCheck size={20} />
              <span>Chiffrement certifié Habitoo Legal Network</span>
            </div>
            <div className="habitoo-pass-barcode" aria-hidden="true">
              <div className="habitoo-barcode-lines"></div>
              <span className="habitoo-barcode-code">{data.dossierRef}-SECURE</span>
            </div>
          </div>

        </div>

        {/* 3-Step Verification Tracker */}
        <div className="habitoo-pending-tracker-card">
          <h2 className="habitoo-tracker-title">
            Protocole d'activation de votre compte
          </h2>
          
          <div className="habitoo-tracker-steps">
            
            {/* Step 1: Validated */}
            <div className="habitoo-tracker-step habitoo-tracker-step--done">
              <div className="habitoo-tracker-icon">
                <CheckCircle2 size={20} />
              </div>
              <div className="habitoo-tracker-text">
                <span className="habitoo-tracker-label">Étape 1 • Validée</span>
                <strong className="habitoo-tracker-heading">Dossier et Pièce d'identité réceptionnés</strong>
                <p className="habitoo-tracker-desc">
                  Les pièces KYC et vos données de contact ont été cryptées et stockées dans notre coffre-fort sécurisé.
                </p>
              </div>
            </div>

            {/* Step 2: In Progress */}
            <div className="habitoo-tracker-step habitoo-tracker-step--current">
              <div className="habitoo-tracker-icon">
                <Clock size={20} />
              </div>
              <div className="habitoo-tracker-text">
                <span className="habitoo-tracker-label">Étape 2 • En cours d'audit</span>
                <strong className="habitoo-tracker-heading">Contrôle de conformité et attribution du matricule</strong>
                <p className="habitoo-tracker-desc">
                  Nos juristes vérifient la validité du document et activent vos autorisations de publication (délai garanti 24h-48h).
                </p>
              </div>
            </div>

            {/* Step 3: Upcoming */}
            <div className="habitoo-tracker-step habitoo-tracker-step--upcoming">
              <div className="habitoo-tracker-icon">
                <Smartphone size={20} />
              </div>
              <div className="habitoo-tracker-text">
                <span className="habitoo-tracker-label">Étape 3 • Prochaine étape</span>
                <strong className="habitoo-tracker-heading">Notification SMS et ouverture du Tableau de Bord</strong>
                <p className="habitoo-tracker-desc">
                  Vous recevrez un SMS prioritaire avec votre lien de connexion sécurisé pour publier vos premiers mandats.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Section Immédiate : "Ne perdez pas une minute" (Académie Habitoo) */}
        <div className="habitoo-pending-academy-card">
          <div className="habitoo-academy-header">
            <div>
              <span className="habitoo-academy-tag">Académie Habitoo • Accès Anticipé</span>
              <h2 className="habitoo-academy-title">
                Prenez une longueur d'avance dès aujourd'hui
              </h2>
              <p className="habitoo-academy-sub">
                Pendant le contrôle de conformité, formez-vous aux méthodes qui génèrent 3x plus de prises de contact qualifiées.
              </p>
            </div>
          </div>

          {/* Academy Video Teaser Box */}
          <div className="habitoo-academy-teaser-box">
            <div className="habitoo-teaser-media">
              <img 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" 
                alt="Formation photographie immobilière de prestige" 
                className="habitoo-teaser-img"
              />
              <div className="habitoo-teaser-play-btn" aria-label="Lire la vidéo">
                <Play size={20} fill="#FFFFFF" />
              </div>
              <span className="habitoo-teaser-duration">12 min • Vidéo masterclass</span>
            </div>

            <div className="habitoo-teaser-info">
              <span className="habitoo-teaser-module-num">Masterclass Partenaires #01</span>
              <h3 className="habitoo-teaser-name">
                Les 5 angles photo qui déclenchent une visite en 24h
              </h3>
              <p className="habitoo-teaser-summary">
                Découvrez la méthode éprouvée par nos meilleurs agents à Cocody et au Plateau pour capturer la lumière naturelle, valoriser les volumes et attirer des acquéreurs solvables.
              </p>
              
              <ul className="habitoo-teaser-points">
                <li>
                  <span>Optimisation du grand angle sans distorsion optique</span>
                </li>
                <li>
                  <span>Mise en scène des espaces de réception et terrasses</span>
                </li>
                <li>
                  <span>Prise de vue crépusculaire « Golden Hour » africaine</span>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom Actions */}
        <div className="habitoo-pending-bottom-actions">
          <Link to="/pro/app/dashboard" className="habitoo-reg-btn-primary" style={{ background: '#F70000', color: '#FFFFFF', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <LayoutDashboard size={16} />
            <span>Accéder au Dashboard PRO (Démo)</span>
            <ArrowRight size={16} />
          </Link>

          <Link to="/professionnels" className="habitoo-reg-btn-ghost">
            <span>Retour aux solutions PRO</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ProPendingPass;
