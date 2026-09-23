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
  LayoutDashboard,
  Award,
  Sparkles,
  BarChart3,
  CreditCard,
  ArrowRight
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
  const [isProMenuOpen, setIsProMenuOpen] = useState(false);
  const [isMobileProAccordionOpen, setIsMobileProAccordionOpen] = useState(false);
  const dropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const proMenuRef = useRef(null);
  const proTriggerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';

  useEffect(() => {
    document.title = 'Habitoo - Trouver son logement en France en toute simplicité et sécurité';
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsProMenuOpen(false);
    setIsMobileProAccordionOpen(false);
    if (searchParams.get('menu') === '1') {
      setMobileMenuOpen(true);
    } else {
      setMobileMenuOpen(false);
    }
  }, [location.pathname, searchParams]);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsCityDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setIsUserDropdownOpen(false);
      }
      if (
        proMenuRef.current && 
        !proMenuRef.current.contains(e.target) &&
        proTriggerRef.current &&
        !proTriggerRef.current.contains(e.target)
      ) {
        setIsProMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsProMenuOpen(false);
        setIsCityDropdownOpen(false);
        setIsUserDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
    <header className={`site-header ${isHome ? 'is-home' : ''} ${isScrolled ? 'is-scrolled' : ''} ${mobileMenuOpen ? 'menu-open' : ''} ${isProMenuOpen ? 'pro-open' : ''}`}>
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
          <button
            type="button"
            ref={proTriggerRef}
            onClick={() => setIsProMenuOpen(!isProMenuOpen)}
            className={`header-pro-trigger ${isProMenuOpen ? 'active' : ''}`}
            style={navLinkStyle(isProMenuOpen || location.pathname === '/professionnels' || location.pathname === '/pro')}
            aria-expanded={isProMenuOpen}
            aria-haspopup="true"
          >
            <span>Professionnels</span>
            <ChevronDown size={14} className={`header-pro-chevron ${isProMenuOpen ? 'open' : ''}`} />
          </button>
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
                  Marchés et Devises
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

      {/* Desktop Pro Curtain & Backdrop */}
      {isProMenuOpen && (
        <>
          <div 
            className="header-pro-backdrop" 
            onClick={() => setIsProMenuOpen(false)} 
            aria-hidden="true"
          />
          <div 
            className="header-pro-curtain" 
            ref={proMenuRef}
            role="region"
            aria-label="Habitoo pour les professionnels"
          >
            <div className="container-wide">
              {/* En-tête épuré */}
              <div className="header-pro-head">
                <div>
                  <span className="header-pro-tag">ESPACE PROFESSIONNEL</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsProMenuOpen(false)}
                  className="header-pro-close-btn"
                  title="Fermer le volet"
                  aria-label="Fermer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Corps du volet épuré : 2 zones */}
              <div className="header-pro-body">
                {/* 4 atouts réels */}
                <div className="header-pro-features-grid">
                  <div className="header-pro-feature">
                    <div className="header-pro-icon-wrap">
                      <Award size={18} color="var(--primary-red)" />
                    </div>
                    <div>
                      <h4 className="header-pro-feature-title">Badge PRO certifié</h4>
                      <p className="header-pro-feature-desc">Crédibilité immédiate auprès des acquéreurs et locataires.</p>
                    </div>
                  </div>

                  <div className="header-pro-feature">
                    <div className="header-pro-icon-wrap">
                      <Sparkles size={18} color="var(--primary-red)" />
                    </div>
                    <div>
                      <h4 className="header-pro-feature-title">Diffusion & Boost</h4>
                      <p className="header-pro-feature-desc">Mise en avant prioritaire de vos mandats sur votre secteur.</p>
                    </div>
                  </div>

                  <div className="header-pro-feature">
                    <div className="header-pro-icon-wrap">
                      <BarChart3 size={18} color="var(--primary-red)" />
                    </div>
                    <div>
                      <h4 className="header-pro-feature-title">Tableau de bord</h4>
                      <p className="header-pro-feature-desc">Suivi en temps réel de vos mandats, vues et prises de contact.</p>
                    </div>
                  </div>

                  <div className="header-pro-feature">
                    <div className="header-pro-icon-wrap">
                      <CreditCard size={18} color="var(--primary-red)" />
                    </div>
                    <div>
                      <h4 className="header-pro-feature-title">Règlement Mobile Money</h4>
                      <p className="header-pro-feature-desc">Encaissement sécurisé et instantané de vos commissions.</p>
                    </div>
                  </div>
                </div>

                {/* Encadré d'action compact */}
                <div className="header-pro-action-card">
                  <p className="header-pro-action-text">Rejoignez le réseau de référence et valorisez votre portefeuille immobilier.</p>

                  <div className="header-pro-action-buttons">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProMenuOpen(false);
                        navigate('/pro/inscription');
                      }}
                      className="btn-primary header-pro-btn-primary"
                    >
                      <span>Créer un compte PRO</span>
                      <ArrowRight size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsProMenuOpen(false);
                        navigate('/professionnels');
                      }}
                      className="header-pro-btn-secondary"
                    >
                      Découvrir l'Espace PRO
                    </button>

                    {!currentUser && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsProMenuOpen(false);
                          openAuthModal();
                        }}
                        className="header-pro-btn-login"
                      >
                        Déjà membre ? Se connecter
                      </button>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </>
      )}

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
          {/* Section Professionnels Accordion */}
          <div className="mobile-pro-accordion">
            <button
              type="button"
              className={`mobile-drawer-link mobile-pro-toggle ${isMobileProAccordionOpen ? 'open' : ''}`}
              onClick={() => setIsMobileProAccordionOpen(!isMobileProAccordionOpen)}
              aria-expanded={isMobileProAccordionOpen}
            >
              <span>Professionnels</span>
              <ChevronDown size={18} className={`mobile-pro-chevron ${isMobileProAccordionOpen ? 'open' : ''}`} />
            </button>

            {isMobileProAccordionOpen && (
              <div className="mobile-pro-panel">
                <div className="mobile-pro-features">
                  <div className="mobile-pro-feature-item">
                    <div>
                      <strong>Badge PRO certifié :</strong> crédibilité immédiate.
                    </div>
                  </div>
                  <div className="mobile-pro-feature-item">
                    <div>
                      <strong>Diffusion & Boost :</strong> visibilité prioritaire.
                    </div>
                  </div>
                  <div className="mobile-pro-feature-item">
                    <div>
                      <strong>Tableau de bord :</strong> mandats, vues et contacts.
                    </div>
                  </div>
                  <div className="mobile-pro-feature-item">
                    <div>
                      <strong>Mobile Money :</strong> encaissement sécurisé.
                    </div>
                  </div>
                </div>

                <div className="mobile-pro-actions">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsMobileProAccordionOpen(false);
                      navigate('/pro/inscription');
                    }}
                    className="btn-primary mobile-pro-btn-primary"
                  >
                    <span>Créer un compte PRO</span>
                    <ArrowRight size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsMobileProAccordionOpen(false);
                      navigate('/professionnels');
                    }}
                    className="mobile-pro-btn-secondary"
                  >
                    Découvrir l'Espace PRO
                  </button>
                  {!currentUser && (
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setIsMobileProAccordionOpen(false);
                        openAuthModal();
                      }}
                      className="mobile-pro-btn-login"
                    >
                      Déjà membre ? Se connecter
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
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

        /* ===== VOLET PRO DEROULANT (DESKTOP) ===== */
        .header-pro-trigger {
          background: none;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 0.9rem;
          color: #262626;
          padding: 6px 0;
          position: relative;
          white-space: nowrap;
          transition: color 0.15s ease;
        }
        .header-pro-trigger:hover,
        .header-pro-trigger.active {
          color: var(--primary-red);
        }
        .header-pro-chevron {
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .header-pro-chevron.open {
          transform: rotate(180deg);
        }

        .site-header.pro-open {
          background-color: #FFFFFF !important;
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
          border-bottom: 1px solid var(--border-color) !important;
          z-index: 1000 !important;
        }

        .header-pro-backdrop {
          position: fixed;
          top: var(--header-height);
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(2px);
          -webkit-backdrop-filter: blur(2px);
          z-index: 998;
          animation: proBackdropFadeIn 0.2s ease;
        }

        @keyframes proBackdropFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .header-pro-curtain {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          width: 100%;
          background-color: #FFFFFF;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.08);
          z-index: 999;
          padding: 24px 0 28px;
          animation: proCurtainSlideDown 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes proCurtainSlideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .header-pro-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          margin-bottom: 20px;
        }
        .header-pro-tag {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--primary-red);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 3px;
        }
        .header-pro-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--obsidian-black);
          margin: 0;
        }
        .header-pro-close-btn {
          background-color: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 6px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--graphite-gray);
          transition: all 0.15s ease;
        }
        .header-pro-close-btn:hover {
          background-color: #FFFFFF;
          border-color: rgba(0, 0, 0, 0.25);
          color: var(--obsidian-black);
        }

        .header-pro-body {
          display: grid;
          grid-template-columns: 1.55fr 1fr;
          gap: 0;
          align-items: stretch;
        }
        .header-pro-features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px 32px;
          padding-right: 36px;
        }
        .header-pro-feature {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          background: transparent;
          border: none;
          padding: 0;
        }
        .header-pro-icon-wrap {
          width: 34px;
          height: 34px;
          border-radius: 6px;
          background-color: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .header-pro-feature-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--obsidian-black);
          margin-bottom: 3px;
        }
        .header-pro-feature-desc {
          font-size: 0.8rem;
          color: var(--graphite-gray);
          line-height: 1.4;
          margin: 0;
        }

        .header-pro-action-card {
          background-color: #FFFFFF;
          border: none;
          border-left: 1px solid rgba(0, 0, 0, 0.08);
          padding: 0 0 0 36px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 14px;
        }
        .header-pro-target-pill {
          align-self: flex-start;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: var(--obsidian-black);
          background-color: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 4px;
          padding: 3px 8px;
          text-transform: uppercase;
        }
        .header-pro-action-text {
          font-size: 0.84rem;
          color: var(--graphite-gray);
          line-height: 1.45;
          margin: 0;
        }
        .header-pro-action-buttons {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
          margin-top: 4px;
        }
        .header-pro-btn-primary {
          width: auto;
          align-self: flex-start;
          font-size: 0.84rem;
          padding: 9px 20px;
          border-radius: 6px;
        }
        .header-pro-btn-secondary {
          width: auto;
          align-self: flex-start;
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.14);
          color: var(--obsidian-black);
          font-size: 0.82rem;
          font-weight: 600;
          padding: 8px 18px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .header-pro-btn-secondary:hover {
          background: #FFFFFF;
          border-color: rgba(0, 0, 0, 0.3);
        }
        .header-pro-btn-login {
          align-self: flex-start;
          background: none;
          border: none;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--graphite-gray);
          cursor: pointer;
          padding: 2px 0;
          text-decoration: underline;
          transition: color 0.15s ease;
        }
        .header-pro-btn-login:hover {
          color: var(--primary-red);
        }

        /* ===== ACCORDEON PRO (MOBILE) ===== */
        .mobile-pro-accordion {
          border-bottom: 1px solid var(--border-light);
        }
        .mobile-pro-toggle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          padding: 12px 0;
          border-bottom: none;
        }
        .mobile-pro-chevron {
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .mobile-pro-chevron.open {
          transform: rotate(180deg);
        }
        .mobile-pro-panel {
          background: #FFFFFF;
          border: none;
          padding: 8px 0 12px;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
          animation: mobileProFadeIn 0.2s ease;
        }
        @keyframes mobileProFadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .mobile-pro-features {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .mobile-pro-feature-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.82rem;
          color: var(--obsidian-black);
          line-height: 1.4;
          padding: 14px 0;
          margin-left: 3%;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }
        .mobile-pro-feature-item:last-child {
          border-bottom: none;
        }
        .mobile-pro-feature-item svg {
          flex-shrink: 0;
          margin-top: 2px;
        }
        .mobile-pro-actions { 
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
          padding-top: 14px;
          border-top: 1px solid rgba(0, 0, 0, 0.08);
        }
        .mobile-pro-btn-primary {
          width: auto;
          align-self: flex-start;
          font-size: 0.84rem;
          padding: 9px 20px;
          border-radius: 6px;
        }
        .mobile-pro-btn-secondary {
          width: auto;
          align-self: flex-start;
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.14);
          color: var(--obsidian-black);
          font-size: 0.82rem;
          font-weight: 600;
          padding: 8px 18px;
          border-radius: 6px;
          cursor: pointer;
        }
        .mobile-pro-btn-login {
          align-self: flex-start;
          background: none;
          border: none;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--graphite-gray);
          cursor: pointer;
          padding: 2px 0;
          text-decoration: underline;
        }
      `}</style>
    </header>
  );
};
