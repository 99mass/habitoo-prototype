import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  UserCheck, 
  Building2, 
  Check, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

const AUDIENCE_SLIDES = [
  {
    id: 'demarcheur',
    tabTitle: 'Démarcheurs Indépendants',
    tabIcon: UserCheck,
    pill: 'Démarcheur Indépendant',
    title: 'Gagnez la confiance immédiate des acquéreurs sur le terrain',
    lead: 'Bénéficiez d\'un statut officiel qui valorise votre réputation et professionnalise chacune de vos prises de contact.',
    image: '/assets/team/patrick-ngoma.jpg',
    alt: 'Démarcheur immobilier indépendant certifié Habitoo',
    features: [
      {
        title: 'Badge officiel PRO vérifié :',
        desc: 'Légitimité immédiate certifiée dès validation de votre pièce d\'identité.'
      },
      {
        title: 'Habitoo Académie :',
        desc: 'Formations pratiques en droit foncier, valorisation de mandats et négociation.'
      },
      {
        title: 'Bureau digital autonome :',
        desc: 'Pilotez vos biens et demandes depuis votre smartphone sans aucun frais fixe.'
      },
      {
        title: 'Encaissement Mobile Money :',
        desc: 'Percevez vos commissions en direct avec sécurité totale et reçus certifiés.'
      }
    ],
    ctaText: 'Rejoindre comme Démarcheur',
    ctaLink: '/pro/inscription?forfait=pro'
  },
  {
    id: 'agence',
    tabTitle: 'Agences Immobilières',
    tabIcon: Building2,
    pill: 'Agence Immobilière & Promoteur',
    title: 'Digitalisez votre catalogue et décuplez la portée de votre marque',
    lead: 'Centralisez vos mandats, analysez l\'intérêt des acquéreurs et renforcez votre présence régionale avec une vitrine de prestige.',
    image: '/assets/pro-agency-boss.jpg',
    alt: 'Directeur d\'agence immobilière et gestionnaire de portefeuille',
    features: [
      {
        title: 'Volume étendu ou illimité :',
        desc: 'Diffusez l\'ensemble de vos mandats avec options de boost mensuel.'
      },
      {
        title: 'Statistiques avancées d\'audience :',
        desc: 'Rapports détaillés sur les clics, demandes de visite et profils clients.'
      },
      {
        title: 'Vitrine d\'agence sur-mesure :',
        desc: 'Page officielle dédiée avec logo, identité d\'enseigne et catalogue complet.'
      },
      {
        title: 'Support prioritaire 7j/7 :',
        desc: 'Gestionnaire de compte dédié et accès exclusif au réseau inter-agences.'
      }
    ],
    ctaText: 'Créer un compte Agence',
    ctaLink: '/pro/inscription?forfait=premium'
  }
];

export const ProTargetAudience = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const currentSlide = AUDIENCE_SLIDES[activeIndex];

  return (
    <section id="cibles" className="habitoo-pro-section habitoo-pro-carousel-section">
      <div className="habitoo-pro-container">
        
        <div className="habitoo-pro-section-header">
          <span className="habitoo-pro-tag">Approche Dédiée</span>
          <h2 className="habitoo-pro-title">
            Une expérience taillée pour votre modèle d'exercice
          </h2>
          <p className="habitoo-pro-lead">
            Que vous exerciez en indépendant agile ou que vous pilotiez une agence structurée, 
            Habitoo ajuste ses outils à vos impératifs métiers.
          </p>
        </div>

        {/* Tabbed Switcher Bar (Centered, no arrows) */}
        <div className="habitoo-pro-carousel-controls">
          <div className="habitoo-pro-tabs-wrapper">
            {AUDIENCE_SLIDES.map((slide, index) => {
              const TabIcon = slide.tabIcon;
              const isActive = activeIndex === index;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`habitoo-pro-tab-btn ${isActive ? 'habitoo-pro-tab-btn--active' : ''}`}
                >
                  <TabIcon size={16} />
                  <span>{slide.tabTitle}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Compact Split-Screen Slide */}
        <div className="habitoo-pro-slide-container">
          <div className="habitoo-pro-slide">
            
            {/* Left: Authentic Photography */}
            <div className="habitoo-pro-slide-image-col">
              <img 
                src={currentSlide.image} 
                alt={currentSlide.alt} 
                className="habitoo-pro-slide-img"
              />
            </div>

            {/* Right: Rich Value Arguments */}
            <div className="habitoo-pro-slide-text-col">
              <div className="habitoo-pro-slide-pill">
                <ShieldCheck size={14} color="var(--primary-red)" />
                <span>{currentSlide.pill}</span>
              </div>

              <h3 className="habitoo-pro-slide-title">
                {currentSlide.title}
              </h3>
              
              <p className="habitoo-pro-slide-desc">
                {currentSlide.lead}
              </p>

              <ul className="habitoo-pro-slide-list">
                {currentSlide.features.map((item, idx) => (
                  <li key={idx} className="habitoo-pro-slide-item">
                    <Check size={18} className="habitoo-pro-slide-check" />
                    <div>
                      <strong>{item.title}</strong> {item.desc}
                    </div>
                  </li>
                ))}
              </ul>

              <div>
                <Link to={currentSlide.ctaLink} className="habitoo-pro-btn-primary">
                  <span>{currentSlide.ctaText}</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
