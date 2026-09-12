import React from 'react';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

export const MetricSparkCard = ({
  title,
  value,
  badge,
  badgeType = 'positive', // 'positive' | 'neutral' | 'red'
  subtitle,
  sparkPoints = [],
  strokeColor = '#059669',
  fillGradientId = 'sparkGradGreen',
  actionLabel,
  onAction
}) => {
  // Générer le tracé SVG sparkline si des points sont fournis
  const sparkWidth = 110;
  const sparkHeight = 36;

  let sparkLine = '';
  let sparkArea = '';

  if (sparkPoints.length > 1) {
    const minVal = Math.min(...sparkPoints);
    const maxVal = Math.max(...sparkPoints);
    const range = maxVal - minVal || 1;

    const coords = sparkPoints.map((val, idx) => {
      const x = (idx / (sparkPoints.length - 1)) * sparkWidth;
      const y = sparkHeight - 4 - ((val - minVal) / range) * (sparkHeight - 8);
      return { x, y };
    });

    sparkLine = coords.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`, '');
    sparkArea = `${sparkLine} L ${sparkWidth},${sparkHeight} L 0,${sparkHeight} Z`;
  }

  return (
    <div className="habitoo-dash-metric-card">
      <div className="habitoo-dash-metric-card__top">
        <span className="habitoo-dash-metric-card__title">{title}</span>
        {badge && (
          <span className={`habitoo-dash-metric-card__badge habitoo-dash-metric-card__badge--${badgeType}`}>
            <ArrowUpRight size={12} /> {badge}
          </span>
        )}
      </div>

      <div className="habitoo-dash-metric-card__middle">
        <div className="habitoo-dash-metric-card__val-wrap">
          <strong className="habitoo-dash-metric-card__val">{value}</strong>
        </div>

        {/* Micro sparkline SVG intégrée */}
        {sparkPoints.length > 1 && (
          <div className="habitoo-dash-metric-card__spark-wrap">
            <svg
              width={sparkWidth}
              height={sparkHeight}
              viewBox={`0 0 ${sparkWidth} ${sparkHeight}`}
              className="habitoo-dash-metric-card__spark-svg"
            >
              <defs>
                <linearGradient id={fillGradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={strokeColor} stopOpacity="0.22" />
                  <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d={sparkArea} fill={`url(#${fillGradientId})`} />
              <path d={sparkLine} fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>

      <div className="habitoo-dash-metric-card__bottom">
        <span className="habitoo-dash-metric-card__sub">{subtitle}</span>
        {actionLabel && (
          <button type="button" className="habitoo-dash-metric-card__action" onClick={onAction}>
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};
