import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight, ArrowRight } from 'lucide-react';

export const ProHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`habitoo-pro-header ${isScrolled ? 'habitoo-pro-header--scrolled' : ''}`}>
      <div className="habitoo-pro-container habitoo-pro-header-inner">
        
        {/* Logo: White Habitoo + PRO Badge */}
        <div className="habitoo-pro-header-brand-wrap">
          <Link to="/professionnels" className="habitoo-pro-header-brand">
            <img 
              src="/assets/Code_Generated_Image (1).png" 
              alt="Habitoo" 
              className="habitoo-pro-header-logo"
            />
            <span className="habitoo-pro-header-badge">PRO</span>
          </Link>
        </div>

        {/* Desktop Anchor Navigation */}
        <nav className="habitoo-pro-desktop-nav">
          <a href="#hero" onClick={(e) => scrollToSection(e, 'hero')} className="habitoo-pro-nav-link">
            Accueil
          </a>
          <a href="#avantages" onClick={(e) => scrollToSection(e, 'avantages')} className="habitoo-pro-nav-link">
            Avantages
          </a>
          <a href="#cibles" onClick={(e) => scrollToSection(e, 'cibles')} className="habitoo-pro-nav-link">
            Solutions
          </a>
          <a href="#tarifs" onClick={(e) => scrollToSection(e, 'tarifs')} className="habitoo-pro-nav-link">
            Tarifs
          </a>
          <a href="#reassurance" onClick={(e) => scrollToSection(e, 'reassurance')} className="habitoo-pro-nav-link">
            Accréditation
          </a>
          <a href="#faq" onClick={(e) => scrollToSection(e, 'faq')} className="habitoo-pro-nav-link">
            FAQ
          </a>
        </nav>

        {/* Right Actions */}
        <div className="habitoo-pro-header-actions">
          <Link to="/" className="habitoo-pro-back-link" title="Accéder au portail grand public">
            <span>Espace Particuliers</span>
            <ArrowUpRight size={14} />
          </Link>
          
          <Link to="/pro/inscription" className="habitoo-pro-btn-primary habitoo-pro-header-cta">
            <span>Rejoindre PRO</span>
            <ArrowRight size={15} />
          </Link>

          {/* Mobile Hamburger Button */}
          <button 
            type="button"
            className="habitoo-pro-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu professionnel"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="habitoo-pro-mobile-drawer">
          <nav className="habitoo-pro-mobile-nav">
            <a href="#hero" onClick={(e) => scrollToSection(e, 'hero')} className="habitoo-pro-mobile-link">
              Accueil PRO
            </a>
            <a href="#avantages" onClick={(e) => scrollToSection(e, 'avantages')} className="habitoo-pro-mobile-link">
              Avantages stratégiques
            </a>
            <a href="#cibles" onClick={(e) => scrollToSection(e, 'cibles')} className="habitoo-pro-mobile-link">
              Solutions Démarcheurs & Agences
            </a>
            <a href="#tarifs" onClick={(e) => scrollToSection(e, 'tarifs')} className="habitoo-pro-mobile-link">
              Grille tarifaire
            </a>
            <a href="#reassurance" onClick={(e) => scrollToSection(e, 'reassurance')} className="habitoo-pro-mobile-link">
              Accréditation & KYC
            </a>
            <a href="#faq" onClick={(e) => scrollToSection(e, 'faq')} className="habitoo-pro-mobile-link">
              FAQ
            </a>
            <div className="habitoo-pro-mobile-footer-actions">
              <Link to="/pro/inscription" className="habitoo-pro-btn-primary" style={{ width: '100%' }}>
                <span>Rejoindre Habitoo PRO</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/" className="habitoo-pro-btn-secondary" style={{ width: '100%', marginTop: '10px' }}>
                <span>Retour au site grand public</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default ProHeader;
