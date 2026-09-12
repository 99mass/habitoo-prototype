import React from 'react';
import { 
  Building2, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  MapPin, 
  ArrowUpRight, 
  Zap, 
  Flame, 
  ArrowRight 
} from 'lucide-react';

export const ProDashboardView = ({ onSelectTab, onOpenCreditsModal }) => {
  return (
    <div className="habitoo-dash-view">
      
      {/* 1. RANGÉE SUPÉRIEURE : 4 KPIs COMPACTS DE PERFORMANCE */}
      <section className="habitoo-dash-section">
        <div className="habitoo-dash-kpi-grid">
          
          {/* KPI 1 : Revenus disponibles */}
          <div className="habitoo-dash-metric-card">
            <div className="habitoo-dash-metric-card__top">
              <span className="habitoo-dash-metric-card__title">Revenus Disponibles</span>
              <span className="habitoo-dash-metric-card__badge habitoo-dash-metric-card__badge--positive">
                Prêt
              </span>
            </div>
            <div className="habitoo-dash-metric-card__middle">
              <strong className="habitoo-dash-metric-card__val">350 000 FCFA</strong>
            </div>
            <div className="habitoo-dash-metric-card__bottom">
              <span className="habitoo-dash-metric-card__sub">Honoraires débloqués</span>
              <button 
                type="button" 
                className="habitoo-dash-metric-card__action"
                onClick={() => onSelectTab && onSelectTab('revenue')}
              >
                Virer
              </button>
            </div>
          </div>

          {/* KPI 2 : Visites à faire */}
          <div className="habitoo-dash-metric-card">
            <div className="habitoo-dash-metric-card__top">
              <span className="habitoo-dash-metric-card__title">Visites Programmées</span>
              <span className="habitoo-dash-metric-card__badge habitoo-dash-metric-card__badge--neutral">
                Cette semaine
              </span>
            </div>
            <div className="habitoo-dash-metric-card__middle">
              <strong className="habitoo-dash-metric-card__val">2 visites</strong>
            </div>
            <div className="habitoo-dash-metric-card__bottom">
              <span className="habitoo-dash-metric-card__sub">2 aujourd'hui</span>
              <button 
                type="button" 
                className="habitoo-dash-metric-card__action"
                onClick={() => onSelectTab && onSelectTab('visits')}
              >
                Agenda
              </button>
            </div>
          </div>

          {/* KPI 3 : Taux de contact */}
          <div className="habitoo-dash-metric-card">
            <div className="habitoo-dash-metric-card__top">
              <span className="habitoo-dash-metric-card__title">Taux d'Intérêt</span>
              <span className="habitoo-dash-metric-card__badge habitoo-dash-metric-card__badge--red">
                +2.1%
              </span>
            </div>
            <div className="habitoo-dash-metric-card__middle">
              <strong className="habitoo-dash-metric-card__val">8.4%</strong>
            </div>
            <div className="habitoo-dash-metric-card__bottom">
              <span className="habitoo-dash-metric-card__sub">Ratio vues / contacts</span>
            </div>
          </div>

          {/* KPI 4 : Annonces en ligne */}
          <div className="habitoo-dash-metric-card">
            <div className="habitoo-dash-metric-card__top">
              <span className="habitoo-dash-metric-card__title">Annonces Actives</span>
              <span className="habitoo-dash-metric-card__badge habitoo-dash-metric-card__badge--neutral">
                Portefeuille
              </span>
            </div>
            <div className="habitoo-dash-metric-card__middle">
              <strong className="habitoo-dash-metric-card__val">6 mandats</strong>
            </div>
            <div className="habitoo-dash-metric-card__bottom">
              <span className="habitoo-dash-metric-card__sub">2 mandats boostés</span>
              <button 
                type="button" 
                className="habitoo-dash-metric-card__action"
                onClick={() => onSelectTab && onSelectTab('properties')}
              >
                Gérer
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 2. RÉSUMÉ VISUEL À 2 COLONNES : VISITES DU JOUR VS ANNONCES À ARBITRER */}
      <section className="habitoo-dash-section">
        <div className="habitoo-dash-twocol-grid">
          
          {/* Colonne Gauche : Visites à faire aujourd'hui */}
          <div className="habitoo-dash-card">
            <div className="habitoo-dash-card__header">
              <div>
                <h3 className="habitoo-dash-card__title">Visites du Jour</h3>
                <p className="habitoo-dash-card__subtitle">Rendez-vous acquéreurs programmés aujourd'hui</p>
              </div>
              <button
                type="button"
                className="habitoo-dash-card-link"
                onClick={() => onSelectTab && onSelectTab('visits')}
              >
                <span>Voir planning</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <div className="habitoo-dash-overview-visits">
              {/* Visite 1 */}
              <div className="habitoo-dash-overview-visit-item">
                <div className="habitoo-dash-overview-visit-time">
                  <Clock size={13} />
                  <strong>14:30 - 15:15</strong>
                </div>
                <div className="habitoo-dash-overview-visit-body">
                  <h4 className="habitoo-dash-overview-visit-prop">Villa Signature 'Le Belvédère'</h4>
                  <span className="habitoo-dash-overview-visit-loc">
                    <MapPin size={11} /> Cocody Riviera Golf
                  </span>
                  <div className="habitoo-dash-overview-visit-contact">
                    <span><User size={11} /> Alexandre Bédi</span>
                    <a href="tel:+2250789221400" className="habitoo-dash-overview-visit-phone">
                      <Phone size={11} /> +225 07 89 22 14 00
                    </a>
                  </div>
                </div>
              </div>

              {/* Visite 2 */}
              <div className="habitoo-dash-overview-visit-item">
                <div className="habitoo-dash-overview-visit-time">
                  <Clock size={13} />
                  <strong>16:45 - 17:30</strong>
                </div>
                <div className="habitoo-dash-overview-visit-body">
                  <h4 className="habitoo-dash-overview-visit-prop">Penthouse Panoramique 'Laguna Sky'</h4>
                  <span className="habitoo-dash-overview-visit-loc">
                    <MapPin size={11} /> Plateau, Abidjan
                  </span>
                  <div className="habitoo-dash-overview-visit-contact">
                    <span><User size={11} /> Claire Diop</span>
                    <a href="tel:+2250544118899" className="habitoo-dash-overview-visit-phone">
                      <Phone size={11} /> +225 05 44 11 88 99
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne Droite : Annonces à optimiser / booster */}
          <div className="habitoo-dash-card">
            <div className="habitoo-dash-card__header">
              <div>
                <h3 className="habitoo-dash-card__title">Optimisation des Mandats</h3>
                <p className="habitoo-dash-card__subtitle">Annonces à fort potentiel nécessitant un boost</p>
              </div>
              <button
                type="button"
                className="habitoo-dash-card-link"
                onClick={() => onSelectTab && onSelectTab('properties')}
              >
                <span>Toutes les annonces</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <div className="habitoo-dash-overview-props">
              {/* Bien 1 */}
              <div className="habitoo-dash-overview-prop-item">
                <img 
                  src="/assets/duplex-congo-river.jpg" 
                  alt="Manoir Contemporain" 
                  className="habitoo-dash-overview-prop-thumb" 
                />
                <div className="habitoo-dash-overview-prop-info">
                  <h4 className="habitoo-dash-overview-prop-title">Manoir Contemporain 'Les Baobabs'</h4>
                  <span className="habitoo-dash-overview-prop-loc">Ngaliema, Kinshasa</span>
                  <div className="habitoo-dash-overview-prop-stats">
                    <span>Score : <strong>78/100</strong></span>
                    <span>3 890 vues</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="habitoo-dash-btn-boost"
                  onClick={onOpenCreditsModal}
                >
                  <Zap size={12} />
                  <span>Booster</span>
                </button>
              </div>

              {/* Bien 2 */}
              <div className="habitoo-dash-overview-prop-item">
                <img 
                  src="/assets/hero-sunset-villa-desktop.jpg" 
                  alt="Résidence Balcon du Golf" 
                  className="habitoo-dash-overview-prop-thumb" 
                />
                <div className="habitoo-dash-overview-prop-info">
                  <h4 className="habitoo-dash-overview-prop-title">Résidence Balcon du Golf</h4>
                  <span className="habitoo-dash-overview-prop-loc">Riviera 3, Abidjan</span>
                  <div className="habitoo-dash-overview-prop-stats">
                    <span>Score : <strong>64/100</strong></span>
                    <span>1 950 vues</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="habitoo-dash-btn-boost"
                  onClick={onOpenCreditsModal}
                >
                  <Zap size={12} />
                  <span>Booster</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
