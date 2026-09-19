import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, LayoutDashboard } from 'lucide-react';

export const ProTunnelHeader = () => {
  return (
    <header className="habitoo-tunnel-header">
      <div className="habitoo-tunnel-header-inner">
        
        {/* Logo Habitoo PRO */}
        <div className="habitoo-tunnel-brand">
          <Link to="/professionnels" className="habitoo-tunnel-brand-link" title="Retour à l'espace professionnel">
            <img 
              src="/assets/Code_Generated_Image (1).png" 
              alt="Habitoo" 
              className="habitoo-tunnel-logo"
            />
            <span className="habitoo-tunnel-badge">PRO</span>
          </Link>
        </div>

        {/* Action: Exit / Cancel Tunnel & Direct Dashboard Proto Link */}
        <div className="habitoo-tunnel-actions">
          <Link 
            to="/pro/app/dashboard" 
            className="habitoo-tunnel-proto-btn"
            title="Accès direct Dashboard PRO (Démo prototypage)"
          >
            <LayoutDashboard size={14} />
            <span className="habitoo-tunnel-proto-btn-text">Dashboard PRO</span>
          </Link>

          <Link to="/professionnels" className="habitoo-tunnel-exit-link" title="Quitter le tunnel">
            <ArrowLeft size={15} />
            <span>Quitter</span>
          </Link>
        </div>

      </div>
    </header>
  );
};

export default ProTunnelHeader;
