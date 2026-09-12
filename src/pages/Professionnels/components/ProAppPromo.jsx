import React from 'react';

export const ProAppPromo = () => {
  return (
    <section className="section-mobile-app">
      <div className="habitoo-pro-container">
        <div className="mobile-app-banner">
          
          {/* Left: Text Info */}
          <div className="mobile-app-content">
            <span className="mobile-app-tag">
              Habitoo partout avec vous
            </span>
            <h2 className="mobile-app-title">
              Bientôt sur mobile
            </h2>
            <p className="mobile-app-desc">
              Accédez à vos annonces, recevez des alertes en direct pour chaque demande de visite et pilotez vos mandats où que vous soyez.
            </p>
          </div>

          {/* Right: Dual iPhone Mockups with Habitoo App */}
          <div className="mobile-app-visual">
            <img 
              src="/assets/mobile-app-mockup.png" 
              alt="Habitoo sur mobile - Restez connecté à vos projets !" 
              className="mobile-app-mockup-img"
            />
          </div>

        </div>
      </div>
    </section>
  );
};
