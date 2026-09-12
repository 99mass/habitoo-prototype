import React, { useState } from 'react';
import { Calendar, Clock, UserCheck, CheckCircle2, ShieldCheck, Settings2, Plus, Sparkles } from 'lucide-react';

const INITIAL_VISITS = [
  {
    id: 'vis-1',
    time: '14:30 - 15:15',
    client: 'Alexandre Bédi',
    property: "Villa Signature 'Le Belvédère'",
    district: 'Riviera Golf',
    escrowDeposit: '10 000 FCFA',
    status: 'TO_CONFIRM', // 'TO_CONFIRM' | 'CONFIRMED'
    phone: '+225 07 89 22 14 00'
  },
  {
    id: 'vis-2',
    time: '16:45 - 17:30',
    client: 'Claire Diop',
    property: "Penthouse Panoramique 'Laguna Sky'",
    district: 'Plateau',
    escrowDeposit: '10 000 FCFA',
    status: 'CONFIRMED',
    phone: '+225 05 44 11 88 99'
  }
];

const DEFAULT_SLOTS = [
  { id: 'slot-morning', label: 'Matinée', time: '09:00 - 12:30', active: true },
  { id: 'slot-midday', label: 'Début après-midi', time: '14:00 - 16:30', active: true },
  { id: 'slot-evening', label: 'Fin d\'après-midi', time: '16:30 - 19:00', active: false },
  { id: 'slot-saturday', label: 'Samedi continu', time: '10:00 - 15:00', active: true }
];

const DAYS = [
  { key: 'lun', label: 'Lun', active: true },
  { key: 'mar', label: 'Mar', active: true },
  { key: 'mer', label: 'Mer', active: true },
  { key: 'jeu', label: 'Jeu', active: true },
  { key: 'ven', label: 'Ven', active: true },
  { key: 'sam', label: 'Sam', active: true },
  { key: 'dim', label: 'Dim', active: false }
];

export const UpcomingVisitsCard = () => {
  const [visits, setVisits] = useState(INITIAL_VISITS);
  const [slots, setSlots] = useState(DEFAULT_SLOTS);
  const [days, setDays] = useState(DAYS);
  const [visitDuration, setVisitDuration] = useState('45');
  const [savedFeedback, setSavedFeedback] = useState(false);

  // Confirmer une visite
  const handleConfirmVisit = (id) => {
    setVisits(prev =>
      prev.map(v => v.id === id ? { ...v, status: 'CONFIRMED' } : v)
    );
  };

  // Basculer un créneau horaire
  const toggleSlot = (id) => {
    setSlots(prev =>
      prev.map(s => s.id === id ? { ...s, active: !s.active } : s)
    );
    showSaveNotification();
  };

  // Basculer un jour disponible
  const toggleDay = (key) => {
    setDays(prev =>
      prev.map(d => d.key === key ? { ...d, active: !d.active } : d)
    );
    showSaveNotification();
  };

  const showSaveNotification = () => {
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2400);
  };

  return (
    <div className="habitoo-dash-card habitoo-dash-visits-availability-card">
      {/* Grille 2 colonnes : Visites du jour vs Gestionnaire de disponibilités */}
      <div className="habitoo-dash-visits-grid">
        
        {/* Colonne A : Visites programmées du jour */}
        <div className="habitoo-dash-visits-col">
          <div className="habitoo-dash-card__header">
            <div className="habitoo-dash-card__title-group">
              <h3 className="habitoo-dash-card__title">Agenda des Visites du Jour</h3>
              <p className="habitoo-dash-card__subtitle">
                Rendez-vous acquéreurs avec caution bloquée sous séquestre
              </p>
            </div>
            <span className="habitoo-dash-visits-today-pill">
              <Calendar size={11} /> Aujourd'hui
            </span>
          </div>

          <div className="habitoo-dash-visits-list">
            {visits.map((vis) => (
              <div
                key={vis.id}
                className={`habitoo-dash-visit-item ${vis.status === 'CONFIRMED' ? 'habitoo-dash-visit-item--confirmed' : ''}`}
              >
                <div className="habitoo-dash-visit-item__time-col">
                  <span className="habitoo-dash-visit-item__time">
                    <Clock size={12} /> {vis.time}
                  </span>
                  <span className={`habitoo-dash-visit-item__status-tag ${vis.status === 'CONFIRMED' ? 'habitoo-dash-visit-item__status-tag--ok' : 'habitoo-dash-visit-item__status-tag--pending'}`}>
                    {vis.status === 'CONFIRMED' ? 'Confirmée' : 'À confirmer'}
                  </span>
                </div>

                <div className="habitoo-dash-visit-item__info-col">
                  <div className="habitoo-dash-visit-item__client">
                    <UserCheck size={13} className="habitoo-dash-visit-item__client-icon" />
                    <strong>{vis.client}</strong>
                    <span className="habitoo-dash-visit-item__escrow">
                      <ShieldCheck size={11} /> {vis.escrowDeposit} sécurisés
                    </span>
                  </div>
                  <div className="habitoo-dash-visit-item__property">
                    <span>{vis.property}</span>
                    <span className="habitoo-dash-visit-item__dot-sep">•</span>
                    <span className="habitoo-dash-visit-item__district">{vis.district}</span>
                  </div>
                </div>

                <div className="habitoo-dash-visit-item__actions-col">
                  {vis.status === 'TO_CONFIRM' ? (
                    <button
                      type="button"
                      className="habitoo-dash-btn-confirm-visit"
                      onClick={() => handleConfirmVisit(vis.id)}
                    >
                      <CheckCircle2 size={13} />
                      <span>Confirmer</span>
                    </button>
                  ) : (
                    <span className="habitoo-dash-badge-confirmed-ready">
                      <CheckCircle2 size={13} /> Prêt pour accueil
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Colonne B : Gestionnaire des Heures de Disponibilité */}
        <div className="habitoo-dash-availability-col">
          <div className="habitoo-dash-card__header">
            <div className="habitoo-dash-card__title-group">
              <div className="habitoo-dash-title-with-sync">
                <h3 className="habitoo-dash-card__title">Mes Plages de Disponibilité</h3>
                {savedFeedback && (
                  <span className="habitoo-dash-sync-badge">
                    <Sparkles size={10} /> Synchronisé
                  </span>
                )}
              </div>
              <p className="habitoo-dash-card__subtitle">
                Configurez les heures où vos biens peuvent être visités par les acquéreurs
              </p>
            </div>
          </div>

          <div className="habitoo-dash-avail-body">
            {/* Jours de visite actifs */}
            <div className="habitoo-dash-avail-section">
              <label className="habitoo-dash-avail-label">Jours d'ouverture aux visites :</label>
              <div className="habitoo-dash-days-row">
                {days.map((d) => (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => toggleDay(d.key)}
                    className={`habitoo-dash-day-btn ${d.active ? 'habitoo-dash-day-btn--active' : ''}`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Plages horaires configurables */}
            <div className="habitoo-dash-avail-section">
              <div className="habitoo-dash-avail-label-row">
                <label className="habitoo-dash-avail-label">Créneaux horaires proposés :</label>
                <span className="habitoo-dash-avail-hint">Cochez pour activer</span>
              </div>

              <div className="habitoo-dash-slots-grid">
                {slots.map((slot) => (
                  <div
                    key={slot.id}
                    onClick={() => toggleSlot(slot.id)}
                    className={`habitoo-dash-slot-card ${slot.active ? 'habitoo-dash-slot-card--active' : ''}`}
                  >
                    <div className="habitoo-dash-slot-card__check">
                      <div className="habitoo-dash-slot-checkbox">
                        {slot.active && <div className="habitoo-dash-slot-checkbox-inner" />}
                      </div>
                    </div>
                    <div className="habitoo-dash-slot-card__content">
                      <span className="habitoo-dash-slot-card__name">{slot.label}</span>
                      <strong className="habitoo-dash-slot-card__time">{slot.time}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Durée type d'un créneau */}
            <div className="habitoo-dash-avail-footer">
              <div className="habitoo-dash-duration-picker">
                <span className="habitoo-dash-duration-label">Durée par visite :</span>
                <div className="habitoo-dash-duration-opts">
                  {['30', '45', '60'].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => {
                        setVisitDuration(mins);
                        showSaveNotification();
                      }}
                      className={`habitoo-dash-duration-btn ${visitDuration === mins ? 'habitoo-dash-duration-btn--active' : ''}`}
                    >
                      {mins} min
                    </button>
                  ))}
                </div>
              </div>

              <span className="habitoo-dash-avail-status-text">
                Rendez-vous limités à 1 par créneau pour préserver l'exclusivité.
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
