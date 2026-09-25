import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  CalendarCheck, 
  Wallet, 
  UserCheck, 
  Settings,
  Plus,
  Zap,
  ShieldCheck,
  Briefcase,
  ExternalLink
} from 'lucide-react';

export const ProAgencySidebar = ({
  activeTab = 'overview',
  onSelectTab,
  propertyCount = 6,
  visitCount = 2,
  credits = 45,
  onOpenCreditsModal,
  userProfile
}) => {
  const agencyName = userProfile?.name || 'Ivoire Prestige Conseil';
  const agencyAvatar = userProfile?.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80';

  const NAV_ITEMS = [
    { id: 'overview', label: "Vue d'ensemble", icon: LayoutDashboard },
    { id: 'properties', label: "Mes Annonces", icon: Building2, badge: String(propertyCount) },
    { id: 'visits', label: "Mes Visites", icon: CalendarCheck, badge: String(visitCount) },
    { id: 'revenue', label: "Revenus", icon: Wallet },
    { id: 'profile', label: "Profil Agence", icon: UserCheck },
    { id: 'settings', label: "Paramètres", icon: Settings }
  ];

  return (
    <aside className="habitoo-agency-sidebar" aria-label="Menu latéral Agence">
      
      {/* 1. Header Sidebar : Logo Habitoo PRO */}
      <div className="habitoo-agency-sidebar__header">
        <Link to="/professionnels" className="habitoo-agency-sidebar__logo" title="Retour au portail Habitoo">
          <img
            src="/assets/Code_Generated_Image (3).png"
            alt="Habitoo PRO"
            className="habitoo-agency-sidebar__logo-img"
          />
          <span className="habitoo-agency-sidebar__pro-tag">PRO</span>
        </Link>
      </div>

      {/* 2. Badge d'Agence Agréée */}
      <div className="habitoo-agency-sidebar__agency-box">
        <div className="habitoo-agency-sidebar__agency-avatar-wrap">
          <img 
            src={agencyAvatar} 
            alt={agencyName}
            className="habitoo-agency-sidebar__agency-avatar" 
          />
        </div>
        <div className="habitoo-agency-sidebar__agency-info">
          <strong className="habitoo-agency-sidebar__agency-name" title={agencyName}>
            {agencyName}
          </strong>
          <div className="habitoo-agency-sidebar__agency-badge">
            <ShieldCheck size={11} />
            <span>Agence Agréée</span>
          </div>
        </div>
      </div>

      {/* 3. Action Rapide Prioritaire */}
      <div className="habitoo-agency-sidebar__cta-wrap">
        <button
          type="button"
          onClick={() => onSelectTab('properties', { action: 'new' })}
          className="habitoo-agency-sidebar__btn-new-property"
        >
          <Plus size={15} strokeWidth={2.2} />
          <span>Nouveau mandat</span>
        </button>
      </div>

      {/* 4. Menu de navigation principal */}
      <nav className="habitoo-agency-sidebar__nav">
        <div className="habitoo-agency-sidebar__nav-section-title">Navigation Agence</div>
        <ul className="habitoo-agency-sidebar__nav-list">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (item.id === 'profile' && activeTab === 'reputation');

            return (
              <li key={item.id} className="habitoo-agency-sidebar__nav-li">
                <button
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  className={`habitoo-agency-sidebar__nav-btn ${isActive ? 'habitoo-agency-sidebar__nav-btn--active' : ''}`}
                >
                  <Icon size={16} strokeWidth={isActive ? 2.2 : 1.7} className="habitoo-agency-sidebar__nav-icon" />
                  <span className="habitoo-agency-sidebar__nav-label">{item.label}</span>

                  {item.badge && (
                    <span className={`habitoo-agency-sidebar__nav-badge ${isActive ? 'habitoo-agency-sidebar__nav-badge--active' : ''}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}

          {/* Lien direct Vitrine Publique */}
          <li className="habitoo-agency-sidebar__nav-li" style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(0, 0, 0, 0.06)' }}>
            <Link
              to="/vitrine/agence-ivoire"
              className="habitoo-agency-sidebar__nav-btn"
              style={{ textDecoration: 'none' }}
              title="Ouvrir la vitrine publique de l'agence dans un nouvel onglet"
            >
              <ExternalLink size={15} className="habitoo-agency-sidebar__nav-icon" />
              <span className="habitoo-agency-sidebar__nav-label">Vitrine publique</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* 5. Widget Crédits Boost Agence */}
      <div className="habitoo-agency-sidebar__credits-card">
        <div className="habitoo-agency-sidebar__credits-top">
          <div className="habitoo-agency-sidebar__credits-icon-wrap">
            <Zap size={14} />
          </div>
          <div>
            <span className="habitoo-agency-sidebar__credits-title">Crédits Boost</span>
            <strong className="habitoo-agency-sidebar__credits-amount">{credits} crédits</strong>
          </div>
        </div>
        <p className="habitoo-agency-sidebar__credits-hint">
          Propulsez vos mandats prioritaires en vitrine.
        </p>
        <button
          type="button"
          onClick={onOpenCreditsModal}
          className="habitoo-agency-sidebar__credits-btn"
        >
          <span>Recharger le solde</span>
        </button>
      </div>

      {/* 6. Footer Profil Agence */}
      <div className="habitoo-agency-sidebar__footer">
        <div className="habitoo-agency-sidebar__footer-user">
          <Briefcase size={14} className="habitoo-agency-sidebar__footer-icon" />
          <span className="habitoo-agency-sidebar__footer-role">Gestionnaire de portefeuille</span>
        </div>
      </div>

    </aside>
  );
};

export default ProAgencySidebar;
