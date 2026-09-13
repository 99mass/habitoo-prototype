import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Plus, 
  ShieldCheck, 
  Building2, 
  User 
} from 'lucide-react';

export const ProTopHeader = ({ 
  persona = 'demarcheur', 
  onPersonaChange, 
  credits = 45, 
  onOpenCreditsModal,
  userProfile
}) => {
  // Profil par défaut selon le persona, surchargeable par userProfile
  const defaultProfile = persona === 'agence' ? {
    name: 'Ivoire Prestige Conseil',
    badgeText: 'Agence Certifiée PRO',
    badgeClass: 'habitoo-dash-badge--agency',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80'
  } : {
    name: 'Jean-Marc Kouassi',
    badgeText: 'Démarcheur Agréé PRO',
    badgeClass: 'habitoo-dash-badge--broker',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
  };

  const profile = {
    ...defaultProfile,
    ...(userProfile || {})
  };

  return (
    <header className="habitoo-dash-top-header">
      <div className="habitoo-dash-top-header__container">
        
        {/* Section Gauche : Logo Noir Habitoo + Badge PRO */}
        <div className="habitoo-dash-top-header__left">
          <Link to="/professionnels" className="habitoo-dash-logo" title="Retour au portail Habitoo">
            <img 
              src="/assets/Code_Generated_Image (3).png" 
              alt="Habitoo PRO" 
              className="habitoo-dash-logo-img"
            />
            <span className="habitoo-dash-logo__tag">PRO</span>
          </Link>
        </div>

        {/* Section Droite : Commutateur Persona démo, Crédits et Profil */}
        <div className="habitoo-dash-top-header__right">
          
          {/* Commutateur Persona Démo (Démarcheur vs Agence) */}
          <div className="habitoo-dash-persona-switcher" title="Basculez entre les vues pour tester l'interface">
            <button
              type="button"
              className={`habitoo-dash-persona-btn ${persona === 'demarcheur' ? 'habitoo-dash-persona-btn--active' : ''}`}
              onClick={() => onPersonaChange && onPersonaChange('demarcheur')}
            >
              <User size={12} />
              <span>Démarcheur</span>
            </button>
            <button
              type="button"
              className={`habitoo-dash-persona-btn ${persona === 'agence' ? 'habitoo-dash-persona-btn--active' : ''}`}
              onClick={() => onPersonaChange && onPersonaChange('agence')}
            >
              <Building2 size={12} />
              <span>Agence</span>
            </button>
          </div>

          <div className="habitoo-dash-divider-v" />

          {/* Widget Solde Crédits Boost */}
          <div className="habitoo-dash-credits-widget">
            <div className="habitoo-dash-credits-info">
              <span className="habitoo-dash-credits-label">Crédits Boost</span>
              <div className="habitoo-dash-credits-amount">
                <Zap size={13} className="habitoo-dash-credits-icon" />
                <strong>{credits}</strong>
              </div>
            </div>
            <button
              type="button"
              className="habitoo-dash-btn-add-credits"
              onClick={onOpenCreditsModal}
              title="Acheter des crédits de visibilité"
            >
              <Plus size={12} />
              <span>Crédits</span>
            </button>
          </div>

          <div className="habitoo-dash-divider-v" />

          {/* Carte Profil Agent avec Badge PRO officiel (sans sous-titre de fonction) */}
          <div className="habitoo-dash-agent-card">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="habitoo-dash-agent-avatar"
            />
            <div className="habitoo-dash-agent-meta">
              <div className="habitoo-dash-agent-name-row">
                <span className="habitoo-dash-agent-name">{profile.name}</span>
                <span className={`habitoo-dash-badge ${profile.badgeClass}`}>
                  <ShieldCheck size={11} /> {profile.badgeText}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
