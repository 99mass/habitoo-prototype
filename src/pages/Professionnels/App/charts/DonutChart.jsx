import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

const SECTORS_DATA = [
  { id: 'riviera', name: 'Riviera Golf', city: 'Abidjan', percentage: 42, color: '#F70000', leads: 622 },
  { id: 'cocody', name: 'Cocody Ambassades', city: 'Abidjan', percentage: 28, color: '#1A1A1A', leads: 414 },
  { id: 'ngaliema', name: 'Ngaliema', city: 'Kinshasa', percentage: 18, color: '#555555', leads: 266 },
  { id: 'mpila', name: 'Mpila', city: 'Brazzaville', percentage: 12, color: '#888888', leads: 178 }
];

export const DonutChart = () => {
  const [hoveredSector, setHoveredSector] = useState(null);

  // Géométrie du Donut
  const size = 220;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  // Calcul des offsets cumulés pour stroke-dasharray / stroke-dashoffset
  let accumulatedPercent = 0;
  const sectorsWithOffsets = SECTORS_DATA.map((sec) => {
    const strokeDasharray = `${(sec.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += sec.percentage;
    return { ...sec, strokeDasharray, strokeDashoffset };
  });

  const activeSector = hoveredSector 
    ? SECTORS_DATA.find(s => s.id === hoveredSector) 
    : SECTORS_DATA[0]; // Leader par défaut (Riviera Golf 42%)

  return (
    <div className="habitoo-dash-card habitoo-dash-donut-card">
      <div className="habitoo-dash-card__header">
        <div className="habitoo-dash-card__title-group">
          <h3 className="habitoo-dash-card__title">Demande par Secteur Géographique</h3>
          <p className="habitoo-dash-card__subtitle">
            Localisation des acquéreurs et locataires qualifiés
          </p>
        </div>
      </div>

      <div className="habitoo-dash-donut-layout">
        {/* Visualisation Donut SVG pure */}
        <div className="habitoo-dash-donut-canvas-wrap">
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="habitoo-dash-donut-svg"
          >
            {/* Cercle de fond discret */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#F0F0F0"
              strokeWidth={strokeWidth}
            />

            {/* Segments SVG */}
            {sectorsWithOffsets.map((sec) => {
              const isHovered = hoveredSector === sec.id;
              return (
                <circle
                  key={sec.id}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={sec.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={sec.strokeDasharray}
                  strokeDashoffset={sec.strokeDashoffset}
                  strokeLinecap="butt"
                  transform={`rotate(-90 ${center} ${center})`}
                  className="habitoo-dash-donut-segment"
                  onMouseEnter={() => setHoveredSector(sec.id)}
                  onMouseLeave={() => setHoveredSector(null)}
                />
              );
            })}
          </svg>

          {/* Centre dynamique du Donut */}
          <div className="habitoo-dash-donut-center">
            <span className="habitoo-dash-donut-center__label">
              {hoveredSector ? 'Sélectionné' : 'Quartier Leader'}
            </span>
            <strong className="habitoo-dash-donut-center__val">
              {activeSector.percentage}%
            </strong>
            <span className="habitoo-dash-donut-center__name">
              {activeSector.name}
            </span>
          </div>
        </div>

        {/* Légende interactive sectorielle */}
        <div className="habitoo-dash-donut-legend">
          {SECTORS_DATA.map((sec) => {
            const isHovered = hoveredSector === sec.id;
            return (
              <div
                key={sec.id}
                className={`habitoo-dash-donut-legend__item ${isHovered ? 'habitoo-dash-donut-legend__item--active' : ''}`}
                onMouseEnter={() => setHoveredSector(sec.id)}
                onMouseLeave={() => setHoveredSector(null)}
              >
                <div className="habitoo-dash-donut-legend__left">
                  <span
                    className="habitoo-dash-donut-legend__dot"
                    style={{ backgroundColor: sec.color }}
                  />
                  <div>
                    <h4 className="habitoo-dash-donut-legend__name">{sec.name}</h4>
                    <span className="habitoo-dash-donut-legend__city">
                      <MapPin size={11} /> {sec.city}
                    </span>
                  </div>
                </div>

                <div className="habitoo-dash-donut-legend__right">
                  <strong className="habitoo-dash-donut-legend__percent">{sec.percentage}%</strong>
                  <span className="habitoo-dash-donut-legend__leads">{sec.leads} prospects</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
