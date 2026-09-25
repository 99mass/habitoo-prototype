import React from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  GraduationCap,
  UserCheck,
  Settings,
  X,
  User,
  Building2,
  ShieldCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

const MORE_ITEMS = [
  { id: 'credits', label: 'Crédits Boost', desc: 'Acheter des crédits de visibilité', icon: Zap, tab: 'credits' },
  { id: 'academy', label: 'Habitoo Académie', desc: 'Formations PRO terrain & déontologie', icon: GraduationCap, tab: 'academy', personaOnly: 'demarcheur' },
  { id: 'profile', label: 'Profil Professionnel', desc: 'Photo, coordonnées & agrément', icon: UserCheck, tab: 'profile' },
  { id: 'settings', label: 'Paramètres & Sécurité', desc: 'Mot de passe, alertes & sessions', icon: Settings, tab: 'settings' }
];

export const ProMoreDrawer = ({
  isOpen,
  onClose,
  onSelectTab,
  persona = 'demarcheur',
  onPersonaChange,
  userProfile,
  credits = 45
}) => {
  if (!isOpen) return null;

  const visibleItems = MORE_ITEMS.filter(
    item => !item.personaOnly || item.personaOnly === persona
  );

  const handleItemTap = (item) => {
    onSelectTab && onSelectTab(item.tab);
    onClose && onClose();
  };

  const profile = userProfile || {
    name: 'Jean-Marc Kouassi',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  };

  const badgeText = persona === 'agence' ? 'Agence Certifiée PRO' : 'Démarcheur Agréé PRO';

  return (
    <div className="pro-more-overlay" onClick={onClose}>
      <div
        className="pro-more-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête du tiroir */}
        <div className="pro-more-header">
          <h3 className="pro-more-header__title">Menu</h3>
          <button
            type="button"
            className="pro-more-close-btn"
            onClick={onClose}
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Corps du tiroir */}
        <div className="pro-more-body">

          {/* Carte profil empilée verticalement */}
          <div className="pro-more-profile-card">
            <div className="pro-more-profile-card__top">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="pro-more-profile-card__avatar"
              />
              <div className="pro-more-profile-card__info">
                <span className="pro-more-profile-card__name">{profile.name}</span>
                <span className="pro-more-profile-card__badge">
                  <ShieldCheck size={11} />
                  {badgeText}
                </span>
              </div>
            </div>

            <div className="pro-more-profile-card__credits-row">
              <div className="pro-more-profile-card__credits">
                <Zap size={13} className="pro-more-profile-card__credits-icon" />
                <strong>{credits}</strong>
                <span>crédits disponibles</span>
              </div>
            </div>
          </div>

          {/* Commutateur Persona Démo */}
          <div className="pro-more-persona-switcher">
            <button
              type="button"
              className={`pro-more-persona-btn ${persona === 'demarcheur' ? 'pro-more-persona-btn--active' : ''}`}
              onClick={() => onPersonaChange && onPersonaChange('demarcheur')}
            >
              <User size={13} />
              <span>Démarcheur</span>
            </button>
            <button
              type="button"
              className={`pro-more-persona-btn ${persona === 'agence' ? 'pro-more-persona-btn--active' : ''}`}
              onClick={() => onPersonaChange && onPersonaChange('agence')}
            >
              <Building2 size={13} />
              <span>Agence</span>
            </button>
          </div>

          {/* Bouton Vitrine style desktop pleine largeur */}
          <div className="pro-more-vitrine-wrapper">
            <Link
              to={persona === 'agence' ? '/vitrine/agence-ivoire' : '/vitrine/demarcheur-kouassi'}
              className="habitoo-dash-btn-ghost pro-more-vitrine-btn-desktop"
              onClick={onClose}
              title="Consulter ma vitrine publique (nouvel onglet)"
            >
              <ExternalLink size={14} />
              <span>Ma vitrine</span>
            </Link>
          </div>

          {/* Liste des entrées */}
          <div className="pro-more-menu-list">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  className="pro-more-menu-item"
                  onClick={() => handleItemTap(item)}
                >
                  <div className="pro-more-menu-item__icon-wrap">
                    <Icon size={18} strokeWidth={1.8} />
                  </div>
                  <div className="pro-more-menu-item__text">
                    <span className="pro-more-menu-item__label">{item.label}</span>
                    <span className="pro-more-menu-item__desc">{item.desc}</span>
                  </div>
                  <ChevronRight size={16} className="pro-more-menu-item__chevron" />
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};
