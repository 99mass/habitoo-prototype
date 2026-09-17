import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, X, Sparkles, ShieldCheck } from 'lucide-react';

const INITIAL_SLOTS = [
  { id: 'slot-1', start: '09:00', end: '12:00' }
];

const DEFAULT_DAYS = [
  { key: 'lun', label: 'Lun', active: true },
  { key: 'mar', label: 'Mar', active: true },
  { key: 'mer', label: 'Mer', active: true },
  { key: 'jeu', label: 'Jeu', active: true },
  { key: 'ven', label: 'Ven', active: true },
  { key: 'sam', label: 'Sam', active: true },
  { key: 'dim', label: 'Dim', active: false }
];

export const ParticulierAvailabilityCard = () => {
  const [days, setDays] = useState(() => {
    try {
      const saved = localStorage.getItem('habitoo_user_avail_days');
      return saved ? JSON.parse(saved) : DEFAULT_DAYS;
    } catch {
      return DEFAULT_DAYS;
    }
  });

  const [slots, setSlots] = useState(() => {
    try {
      const saved = localStorage.getItem('habitoo_user_avail_slots');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].start) {
          return parsed;
        }
      }
      return INITIAL_SLOTS;
    } catch {
      return INITIAL_SLOTS;
    }
  });

  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('17:00');
  const [duration, setDuration] = useState(() => {
    return localStorage.getItem('habitoo_user_avail_duration') || '45';
  });

  const [savedFeedback, setSavedFeedback] = useState(false);

  useEffect(() => {
    localStorage.setItem('habitoo_user_avail_days', JSON.stringify(days));
  }, [days]);

  useEffect(() => {
    localStorage.setItem('habitoo_user_avail_slots', JSON.stringify(slots));
  }, [slots]);

  useEffect(() => {
    localStorage.setItem('habitoo_user_avail_duration', duration);
  }, [duration]);

  const triggerSaveFeedback = () => {
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const toggleDay = (key) => {
    setDays(prev => prev.map(d => d.key === key ? { ...d, active: !d.active } : d));
    triggerSaveFeedback();
  };

  const handleAddSlot = (e) => {
    e.preventDefault();
    if (!startTime || !endTime) return;
    if (startTime >= endTime) {
      alert("L'heure de début doit être antérieure à l'heure de fin.");
      return;
    }

    const exists = slots.some(s => s.start === startTime && s.end === endTime);
    if (exists) return;

    const newSlot = {
      id: `slot-${Date.now()}`,
      start: startTime,
      end: endTime
    };

    setSlots(prev => [...prev, newSlot].sort((a, b) => a.start.localeCompare(b.start)));
    triggerSaveFeedback();
  };

  const handleRemoveSlot = (id) => {
    setSlots(prev => prev.filter(s => s.id !== id));
    triggerSaveFeedback();
  };

  const handleDurationChange = (mins) => {
    setDuration(mins);
    triggerSaveFeedback();
  };

  return (
    <div className="particulier-avail-card">
      <div className="particulier-avail-header">
        <div className="particulier-avail-title-row">
          <h3 className="particulier-avail-title">
            <Calendar size={18} color="var(--primary-red)" />
            <span>Disponibilités pour les visites</span>
          </h3>
          {savedFeedback && (
            <span className="particulier-avail-sync-badge">
              <Sparkles size={11} /> Synchronisé
            </span>
          )}
        </div>
        <p className="particulier-avail-desc">
          Définissez vos jours et vos horaires d'accueil habituels pour vos annonces.
        </p>
      </div>

      <div className="particulier-avail-body">
        {/* Jours ouverts */}
        <div className="particulier-avail-section">
          <label className="particulier-avail-label">Jours disponibles :</label>
          <div className="particulier-days-row">
            {days.map((d) => (
              <button
                key={d.key}
                type="button"
                onClick={() => toggleDay(d.key)}
                className={`particulier-day-btn ${d.active ? 'active' : ''}`}
                aria-pressed={d.active}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Créneaux horaires personnalisés */}
        <div className="particulier-avail-section">
          <label className="particulier-avail-label">Créneaux horaires personnalisés :</label>

          {/* Formulaire d'ajout de créneau */}
          <form onSubmit={handleAddSlot} className="particulier-add-slot-form">
            <div className="particulier-time-input-group">
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="particulier-time-field"
                required
              />
              <span className="particulier-time-sep">à</span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="particulier-time-field"
                required
              />
            </div>
            <button type="submit" className="particulier-add-slot-btn">
              <Plus size={15} />
              <span>Ajouter</span>
            </button>
          </form>

          {/* Liste des créneaux actifs */}
          <div className="particulier-custom-slots-wrap">
            {slots.length === 0 ? (
              <span className="particulier-slots-empty">
                Aucun créneau configuré. Ajoutez une plage horaire ci-dessus.
              </span>
            ) : (
              <div className="particulier-custom-slots-list">
                {slots.map((s) => (
                  <div key={s.id} className="particulier-custom-slot-pill">
                    <Clock size={13} color="var(--primary-red)" />
                    <span className="particulier-slot-hours">{s.start} - {s.end}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSlot(s.id)}
                      className="particulier-slot-del-btn"
                      aria-label="Supprimer ce créneau"
                      title="Supprimer ce créneau"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Durée estimée par visite */}
        <div className="particulier-avail-footer">
          <div className="particulier-duration-picker">
            <span className="particulier-duration-label">
              <Clock size={13} color="var(--graphite-gray)" /> Durée estimée :
            </span>
            <div className="particulier-duration-opts">
              {['30', '45', '60'].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => handleDurationChange(mins)}
                  className={`particulier-duration-btn ${duration === mins ? 'active' : ''}`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .particulier-avail-card {
          background: #FFFFFF;
          border-radius: var(--radius-card, 16px);
          border: 1px solid var(--border-color, #E5E7EB);
          padding: 20px 22px;
          margin-bottom: 24px;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
        }
        .particulier-avail-header {
          margin-bottom: 16px;
          border-bottom: 1px solid var(--border-light, #F3F4F6);
          padding-bottom: 12px;
        }
        .particulier-avail-title-row {
          display: flex;
          align-items: center;
          justifyContent: space-between;
          flex-wrap: wrap;
          gap: 10px;
        }
        .particulier-avail-title {
          font-family: var(--font-heading, sans-serif);
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--obsidian-black, #111827);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .particulier-avail-sync-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.72rem;
          font-weight: 700;
          color: #16a34a;
          background: rgba(22, 163, 74, 0.1);
          border: 1px solid rgba(22, 163, 74, 0.22);
          padding: 2px 8px;
          border-radius: 999px;
          animation: fadeIn 0.2s ease-out;
        }
        .particulier-avail-desc {
          font-size: 0.8rem;
          color: var(--graphite-gray, #6B7280);
          margin: 4px 0 0 0;
        }
        .particulier-avail-section {
          margin-bottom: 16px;
        }
        .particulier-avail-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--obsidian-black, #111827);
          text-transform: uppercase;
          letter-spacing: 0.4px;
          margin-bottom: 8px;
        }
        .particulier-days-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .particulier-day-btn {
          min-width: 42px;
          height: 36px;
          border-radius: 8px;
          border: 1px solid var(--border-color, #E5E7EB);
          background: var(--bg-main, #F9FAFB);
          color: var(--graphite-gray, #6B7280);
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .particulier-day-btn:hover {
          border-color: var(--primary-red, #F70000);
          color: var(--primary-red, #F70000);
        }
        .particulier-day-btn.active {
          background: var(--primary-red, #F70000);
          border-color: var(--primary-red, #F70000);
          color: #FFFFFF;
          box-shadow: 0 2px 8px rgba(247, 0, 0, 0.25);
        }

        /* Formulaire d'ajout de créneau */
        .particulier-add-slot-form {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }
        .particulier-time-input-group {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--bg-main, #F9FAFB);
          border: 1px solid var(--border-color, #E5E7EB);
          padding: 4px 10px;
          border-radius: 8px;
        }
        .particulier-time-field {
          border: none;
          background: transparent;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--obsidian-black, #111827);
          outline: none;
          font-family: inherit;
        }
        .particulier-time-sep {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--graphite-gray, #6B7280);
        }
        .particulier-add-slot-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 7px 14px;
          border-radius: 8px;
          background: var(--obsidian-black, #111827);
          color: #FFFFFF;
          border: none;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .particulier-add-slot-btn:hover {
          background: var(--primary-red, #F70000);
        }

        /* Liste des créneaux personnalisés */
        .particulier-custom-slots-wrap {
          min-height: 38px;
        }
        .particulier-slots-empty {
          font-size: 0.78rem;
          color: var(--graphite-gray, #9CA3AF);
          font-style: italic;
        }
        .particulier-custom-slots-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .particulier-custom-slot-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 6px 12px;
          border-radius: 8px;
          border: 1px solid var(--border-color, #E5E7EB);
          background: #FFFFFF;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          transition: border-color 0.15s ease;
        }
        .particulier-custom-slot-pill:hover {
          border-color: #CBD5E1;
        }
        .particulier-slot-hours {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--obsidian-black, #111827);
        }
        .particulier-slot-del-btn {
          background: transparent;
          border: none;
          color: var(--graphite-gray, #9CA3AF);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          border-radius: 4px;
          transition: all 0.15s ease;
        }
        .particulier-slot-del-btn:hover {
          background: #FEE2E2;
          color: var(--primary-red, #EF4444);
        }

        .particulier-avail-footer {
          display: flex;
          align-items: center;
          justifyContent: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 16px;
          padding-top: 12px;
          border-top: 1px dashed var(--border-color, #E5E7EB);
        }
        .particulier-duration-picker {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .particulier-duration-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--obsidian-black, #111827);
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .particulier-duration-opts {
          display: flex;
          gap: 6px;
        }
        .particulier-duration-btn {
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid var(--border-color, #E5E7EB);
          background: #FFFFFF;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--obsidian-black, #111827);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .particulier-duration-btn.active {
          background: var(--obsidian-black, #111827);
          border-color: var(--obsidian-black, #111827);
          color: #FFFFFF;
        }
        .particulier-trust-note {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.74rem;
          color: #16a34a;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default ParticulierAvailabilityCard;
