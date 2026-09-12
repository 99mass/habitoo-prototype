import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useHabitoo } from '../context/HabitooContext';
import { CITIES } from '../data/propertiesData';
import { 
  Bell, 
  ChevronDown, 
  Plus, 
  User, 
  Menu, 
  X, 
  Search,
  LogIn,
  LogOut,
  ShieldCheck,
  Megaphone,
  Settings,
  LayoutDashboard
} from 'lucide-react';

export const Header = () => {
  const { 
    activeCity, 
    setActiveCity, 
    favorites, 
    openDepositModal,
    currentUser,
    openAuthModal,
    logout
  } = useHabitoo();

  const [searchParams] = useSearchParams();
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(() => searchParams.get('menu') === '1');
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change unless menu=1 query param is set
  useEffect(() => {
    if (searchParams.get('menu') === '1') {
      setMobileMenuOpen(true);
    } else {
      setMobileMenuOpen(false);
    }
  }, [location, searchParams]);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsCityDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scoped mobile menu handling managed via searchParams and location above

  const navLinkStyle = (active) => ({
    fontWeight: 600,
    fontSize: '0.9rem',
    color: active ? 'var(--primary-red)' : '#262626',
    textDecoration: 'none',
    padding: '6px 0',
    position: 'relative',
    whiteSpace: 'nowrap',
    transition: 'color 0.15s ease'
  });

  return (
    <header className={`site-header ${isHome ? 'is-home' : ''} ${isScrolled ? 'is-scrolled' : ''} ${mobileMenuOpen ? 'menu-open' : ''}`}>
      <div className="container-wide header-inner">
        
        {/* Brand Logo — Red version with brand name + motto */}
        <Link to="/" className="header-brand">
          <img 
            src="/assets/Code_Generated_Image (2).png" 
            alt="Habitoo — La nouvelle façon de se loger" 
            className="header-logo-img"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentNode.innerHTML = '<span style="font-family:Playfair Display,serif;font-size:1.65rem;font-weight:900;color:#F70000;">Habitoo</span>';
            }}
          />
        </Link>

        {/* Desktop Primary Navigation matching mockup */}
        <nav className="desktop-nav">
          <Link to="/recherche?type=VENTE" style={navLinkStyle(location.search.includes('type=VENTE'))}>
            Acheter
          </Link>
          <Link to="/recherche?type=LOCATION" style={navLinkStyle(location.search.includes('type=LOCATION'))}>
            Louer
          </Link>
          <Link to="/conciergerie" style={navLinkStyle(location.pathname === '/conciergerie')}>
            Conciergerie
          </Link>
          <a 
            href="#/professionnels" 
            target="_blank" 
            rel="noopener noreferrer"
            style={navLinkStyle(location.pathname === '/professionnels' || location.pathname === '/pro')}
          >
            Professionnels
          </a>
          <Link 
            to="/pro/app/dashboard"
            style={{ 
              ...navLinkStyle(location.pathname.startsWith('/pro/app')), 
              color: '#F70000', 
              fontWeight: '700',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}
            title="Accéder au Dashboard PRO (Démo)"
          >
            <LayoutDashboard size={14} />
            <span>Dashboard PRO</span>
          </Link>
          <Link 
            to="/a-propos" 
            style={navLinkStyle(location.pathname === '/a-propos' || location.pathname === '/about')}
          >
            À propos
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="header-actions">
          
          {/* Currency / City Switcher */}
          <div className="currency-toggle-wrap hide-mobile" style={{ position: 'relative' }} ref={dropdownRef}>
            <button
              onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
              className="currency-toggle-btn"
              title="Changer de ville et devise"
              aria-label={`Marché actif : ${activeCity.name}, Devise : ${activeCity.currency}. Cliquer pour changer.`}
              aria-expanded={isCityDropdownOpen}
              aria-haspopup="true"
            >
              <span className="currency-toggle-flag">{activeCity.flag}</span>
              <span className="currency-toggle-code">{activeCity.currency}</span>
              <ChevronDown size={12} className={`currency-toggle-chevron ${isCityDropdownOpen ? 'open' : ''}`} />
            </button>

            {isCityDropdownOpen && (
              <div className="city-dropdown">
                <div className="city-dropdown-title">
                  Marchés & Devises
                </div>
                {CITIES.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => {
                      setActiveCity(city);
                      setIsCityDropdownOpen(false);
                    }}
                    className={`city-dropdown-item ${activeCity.id === city.id ? 'active' : ''}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.2rem' }}>{city.flag}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--obsidian-black)' }}>
                          {city.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--graphite-gray)' }}>
                          {city.country}
                        </div>
                      </div>
                    </div>
                    <span className={`currency-badge ${activeCity.id === city.id ? 'active' : ''}`}>
                      {city.currency}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Account / Login */}
          {currentUser ? (
            <div style={{ position: 'relative' }} ref={userDropdownRef}>
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="header-user-avatar-btn"
                title={`Connecté en tant que ${currentUser.name}`}
              >
                {currentUser.avatar ? (
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name} 
                    className="header-user-img"
                  />
                ) : (
                  <span className="header-user-initials">
                    {currentUser.name.charAt(0)}
                  </span>
                )}
                <span className="header-user-online-dot" />
              </button>

              {isUserDropdownOpen && (
                <div className="user-dropdown-menu">
                  <div className="user-dropdown-header">
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--obsidian-black)' }}>
                      {currentUser.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--graphite-gray)', marginTop: '2px' }}>
                      {currentUser.email || currentUser.phone}
                    </div>
                  </div>

                  <div className="user-dropdown-divider" />

                  <Link 
                    to="/mon-compte?tab=profile" 
                    className="user-dropdown-item"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    <User size={16} />
                    <span>Mon Profil</span>
                  </Link>
                  <Link 
                    to="/mon-compte?tab=properties" 
                    className="user-dropdown-item"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    <Megaphone size={16} />
                    <span>Mes Annonces</span>
                  </Link>
                  <Link 
                    to="/mon-compte?tab=notifications" 
                    className="user-dropdown-item"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    <Bell size={16} />
                    <span>Notifications</span>
                  </Link>
                  <Link 
                    to="/mon-compte?tab=settings" 
                    className="user-dropdown-item"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    <Settings size={16} />
                    <span>Paramètres</span>
                  </Link>

                  <div className="user-dropdown-divider" />

                  <button
                    onClick={() => {
                      logout();
                      setIsUserDropdownOpen(false);
                      if (location.pathname === '/mon-compte') {
                        navigate('/');
                      }
                    }}
                    className="user-dropdown-item logout"
                  >
                    <LogOut size={16} />
                    <span>Se déconnecter</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={openAuthModal} 
              className="btn-header-login"
              title="Se connecter"
            >
              <User size={17} />
              <span>Se connecter</span>
            </button>
          )}

          {/* Red CTA Button: + Déposer une annonce */}
          <button
            onClick={() => {
              if (currentUser) {
                navigate('/publier');
              } else {
                openAuthModal(() => navigate('/publier'));
              }
            }}
            className="btn-header-cta hide-mobile"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Déposer une annonce</span>
          </button>

          {/* Mobile Notification Button (matching reference mockup) */}
          <button
            onClick={() => {
              if (currentUser) {
                navigate('/mon-compte?tab=notifications');
              } else {
                openAuthModal(() => navigate('/mon-compte?tab=notifications'));
              }
            }}
            className="mobile-notif-btn"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell size={18} color="#1A1A1A" strokeWidth={2.2} />
            <span className="notif-red-dot" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn header-icon-btn"
            aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          {/* User profile / Login banner in drawer */}
          {currentUser ? (
            <div className="mobile-user-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="mobile-user-avatar">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--obsidian-black)' }}>
                    {currentUser.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--graphite-gray)' }}>
                    {currentUser.email || currentUser.phone}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                  if (location.pathname === '/mon-compte') {
                    navigate('/');
                  }
                }}
                className="mobile-logout-btn"
              >
                <LogOut size={14} />
                <span>Déconnexion</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openAuthModal();
              }}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '12px', marginBottom: '12px' }}
            >
              <LogIn size={16} />
              <span>Se connecter</span>
            </button>
          )}

          <Link to="/recherche?type=VENTE" className="mobile-drawer-link" onClick={() => setMobileMenuOpen(false)}>
            Acheter
          </Link>
          <Link to="/recherche?type=LOCATION" className="mobile-drawer-link" onClick={() => setMobileMenuOpen(false)}>
            Louer
          </Link>
          <Link to="/publier" className="mobile-drawer-link" onClick={() => setMobileMenuOpen(false)}>
            Vendre
          </Link>
          <Link to="/conciergerie" className="mobile-drawer-link" onClick={() => setMobileMenuOpen(false)}>
            Conciergerie
          </Link>
          <a 
            href="#/professionnels" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`mobile-drawer-link ${(location.pathname === '/professionnels' || location.pathname === '/pro') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Professionnels
          </a>
          <Link 
            to="/pro/app/dashboard"
            className="mobile-drawer-link"
            style={{ color: '#F70000', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <LayoutDashboard size={16} />
            <span>Dashboard PRO (Démo)</span>
          </Link>
          <Link 
            to="/a-propos" 
            className={`mobile-drawer-link ${(location.pathname === '/a-propos' || location.pathname === '/about') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            À propos
          </Link>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              if (currentUser) {
                navigate('/publier');
              } else {
                openAuthModal(() => navigate('/publier'));
              }
            }}
            className="btn-header-cta"
            style={{ width: '100%', justifyContent: 'center', marginTop: '16px', padding: '14px' }}
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Déposer une annonce</span>
          </button>
        </div>
      )}

      <style>{`
        .site-header {
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          height: var(--header-height);
          background-color: var(--surface-glass);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-color);
          z-index: 900;
          display: flex;
          align-items: center;
        }
        .header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          gap: 20px;
        }
        .header-brand {
          display: flex;
          align-items: center;
          text-decoration: none;
          flex-shrink: 0;
        }
        .header-logo-img {
          height: 36px;
          width: auto;
          object-fit: contain;
        }
        .desktop-nav {
          display: none;
          align-items: center;
          gap: clamp(14px, 2vw, 32px);
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* Currency Toggle */
        .currency-toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: var(--radius-pill);
          border: 1px solid var(--border-color);
          background-color: var(--surface-white);
          color: var(--obsidian-black);
          font-size: 0.8125rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s;
        }
        .currency-toggle-btn:hover {
          border-color: var(--primary-red);
          background-color: var(--soft-tint);
        }
        .currency-toggle-flag {
          font-size: 1.1rem;
          line-height: 1;
        }
        .currency-toggle-code {
          color: var(--obsidian-black);
          letter-spacing: 0.5px;
        }
        .currency-toggle-chevron {
          color: var(--graphite-gray);
          transition: transform 0.2s;
        }
        .currency-toggle-chevron.open {
          transform: rotate(180deg);
        }

        /* Header icon buttons */
        .header-icon-btn {
          position: relative;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid var(--border-color);
          background-color: var(--surface-white);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--obsidian-black);
          cursor: pointer;
          text-decoration: none;
          transition: all 0.15s;
        }
        .header-icon-btn:hover {
          border-color: var(--graphite-gray);
        }
        .header-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background-color: var(--primary-red);
          color: #FFF;
          font-size: 0.6875rem;
          font-weight: 700;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #FFF;
        }

        /* Publish CTA */
        .btn-publish {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 20px;
          border-radius: var(--radius-pill);
          border: 2px solid var(--primary-red);
          background: transparent;
          color: var(--primary-red);
          font-weight: 700;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .btn-publish:hover {
          background-color: var(--primary-red);
          color: #FFF;
        }

        /* Login Button in Header */
        .btn-header-login {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: var(--radius-pill);
          border: 1px solid var(--border-color);
          background-color: var(--surface-white);
          color: var(--obsidian-black);
          font-weight: 700;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-header-login:hover {
          border-color: var(--primary-red);
          color: var(--primary-red);
          background-color: var(--soft-tint);
        }

        /* Red Header CTA (+ Déposer une annonce) */
        .btn-header-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 20px;
          border-radius: var(--radius-pill);
          background-color: var(--primary-red);
          color: #FFFFFF;
          border: none;
          font-weight: 700;
          font-size: 0.875rem;
          cursor: pointer;
          white-space: nowrap;
          box-shadow: 0 4px 14px rgba(247, 0, 0, 0.25);
          transition: all 0.2s ease;
        }
        .btn-header-cta:hover {
          background-color: var(--primary-red-hover);
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(247, 0, 0, 0.35);
        }

        /* User Avatar Button */
        .header-user-avatar-btn {
          position: relative;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid var(--primary-red);
          background-color: var(--soft-tint);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 0;
          overflow: visible;
          transition: transform 0.15s;
        }
        .header-user-avatar-btn:hover {
          transform: scale(1.05);
        }
        .header-user-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }
        .header-user-initials {
          font-weight: 800;
          font-size: 1rem;
          color: var(--primary-red);
        }
        .header-user-online-dot {
          position: absolute;
          bottom: -1px;
          right: -1px;
          width: 11px;
          height: 11px;
          background-color: var(--verified-green);
          border: 2px solid #FFF;
          border-radius: 50%;
        }

        /* User Dropdown Menu */
        .user-dropdown-menu {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 250px;
          background-color: var(--surface-white);
          border-radius: var(--radius-card);
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-color);
          padding: 10px;
          z-index: 1000;
          animation: fadeIn 0.15s ease-out;
        }
        .user-dropdown-header {
          padding: 8px 10px;
        }
        .user-dropdown-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.6875rem;
          font-weight: 700;
          background-color: rgba(5,150,105,0.1);
          color: #059669;
          padding: 2px 8px;
          border-radius: var(--radius-pill);
          margin-top: 6px;
        }
        .user-dropdown-divider {
          height: 1px;
          background-color: var(--border-color);
          margin: 6px 0;
        }
        .user-dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 9px 12px;
          border-radius: 8px;
          background: transparent;
          border: none;
          color: var(--obsidian-black);
          font-weight: 600;
          font-size: 0.875rem;
          text-decoration: none;
          text-align: left;
          cursor: pointer;
          transition: all 0.15s;
        }
        .user-dropdown-item:hover {
          background-color: var(--bg-main);
          color: var(--primary-red);
        }
        .user-dropdown-item.logout {
          color: #DC2626;
        }
        .user-dropdown-item.logout:hover {
          background-color: #FEF2F2;
        }

        /* Mobile Drawer User Card */
        .mobile-user-card {
          background-color: var(--bg-main);
          border-radius: 12px;
          padding: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          border: 1px solid var(--border-color);
        }
        .mobile-user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: var(--primary-red);
          color: #FFF;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .mobile-logout-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          background: transparent;
          border: 1px solid #FCA5A5;
          color: #DC2626;
          border-radius: var(--radius-pill);
          padding: 5px 10px;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
        }

        /* City dropdown */
        .city-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 240px;
          background-color: var(--surface-white);
          border-radius: var(--radius-card);
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-color);
          padding: 8px;
          z-index: 999;
          animation: fadeIn 0.15s ease-out;
        }
        .city-dropdown-title {
          padding: 8px 12px;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--graphite-gray);
          text-transform: uppercase;
        }
        .city-dropdown-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 10px 12px;
          border-radius: 8px;
          background-color: transparent;
          border: none;
          text-align: left;
          cursor: pointer;
          transition: background-color 0.15s;
        }
        .city-dropdown-item.active {
          background-color: var(--soft-tint);
        }
        .city-dropdown-item:hover {
          background-color: var(--bg-main);
        }
        .currency-badge {
          font-weight: 700;
          font-size: 0.8125rem;
          color: var(--graphite-gray);
          background: #FFF;
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid var(--border-color);
        }
        .currency-badge.active {
          color: var(--primary-red);
        }

        .site-header.menu-open {
          z-index: 2200 !important;
          background-color: var(--surface-white) !important;
        }

        /* Mobile drawer */
        .mobile-drawer {
          position: fixed;
          top: var(--header-height);
          left: 0;
          right: 0;
          bottom: 0;
          height: calc(100vh - var(--header-height));
          width: 100vw;
          background-color: var(--surface-white);
          border-bottom: none;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          box-shadow: var(--shadow-lg);
          z-index: 2200;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        .mobile-drawer-link {
          font-size: 1.1rem;
          font-weight: 600;
          padding: 12px 0;
          color: var(--obsidian-black);
          text-decoration: none;
          border-bottom: 1px solid var(--border-light);
        }
        .mobile-drawer-link:last-of-type {
          border-bottom: none;
        }

        /* Responsive */
        .mobile-menu-btn { display: flex; }
        .hide-mobile { display: none !important; }
        .btn-header-login { display: none; }
        .header-user-avatar-btn { display: none; }
        .mobile-notif-btn { display: none; }

        @media (max-width: 768px) {
          .mobile-notif-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 38px;
            height: 38px;
            min-height: unset !important;
            aspect-ratio: 1 / 1 !important;
            border-radius: 50% !important;
            background-color: #FFFFFF;
            border: 1px solid rgba(0, 0, 0, 0.08);
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
            position: relative;
            cursor: pointer;
            padding: 0;
            flex-shrink: 0;
            -webkit-tap-highlight-color: transparent;
          }

          .header-icon-btn, .mobile-menu-btn {
            width: 38px;
            height: 38px;
            min-height: unset !important;
            aspect-ratio: 1 / 1 !important;
            border-radius: 50% !important;
            flex-shrink: 0;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .notif-red-dot {
            position: absolute;
            top: 7px;
            right: 8px;
            width: 7px;
            height: 7px;
            background-color: var(--primary-red);
            border-radius: 50%;
            border: 1.5px solid #FFFFFF;
          }

          .site-header.is-home {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            background-color: transparent;
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
            border-bottom: none;
            box-shadow: none;
            z-index: 100;
          }

          .site-header.is-home.is-scrolled {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background-color: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(0, 0, 0, 0.06);
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
            z-index: 999;
          }

          .header-inner {
            gap: 8px;
          }
          .header-actions {
            gap: 8px;
          }
          .header-logo-img {
            height: 32px;
          }
          .currency-toggle-btn {
            padding: 6px 10px;
            font-size: 0.75rem;
            gap: 4px;
          }
          .header-icon-btn {
            width: 36px;
            height: 36px;
          }
        }

        @media (min-width: 768px) {
          .btn-header-login { display: inline-flex; }
          .header-user-avatar-btn { display: flex; }
        }

        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
          .hide-mobile {
            display: inline-flex !important;
          }
        }
      `}</style>
    </header>
  );
};
