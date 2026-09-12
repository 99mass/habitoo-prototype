import React from 'react';
import { Award, BarChart3, CheckCircle2, GraduationCap, Sparkles, ArrowRight } from 'lucide-react';

const ADVANTAGES = [
  {
    id: 'badge',
    title: 'Le Badge PRO Certifié',
    category: 'Autorité & Accréditation',
    icon: Award,
    image: '/assets/team/aminata-cisse.jpg',
    alt: 'Conseillère immobilière certifiée Habitoo',
    description: 'Un gage immédiat de crédibilité auprès des acquéreurs et locataires. Vos annonces inspirent une confiance absolue dès le premier regard.',
    highlight: 'Badge vérifié sur toutes vos annonces'
  },
  {
    id: 'dashboard',
    title: 'Dashboard Tout-en-un',
    category: 'Analytique & Performance',
    icon: BarChart3,
    image: '/assets/pro-dashboard-analytics.jpg',
    alt: 'Tableau de bord professionnel avec graphiques et indicateurs clés',
    description: 'Suivi en temps réel des vues, prises de contact qualifiées et synchronisation simplifiée de votre calendrier de visites.',
    highlight: 'Graphiques circulaires & métriques directes'
  },
  {
    id: 'commissions',
    title: 'Commissions Automatiques',
    category: 'Transactions & Règlements',
    icon: CheckCircle2,
    image: '/assets/pro-commissions-money.jpg',
    alt: 'Encaissement des commissions et transactions sécurisées',
    description: 'Encaissement garanti, transparent et rapide de vos honoraires directement via Mobile Money avec reçus officiels horodatés.',
    highlight: 'Paiements directs et traçabilité totale'
  },
  {
    id: 'academie',
    title: 'Habitoo Académie',
    category: 'Formation & Montée en Compétence',
    icon: GraduationCap,
    image: '/assets/pro-academy-learning.jpg',
    alt: 'Masterclass et formation d\'excellence en immobilier',
    description: 'Formations professionnelles continues : réglementation foncière, valorisation photographique de mandats et négociation terrain.',
    highlight: 'Accès illimité aux masterclasses'
  },
  {
    id: 'visibilite',
    title: 'Visibilité Maximale',
    category: 'Boost & Algorithme',
    icon: Sparkles,
    image: '/assets/pro-visibility-boost.jpg',
    alt: 'Visibilité prioritaire et mise en avant des biens',
    description: 'Options de boost pour propulser vos biens prioritaires en tête des résultats de recherche, en vitrine d\'accueil et en alertes acquéreurs.',
    highlight: 'Positionnement prioritaire garanti'
  }
];

export const ProBentoAdvantages = () => {
  return (
    <section id="avantages" className="habitoo-pro-section habitoo-pro-advantages-section">
      <div className="habitoo-pro-container">
        
        <div className="habitoo-pro-section-header">
          <span className="habitoo-pro-tag">Avantages Stratégiques</span>
          <h2 className="habitoo-pro-title">
            Cinq atouts décisifs pour accélérer votre activité
          </h2>
          <p className="habitoo-pro-lead">
            Des outils digitaux de premier ordre et un écosystème réputé pour donner une nouvelle envergure à vos mandats.
          </p>
        </div>

        <div className="habitoo-pro-cards-grid">
          {ADVANTAGES.map((adv) => {
            const Icon = adv.icon;
            return (
              <div key={adv.id} className="habitoo-pro-feature-card">
                {/* Image on Top (Authentic, without heavy sticker badges) */}
                <div className="habitoo-pro-card-image-wrap">
                  <img 
                    src={adv.image} 
                    alt={adv.alt} 
                    className="habitoo-pro-card-img"
                  />
                </div>

                {/* Card Body */}
                <div className="habitoo-pro-card-body">
                  <div className="habitoo-pro-card-category-tag">
                    {adv.category}
                  </div>
                  <h3 className="habitoo-pro-card-title">{adv.title}</h3>
                  <p className="habitoo-pro-card-desc">{adv.description}</p>
                  
                  <div className="habitoo-pro-card-footer">
                    <span>{adv.highlight}</span>
                    <ArrowRight size={15} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
