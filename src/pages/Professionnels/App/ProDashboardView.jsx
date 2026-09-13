import React, { useState } from 'react';
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
  ArrowRight,
  Eye,
  ShieldCheck,
  CheckCircle2,
  X
} from 'lucide-react';

const TODAY_VISITS = [
  {
    id: 'vis-1',
    time: '14:30 - 15:15',
    date: "Aujourd'hui, 13 Septembre 2026",
    propertyTitle: "Villa Signature 'Le Belvédère'",
    propertyImage: '/assets/villa-abidjan-signature.jpg',
    propertyPrice: '1 250 000 000 FCFA',
    propertyCategory: 'Vente',
    location: 'Cocody Riviera Golf',
    fullAddress: 'Boulevard de France prolongé, Cocody Riviera Golf, Abidjan',
    clientName: 'Alexandre Bédi',
    clientPhone: '+225 07 89 22 14 00',
    clientEmail: 'a.bedi@invest-abidjan.ci',
    visitType: 'Visite guidée exclusive (Acquéreur qualifié)',
    escrowDeposit: '50 000 FCFA',
    escrowStatus: 'Caution sécurisée sous séquestre Habitoo',
    notes: 'Acquéreur qualifié avec dossier de financement validé. Recherche résidence principale d’exception.',
    status: 'CONFIRMED'
  },
  {
    id: 'vis-2',
    time: '16:45 - 17:30',
    date: "Aujourd'hui, 13 Septembre 2026",
    propertyTitle: "Penthouse Panoramique 'Laguna Sky'",
    propertyImage: '/assets/hero-sunset-villa-desktop.jpg',
    propertyPrice: '450 000 000 FCFA',
    propertyCategory: 'Vente',
    location: 'Plateau, Abidjan',
    fullAddress: 'Avenue Chardy, Tour Laguna 18ème étage, Plateau, Abidjan',
    clientName: 'Claire Diop',
    clientPhone: '+225 05 44 11 88 99',
    clientEmail: 'claire.diop@dakar-capital.sn',
    visitType: 'Visite investisseur',
    escrowDeposit: '50 000 FCFA',
    escrowStatus: 'Caution sécurisée sous séquestre Habitoo',
    notes: 'Investisseuse basée à Dakar, recherche penthouse vue lagune pour investissement locatif meublé haut standing.',
    status: 'CONFIRMED'
  }
];

export const ProDashboardView = ({ onSelectTab, onOpenCreditsModal }) => {
  const [selectedVisit, setSelectedVisit] = useState(null);

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
              <strong className="habitoo-dash-metric-card__val">6</strong>
            </div>
            <div className="habitoo-dash-metric-card__bottom">
              <span className="habitoo-dash-metric-card__sub">2 boostées</span>
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
              {TODAY_VISITS.map((vis) => (
                <div key={vis.id} className="habitoo-dash-overview-visit-item">
                  <div className="habitoo-dash-overview-visit-top">
                    <div className="habitoo-dash-overview-visit-time">
                      <Clock size={13} />
                      <strong>{vis.time}</strong>
                    </div>
                    <span className="habitoo-dash-overview-visit-loc">
                      <MapPin size={11} /> {vis.location}
                    </span>
                  </div>
                  <div className="habitoo-dash-overview-visit-body">
                    <h4 className="habitoo-dash-overview-visit-prop">{vis.propertyTitle}</h4>
                    <div className="habitoo-dash-overview-visit-contact">
                      <span className="habitoo-dash-overview-visit-client">
                        <User size={12} /> {vis.clientName}
                      </span>
                      <div className="habitoo-dash-overview-visit-actions">
                        <a
                          href={`tel:${vis.clientPhone.replace(/\s+/g, '')}`}
                          className="habitoo-dash-overview-visit-phone"
                          title="Appeler l'acquéreur"
                        >
                          <Phone size={11} /> {vis.clientPhone}
                        </a>
                        <button
                          type="button"
                          className="habitoo-dash-btn-visit-details"
                          onClick={() => setSelectedVisit(vis)}
                          title="Voir les détails complets de la visite"
                        >
                          <Eye size={12} />
                          <span>Voir détails</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Colonne Droite : Annonces à optimiser / booster */}
          <div className="habitoo-dash-card">
            <div className="habitoo-dash-card__header">
              <div>
                <h3 className="habitoo-dash-card__title">Annonces à booster</h3>
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

      {/* Modale de Détails de Visite */}
      {selectedVisit && (
        <div className="habitoo-dash-modal-overlay" onClick={() => setSelectedVisit(null)}>
          <div
            className="habitoo-dash-modal habitoo-dash-visit-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="visit-modal-title"
          >
            <button
              type="button"
              className="habitoo-dash-modal__close habitoo-dash-visit-modal__close"
              onClick={() => setSelectedVisit(null)}
              aria-label="Fermer la modale"
            >
              <X size={18} />
            </button>

            {/* En-tête avec image du bien & titre */}
            <div className="habitoo-dash-visit-modal__banner">
              <img
                src={selectedVisit.propertyImage}
                alt={selectedVisit.propertyTitle}
                className="habitoo-dash-visit-modal__img"
              />
              <div className="habitoo-dash-visit-modal__banner-overlay">
                <span className="habitoo-dash-visit-modal__category">{selectedVisit.propertyCategory}</span>
                <h3 id="visit-modal-title" className="habitoo-dash-visit-modal__prop-title">
                  {selectedVisit.propertyTitle}
                </h3>
                <span className="habitoo-dash-visit-modal__price">{selectedVisit.propertyPrice}</span>
              </div>
            </div>

            <div className="habitoo-dash-visit-modal__body">
              {/* Statut & Horaire */}
              <div className="habitoo-dash-visit-modal__time-row">
                <div className="habitoo-dash-visit-modal__time-chip">
                  <Clock size={14} />
                  <span>{selectedVisit.date} • {selectedVisit.time}</span>
                </div>
                <span className="habitoo-dash-badge habitoo-dash-badge--broker">
                  <CheckCircle2 size={12} /> Confirmé
                </span>
              </div>

              {/* Lieu & Adresse */}
              <div className="habitoo-dash-visit-modal__section">
                <span className="habitoo-dash-visit-modal__label">Lieu du rendez-vous</span>
                <div className="habitoo-dash-visit-modal__address">
                  <MapPin size={16} className="habitoo-dash-visit-modal__icon" />
                  <div>
                    <strong>{selectedVisit.location}</strong>
                    <p>{selectedVisit.fullAddress}</p>
                  </div>
                </div>
              </div>

              {/* Acquéreur & Contact */}
              <div className="habitoo-dash-visit-modal__section">
                <span className="habitoo-dash-visit-modal__label">Acquéreur / Visiteur</span>
                <div className="habitoo-dash-visit-modal__client-card">
                  <div className="habitoo-dash-visit-modal__client-info">
                    <div className="habitoo-dash-visit-modal__client-avatar">
                      <User size={18} />
                    </div>
                    <div>
                      <strong className="habitoo-dash-visit-modal__client-name">{selectedVisit.clientName}</strong>
                      <span className="habitoo-dash-visit-modal__client-sub">{selectedVisit.visitType}</span>
                    </div>
                  </div>
                  <a
                    href={`tel:${selectedVisit.clientPhone.replace(/\s+/g, '')}`}
                    className="habitoo-dash-visit-modal__phone-link"
                  >
                    <Phone size={13} /> {selectedVisit.clientPhone}
                  </a>
                </div>
              </div>

              {/* Caution sous Séquestre */}
              <div className="habitoo-dash-visit-modal__escrow-card">
                <div className="habitoo-dash-visit-modal__escrow-top">
                  <ShieldCheck size={16} className="habitoo-dash-visit-modal__escrow-icon" />
                  <strong>Caution de {selectedVisit.escrowDeposit} sous séquestre</strong>
                </div>
                <p className="habitoo-dash-visit-modal__escrow-text">
                  Garantie par séquestre Habitoo. En cas d'absence injustifiée de l'acquéreur, la caution vous est reversée sous 24h.
                </p>
              </div>

              {/* Notes */}
              {selectedVisit.notes && (
                <div className="habitoo-dash-visit-modal__notes">
                  <span className="habitoo-dash-visit-modal__label">Notes & Profil</span>
                  <p>{selectedVisit.notes}</p>
                </div>
              )}
            </div>

            {/* Pied de modal avec actions */}
            <div className="habitoo-dash-visit-modal__footer">
              <a
                href={`tel:${selectedVisit.clientPhone.replace(/\s+/g, '')}`}
                className="habitoo-dash-btn-primary habitoo-dash-visit-modal__call-btn"
              >
                <Phone size={14} />
                <span>Appeler {selectedVisit.clientName.split(' ')[0]}</span>
              </a>
              <button
                type="button"
                className="habitoo-dash-visit-modal__close-btn"
                onClick={() => setSelectedVisit(null)}
              >
                Fermer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
