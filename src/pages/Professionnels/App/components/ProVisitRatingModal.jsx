import React, { useEffect } from 'react';
import { MessageSquareText, Star, X } from 'lucide-react';

export const ProVisitRatingModal = ({ visit, onClose }) => {
  useEffect(() => {
    if (!visit) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visit, onClose]);

  if (!visit?.rating) return null;

  const { rating } = visit;
  const hasComment = Boolean(rating.comment?.trim());

  return (
    <div className="habitoo-dash-modal-overlay" onClick={onClose}>
      <div
        className="habitoo-dash-modal pro-visit-rating-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pro-visit-rating-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="habitoo-dash-modal__close pro-visit-rating-modal__close"
          onClick={onClose}
          aria-label="Fermer la note"
        >
          <X size={18} />
        </button>

        <div className="pro-visit-rating-modal__header">
          <div className="pro-visit-rating-modal__icon">
            <Star size={20} fill="currentColor" />
          </div>
          <div>
            <p className="pro-visit-rating-modal__eyebrow">Évaluation reçue</p>
            <h3 id="pro-visit-rating-title" className="pro-visit-rating-modal__title">
              Note de la visite
            </h3>
          </div>
        </div>

        <p className="pro-visit-rating-modal__property">{visit.property}</p>
        <p className="pro-visit-rating-modal__meta">{visit.client} · {visit.date}</p>

        <div className="pro-visit-rating-modal__score" aria-label={`Note de ${rating.score} sur 5`}>
          <div className="pro-visit-rating-modal__stars" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((value) => (
              <Star key={value} size={22} fill={value <= rating.score ? 'currentColor' : 'none'} />
            ))}
          </div>
          <strong>{rating.score}/5</strong>
        </div>

        <div className="pro-visit-rating-modal__comment">
          <div className="pro-visit-rating-modal__comment-title">
            <MessageSquareText size={16} />
            <span>Commentaire</span>
          </div>
          <p className={hasComment ? '' : 'pro-visit-rating-modal__comment--empty'}>
            {hasComment ? rating.comment : 'Aucun commentaire n’a été laissé pour cette évaluation.'}
          </p>
        </div>

        <div className="pro-visit-rating-modal__footer">
          <button type="button" className="habitoo-dash-btn-ghost" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
