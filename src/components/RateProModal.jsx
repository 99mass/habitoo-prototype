import React, { useState, useEffect } from 'react';
import { X, Star, Check, ShieldCheck, User } from 'lucide-react';

export const RateProModal = ({
  isOpen,
  onClose,
  visit,
  onSaveRating
}) => {
  const [globalScore, setGlobalScore] = useState(5);
  const [hoverGlobal, setHoverGlobal] = useState(0);
  const [punctuality, setPunctuality] = useState(5);
  const [professionalism, setProfessionalism] = useState(5);
  const [compliance, setCompliance] = useState(5);
  const [comment, setComment] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (visit?.rating) {
      setGlobalScore(visit.rating.score || 5);
      setPunctuality(visit.rating.criteria?.punctuality || 5);
      setProfessionalism(visit.rating.criteria?.professionalism || 5);
      setCompliance(visit.rating.criteria?.compliance || 5);
      setComment(visit.rating.comment || '');
    } else {
      setGlobalScore(5);
      setPunctuality(5);
      setProfessionalism(5);
      setCompliance(5);
      setComment('');
    }
    setIsSuccess(false);
  }, [visit, isOpen]);

  if (!isOpen || !visit) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const ratingData = {
      score: globalScore,
      criteria: {
        punctuality,
        professionalism,
        compliance
      },
      comment: comment.trim()
    };

    onSaveRating(visit.id, ratingData);
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  const renderStarSelector = (score, setScore) => {
    return (
      <div className="rate-stars-selector">
        {[1, 2, 3, 4, 5].map((val) => (
          <button
            key={val}
            type="button"
            className="rate-star-btn"
            onClick={() => setScore(val)}
            aria-label={`Note de ${val} sur 5`}
          >
            <Star
              size={18}
              fill={val <= score ? "#D97706" : "none"}
              color={val <= score ? "#D97706" : "#D1D5DB"}
              strokeWidth={val <= score ? 0 : 1.5}
            />
          </button>
        ))}
        <span className="rate-star-val-text">{score}/5</span>
      </div>
    );
  };

  return (
    <div className="rate-pro-modal-overlay" onClick={onClose}>
      <div className="rate-pro-modal-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button
          type="button"
          className="rate-pro-close-btn"
          onClick={onClose}
          aria-label="Fermer"
        >
          <X size={16} />
        </button>

        {isSuccess ? (
          <div className="rate-pro-success-state">
            <div className="rate-pro-success-icon">
              <Check size={26} strokeWidth={2.5} />
            </div>
            <h3 className="rate-pro-success-title">Évaluation enregistrée</h3>
            <p className="rate-pro-success-desc">
              Merci pour votre retour. Votre évaluation a été associée à la visite de « {visit.propertyTitle} ».
            </p>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="rate-pro-header">
              <h2 className="rate-pro-title">Évaluer votre expérience</h2>
              <div className="rate-pro-meta">
                <span className="rate-pro-agent-name">
                  <User size={13} />
                  <span>{visit.agentName}</span>
                  {visit.agentAgency && <span className="rate-pro-agency">• {visit.agentAgency}</span>}
                </span>
                <span className="rate-pro-property">{visit.propertyTitle}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Note Globale */}
              <div className="rate-pro-global-section">
                <label className="rate-pro-label">Appréciation générale :</label>
                <div className="rate-pro-large-stars">
                  {[1, 2, 3, 4, 5].map((starVal) => {
                    const activeVal = hoverGlobal || globalScore;
                    return (
                      <button
                        key={starVal}
                        type="button"
                        className="rate-large-star-btn"
                        onMouseEnter={() => setHoverGlobal(starVal)}
                        onMouseLeave={() => setHoverGlobal(0)}
                        onClick={() => setGlobalScore(starVal)}
                        aria-label={`Attribuer ${starVal} étoiles`}
                      >
                        <Star
                          size={28}
                          fill={starVal <= activeVal ? "#D97706" : "none"}
                          color={starVal <= activeVal ? "#D97706" : "#D1D5DB"}
                          strokeWidth={starVal <= activeVal ? 0 : 1.5}
                        />
                      </button>
                    );
                  })}
                  <span className="rate-pro-global-display">{globalScore}/5</span>
                </div>
              </div>

              {/* Critères Détaillés */}
              <div className="rate-pro-criteria-card">
                <span className="rate-pro-criteria-title">Critères d'évaluation :</span>

                <div className="rate-pro-criterion-row">
                  <span className="rate-criterion-name">Ponctualité</span>
                  {renderStarSelector(punctuality, setPunctuality)}
                </div>

                <div className="rate-pro-criterion-row">
                  <span className="rate-criterion-name">Professionnalisme</span>
                  {renderStarSelector(professionalism, setProfessionalism)}
                </div>

                <div className="rate-pro-criterion-row">
                  <span className="rate-criterion-name">Conformité du bien</span>
                  {renderStarSelector(compliance, setCompliance)}
                </div>
              </div>

              {/* Champ Commentaire */}
              <div className="rate-pro-comment-section">
                <label className="rate-pro-label" htmlFor="rate-comment">
                  Commentaire ou remarques (facultatif) :
                </label>
                <textarea
                  id="rate-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Partagez votre retour sur la visite..."
                  className="rate-pro-textarea"
                  rows={3}
                />
              </div>

              {/* Footer */}
              <div className="rate-pro-footer">
                <button type="submit" className="rate-pro-submit-btn">
                  <span>Enregistrer mon évaluation</span>
                </button>
                <div className="rate-pro-trust-note">
                  <ShieldCheck size={13} color="#16a34a" />
                  <span>Évaluation certifiée et vérifiée par Habitoo.</span>
                </div>
              </div>
            </form>
          </div>
        )}

      </div>

      <style>{`
        .rate-pro-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(17, 24, 39, 0.7);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 16px;
          animation: fadeIn 0.15s ease-out;
        }
        .rate-pro-modal-card {
          background: #FFFFFF;
          border-radius: 8px;
          width: 100%;
          max-width: 500px;
          max-height: 92vh;
          overflow-y: auto;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
          border: 1px solid rgba(0, 0, 0, 0.08);
          position: relative;
          padding: 24px 24px 20px;
        }
        .rate-pro-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: #F3F4F6;
          border: none;
          color: #4B5563;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .rate-pro-close-btn:hover {
          background: #E5E7EB;
          color: #111827;
        }
        .rate-pro-header {
          margin-bottom: 16px;
          padding-right: 28px;
        }
        .rate-pro-badge {
          display: inline-block;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #D97706;
          background: #FEF3C7;
          border: 1px solid #FDE68A;
          padding: 2px 8px;
          border-radius: 4px;
          margin-bottom: 6px;
        }
        .rate-pro-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #111827;
          margin: 0 0 6px 0;
        }
        .rate-pro-meta {
          display: flex;
          flex-direction: column;
          gap: 3px;
          font-size: 0.8rem;
          color: #4B5563;
        }
        .rate-pro-agent-name {
          display: flex;
          align-items: center;
          gap: 5px;
          font-weight: 600;
          color: #111827;
        }
        .rate-pro-agency {
          color: #6B7280;
          font-weight: 400;
        }
        .rate-pro-property {
          color: #6B7280;
          font-size: 0.76rem;
        }
        .rate-pro-global-section {
          background: #F9FAFB;
          border: 1px solid #E5E7EB;
          border-radius: 6px;
          padding: 12px 14px;
          margin-bottom: 14px;
          text-align: center;
        }
        .rate-pro-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #111827;
          margin-bottom: 8px;
        }
        .rate-pro-large-stars {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .rate-large-star-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.1s ease;
        }
        .rate-large-star-btn:hover {
          transform: scale(1.1);
        }
        .rate-pro-global-display {
          font-size: 1.05rem;
          font-weight: 700;
          color: #111827;
          margin-left: 8px;
          min-width: 32px;
        }
        .rate-pro-criteria-card {
          border: 1px solid #E5E7EB;
          border-radius: 6px;
          padding: 12px 14px;
          margin-bottom: 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .rate-pro-criteria-title {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #6B7280;
          margin-bottom: 2px;
        }
        .rate-pro-criterion-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 4px 0;
          border-bottom: 1px solid #F3F4F6;
        }
        .rate-pro-criterion-row:last-child {
          border-bottom: none;
        }
        .rate-criterion-name {
          font-size: 0.8rem;
          font-weight: 600;
          color: #111827;
        }
        .rate-stars-selector {
          display: flex;
          align-items: center;
          gap: 3px;
        }
        .rate-star-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .rate-star-val-text {
          font-size: 0.75rem;
          font-weight: 600;
          color: #4B5563;
          margin-left: 6px;
          min-width: 24px;
        }
        .rate-pro-comment-section {
          margin-bottom: 16px;
        }
        .rate-pro-textarea {
          width: 100%;
          border: 1px solid #E5E7EB;
          border-radius: 6px;
          padding: 8px 10px;
          font-size: 0.82rem;
          color: #111827;
          outline: none;
          font-family: inherit;
          resize: vertical;
          box-sizing: border-box;
          transition: border-color 0.15s ease;
        }
        .rate-pro-textarea:focus {
          border-color: #111827;
        }
        .rate-pro-footer {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .rate-pro-submit-btn {
          width: 100%;
          height: 42px;
          background: #111827;
          color: #FFFFFF;
          border: none;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s ease;
        }
        .rate-pro-submit-btn:hover {
          background: var(--primary-red, #F70000);
        }
        .rate-pro-trust-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          font-size: 0.72rem;
          color: #6B7280;
        }
        .rate-pro-success-state {
          padding: 24px 8px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .rate-pro-success-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #16a34a;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .rate-pro-success-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }
        .rate-pro-success-desc {
          font-size: 0.82rem;
          color: #4B5563;
          margin: 0;
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
};

export default RateProModal;
