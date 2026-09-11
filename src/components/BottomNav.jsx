import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useHabitoo } from '../context/HabitooContext';
import { Home, Search, Heart, User } from 'lucide-react';

export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { favorites, currentUser, openAuthModal } = useHabitoo();

  const isHome = location.pathname === '/';
  const isSearch = location.pathname === '/recherche';
  const isAccount = location.pathname === '/mon-compte';

  const handleNav = (item) => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const navItems = [
    {
      id: 'home',
      label: 'Accueil',
      icon: Home,
      active: isHome,
      path: '/'
    },
    {
      id: 'search',
      label: 'Rechercher',
      icon: Search,
      active: isSearch,
      path: '/recherche'
    },
    {
      id: 'favorites',
      label: 'Favoris',
      icon: Heart,
      active: false,
      badge: favorites && favorites.length > 0 ? favorites.length : null,
      action: () => {
        navigate('/recherche');
      }
    },
    {
      id: 'account',
      label: 'Compte',
      icon: User,
      active: isAccount,
      action: () => {
        if (currentUser) {
          navigate('/mon-compte');
        } else {
          openAuthModal(() => navigate('/mon-compte'));
        }
      }
    }
  ];

  return (
    <>
      <nav className="pwa-bottom-nav" aria-label="Navigation mobile principale">
        <div className="pwa-bottom-nav-inner">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item)}
                className={`pwa-nav-item ${item.active ? 'active' : ''}`}
                aria-label={item.label}
              >
                <div className="pwa-nav-icon-wrap">
                  <Icon 
                    size={21} 
                    strokeWidth={item.active ? 2.5 : 1.9} 
                    color={item.active ? 'var(--primary-red)' : '#6B7280'} 
                  />
                  {item.badge && (
                    <span className="pwa-nav-badge">{item.badge}</span>
                  )}
                </div>
                <span className="pwa-nav-label">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <style>{`
        .pwa-bottom-nav {
          display: none;
        }

        @media (max-width: 768px) {
          .pwa-bottom-nav {
            display: block;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: #FFFFFF;
            border-top: 1px solid #E5E7EB;
            z-index: 1000;
            box-shadow: 0 -3px 14px rgba(0, 0, 0, 0.06);
            padding-bottom: env(safe-area-inset-bottom, 0px);
          }

          .pwa-bottom-nav-inner {
            display: flex;
            align-items: center;
            justify-content: space-around;
            height: 58px;
            max-width: 480px;
            margin: 0 auto;
            padding: 0 12px;
          }

          .pwa-nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 3px;
            background: none;
            border: none;
            padding: 6px 12px;
            cursor: pointer;
            text-decoration: none;
            flex: 1;
            transition: transform 0.15s ease;
            -webkit-tap-highlight-color: transparent;
          }

          .pwa-nav-item:active {
            transform: scale(0.92);
          }

          .pwa-nav-icon-wrap {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 24px;
          }

          .pwa-nav-badge {
            position: absolute;
            top: -4px;
            right: -8px;
            background-color: var(--primary-red);
            color: #FFFFFF;
            font-size: 0.625rem;
            font-weight: 700;
            padding: 1px 5px;
            border-radius: 9999px;
            min-width: 14px;
            text-align: center;
          }

          .pwa-nav-label {
            font-size: 0.6875rem;
            font-weight: 600;
            color: #6B7280;
            transition: color 0.15s ease;
          }

          .pwa-nav-item.active .pwa-nav-label {
            color: var(--primary-red);
            font-weight: 700;
          }
        }
      `}</style>
    </>
  );
};
