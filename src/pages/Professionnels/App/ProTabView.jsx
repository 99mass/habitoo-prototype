import React, { useRef, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  CalendarCheck, 
  Wallet, 
  GraduationCap, 
  UserCheck, 
  Settings 
} from 'lucide-react';

const TABS = [
  { id: 'overview', label: "Vue d'ensemble", icon: LayoutDashboard },
  { id: 'properties', label: "Mes Annonces", icon: Building2, badge: "6" },
  { id: 'visits', label: "Mes Visites", icon: CalendarCheck, badge: "2" },
  { id: 'revenue', label: "Revenus", icon: Wallet },
  { id: 'academy', label: "Habitoo Académie", icon: GraduationCap, personaOnly: "demarcheur" },
  { id: 'profile', label: "Profil", icon: UserCheck },
  { id: 'settings', label: "Paramètres", icon: Settings },
];

export const ProTabView = ({ 
  activeTab = 'overview', 
  onSelectTab, 
  persona = 'demarcheur',
  propertyCount
}) => {
  const tabsContainerRef = useRef(null);

  // Filtrage conditionnel des onglets selon persona
  const visibleTabs = TABS
    .filter(t => !t.personaOnly || t.personaOnly === persona)
    .map(t => {
      if (t.id === 'properties' && propertyCount !== undefined) {
        return { ...t, badge: String(propertyCount) };
      }
      return t;
    });

  // Défilement automatique pour que l'onglet actif soit toujours visible sur mobile
  useEffect(() => {
    if (tabsContainerRef.current) {
      const activeEl = tabsContainerRef.current.querySelector('.habitoo-dash-tab--active');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeTab]);

  return (
    <nav className="habitoo-dash-tabbar" aria-label="Navigation Espace PRO">
      <div className="habitoo-dash-tabbar__inner" ref={tabsContainerRef}>
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id || (tab.id === 'profile' && activeTab === 'reputation');

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab && onSelectTab(tab.id)}
              className={`habitoo-dash-tab ${isActive ? 'habitoo-dash-tab--active' : ''}`}
            >
              <Icon size={15} strokeWidth={isActive ? 2.2 : 1.7} className="habitoo-dash-tab__icon" />
              <span className="habitoo-dash-tab__label">{tab.label}</span>

              {tab.badge && (
                <span className="habitoo-dash-tab__badge-count">{tab.badge}</span>
              )}

              {/* Ligne inférieure animée rouge signature Habitoo */}
              {isActive && <div className="habitoo-dash-tab__indicator" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
