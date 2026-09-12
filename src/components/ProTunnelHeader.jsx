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
        <div className="habitoo-tunnel-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link 
            to="/pro/app/dashboard" 
            className="habitoo-tunnel-proto-btn"
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              background: '#1A1A1A', 
              color: '#FFFFFF', 
              fontSize: '0.78rem', 
              fontWeight: '700', 
              padding: '6px 12px', 
              borderRadius: '6px', 
              textDecoration: 'none' 
            }}
            title="Accès direct Dashboard PRO (Démo prototypage)"
          >
            <LayoutDashboard size={13} />
            <span>Dashboard PRO</span>
          </Link>

          <Link to="/professionnels" className="habitoo-tunnel-exit-link">
            <ArrowLeft size={15} />
            <span>Quitter</span>
          </Link>
        </div>

      </div>
    </header>
  );
};

export default ProTunnelHeader;
