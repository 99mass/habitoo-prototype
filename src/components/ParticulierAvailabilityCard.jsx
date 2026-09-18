import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Plus, 
  X, 
  Sparkles, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  ArrowRight,
  SlidersHorizontal,
  CalendarCheck
} from 'lucide-react';

const TIME_OPTIONS = [
  '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', 
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', 
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', 
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', 
  '19:00', '19:30', '20:00', '20:30', '21:00'
];

const DEFAULT_DAYS = [
  { key: 'lun', shortLabel: 'Lun', fullLabel: 'Lundi', active: true },
  { key: 'mar', shortLabel: 'Mar', fullLabel: 'Mardi', active: true },
  { key: 'mer', shortLabel: 'Mer', fullLabel: 'Mercredi', active: true },
  { key: 'jeu', shortLabel: 'Jeu', fullLabel: 'Jeudi', active: true },
  { key: 'ven', shortLabel: 'Ven', fullLabel: 'Vendredi', active: true },
  { key: 'sam', shortLabel: 'Sam', fullLabel: 'Samedi', active: true },
  { key: 'dim', shortLabel: 'Dim', fullLabel: 'Dimanche', active: false }
];

const DEFAULT_SLOTS = [
  { id: 'slot-sample-1', start: '09:30', end: '12:30' },
  { id: 'slot-sample-2', start: '14:30', end: '17:30' }
];

export const ParticulierAvailabilityCard = () => {
  const [searchParams] = useSearchParams();

  // Collapsible state (Desktop) : déplié par défaut
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Mobile lateral drawer state (supporte ?avail=1 pour deep-linking)
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(() => searchParams.get('avail') === '1');

  useEffect(() => {
    if (searchParams.get('avail') === '1') {
      setIsMobileDrawerOpen(true);
    }
  }, [searchParams]);

  // Jours d'accueil
  const [days, setDays] = useState(() => {
    try {
      const saved = localStorage.getItem('habitoo_user_avail_days');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge full labels if loaded from older structure
          return parsed.map(d => {
            const def = DEFAULT_DAYS.find(df => df.key === d.key);
            return {
              ...d,
              fullLabel: def?.fullLabel || d.label || d.fullLabel,
              shortLabel: def?.shortLabel || d.label || d.shortLabel
            };
          });
        }
      }
      return DEFAULT_DAYS;
    } catch {
      return DEFAULT_DAYS;
    }
  });

  // Créneaux horaires personnalisés libres
  const [slots, setSlots] = useState(() => {
    try {
      const saved = localStorage.getItem('habitoo_user_avail_slots');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return DEFAULT_SLOTS;
    } catch {
      return DEFAULT_SLOTS;
    }
  });

  // Sélecteur libre (Segment d'Exception)
  const [slotStart, setSlotStart] = useState('09:30');
  const [slotEnd, setSlotEnd] = useState('12:30');
  const [savedFeedback, setSavedFeedback] = useState(false);


  useEffect(() => {
    localStorage.setItem('habitoo_user_avail_days', JSON.stringify(days));
  }, [days]);

  useEffect(() => {
    localStorage.setItem('habitoo_user_avail_slots', JSON.stringify(slots));
  }, [slots]);

  const triggerSaveFeedback = () => {
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const toggleDay = (key) => {
    setDays(prev => prev.map(d => d.key === key ? { ...d, active: !d.active } : d));
    triggerSaveFeedback();
  };

  const applyDaysPreset = (preset) => {
    if (preset === 'week') {
      setDays(prev => prev.map(d => ({ ...d, active: d.key !== 'sam' && d.key !== 'dim' })));
    } else if (preset === 'all') {
      setDays(prev => prev.map(d => ({ ...d, active: true })));
    } else if (preset === 'weekend') {
      setDays(prev => prev.map(d => ({ ...d, active: d.key === 'sam' || d.key === 'dim' })));
    }
    triggerSaveFeedback();
  };

  // Ajouter un nouveau créneau libre
  const handleAddSlot = (e) => {
    e?.preventDefault();
    if (!slotStart || !slotEnd) return;
    if (slotStart >= slotEnd) {
      alert("L'heure de début doit être antérieure à l'heure de fin.");
      return;
    }

    const exists = slots.some(s => s.start === slotStart && s.end === slotEnd);
    if (exists) {
      alert("Cette plage horaire est déjà enregistrée.");
      return;
    }

    const newSlot = {
      id: `slot-${Date.now()}`,
      start: slotStart,
      end: slotEnd
    };

    setSlots(prev => [...prev, newSlot].sort((a, b) => a.start.localeCompare(b.start)));
    triggerSaveFeedback();
  };

  const handleRemoveSlot = (id) => {
    setSlots(prev => prev.filter(s => s.id !== id));
    triggerSaveFeedback();
  };

  const activeDaysCount = days.filter(d => d.active).length;
  const activeSlotsCount = slots.length;

  // Contenu principal du gestionnaire de créneaux (réutilisé en desktop et dans le drawer mobile)
  const renderAvailabilityContent = () => (
    <div className="avail-editor-inner">
      
      {/* SECTION 1 : JOURS D'ACCUEIL */}
      <div className="avail-section">
        <div className="avail-section-header">
          <label className="avail-section-label">Jours d'accueil disponibles :</label>

   
        </div>

        {/* Boutons jours : pleins noms en desktop (Lundi...Dimanche), courts en mobile */}
        <div className="avail-days-row">
          {days.map((d) => (
            <button
              key={d.key}
              type="button"
              onClick={() => toggleDay(d.key)}
              className={`avail-day-btn ${d.active ? 'active' : ''}`}
              aria-pressed={d.active}
              title={`${d.fullLabel} : ${d.active ? 'Ouvert' : 'Fermé'}`}
            >
              <span className="day-name-full">{d.fullLabel}</span>
              <span className="day-name-short">{d.shortLabel}</span>
              <span className="day-dot" />
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 2 : CHOIX DIRECT D'HORAIRE */}
      <div className="avail-section">
        {/* Le Sélecteur d'horaire direct */}
        <div className="segment-builder-card">
          <div className="segment-builder-row">
            
            <div className="segment-select-box">
              <Clock size={13} color="var(--graphite-gray)" />
              <select 
                value={slotStart} 
                onChange={(e) => setSlotStart(e.target.value)}
                className="segment-select"
                aria-label="Heure de début"
              >
                {TIME_OPTIONS.map((t) => (
                  <option key={`start-${t}`} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="segment-separator-arrow">
              <ArrowRight size={14} color="#737373" />
            </div>

            <div className="segment-select-box">
              <Clock size={13} color="var(--graphite-gray)" />
              <select 
                value={slotEnd} 
                onChange={(e) => setSlotEnd(e.target.value)}
                className="segment-select"
                aria-label="Heure de fin"
              >
                {TIME_OPTIONS.map((t) => (
                  <option key={`end-${t}`} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Bouton d'ajout */}
            <button
              type="button"
              onClick={handleAddSlot}
              className="segment-add-btn"
              disabled={slotStart >= slotEnd}
            >
              <Plus size={14} />
              <span>Ajouter</span>
            </button>

          </div>
        </div>

        {/* LISTE DES CRÉNEAUX ACTIFS SANS TITRE */}
        <div className="avail-slots-wrapper">
          {slots.length === 0 ? (
            <div className="avail-slots-empty-box">
              <Clock size={16} color="#9CA3AF" />
              <span>Aucune plage horaire configurée.</span>
            </div>
          ) : (
            <div className="segment-slots-grid">
              {slots.map((s) => (
                <div key={s.id} className="segment-slot-card">
                  <span className="slot-hours-text">{s.start} — {s.end}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSlot(s.id)}
                    className="slot-delete-btn"
                    title="Supprimer cette plage"
                    aria-label="Supprimer ce créneau"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>



    </div>
  );

  return (
    <>
      {/* ========================================================================= */}
      {/* VERSION DESKTOP (> 1024px) : CARTE DANS LE FLUX AVEC COMPORTEMENT COLLAPSIBLE */}
      {/* ========================================================================= */}
      <div className={`particulier-avail-card desktop-only ${isCollapsed ? 'is-collapsed' : ''}`}>
        
        {/* Header cliquable pour plier/déplier */}
        <div 
          className="particulier-avail-header"
          onClick={() => setIsCollapsed(!isCollapsed)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsCollapsed(!isCollapsed)}
          aria-expanded={!isCollapsed}
        >
          <div className="particulier-avail-title-row">
            <div className="particulier-avail-title-wrap">
              <Calendar size={18} color="var(--primary-red)" />
              <h3 className="particulier-avail-title">Disponibilités pour les visites</h3>
            </div>

            <div className="particulier-avail-header-actions" onClick={(e) => e.stopPropagation()}>
              {savedFeedback && (
                <span className="particulier-sync-badge">
                  <Sparkles size={12} />
                  <span>Enregistré</span>
                </span>
              )}

              <span className="particulier-status-pill">
                {activeDaysCount > 0 && activeSlotsCount > 0 
                  ? `${activeDaysCount} jours • ${activeSlotsCount} créneau${activeSlotsCount > 1 ? 'x' : ''}` 
                  : 'Non configuré'}
              </span>

              {/* Bouton chevron pliable */}
              <button 
                type="button" 
                className="particulier-collapse-toggle-btn"
                onClick={() => setIsCollapsed(!isCollapsed)}
                title={isCollapsed ? "Déplier les disponibilités" : "Replier les disponibilités"}
                aria-label={isCollapsed ? "Déplier" : "Replier"}
              >
                {isCollapsed ? <ChevronDown size={17} /> : <ChevronUp size={17} />}
              </button>
            </div>
          </div>

          {/* Bandeau de résumé visible UNIQUEMENT quand la carte est repliée */}
          {isCollapsed ? (
            <div className="avail-collapsed-summary">
              <div className="collapsed-slots-chips">
                {slots.slice(0, 3).map(s => (
                  <span key={s.id} className="collapsed-chip">
                    {s.start} — {s.end}
                  </span>
                ))}
                {slots.length > 3 && (
                  <span className="collapsed-chip-more">+{slots.length - 3}</span>
                )}
                {slots.length === 0 && (
                  <span className="collapsed-empty-text">Aucun créneau configuré. Cliquez pour paramétrer vos visites.</span>
                )}
              </div>
              <span className="collapsed-action-hint">Cliquer pour modifier</span>
            </div>
          ) : (
            <p className="particulier-avail-desc">
              Définissez vos jours et vos plages horaires d'accueil habituels pour vos annonces.
            </p>
          )}
        </div>

        {/* Corps déplié */}
        {!isCollapsed && renderAvailabilityContent()}

      </div>

      {/* ========================================================================= */}
      {/* VERSION MOBILE (< 1024px) : ONGLET LATÉRAL ANCRÉ AU MILIEU À DROITE + TIROIR */}
      {/* ========================================================================= */}
      
      {/* Onglet latéral agrandi fixé à mi-hauteur sur le bord droit (opacité 80%) */}
      <button
        type="button"
        className="particulier-mobile-edge-tab mobile-only"
        onClick={() => setIsMobileDrawerOpen(true)}
        aria-label="Gérer mes disponibilités de visite"
        title="Disponibilités des visites"
      >
        <div className="edge-tab-icon-wrap">
          <CalendarCheck size={32} />
          {activeSlotsCount > 0 && <span className="edge-tab-badge-dot" />}
        </div>
      </button>

      {/* Tiroir latéral glissant depuis la droite (Drawer Sheet via Portal) */}
      {isMobileDrawerOpen && createPortal(
        <div 
          className="particulier-drawer-overlay mobile-only"
          onClick={() => setIsMobileDrawerOpen(false)}
        >
          <div 
            className="particulier-drawer-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="particulier-drawer-header">
              <div className="drawer-title-box">
                <Calendar size={18} color="var(--primary-red)" />
                <h3 className="drawer-title">Disponibilités pour les visites</h3>
              </div>
              <button 
                type="button"
                className="drawer-close-btn"
                onClick={() => setIsMobileDrawerOpen(false)}
                title="Fermer le panneau"
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="particulier-drawer-body">
              {renderAvailabilityContent()}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* STYLES ARCHITECTURAUX VANILLA CSS SCOPED                                 */}
      {/* ========================================================================= */}
      <style>{`
        /* 1. CARTE PRINCIPALE DESKTOP */
        .particulier-avail-card {
          background: #FFFFFF;
          border-radius: 8px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          padding: 20px 24px;
          margin-bottom: 24px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
          box-sizing: border-box;
          transition: all 0.2s ease;
        }
        .particulier-avail-card.is-collapsed {
          padding: 14px 20px;
        }

        .particulier-avail-header {
          cursor: pointer;
          user-select: none;
        }
        .particulier-avail-card:not(.is-collapsed) .particulier-avail-header {
          margin-bottom: 18px;
          border-bottom: 1px solid #F0F2F5;
          padding-bottom: 14px;
        }

        .particulier-avail-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .particulier-avail-title-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .particulier-avail-title {
          font-family: var(--font-heading, sans-serif);
          font-size: 1.05rem;
          font-weight: 700;
          color: #1A1A1A;
          margin: 0;
          line-height: 1.25;
        }

        .particulier-avail-header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .particulier-sync-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.72rem;
          font-weight: 600;
          color: #059669;
          background: rgba(5, 150, 105, 0.08);
          border: 1px solid rgba(5, 150, 105, 0.2);
          padding: 2px 8px;
          border-radius: 4px;
          animation: fadeIn 0.15s ease-out;
        }

        .particulier-status-pill {
          font-size: 0.72rem;
          font-weight: 600;
          color: #555555;
          background: #F8F9FA;
          border: 1px solid #E5E7EB;
          padding: 3px 9px;
          border-radius: 4px;
        }

        .particulier-collapse-toggle-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 4px;
          border: 1px solid #E5E7EB;
          background: #FAFAFA;
          color: #555555;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .particulier-collapse-toggle-btn:hover {
          background: #1A1A1A;
          color: #FFFFFF;
          border-color: #1A1A1A;
        }

        .particulier-avail-desc {
          font-size: 0.8125rem;
          color: #555555;
          margin: 6px 0 0 0;
          line-height: 1.45;
        }

        /* BANDEAU RÉSUMÉ QUAND REPLIÉ */
        .avail-collapsed-summary {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px dashed #E5E7EB;
          gap: 12px;
          flex-wrap: wrap;
        }
        .collapsed-slots-chips {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }
        .collapsed-chip {
          font-size: 0.74rem;
          font-weight: 700;
          color: #1A1A1A;
          background: #F8F9FA;
          border: 1px solid #E5E7EB;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .collapsed-chip-more {
          font-size: 0.7rem;
          font-weight: 600;
          color: #555555;
          background: #FAFAFA;
          border: 1px solid #E5E7EB;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .collapsed-empty-text {
          font-size: 0.75rem;
          color: #737373;
          font-style: italic;
        }
        .collapsed-action-hint {
          font-size: 0.72rem;
          font-weight: 600;
          color: #737373;
          text-decoration: underline;
        }

        /* 2. JOURS D'ACCUEIL */
        .avail-section {
          margin-bottom: 22px;
        }

        .avail-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 10px;
        }

        .avail-section-label {
          display: block;
          font-size: 0.72rem;
          font-weight: 700;
          color: #1A1A1A;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .avail-section-sub {
          display: block;
          font-size: 0.75rem;
          color: #737373;
          margin-top: 2px;
        }

        .avail-day-presets {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .avail-preset-link {
          background: transparent;
          border: none;
          padding: 0;
          font-size: 0.72rem;
          font-weight: 600;
          color: #555555;
          cursor: pointer;
          transition: color 0.15s ease;
        }
        .avail-preset-link:hover {
          color: #1A1A1A;
          text-decoration: underline;
        }

        .avail-preset-sep {
          font-size: 0.65rem;
          color: #CCCCCC;
        }

        .avail-days-row {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 8px;
        }

        .avail-day-btn {
          height: 42px;
          border-radius: 6px;
          border: 1px solid #E5E7EB;
          background: #FAFAFA;
          color: #555555;
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 4px 6px;
        }
        .avail-day-btn:hover {
          border-color: #1A1A1A;
          color: #1A1A1A;
          background: #FFFFFF;
        }
        .avail-day-btn.active {
          background: #1A1A1A;
          border-color: #1A1A1A;
          color: #FFFFFF;
        }

        .day-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: transparent;
        }
        .avail-day-btn.active .day-dot {
          background: #FFFFFF;
        }

        .day-name-full {
          display: inline;
        }
        .day-name-short {
          display: none;
        }

        /* 3. CHOIX DIRECT D'HORAIRE */
        .segment-builder-card {
          background: #F8F9FA;
          border: 1px solid #E5E7EB;
          border-radius: 6px;
          padding: 10px 14px;
          margin-top: 6px;
        }

        .segment-builder-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .segment-select-box {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 6px;
          padding: 4px 10px;
          height: 38px;
          box-sizing: border-box;
        }

        .segment-select {
          border: none;
          background: transparent;
          font-size: 0.88rem;
          font-weight: 700;
          color: #1A1A1A;
          outline: none;
          cursor: pointer;
          font-family: inherit;
        }

        .segment-separator-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .segment-add-btn {
          margin-left: auto;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #1A1A1A;
          color: #FFFFFF;
          border: none;
          padding: 0 16px;
          border-radius: 6px;
          font-size: 0.8125rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s ease;
          height: 38px;
          box-sizing: border-box;
        }
        .segment-add-btn:hover:not(:disabled) {
          background: #000000;
        }
        .segment-add-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        /* 4. LISTE DES PLAGES SANS TITRE */
        .avail-slots-wrapper {
          margin-top: 14px;
        }

        .avail-slots-empty-box {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          background: #FAFAFA;
          border: 1px dashed #E5E7EB;
          border-radius: 6px;
          font-size: 0.78rem;
          color: #737373;
        }

        .segment-slots-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .segment-slot-card {
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 6px;
          padding: 8px 12px;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
          transition: all 0.15s ease;
        }
        .segment-slot-card:hover {
          border-color: rgba(0, 0, 0, 0.22);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
        }

        .slot-hours-text {
          font-size: 0.88rem;
          font-weight: 800;
          color: #1A1A1A;
          letter-spacing: -0.2px;
        }

        .slot-delete-btn {
          background: transparent;
          border: none;
          color: #9CA3AF;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          border-radius: 3px;
          transition: all 0.15s ease;
        }
        .slot-delete-btn:hover {
          color: var(--primary-red);
          background: #FEE2E2;
        }

        /* 5. FOOTER SANS BANDEAU DE DURÉE */
        .avail-card-footer {
          margin-top: 18px;
          padding-top: 14px;
          border-top: 1px solid #F0F2F5;
        }

        .avail-reassurance-box {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.74rem;
          color: #166534;
          background: #F0FDF4;
          border: 1px solid #DCFCE7;
          padding: 6px 12px;
          border-radius: 4px;
          line-height: 1.4;
        }

        /* 6. EXPÉRIENCE MOBILE — TIROIR LATÉRAL DROIT (DRAWER) */
        .mobile-only {
          display: none !important;
        }

        @media (max-width: 1024px) {
          /* Masquer la carte intégrée dans le flux de la page */
          .desktop-only {
            display: none !important;
          }

          .mobile-only {
            display: flex !important;
          }

          /* Bouton déclencheur vertical fixé au bord droit à mi-hauteur */
          .particulier-mobile-edge-tab {
            position: fixed;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            z-index: 990;
            background: #1A1A1A;
            opacity: 0.75;
            color: #FFFFFF;
            border: 1px solid rgba(255, 255, 255, 0.25);
            border-right: none;
            border-radius: 10px 0 0 10px;
            padding: 13px 12px 13px 15px;
            min-width: 48px;
            min-height: 48px;
            cursor: pointer;
            box-shadow: -4px 0 20px rgba(0, 0, 0, 0.28);
            display: flex !important;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
          }
          .particulier-mobile-edge-tab:hover,
          .particulier-mobile-edge-tab:active {
            transform: translateY(-50%) translateX(-2px);
            opacity: 1;
            background: #000000;
          }

          .edge-tab-icon-wrap {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .edge-tab-badge-dot {
            position: absolute;
            top: -3px;
            right: -4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--primary-red);
            border: 1.5px solid #1A1A1A;
          }

          /* Tiroir latéral (Overlay + Sheet) */
          .particulier-drawer-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
            z-index: 2500;
            display: flex !important;
            justify-content: flex-end;
          }

          .particulier-drawer-panel {
            width: 90vw;
            max-width: 440px;
            height: 100%;
            background: #FFFFFF;
            box-shadow: -8px 0 30px rgba(0, 0, 0, 0.2);
            display: flex;
            flex-direction: column;
            animation: slideInFromRight 0.22s ease-out;
            position: relative;
            z-index: 2501;
          }

          .particulier-drawer-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 18px;
            border-bottom: 1px solid #E5E7EB;
            background: #FAFAFA;
            flex-shrink: 0;
          }

          .drawer-title-box {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .drawer-title {
            font-family: var(--font-heading, sans-serif);
            font-size: 1rem;
            font-weight: 700;
            color: #1A1A1A;
            margin: 0;
          }

          .drawer-close-btn {
            background: transparent;
            border: none;
            color: #555555;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .drawer-close-btn:hover {
            color: var(--primary-red);
            background: rgba(0, 0, 0, 0.04);
          }

          .particulier-drawer-body {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            padding-bottom: calc(24px + env(safe-area-inset-bottom, 0px));
          }

          /* Adapter les jours dans le tiroir */
          .avail-days-row {
            grid-template-columns: repeat(4, 1fr);
            gap: 6px;
          }

          .day-name-full {
            display: none;
          }
          .day-name-short {
            display: inline;
          }

          .segment-builder-row {
            flex-direction: row;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
          }

          .segment-select-box {
            flex: 1;
            min-width: 105px;
          }

          .segment-separator-arrow {
            display: flex;
          }

          .segment-add-btn {
            margin-left: 0;
            margin-top: 6px;
            width: 100%;
            justify-content: center;
          }
        }

        @keyframes slideInFromRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(2px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default ParticulierAvailabilityCard;
