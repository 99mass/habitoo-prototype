import React from 'react';
import { Award, BarChart3, CheckCircle2, GraduationCap, Sparkles, ArrowRight } from 'lucide-react';

const ADVANTAGES = [
  {
    id: 'badge',
    title: 'Le Badge PRO Certifié',
    category: 'Autorité et Accréditation',
    icon: Award,
    image: '/assets/pro-badge-certified.jpg',
    alt: 'Insigne officiel Habitoo PRO Certifié et accréditation professionnelle',
    description: 'Un gage immédiat de crédibilité auprès des acquéreurs et locataires. Vos annonces inspirent une confiance absolue dès le premier regard.',
  },
  {
    id: 'dashboard',
    title: 'Dashboard Tout-en-un',
    category: 'Analytique et Performance',
    icon: BarChart3,
    image: '/assets/pro-dashboard-screen.jpg',
    alt: 'Tableau de bord professionnel Habitoo avec indicateurs clés et gestion des mandats',
    description: 'Suivi en temps réel des vues, prises de contact qualifiées et synchronisation simplifiée de votre calendrier de visites.',
  },
  {
    id: 'commissions',
    title: 'Commissions Automatiques',
    category: 'Transactions et Règlements',
    icon: CheckCircle2,
    image: '/assets/pro-commissions-transaction.jpg',
    alt: 'Notification de virement et règlement sécurisé des commissions',
    description: 'Encaissement garanti, transparent et rapide de vos honoraires directement via Mobile Money avec reçus officiels horodatés.',
  },
  {
    id: 'academie',
    title: 'Habitoo Académie',
    category: 'Formation et Montée en Compétence',
    icon: GraduationCap,
    image: '/assets/pro-academy-simple.jpg',
    alt: 'Interface épurée de masterclass immobilière Habitoo Académie',
    description: 'Formations professionnelles continues : réglementation foncière, valorisation photographique de mandats et négociation terrain.',
  },
  {
    id: 'visibilite',
    title: 'Visibilité Maximale',
    category: 'Boost et Algorithme',
    icon: Sparkles,
    image: '/assets/pro-boost-algorithm.jpg',
    alt: 'Algorithme de boost et propulsion d\'annonce en tête de recherche',
    description: 'Options de boost pour propulser vos biens prioritaires en tête des résultats de recherche, en vitrine d\'accueil et en alertes acquéreurs.',
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
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
