import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, 
  Award, 
  Building2, 
  Sparkles, 
  Linkedin, 
  Send, 
  ArrowRight, 
  CheckCircle2 
} from 'lucide-react';
import './About.css';

// 4 Projection Metrics in Mineral Glass Cards
const METRICS = [
  {
    value: "3",
    label: "Métropoles d'ancrage",
    detail: "Abidjan • Brazzaville • Kinshasa"
  },
  {
    value: "150+",
    label: "Biens de standing sélectionnés",
    detail: "En cours d'audit et de labellisation"
  },
  {
    value: "100%",
    label: "Rigueur juridique garantie",
    detail: "Mandats formels et séquestre notarié"
  },
  {
    value: "24/7",
    label: "Intendance et Conciergerie",
    detail: "Prise en charge dédiée des résidents"
  }
];

// 3 Strategic Mission Pillars
const MISSION_PILLARS = [
  {
    num: "01",
    title: "Éliminer l'insécurité foncière",
    desc: "Chaque transaction fait l'objet d'un audit physique contradictoire, d'une vérification approfondie des titres de propriété et d'une consignation sécurisée auprès d'offices notariaux partenaires."
  },
  {
    num: "02",
    title: "Pérenniser la valeur patrimoniale",
    desc: "Nous accompagnons propriétaires et investisseurs avec une intendance privée haut de gamme : maintenance préventive, sélection rigoureuse des résidents et valorisation pérenne des actifs immobiliers."
  },
  {
    num: "03",
    title: "Passerelle de confiance et d'excellence",
    desc: "Offrir à la diaspora et aux investisseurs internationaux une relation directe, transparente et sans intermédiaire douteux, adossée aux standards de gouvernance et d'accueil les plus exigeants."
  }
];

// 4 Core Values Aligned with Real Estate Prestige et Continuous Timeline
const VALUES = [
  {
    num: "01",
    id: "rigueur",
    title: "Rigueur Juridique et Foncière",
    desc: "Mandats formels, vérification physique contradictoire et consignation notariée systématique des flux.",
    icon: Award
  },
  {
    num: "02",
    id: "sobriete",
    title: "Sobriété et Élégance Architecturale",
    desc: "Sélection rigoureuse de résidences contemporaines aux volumes nobles, finitions pérennes et matériaux d'exception.",
    icon: Sparkles
  },
  {
    num: "03",
    id: "ancrage",
    title: "Ancrage Métropolitain et Diplomatique",
    desc: "Maîtrise des micromarchés de prestige à Abidjan, Brazzaville et Kinshasa pour une clientèle d'affaires et institutionnelle.",
    icon: Building2
  },
  {
    num: "04",
    id: "discretion",
    title: "Intégrité et Discrétion Absolue",
    desc: "Confidentialité patrimoniale totale pour nos mandants et accès privilégié à des opportunités confidentielles hors marché.",
    icon: ShieldCheck
  }
];

// Leadership Data
const LEADERSHIP = {
  name: "John John",
  role: "Fondateur et Directeur Général (CEO)",
  quote: "« Nous ne nous contentons pas de répertorier des biens : nous redéfinissons le standard du standing résidentiel africain en alliant sécurité juridique absolue et expérience d'accueil 5 étoiles. »",
  bio: [
    "Habitoo est née de la volonté d'apporter aux métropoles d'Afrique de l'Ouest et Centrale les standards immobiliers les plus exigeants au monde. L'accès à un logement d'exception ne doit plus être un parcours d'incertitudes foncières.",
    "En bâtissant un modèle intégrant vérification notariale systématique, audits physiques rigoureux et conciergerie privée, nous offrons aux propriétaires, investisseurs et résidents une relation durable fondée sur la sérénité et le raffinement contemporain."
  ],
  image: "/assets/team/john-john.jpg"
};

// 4 Key Team Members (B&W Editorial Portraits)
const TEAM_MEMBERS = [
  {
    id: "john-john",
    name: "John John",
    role: "Fondateur et Directeur Général",
    department: "Direction Générale",
    image: "/assets/team/john-john.jpg",
    linkedin: "https://linkedin.com"
  },
  {
    id: "aminata-cisse",
    name: "Aminata Cissé",
    role: "Directrice des Opérations et Expansion",
    department: "Opérations Régionales",
    image: "/assets/team/aminata-cisse.jpg",
    linkedin: "https://linkedin.com"
  },
  {
    id: "patrick-ngoma",
    name: "Me Patrick Ngoma",
    role: "Directeur Juridique et Conformité Foncière",
    department: "Pôle Légal et Notarial",
    image: "/assets/team/patrick-ngoma.jpg",
    linkedin: "https://linkedin.com"
  },
  {
    id: "sarah-bamba",
    name: "Sarah Bamba",
    role: "Directrice Conciergerie et Intendance",
    department: "Hospitality et Private Care",
    image: "/assets/team/sarah-bamba.jpg",
    linkedin: "https://linkedin.com"
  }
];

export const AboutPage = () => {
  const { hash } = useLocation();

  // Handle smooth scroll to anchor when hash changes (e.g. #mission)
  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);
      }
    }
  }, [hash]);

  return (
    <div className="about-page">
      
      {/* =========================================================================
          1. HERO SECTION : COMPACT ARCHITECTURAL BANNER & COMPTEURS MINÉRAUX
          ========================================================================= */}
      <section className="about-page__hero">
        <div className="about-page__hero-overlay" />
        
        <div className="container about-page__hero-container">
          <div className="about-page__hero-content">
          

            <h1 className="about-page__hero-title">
              Redéfinir le standard de l'immobilier d'exception en Afrique
            </h1>

            <p className="about-page__hero-subtitle">
              Habitoo réunit l'intégrité juridique des transactions et l'exigence d'un service d'accueil 5 étoiles pour accompagner acquéreurs, locataires et propriétaires à Abidjan, Brazzaville et Kinshasa.
            </p>

            {/* 4 Projection Metrics in Mineral Glass Cards */}
            <div className="about-page__metrics-grid">
              {METRICS.map((metric, index) => (
                <div key={index} className="about-page__metric-card">
                  <div className="about-page__metric-value">{metric.value}</div>
                  <div className="about-page__metric-label">{metric.label}</div>
                  <div className="about-page__metric-detail">{metric.detail}</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          2. LE MOT DE LA DIRECTION (ASYMMETRIC 2-COLUMN)
          ========================================================================= */}
      <section className="about-page__direction">
        <div className="container">
          <div className="about-page__direction-grid">
            
            {/* Left: Leadership Portrait */}
            <div className="about-page__direction-visual">
              <div className="about-page__direction-img-frame">
                <img 
                  src={LEADERSHIP.image} 
                  alt={`${LEADERSHIP.name}, ${LEADERSHIP.role}`}
                  className="about-page__direction-img" 
                />
                <div className="about-page__direction-badge">
                  <div className="about-page__direction-badge-name">{LEADERSHIP.name}</div>
                  <div className="about-page__direction-badge-role">{LEADERSHIP.role}</div>
                </div>
              </div>
            </div>

            {/* Right: Narrative et Quote */}
            <div className="about-page__direction-content">
              <span className="about-page__tag">Le mot de la direction</span>
              
              <blockquote className="about-page__direction-quote">
                {LEADERSHIP.quote}
              </blockquote>

              <div className="about-page__direction-body">
                {LEADERSHIP.bio.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              <div className="about-page__direction-sign-block">
                <div>
                  <div className="about-page__direction-sign-name">{LEADERSHIP.name}</div>
                  <div className="about-page__direction-sign-role">{LEADERSHIP.role}</div>
                </div>
                <div className="about-page__direction-sign-cities">
                  Abidjan • Brazzaville • Kinshasa
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          3. NOUVELLE SECTION DÉDIÉE : NOTRE MISSION (#mission)
             DESIGN : 3 COLONNES ÉDITORIALES OUVERTES SANS CARTES FERMÉES
          ========================================================================= */}
      <section id="mission" className="about-page__mission">
        <div className="container">
          
          <div className="about-page__mission-header">
            <span className="about-page__tag">Notre Mission Patrimoniale</span>
            <h2 className="about-page__mission-title">
              Sécuriser, valoriser et pérenniser l'immobilier d'exception
            </h2>
            <p className="about-page__mission-lead">
              Face aux défis de la croissance urbaine en Afrique, Habitoo institue un standard irréprochable fondé sur la transparence légale, l'expertise locale et une exigence sans compromis.
            </p>
          </div>

          <div className="about-page__missions-editorial">
            {MISSION_PILLARS.map((pillar) => (
              <div key={pillar.num} className="about-page__mission-col">
                <div className="about-page__mission-col-top">
                  <span className="about-page__mission-col-num">{pillar.num}</span>
                  <div className="about-page__mission-col-rule" />
                </div>
                <h3 className="about-page__mission-col-title">{pillar.title}</h3>
                <p className="about-page__mission-col-desc">{pillar.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          4. NOS VALEURS FONDATRICES (FRISE PATRIMONIALE CONTINUE)
          ========================================================================= */}
      <section className="about-page__values">
        <div className="container">
          
          <div className="about-page__section-header">
            <span className="about-page__tag">Nos valeurs fondatrices</span>
            <h2 className="about-page__section-title">
              Ce qui guide chacune de nos actions
            </h2>
            <p className="about-page__section-subtitle">
              Une charte d'intégrité et de discrétion, pensée pour répondre aux attentes les plus pointues du marché immobilier de prestige.
            </p>
          </div>

          <div className="about-page__timeline">
            <div className="about-page__timeline-line" aria-hidden="true" />
            <div className="about-page__timeline-steps">
              {VALUES.map((val) => {
                const IconComp = val.icon;
                return (
                  <div key={val.id} className="about-page__timeline-step">
                    <div className="about-page__timeline-marker">
                      <div className="about-page__timeline-dot">
                        <span className="about-page__timeline-dot-inner" />
                      </div>
                      <span className="about-page__timeline-num">{val.num}</span>
                    </div>
                    <div className="about-page__timeline-card">
                      <div className="about-page__timeline-icon-box">
                        <IconComp size={18} />
                      </div>
                      <h3 className="about-page__timeline-title">{val.title}</h3>
                      <p className="about-page__timeline-desc">{val.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          5. L'ÉQUIPE DIRIGEANTE (4 MONOCHROME EDITORIAL PORTRAITS)
          ========================================================================= */}
      <section className="about-page__team">
        <div className="container">
          
          <div className="about-page__section-header">
            <span className="about-page__tag">L'équipe dirigeante</span>
            <h2 className="about-page__section-title">
              Des experts engagés pour vos projets
            </h2>
            <p className="about-page__section-subtitle">
              Une gouvernance alliant rigueur juridique, vision opérationnelle et culture d'excellence hôtelière.
            </p>
          </div>

          <div className="about-page__team-grid">
            {TEAM_MEMBERS.map((member) => (
              <div key={member.id} className="about-page__team-card">
                <div className="about-page__team-photo-wrap">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="about-page__team-photo"
                  />
                  <span className="about-page__team-department-tag">
                    {member.department}
                  </span>
                </div>
                
                <div className="about-page__team-body">
                  <div className="about-page__team-header-row">
                    <h3 className="about-page__team-name">{member.name}</h3>
                    <a 
                      href={member.linkedin} 
                      target="_blank" 
                      rel="noreferrer" 
                      aria-label={`Profil LinkedIn de ${member.name}`}
                      className="about-page__team-link"
                    >
                      <Linkedin size={14} />
                    </a>
                  </div>
                  <div className="about-page__team-role">{member.role}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          6. BANNIÈRE D'APPEL À L'ACTION (CTA) : 2 COLONNES ASYMÉTRIQUES
             Image salon privé à gauche / Texte et CTA à droite
          ========================================================================= */}
      <section className="about-page__cta">
        <div className="container">
          <div className="about-page__cta-card">
            
            {/* Colonne Gauche : Visuel immersif salon privé */}
            <div className="about-page__cta-visual">
              <img 
                src="/assets/cta-private-consultation.jpg" 
                alt="Salon de consultation privée Habitoo" 
                className="about-page__cta-img"
              />
              <div className="about-page__cta-badge">
                <Sparkles size={14} />
                <span>Salons Privés et Discrétion</span>
              </div>
            </div>

            {/* Colonne Droite : Message éditorial et CTA */}
            <div className="about-page__cta-content">
              <span className="about-page__cta-tag">Accompagnement d'exception</span>
              <h2 className="about-page__cta-title">
                Concrétisons ensemble votre prochain projet immobilier
              </h2>
              <p className="about-page__cta-desc">
                Que vous souhaitiez acquérir une résidence de prestige, confier un bien en intendance privée ou nous rencontrer dans nos salons privés d'Abidjan, Brazzaville ou Kinshasa, nos conseillers sont à votre disposition en toute discrétion.
              </p>
              <div className="about-page__cta-actions">
                <Link to="/#contact" className="about-page__cta-btn">
                  <Send size={16} />
                  <span>Échanger avec un conseiller privé</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
