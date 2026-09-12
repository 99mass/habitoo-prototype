import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const ProFinalCta = () => {
  return (
    <section className="habitoo-pro-final-section">
      {/* 32px Blurred Background Image */}
      <div className="habitoo-pro-final-bg-layer" />
      
      {/* Dark Luxury Overlay */}
      <div className="habitoo-pro-final-overlay" />

      {/* Content Container */}
      <div className="habitoo-pro-container" style={{ position: 'relative', zIndex: 3 }}>
        <div className="habitoo-pro-final-card">
          
          <h2 className="habitoo-pro-final-title">
            Prêt à valoriser vos mandats et développer votre activité ?
          </h2>
          
          <p className="habitoo-pro-final-lead">
            Rejoignez dès aujourd'hui les démarcheurs et agences de référence certifiés 
            par Habitoo en Côte d'Ivoire, RDC et Congo.
          </p>
          
          <div className="habitoo-pro-final-actions">
            <Link 
              to="/pro/inscription" 
              className="habitoo-pro-btn-primary habitoo-pro-btn-large"
            >
              <span>Rejoindre Habitoo PRO</span>
              <ArrowRight size={18} />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};
