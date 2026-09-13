import React from 'react';
import { Eye, Image, CalendarCheck, CheckCircle2, ArrowDown } from 'lucide-react';

const FUNNEL_STEPS = [
  {
    id: 'views',
    label: "Vues de l'annonce",
    sub: "Impressions dans le flux de recherche Habitoo",
    count: 14820,
    percentage: 100,
    retentionFromPrev: null,
    icon: Eye,
    color: '#1A1A1A'
  },
  {
    id: 'details',
    label: "Consultations fiches et photos HD",
    sub: "Fiches détaillées ouvertes et galeries explorées",
    count: 5631,
    percentage: 38.0,
    retentionFromPrev: '38.0%',
    icon: Image,
    color: '#3B3B3B'
  },
  {
    id: 'requests',
    label: "Demandes de visite déposées",
    sub: "Dossiers vérifiés avec date sélectionnée",
    count: 918,
    percentage: 6.2,
    retentionFromPrev: '16.3%',
    icon: CalendarCheck,
    color: '#D60000'
  },
  {
    id: 'completed',
    label: "Visites physiques confirmées",
    sub: "Rendez-vous validés et honorés sur site",
    count: 355,
    percentage: 2.4,
    retentionFromPrev: '38.7%',
    icon: CheckCircle2,
    color: '#F70000'
  }
];

export const FunnelChart = () => {
  return (
    <div className="habitoo-dash-card habitoo-dash-funnel-card">
      <div className="habitoo-dash-card__header">
        <div className="habitoo-dash-card__title-group">
          <h3 className="habitoo-dash-card__title">Entonnoir de Conversion</h3>
          <p className="habitoo-dash-card__subtitle">
            Du premier clic d'acquéreur jusqu'à la visite sur site
          </p>
        </div>
        <span className="habitoo-dash-funnel-global-rate">
          <strong>2.4%</strong> conv. globale
        </span>
      </div>

      <div className="habitoo-dash-funnel-body">
        {FUNNEL_STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isLast = idx === FUNNEL_STEPS.length - 1;

          return (
            <div key={step.id} className="habitoo-dash-funnel-step">
              <div className="habitoo-dash-funnel-step__top">
                <div className="habitoo-dash-funnel-step__info">
                  <div className="habitoo-dash-funnel-step__icon-wrap">
                    <Icon size={14} className="habitoo-dash-funnel-step__icon" />
                  </div>
                  <div>
                    <h4 className="habitoo-dash-funnel-step__name">{step.label}</h4>
                    <span className="habitoo-dash-funnel-step__sub">{step.sub}</span>
                  </div>
                </div>

                <div className="habitoo-dash-funnel-step__metrics">
                  <span className="habitoo-dash-funnel-step__count">
                    {step.count.toLocaleString('fr-FR')}
                  </span>
                  <span className="habitoo-dash-funnel-step__percent">
                    {step.percentage}%
                  </span>
                </div>
              </div>

              {/* Barre de progression fluide */}
              <div className="habitoo-dash-funnel-bar-track">
                <div
                  className="habitoo-dash-funnel-bar-fill"
                  style={{
                    width: `${Math.max(step.percentage, 4)}%`,
                    backgroundColor: step.color
                  }}
                />
              </div>

              {/* Rétention entre étapes */}
              {!isLast && (
                <div className="habitoo-dash-funnel-connector">
                  <div className="habitoo-dash-funnel-connector__line" />
                  <span className="habitoo-dash-funnel-connector__badge">
                    <ArrowDown size={10} /> Rétention : {FUNNEL_STEPS[idx + 1].retentionFromPrev}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
