import React from 'react';
import { Zap, Eye, MapPin, CheckCircle, Flame } from 'lucide-react';

const TOP_PROPERTIES = [
  {
    id: 'prop-1',
    title: "Villa Signature 'Le Belvédère'",
    district: "Riviera Golf, Cocody",
    price: "4 500 000 FCFA/mois",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=300&q=80",
    status: "BOOSTED",
    statusLabel: "Boostée Active",
    views: "5 420",
    leads: "142",
    engagementScore: 94
  },
  {
    id: 'prop-2',
    title: "Penthouse Panoramique 'Laguna Sky'",
    district: "Plateau, Abidjan",
    price: "850 000 000 FCFA",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=300&q=80",
    status: "ACTIVE",
    statusLabel: "En ligne",
    views: "4 110",
    leads: "98",
    engagementScore: 82
  },
  {
    id: 'prop-3',
    title: "Manoir Contemporain 'Les Baobabs'",
    district: "Ngaliema, Kinshasa",
    price: "6 000 000 FCFA/mois",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80",
    status: "ACTIVE",
    statusLabel: "En ligne",
    views: "3 890",
    leads: "76",
    engagementScore: 78
  }
];

export const TopPropertiesTable = ({ onOpenBoost }) => {
  return (
    <div className="habitoo-dash-card habitoo-dash-top-props-card">
      <div className="habitoo-dash-card__header">
        <div className="habitoo-dash-card__title-group">
          <h3 className="habitoo-dash-card__title">Top Annonces et Popularité</h3>
          <p className="habitoo-dash-card__subtitle">
            Biens générant le plus fort taux d'engagement cette semaine
          </p>
        </div>
        <span className="habitoo-dash-top-props-badge">
          3 annonces phares
        </span>
      </div>

      <div className="habitoo-dash-top-props-list">
        {TOP_PROPERTIES.map((prop) => (
          <div key={prop.id} className="habitoo-dash-top-prop-item">
            {/* Miniature et statut */}
            <div className="habitoo-dash-top-prop-item__media">
              <img src={prop.image} alt={prop.title} className="habitoo-dash-top-prop-item__img" />
              <span className={`habitoo-dash-top-prop-item__tag habitoo-dash-top-prop-item__tag--${prop.status.toLowerCase()}`}>
                {prop.status === 'BOOSTED' ? <Flame size={10} /> : <CheckCircle size={10} />}
                {prop.statusLabel}
              </span>
            </div>

            {/* Infos du bien */}
            <div className="habitoo-dash-top-prop-item__details">
              <h4 className="habitoo-dash-top-prop-item__title">{prop.title}</h4>
              <div className="habitoo-dash-top-prop-item__meta">
                <span className="habitoo-dash-top-prop-item__loc">
                  <MapPin size={11} /> {prop.district}
                </span>
                <span className="habitoo-dash-top-prop-item__price">{prop.price}</span>
              </div>
            </div>

            {/* Jauge d'engagement */}
            <div className="habitoo-dash-top-prop-item__score-col">
              <div className="habitoo-dash-top-prop-item__score-head">
                <span className="habitoo-dash-top-prop-item__score-label">Score d'engagement</span>
                <strong className="habitoo-dash-top-prop-item__score-val">{prop.engagementScore}/100</strong>
              </div>
              <div className="habitoo-dash-top-prop-item__score-bar">
                <div
                  className="habitoo-dash-top-prop-item__score-fill"
                  style={{ width: `${prop.engagementScore}%` }}
                />
              </div>
              <div className="habitoo-dash-top-prop-item__stats-row">
                <span><Eye size={11} /> {prop.views} vues</span>
                <span>{prop.leads} demandes</span>
              </div>
            </div>

            {/* Bouton d'action Booster */}
            <div className="habitoo-dash-top-prop-item__action-col">
              <button
                type="button"
                className={`habitoo-dash-btn-boost ${prop.status === 'BOOSTED' ? 'habitoo-dash-btn-boost--active' : ''}`}
                onClick={() => onOpenBoost && onOpenBoost(prop)}
              >
                <Zap size={13} />
                <span>{prop.status === 'BOOSTED' ? 'Boost Actif' : 'Booster'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
