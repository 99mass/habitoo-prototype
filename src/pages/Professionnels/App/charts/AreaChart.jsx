import React, { useState, useRef } from 'react';
import { Calendar } from 'lucide-react';

// Données temporelles réalistes pour les 3 périodes
const DATA_PERIODS = {
  '7j': [
    { label: 'Lun', date: '08 Sept', views: 1840, visits: 42 },
    { label: 'Mar', date: '09 Sept', views: 2190, visits: 48 },
    { label: 'Mer', date: '10 Sept', views: 1980, visits: 39 },
    { label: 'Jeu', date: '11 Sept', views: 2450, visits: 56 },
    { label: 'Ven', date: '12 Sept', views: 2890, visits: 68 },
    { label: 'Sam', date: '13 Sept', views: 3410, visits: 82 },
    { label: 'Dim', date: 'Aujourd\'hui', views: 3220, visits: 74 }
  ],
  '30j': [
    { label: 'S1', date: '18-24 Août', views: 9800, visits: 210 },
    { label: 'S2', date: '25-31 Août', views: 11400, visits: 265 },
    { label: 'S3', date: '01-07 Sept', views: 13200, visits: 298 },
    { label: 'S4', date: '08-14 Sept', views: 14820, visits: 342 }
  ],
  '90j': [
    { label: 'Juil', date: 'Juillet 2025', views: 31200, visits: 720 },
    { label: 'Août', date: 'Août 2025', views: 38900, visits: 890 },
    { label: 'Sept', date: 'Septembre 2025', views: 44600, visits: 1045 }
  ]
};

// Algorithme d'interpolation de Bézier cubique pour courbe spline C1 ultra-lisse
const computeBezierPaths = (points, chartHeight) => {
  if (!points || points.length === 0) return { linePath: '', areaPath: '' };

  const linePath = points.reduce((acc, point, i, arr) => {
    if (i === 0) return `M ${point.x},${point.y}`;
    const prev = arr[i - 1];
    const prevPrev = arr[i - 2] || prev;
    const next = arr[i + 1] || point;
    const tension = 0.22; // Facteur de lissage subtil

    const cp1x = prev.x + (point.x - prevPrev.x) * tension;
    const cp1y = prev.y + (point.y - prevPrev.y) * tension;
    const cp2x = point.x - (next.x - prev.x) * tension;
    const cp2y = point.y - (next.y - prev.y) * tension;

    return `${acc} C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${point.x.toFixed(1)},${point.y.toFixed(1)}`;
  }, '');

  const first = points[0];
  const last = points[points.length - 1];
  const areaPath = `${linePath} L ${last.x},${chartHeight} L ${first.x},${chartHeight} Z`;

  return { linePath, areaPath };
};

export const AreaChart = () => {
  const [period, setPeriod] = useState('7j');
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const containerRef = useRef(null);

  const data = DATA_PERIODS[period];

  // Dimensions internes SVG
  const width = 680;
  const height = 280;
  const padding = { top: 28, right: 30, bottom: 42, left: 55 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // Échelles min / max
  const maxViews = Math.max(...data.map(d => d.views)) * 1.15;
  const maxVisits = Math.max(...data.map(d => d.visits)) * 1.25;

  // Coordonnées projetées
  const viewsPoints = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * chartW;
    const y = padding.top + chartH - (d.views / maxViews) * chartH;
    return { x, y, val: d.views };
  });

  const visitsPoints = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * chartW;
    const y = padding.top + chartH - (d.visits / maxVisits) * chartH;
    return { x, y, val: d.visits };
  });

  const viewsPaths = computeBezierPaths(viewsPoints, padding.top + chartH);
  const visitsPaths = computeBezierPaths(visitsPoints, padding.top + chartH);

  // Lignes de repère horizontales discrètes
  const gridSteps = 4;
  const gridY = Array.from({ length: gridSteps + 1 }, (_, i) => padding.top + (chartH / gridSteps) * i);

  // Gestion de la souris pour le curseur dynamique
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const ratio = mouseX / rect.width;
    const svgX = ratio * width;

    // Trouver le point le plus proche
    let closest = 0;
    let minDist = Infinity;
    viewsPoints.forEach((pt, i) => {
      const dist = Math.abs(pt.x - svgX);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    setHoveredIdx(closest);
  };

  const handleMouseLeave = () => {
    setHoveredIdx(null);
  };

  const activeItem = hoveredIdx !== null ? data[hoveredIdx] : null;
  const activeViewsPt = hoveredIdx !== null ? viewsPoints[hoveredIdx] : null;
  const activeVisitsPt = hoveredIdx !== null ? visitsPoints[hoveredIdx] : null;

  return (
    <div className="habitoo-dash-card habitoo-dash-chart-card">
      {/* En-tête du graphique avec titre sobre & sélecteur temporel */}
      <div className="habitoo-dash-card__header">
        <div className="habitoo-dash-card__title-group">
          <h3 className="habitoo-dash-card__title">Audience & Demandes de Visite</h3>
          <p className="habitoo-dash-card__subtitle">
            Flux de consultations d'annonces mis en corrélation avec les demandes de visites avec caution
          </p>
        </div>

        <div className="habitoo-dash-period-toggle">
          {['7j', '30j', '90j'].map((p) => (
            <button
              key={p}
              type="button"
              className={`habitoo-dash-period-btn ${period === p ? 'habitoo-dash-period-btn--active' : ''}`}
              onClick={() => {
                setPeriod(p);
                setHoveredIdx(null);
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Légende interactive épurée */}
      <div className="habitoo-dash-chart-legend">
        <div className="habitoo-dash-chart-legend__item">
          <span className="habitoo-dash-chart-legend__dot habitoo-dash-chart-legend__dot--views" />
          <span className="habitoo-dash-chart-legend__name">Vues d'annonces</span>
          <strong className="habitoo-dash-chart-legend__value">
            {activeItem ? activeItem.views.toLocaleString('fr-FR') : data[data.length - 1].views.toLocaleString('fr-FR')}
          </strong>
        </div>
        <div className="habitoo-dash-chart-legend__item">
          <span className="habitoo-dash-chart-legend__dot habitoo-dash-chart-legend__dot--visits" />
          <span className="habitoo-dash-chart-legend__name">Demandes de visite qualifiées</span>
          <strong className="habitoo-dash-chart-legend__value habitoo-dash-chart-legend__value--red">
            {activeItem ? activeItem.visits.toLocaleString('fr-FR') : data[data.length - 1].visits.toLocaleString('fr-FR')}
          </strong>
        </div>
      </div>

      {/* Zone SVG interactive */}
      <div
        className="habitoo-dash-chart-canvas-wrapper"
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="habitoo-dash-svg-chart"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Dégradé anthracite épuré pour les vues */}
            <linearGradient id="areaViewsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1A1A1A" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#1A1A1A" stopOpacity="0.00" />
            </linearGradient>

            {/* Dégradé rouge signature pour les demandes de visite */}
            <linearGradient id="areaVisitsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F70000" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#F70000" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Lignes de grille horizontales 1px discrètes */}
          {gridY.map((y, idx) => (
            <line
              key={idx}
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke="#EDEDED"
              strokeDasharray="3 3"
              strokeWidth="1"
            />
          ))}

          {/* Surfaces avec dégradés */}
          <path d={viewsPaths.areaPath} fill="url(#areaViewsGrad)" />
          <path d={visitsPaths.areaPath} fill="url(#areaVisitsGrad)" />

          {/* Courbes de Bézier cubiques lissées */}
          <path
            d={viewsPaths.linePath}
            fill="none"
            stroke="#2B2B2B"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d={visitsPaths.linePath}
            fill="none"
            stroke="#F70000"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Axe X étiquettes */}
          {data.map((d, i) => {
            const x = viewsPoints[i].x;
            const isHovered = hoveredIdx === i;
            return (
              <text
                key={i}
                x={x}
                y={height - 12}
                textAnchor="middle"
                className={`habitoo-dash-chart-axis-label ${isHovered ? 'habitoo-dash-chart-axis-label--active' : ''}`}
              >
                {d.label}
              </text>
            );
          })}

          {/* Curseur vertical et points interactifs au survol */}
          {hoveredIdx !== null && activeViewsPt && activeVisitsPt && (
            <g className="habitoo-dash-chart-cursor-group">
              <line
                x1={activeViewsPt.x}
                y1={padding.top}
                x2={activeViewsPt.x}
                y2={padding.top + chartH}
                stroke="#1A1A1A"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <circle
                cx={activeViewsPt.x}
                cy={activeViewsPt.y}
                r="5"
                fill="#FFFFFF"
                stroke="#1A1A1A"
                strokeWidth="2.5"
              />
              <circle
                cx={activeVisitsPt.x}
                cy={activeVisitsPt.y}
                r="5"
                fill="#FFFFFF"
                stroke="#F70000"
                strokeWidth="2.5"
              />
            </g>
          )}
        </svg>

        {/* Tooltip flottant de précision ancré sur la position de données */}
        {hoveredIdx !== null && activeItem && activeViewsPt && (
          <div
            className="habitoo-dash-chart-tooltip"
            style={{
              left: `${(activeViewsPt.x / width) * 100}%`,
              transform: activeViewsPt.x > width * 0.75 
                ? 'translateX(-100%) translateY(-100%)' 
                : 'translateX(0) translateY(-100%)'
            }}
          >
            <div className="habitoo-dash-chart-tooltip__date">
              <Calendar size={11} /> {activeItem.date}
            </div>
            <div className="habitoo-dash-chart-tooltip__row">
              <span className="habitoo-dash-chart-tooltip__label">Vues de biens :</span>
              <strong className="habitoo-dash-chart-tooltip__val">
                {activeItem.views.toLocaleString('fr-FR')}
              </strong>
            </div>
            <div className="habitoo-dash-chart-tooltip__row">
              <span className="habitoo-dash-chart-tooltip__label">Demandes de visite :</span>
              <strong className="habitoo-dash-chart-tooltip__val habitoo-dash-chart-tooltip__val--red">
                {activeItem.visits.toLocaleString('fr-FR')}
              </strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
