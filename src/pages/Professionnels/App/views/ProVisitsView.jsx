import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Sparkles,
  CalendarDays,
  Plus,
  Trash2,
  X
} from 'lucide-react';

const UPCOMING_VISITS = [
  {
    id: 'vis-up-1',
    date: 'Aujourd\'hui, 13 Sept.',
    time: '14:30 - 15:15',
    client: 'Alexandre Bédi',
    phone: '+225 07 89 22 14 00',
    property: "Villa Signature 'Le Belvédère'",
    address: 'Boulevard de France prolongé, Cocody Riviera Golf',
    type: 'Visite guidée exclusive'
  },
  {
    id: 'vis-up-2',
    date: 'Aujourd\'hui, 13 Sept.',
    time: '16:45 - 17:30',
    client: 'Claire Diop',
    phone: '+225 05 44 11 88 99',
    property: "Penthouse Panoramique 'Laguna Sky'",
    address: 'Avenue Chardy, Le Plateau, Abidjan',
    type: 'Visite acquéreur'
  },
  {
    id: 'vis-up-3',
    date: 'Lundi 15 Sept.',
    time: '10:00 - 10:45',
    client: 'Marc-Antoine Tano',
    phone: '+225 01 23 45 67 89',
    property: "Manoir Contemporain 'Les Baobabs'",
    address: 'Ngaliema, Kinshasa',
    type: 'Première visite'
  }
];

const PAST_VISITS = [
  {
    id: 'vis-past-1',
    date: 'Hier, 12 Sept.',
    time: '11:00 - 11:45',
    client: 'Didier Koffi',
    phone: '+225 07 11 22 33 44',
    property: "Villa Signature 'Le Belvédère'",
    address: 'Cocody Riviera Golf',
    result: 'Visite honorée • Offre d\'achat en cours'
  },
  {
    id: 'vis-past-2',
    date: 'Mercredi 10 Sept.',
    time: '15:30 - 16:15',
    client: 'Sarah Mensah',
    phone: '+225 05 99 88 77 66',
    property: "Résidence Balcon du Golf",
    address: 'Riviera 3',
    result: 'Visite honorée • Seconde visite souhaitée'
  },
  {
    id: 'vis-past-3',
    date: 'Mardi 09 Sept.',
    time: '09:30 - 10:15',
    client: 'Ibrahim Traoré',
    phone: '+225 01 02 03 04 05',
    property: "Penthouse Panoramique 'Laguna Sky'",
    address: 'Plateau',
    result: 'Visite honorée'
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

export const ProVisitsView = () => {
  const [subTab, setSubTab] = useState('UPCOMING'); // 'UPCOMING' | 'PAST'
  const [mobileSection, setMobileSection] = useState('PLANNING'); // 'PLANNING' | 'AVAILABILITY'
  const [slots, setSlots] = useState(DEFAULT_SLOTS);
  const [days, setDays] = useState(DAYS);
  const [visitDuration, setVisitDuration] = useState('45');
  const [savedFeedback, setSavedFeedback] = useState(false);

  // État d'ajout de créneau personnalisé
  const [isAddingSlot, setIsAddingSlot] = useState(false);
  const [newSlotLabel, setNewSlotLabel] = useState('');
  const [newSlotStart, setNewSlotStart] = useState('08:30');
  const [newSlotEnd, setNewSlotEnd] = useState('10:30');
  const [slotError, setSlotError] = useState('');

  const handleAddSlot = (e) => {
    e.preventDefault();
    if (!newSlotStart || !newSlotEnd) {
      setSlotError('Veuillez renseigner les heures de début et fin.');
      return;
    }
    if (newSlotStart >= newSlotEnd) {
      setSlotError("L'heure de fin doit être postérieure à l'heure de début.");
      return;
    }
    setSlotError('');
    const newId = `slot-custom-${Date.now()}`;
    const label = newSlotLabel.trim() || `Créneau ${newSlotStart}`;
    const newSlot = {
      id: newId,
      label,
      time: `${newSlotStart} - ${newSlotEnd}`,
      active: true,
      custom: true
    };
    setSlots(prev => [...prev, newSlot]);
    setIsAddingSlot(false);
    setNewSlotLabel('');
    setNewSlotStart('08:30');
    setNewSlotEnd('10:30');
    triggerFeedback();
  };

  const handleDeleteSlot = (e, slotId) => {
    e.stopPropagation();
    setSlots(prev => prev.filter(s => s.id !== slotId));
    triggerFeedback();
  };

  const toggleSlot = (id) => {
    setSlots(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
    triggerFeedback();
  };

  const toggleDay = (key) => {
    setDays(prev => prev.map(d => d.key === key ? { ...d, active: !d.active } : d));
    triggerFeedback();
  };

  const triggerFeedback = () => {
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const currentList = subTab === 'UPCOMING' ? UPCOMING_VISITS : PAST_VISITS;

  return (
    <div className="habitoo-dash-section">
      
      {/* Sélecteur d'onglets mobile (< 768px) pour basculer Planning vs Disponibilités */}
      <div className="pro-visits-mobile-tabs">
        <button
          type="button"
          className={`pro-visits-mobile-tab-btn ${mobileSection === 'PLANNING' ? 'pro-visits-mobile-tab-btn--active' : ''}`}
          onClick={() => setMobileSection('PLANNING')}
        >
          <Calendar size={14} />
          <span>Planning ({UPCOMING_VISITS.length})</span>
        </button>
        <button
          type="button"
          className={`pro-visits-mobile-tab-btn ${mobileSection === 'AVAILABILITY' ? 'pro-visits-mobile-tab-btn--active' : ''}`}
          onClick={() => setMobileSection('AVAILABILITY')}
        >
          <Clock size={14} />
          <span>Disponibilités</span>
        </button>
      </div>

      {/* 2 Colonnes : Planning des Visites vs Gestionnaire de Disponibilité */}
      <div className="habitoo-dash-visits-page-grid">
        
        {/* Colonne Gauche : Liste des visites avec sous-onglets */}
        <div className={`habitoo-dash-card ${mobileSection !== 'PLANNING' ? 'pro-visits-col--hidden-mobile' : ''}`}>
          <div className="habitoo-dash-card__header">
            <div>
              <h3 className="habitoo-dash-card__title">Planning des Visites</h3>
              <p className="habitoo-dash-card__subtitle">
                Rendez-vous programmés avec vos acquéreurs et locataires
              </p>
            </div>

            {/* Commutateur À faire / Passées */}
            <div className="habitoo-dash-subtab-toggle">
              <button
                type="button"
                className={`habitoo-dash-subtab-btn ${subTab === 'UPCOMING' ? 'habitoo-dash-subtab-btn--active' : ''}`}
                onClick={() => setSubTab('UPCOMING')}
              >
                Visites à faire ({UPCOMING_VISITS.length})
              </button>
              <button
                type="button"
                className={`habitoo-dash-subtab-btn ${subTab === 'PAST' ? 'habitoo-dash-subtab-btn--active' : ''}`}
                onClick={() => setSubTab('PAST')}
              >
                Visites passées ({PAST_VISITS.length})
              </button>
            </div>
          </div>

          <div className="habitoo-dash-visits-full-list">
            {currentList.map((vis) => (
              <div key={vis.id} className="habitoo-dash-visit-row">
                <div className="habitoo-dash-visit-row__time-block">
                  <span className="habitoo-dash-visit-row__date">{vis.date}</span>
                  <strong className="habitoo-dash-visit-row__hours">
                    <Clock size={12} /> {vis.time}
                  </strong>
                </div>

                <div className="habitoo-dash-visit-row__info">
                  <h4 className="habitoo-dash-visit-row__prop">{vis.property}</h4>
                  <span className="habitoo-dash-visit-row__address">
                    <MapPin size={11} /> {vis.address}
                  </span>
                  
                  <div className="habitoo-dash-visit-row__client">
                    <span><User size={12} /> {vis.client}</span>
                    <a href={`tel:${vis.phone}`} className="habitoo-dash-visit-row__phone">
                      <Phone size={11} /> {vis.phone}
                    </a>
                  </div>

                  {vis.result && (
                    <div className="habitoo-dash-visit-row__result">
                      <CheckCircle2 size={12} /> {vis.result}
                    </div>
                  )}
                </div>

                <div className="habitoo-dash-visit-row__badge-col">
                  <span className={`habitoo-dash-visit-status-badge ${subTab === 'UPCOMING' ? 'habitoo-dash-visit-status-badge--upcoming' : 'habitoo-dash-visit-status-badge--done'}`}>
                    {subTab === 'UPCOMING' ? 'À faire' : 'Passée'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Colonne Droite : Plages de disponibilité de l'agent */}
        <div className={`habitoo-dash-card ${mobileSection !== 'AVAILABILITY' ? 'pro-visits-col--hidden-mobile' : ''}`}>
          <div className="habitoo-dash-card__header">
            <div>
              <div className="habitoo-dash-title-with-sync">
                <h3 className="habitoo-dash-card__title">Plages de Disponibilité</h3>
                {savedFeedback && (
                  <span className="habitoo-dash-sync-badge">
                    <Sparkles size={10} /> Enregistré
                  </span>
                )}
              </div>
              <p className="habitoo-dash-card__subtitle">
                Définissez les créneaux ouverts à la prise de rendez-vous sur vos biens
              </p>
            </div>
          </div>

          <div className="habitoo-dash-avail-body">
            {/* Jours actifs */}
            <div className="habitoo-dash-avail-section">
              <label className="habitoo-dash-avail-label">Jours d'accueil :</label>
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

            {/* Créneaux */}
            <div className="habitoo-dash-avail-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label className="habitoo-dash-avail-label" style={{ margin: 0 }}>Créneaux horaires proposés :</label>
                {!isAddingSlot && (
                  <button
                    type="button"
                    onClick={() => setIsAddingSlot(true)}
                    className="habitoo-dash-btn-add-slot-trigger"
                    title="Définir un nouveau créneau de visite"
                  >
                    <Plus size={13} />
                    <span>Nouveau créneau</span>
                  </button>
                )}
              </div>

              {/* Formulaire d'ajout en ligne */}
              {isAddingSlot && (
                <form onSubmit={handleAddSlot} className="habitoo-dash-add-slot-card">
                  <div className="habitoo-dash-add-slot-header">
                    <span className="habitoo-dash-add-slot-title">Ajouter un créneau de visite</span>
                    <button
                      type="button"
                      onClick={() => { setIsAddingSlot(false); setSlotError(''); }}
                      className="habitoo-dash-add-slot-close"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <div className="habitoo-dash-add-slot-field">
                    <label className="habitoo-dash-add-slot-label">Libellé du créneau</label>
                    <input
                      type="text"
                      className="habitoo-dash-add-slot-input"
                      placeholder="Ex: Matinée VIP, Début d'après-midi, Fin de journée..."
                      value={newSlotLabel}
                      onChange={(e) => setNewSlotLabel(e.target.value)}
                    />
                  </div>

                  <div className="habitoo-dash-add-slot-times-row">
                    <div className="habitoo-dash-add-slot-time-col">
                      <label className="habitoo-dash-add-slot-label">Heure de début *</label>
                      <input
                        type="time"
                        className="habitoo-dash-add-slot-input"
                        value={newSlotStart}
                        onChange={(e) => setNewSlotStart(e.target.value)}
                        required
                      />
                    </div>
                    <div className="habitoo-dash-add-slot-time-col">
                      <label className="habitoo-dash-add-slot-label">Heure de fin *</label>
                      <input
                        type="time"
                        className="habitoo-dash-add-slot-input"
                        value={newSlotEnd}
                        onChange={(e) => setNewSlotEnd(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {slotError && (
                    <span className="habitoo-dash-add-slot-error">{slotError}</span>
                  )}

                  <div className="habitoo-dash-add-slot-actions">
                    <button
                      type="button"
                      onClick={() => { setIsAddingSlot(false); setSlotError(''); }}
                      className="habitoo-dash-btn-ghost habitoo-dash-btn-add-slot-cancel"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="habitoo-dash-btn-primary habitoo-dash-btn-add-slot-submit"
                    >
                      Enregistrer ce créneau
                    </button>
                  </div>
                </form>
              )}

              {/* Grille des créneaux actifs / inactifs */}
              <div className="habitoo-dash-slots-grid" style={{ marginTop: '8px' }}>
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
                    <button
                      type="button"
                      className="habitoo-dash-slot-delete-btn"
                      onClick={(e) => handleDeleteSlot(e, slot.id)}
                      title="Supprimer ce créneau"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Durée */}
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
                        triggerFeedback();
                      }}
                      className={`habitoo-dash-duration-btn ${visitDuration === mins ? 'habitoo-dash-duration-btn--active' : ''}`}
                    >
                      {mins} min
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
