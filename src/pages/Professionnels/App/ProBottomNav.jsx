import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Plus,
  CalendarCheck,
  Wallet
} from 'lucide-react';

const PRO_NAV_ITEMS = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, tab: 'overview' },
  { id: 'properties', label: 'Annonces', icon: Building2, tab: 'properties' },
  { id: 'publish', label: 'Publier', icon: Plus, isSpecial: true, tab: 'properties', action: 'new' },
  { id: 'visits', label: 'Visites', icon: CalendarCheck, tab: 'visits', badge: '2' },
  { id: 'revenue', label: 'Revenus', icon: Wallet, tab: 'revenue' }
];

export const ProBottomNav = ({
  activeTab = 'overview',
  onSelectTab,
  onOpenMore,
  visitCount = 2
}) => {

  const handleTap = (item) => {
    if (item.id === 'publish') {
      onSelectTab && onSelectTab('properties', { action: 'new' });
      return;
    }
    if (item.id === 'more') {
      onOpenMore && onOpenMore();
      return;
    }
    onSelectTab && onSelectTab(item.tab);
  };

  const isActive = (item) => {
    if (item.id === 'publish') return false;
    return activeTab === item.tab;
  };

  return (
    <nav className="pro-bottom-nav" aria-label="Navigation mobile Espace PRO">
      <div className="pro-bottom-nav__inner">
        {PRO_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          const badge = item.id === 'visits' && visitCount > 0 ? visitCount : null;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleTap(item)}
              className={`pro-bottom-nav__item ${active ? 'pro-bottom-nav__item--active' : ''} ${item.isSpecial ? 'pro-bottom-nav__item--fab' : ''}`}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
            >
              <div className="pro-bottom-nav__icon-wrap">
                <Icon
                  size={item.isSpecial ? 20 : 19}
                  strokeWidth={active ? 2.4 : 1.8}
                />
                {badge && (
                  <span className="pro-bottom-nav__badge">{badge}</span>
                )}
              </div>
              <span className="pro-bottom-nav__label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
