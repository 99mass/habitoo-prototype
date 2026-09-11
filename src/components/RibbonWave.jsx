import React from 'react';

export const RibbonWave = ({ className = "", style = {}, inverted = false, opacity = 0.08 }) => {
  return (
    <div
      className={`ribbon-wave-container ${className}`}
      style={{
        position: 'absolute',
        width: '100%',
        overflow: 'hidden',
        lineHeight: 0,
        pointerEvents: 'none',
        zIndex: 0,
        ...style
      }}
    >
      <svg
        viewBox="0 0 1440 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          transform: inverted ? 'scaleY(-1)' : 'none'
        }}
      >
        <path
          d="M0,96L48,112C96,128,192,160,288,154.7C384,149,480,107,576,106.7C672,107,768,149,864,165.3C960,181,1056,171,1152,144C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          fill="#F70000"
          fillOpacity={opacity}
        />
        <path
          d="M0,160L48,144C96,128,192,96,288,112C384,128,480,192,576,192C672,192,768,128,864,117.3C960,107,1056,149,1152,165.3C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          fill="#1A1A1A"
          fillOpacity={opacity * 0.7}
        />
      </svg>
    </div>
  );
};
