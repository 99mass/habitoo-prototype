import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useHabitoo } from '../context/HabitooContext';
import { PROPERTIES_DATA } from '../data/propertiesData';
import { SearchWidget } from '../components/SearchWidget';
import { PropertyCard } from '../components/PropertyCard';
import { 
  MapPin, 
  Star, 
  Home, 
  Building2, 
  Trees, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Camera, 
  Sparkles, 
  Award, 
  CreditCard, 
  FileText,
  BarChart3,
  ChevronRight as ChevronRightIcon,
  CheckCircle2,
  ShieldCheck,
  Plus,
  Minus,
  Mail,
  Phone,
  Clock,
  Send
} from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: "Comment Habitoo sécurise-t-il les transactions immobilières ?",
    answer: "Audit juridique systématique (titre foncier, certificat de propriété foncière, conformité technique), séquestre notarié des fonds et vérification physique contradictoire avant toute signature."
  },
  {
    question: "Quelles sont les prestations incluses dans la conciergerie et l'intendance privée ?",
    answer: "Gestion locative intégrale, sélection rigoureuse des locataires, états des lieux certifiés, ménage hôtelier, entretien préventif des équipements (groupes électrogènes, climatisation) et reversement garanti des loyers."
  },
  {
    question: "Quels sont les honoraires et frais appliqués par Habitoo ?",
    answer: "Une transparence tarifaire absolue : nos commissions et forfaits de gestion respectent rigoureusement les barèmes professionnels locaux et sont formalisés par mandat préalable, sans aucun coût caché."
  },
  {
    question: "Puis-je bénéficier d'un service de recherche personnalisée pour un bien d'exception ?",
    answer: "Oui. Nos conseillers privés assurent une prise en charge sur-mesure de votre cahier des charges, avec accès privilégié à des opportunités \"off-market\" (hors marché public) et accompagnement juridique complet."
  }
];

export const HomePage = () => {
  const { openAuthModal } = useHabitoo();
  const navigate = useNavigate();
  const heroSectionRef = useRef(null);
  const [bannerBottomOffset, setBannerBottomOffset] = useState(82);

  // Measure the vertical position of the search button to stop the background banner exactly at its height
  useEffect(() => {

    document.title = "Habitoo - La Nouvelle Façon de Se Loger"
    const updateBannerBottom = () => {
      const heroEl = heroSectionRef.current;
      const searchBtn = heroEl?.querySelector('button[type="submit"]');
      if (heroEl && searchBtn) {
        const heroRect = heroEl.getBoundingClientRect();
        const btnRect = searchBtn.getBoundingClientRect();
        // Distance from the bottom of the hero section to the bottom of the search button
        const btnTargetY = btnRect.bottom;
        const offset = Math.max(0, Math.round(heroRect.bottom - btnTargetY));
        if (offset > 0) {
          setBannerBottomOffset(offset);
        }
      }
    };

    updateBannerBottom();
    window.addEventListener('resize', updateBannerBottom);

    let observer = null;
    if (typeof ResizeObserver !== 'undefined' && heroSectionRef.current) {
      observer = new ResizeObserver(() => {
        updateBannerBottom();
      });
      observer.observe(heroSectionRef.current);
    }

    const t1 = setTimeout(updateBannerBottom, 100);
    const t2 = setTimeout(updateBannerBottom, 300);
    const t3 = setTimeout(updateBannerBottom, 800);

    return () => {
      window.removeEventListener('resize', updateBannerBottom);
      if (observer) observer.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // Filter for showcase: "ALL" | "PARTICULIER" | "PRO"
  const [showcaseFilter, setShowcaseFilter] = useState('ALL');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const itemsPerPage = 4;

  const residentialProperties = useMemo(() => {
    return PROPERTIES_DATA.filter(p => p.destination !== 'PRO');
  }, []);

  const proCount = residentialProperties.filter(p => p.isPro || p.advertiserType === 'PRO').length;
  const particulierCount = residentialProperties.filter(p => !p.isPro || p.advertiserType === 'PARTICULIER').length;

  const filteredProperties = useMemo(() => {
    if (showcaseFilter === 'PRO') {
      return residentialProperties.filter(p => p.isPro || p.advertiserType === 'PRO');
    }
    if (showcaseFilter === 'PARTICULIER') {
      return residentialProperties.filter(p => !p.isPro || p.advertiserType === 'PARTICULIER');
    }
    return residentialProperties;
  }, [showcaseFilter, residentialProperties]);

  const totalFiltered = filteredProperties.length;

  const handlePrev = () => {
    setCarouselIndex(prev => (prev > 0 ? prev - 1 : Math.max(0, totalFiltered - itemsPerPage)));
  };

  const handleNext = () => {
    setCarouselIndex(prev => (prev + itemsPerPage < totalFiltered ? prev + 1 : 0));
  };

  const displayedProperties = filteredProperties.slice(carouselIndex, carouselIndex + itemsPerPage);

  // FAQ Accordion State (Exclusive, instant toggle with 0 animation)
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const toggleFaq = (index) => {
    setOpenFaqIndex(prev => (prev === index ? null : index));
  };

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    projectType: 'Achat',
    message: ''
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
  };

  const handleResetContact = () => {
    setContactSubmitted(false);
    setContactForm({
      fullName: '',
      phone: '',
      email: '',
      projectType: 'Achat',
      message: ''
    });
  };

  return (
    <div className="habitoo-homepage" style={{ position: 'relative', overflowX: 'hidden', backgroundColor: '#FFFFFF' }}>
      
      {/* =========================================================================
          1. HERO SECTION (Compact, Sharp Terrace Background stopping at vertical middle of Search)
          ========================================================================= */}
      <section ref={heroSectionRef} className="home-hero-section">
        
        {/* Background Banner with desktop & mobile sunset villa images, stopping at the exact height of the search button */}
        <div 
          className="hero-bg-banner"
          style={{ bottom: `${bannerBottomOffset}px` }}
        >
          <picture className="hero-bg-picture">
            <source media="(max-width: 768px)" srcSet="/assets/hero-sunset-villa-mobile.jpg" />
            <img 
              src="/assets/hero-terrace-skyline.jpg" 
              alt="Habitoo - Immobilier d'exception en Afrique" 
              className="hero-bg-photo"
            />
          </picture>
          {/* Subtle soft white overlay — douce, naturelle et non piquante */}
          <div className="hero-bg-overlay" />
        </div>

        <div className="container hero-content-container">
          
          {/* Upper Hero Area: Text Left */}
          <div className="hero-upper-row">
            
            {/* Left: Heading, Subtitle & 3 Trust Badges */}
            <div className="hero-text-column">
              {/* Pre-tag matching mockup */}
              <div className="hero-pre-tag">
                <span className="hero-pre-tag-dash" />
                <span>Des lieux pour aujourd'hui et demain</span>
              </div>

              <h1 className="font-serif hero-headline">
                Trouvez plus<br />
                qu'un logement,<br />
                <span className="hero-headline-red">trouvez votre chez-vous.</span>
              </h1>

              <p className="hero-subheadline">
                Maisons, appartements, terrains... en location ou en vente à Brazzaville, Kinshasa et Abidjan.
              </p>
            </div>

          </div>

          {/* Bottom Hero: SearchWidget (Centered, Straddling the bottom edge of the background photo) */}
          <div className="hero-search-anchor">
            <SearchWidget />
          </div>

        </div>
      </section>


      {/* =========================================================================
          2. EXPLORE BY TYPOLOGY (3 Image Cards: Appartements, Maisons, Terrains)
          ========================================================================= */}
      <section className="section-categories">
        <div className="container">
          <div className="categories-grid">
            
            {/* Card 1: Appartements */}
            <Link 
              to="/recherche?typologies=Appartement"
              className="category-card"
            >
              <img 
                src="/assets/category-appartement.jpg" 
                alt="Appartements confort et modernité"
                className="category-card-img"
              />
              <div className="category-card-overlay" />
              <div className="category-pill-badge">
                <div className="category-pill-icon">
                  <Building2 size={18} />
                </div>
                <div className="category-pill-text">
                  <div className="category-pill-title">Appartements</div>
                  <div className="category-pill-sub">Confort et modernité →</div>
                </div>
              </div>
            </Link>

            {/* Card 2: Maisons */}
            <Link 
              to="/recherche?typologies=Villa,Maison"
              className="category-card"
            >
              <img 
                src="/assets/category-maison.jpg" 
                alt="Maisons et villas pour toute la famille"
                className="category-card-img"
              />
              <div className="category-card-overlay" />
              <div className="category-pill-badge">
                <div className="category-pill-icon">
                  <Home size={18} />
                </div>
                <div className="category-pill-text">
                  <div className="category-pill-title">Maisons</div>
                  <div className="category-pill-sub">Pour toute la famille →</div>
                </div>
              </div>
            </Link>

            {/* Card 3: Terrains */}
            <Link 
              to="/recherche?typologies=Terrain"
              className="category-card"
            >
              <img 
                src="/assets/category-terrain.jpg" 
                alt="Terrains à vendre - Investissez dans l'avenir"
                className="category-card-img"
              />
              <div className="category-card-overlay" />
              <div className="category-pill-badge">
                <div className="category-pill-icon">
                  <Trees size={18} />
                </div>
                <div className="category-pill-text">
                  <div className="category-pill-title">Terrains</div>
                  <div className="category-pill-sub">Investissez dans l'avenir →</div>
                </div>
              </div>
            </Link>

          </div>
        </div>
      </section>


      {/* =========================================================================
          3. NOS DERNIÈRES ANNONCES (Latest Listings with Red Accent Bar)
          ========================================================================= */}
      <section className="section-showcase">
        <div className="container">
          
          {/* Section Header */}
          <div className="showcase-header">
            <div>
              {/* Red Accent Dash from prototype */}
              <div className="showcase-red-dash" />
              <h2 className="font-serif showcase-title">
                Nos dernières annonces
              </h2>
              <p className="showcase-subtitle">
                Des biens sélectionnés pour vous, aux meilleurs emplacements.
              </p>
            </div>

            <div className="showcase-header-actions">
              <Link to="/recherche" className="showcase-view-all">
                <span>Voir toutes les annonces ({PROPERTIES_DATA.length})</span>
                <ArrowRight size={15} />
              </Link>

              <div className="showcase-nav-arrows">
                <button 
                  onClick={handlePrev}
                  className="showcase-arrow-btn"
                  aria-label="Annonces précédentes"
                >
                  <ChevronLeft size={18} />
                </button>
                <button 
                  onClick={handleNext}
                  className="showcase-arrow-btn"
                  aria-label="Annonces suivantes"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Filter Tabs: Tout mélangé | Particuliers | Agences Pro */}
          <div className="showcase-filter-tabs">
            <button 
              type="button"
              onClick={() => { setShowcaseFilter('ALL'); setCarouselIndex(0); }}
              className={`showcase-tab ${showcaseFilter === 'ALL' ? 'active' : ''}`}
            >
              Toutes les annonces ({PROPERTIES_DATA.length})
            </button>
            <button 
              type="button"
              onClick={() => { setShowcaseFilter('PARTICULIER'); setCarouselIndex(0); }}
              className={`showcase-tab ${showcaseFilter === 'PARTICULIER' ? 'active' : ''}`}
            >
              Particuliers ({particulierCount})
            </button>
            <button 
              type="button"
              onClick={() => { setShowcaseFilter('PRO'); setCarouselIndex(0); }}
              className={`showcase-tab ${showcaseFilter === 'PRO' ? 'active' : ''}`}
            >
              <ShieldCheck size={13} strokeWidth={2.5} style={{ marginRight: '5px', verticalAlign: '-2px' }} />
              Agences Pro ({proCount})
            </button>
          </div>

          {/* 4 Listing Cards Grid */}
          <div className="showcase-grid">
            {displayedProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

        </div>
      </section>


      {/* =========================================================================
          4. SERVICES SECTION ("PLUS QU'UNE PLATEFORME D'ANNONCES")
             3 Alternating Feature Rows with Illustrative Photos
             - Service 1: Image Left, Text Right
             - Service 2: Text Left, Image Right (Inversé)
             - Service 3: Image Left, Text Right (Ainsi de suite)
          ========================================================================= */}
      <section id="services" className="section-services">
        <div className="container">
          
          {/* Section Header */}
          <div className="services-header">
            <span className="services-tag">
              PLUS QU'UNE PLATEFORME D'ANNONCES
            </span>
            <h2 className="font-serif services-title">
              Des services pour vous accompagner à chaque étape
            </h2>
            <p className="services-desc">
              Habitoo simplifie votre quotidien avec des services d'excellence, pensés pour les locataires, propriétaires et investisseurs.
            </p>
          </div>

          {/* 3 Alternating Showcase Rows */}
          <div className="services-rows-container">
            
            {/* SERVICE 1: Conciergerie (Image GAUCHE, Texte DROITE) */}
            <div className="service-split-row">
              <div className="service-img-col">
                <Link to="/conciergerie" className="service-img-wrapper" style={{ display: 'block', textDecoration: 'none' }}>
                  <img 
                    src="/assets/conciergerie-service.jpg" 
                    alt="Services de Conciergerie et intendance Habitoo" 
                    className="service-img" 
                  />
                </Link>
              </div>

              <div className="service-text-col">
                <div className="service-badge-chip">
                  <Home size={15} color="var(--primary-red)" />
                  <span>Conciergerie et Intendance</span>
                </div>
                <h3 className="font-serif service-row-title">
                  Confiez-nous la gestion complète de votre bien
                </h3>
                <p className="service-row-desc">
                  Ménage hôtelier, accueil physique des locataires, état des lieux rigoureux et maintenance d’urgence. Libérez-vous de toutes les contraintes de gestion locative en toute sérénité.
                </p>
                <ul className="service-features-list">
                  <li>
                    <CheckCircle2 size={18} className="service-check-icon" />
                    <span>Accueil personnalisé et remise sécurisée des clés</span>
                  </li>
                  <li>
                    <CheckCircle2 size={18} className="service-check-icon" />
                    <span>Ménage professionnel et blanchisserie de standing</span>
                  </li>
                  <li>
                    <CheckCircle2 size={18} className="service-check-icon" />
                    <span>États des lieux contradictoires avec photos HD horodatées</span>
                  </li>
                  <li>
                    <CheckCircle2 size={18} className="service-check-icon" />
                    <span>Maintenance technique réactive et dépannage 7j/7</span>
                  </li>
                </ul>
                <div className="service-action-wrapper">
                  <Link to="/conciergerie" className="service-cta-link">
                    <span>Découvrir la conciergerie</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* =========================================================================
          5. PROFESSIONNELS B2B SECTION (Positionné immédiatement sous Conciergerie)
          ========================================================================= */}
      <section id="professionnels" className="section-professionals">
        <div className="container">
          <div className="professionals-split">
            
            {/* Left Column: Authentic African Business Real Estate Image */}
           
    <div>
                <span className="professionals-tag">
                  PROFESSIONNELS
                </span>
                <h2 className="font-serif professionals-title">
                  Développez votre activité avec Habitoo
                </h2>
                <p className="professionals-desc">
                  Agences, démarcheurs, promoteurs... accédez à des outils puissants pour gérer vos annonces, suivre vos performances et booster votre visibilité.
                </p>

                <Link 
                  to="/professionnels"
                  className="btn-primary professionals-cta-btn"
                  style={{ textDecoration: 'none' }}
                >
                  <span>Découvrir l'Espace PRO</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            {/* Center & Right Column: B2B Arguments & Feature Checklist */}
            <div className="professionals-content">
           <div className="professionals-image-wrapper">
              <img 
                src="/assets/pro-african-business.jpg" 
                alt="Partenariat Professionnels de l'immobilier Habitoo" 
                className="professionals-img"
              />
            </div>

              {/* 5 Feature Checklist with Red Outline Icons */}
              <div className="professionals-features-list">
                <div className="pro-feature-item">
                  <div className="pro-feature-icon">
                    <FileText size={18} color="var(--primary-red)" />
                  </div>
                  <span>Tableau de bord personnalisé</span>
                </div>

                <div className="pro-feature-item">
                  <div className="pro-feature-icon">
                    <Award size={18} color="var(--primary-red)" />
                  </div>
                  <span>Badge PRO vérifié</span>
                </div>

                <div className="pro-feature-item">
                  <div className="pro-feature-icon">
                    <BarChart3 size={18} color="var(--primary-red)" />
                  </div>
                  <span>Statistiques de performance (vues, clics, contacts)</span>
                </div>

                <div className="pro-feature-item">
                  <div className="pro-feature-icon">
                    <Sparkles size={18} color="var(--primary-red)" />
                  </div>
                  <span>Options de mise en avant</span>
                </div>

                <div className="pro-feature-item">
                  <div className="pro-feature-icon">
                    <CreditCard size={18} color="var(--primary-red)" />
                  </div>
                  <span>Formules d'abonnement</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* =========================================================================
          5. CITIES SECTION (Atmospheric Night/Sunset Skyline Panorama Background)
          ========================================================================= */}
      <section className="section-cities">
        <div className="cities-bg-overlay" />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          
          {/* Header */}
          <div className="cities-header">
            <div>
              <span className="cities-tag">Nos villes</span>
              <h2 className="font-serif cities-title">
                Des opportunités dans les grandes villes d'Afrique
              </h2>
            </div>
            <Link to="/recherche" className="cities-view-all-btn">
              <span>Voir toutes les annonces</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* 3 City Cards */}
          <div className="cities-cards-grid">
            
            {/* City 1: Brazzaville */}
            <div 
              onClick={() => navigate('/recherche?location=Brazzaville')}
              className="city-explore-card"
            >
              <div className="city-explore-img-wrap">
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ19bAg1tGTR5uXVOK2Y2YZHkVSqDyfQnKr4-FOf8QHMA&s=10" 
                  alt="Brazzaville, Congo"
                  className="city-explore-img"
                />
              </div>
              <div className="city-explore-info">
                <div>
                  <div className="city-explore-name">Brazzaville</div>
                  <div className="city-explore-country">Congo</div>
                </div>
                <div className="city-explore-chevron">
                  <ChevronRightIcon size={18} />
                </div>
              </div>
            </div>

            {/* City 2: Kinshasa */}
            <div 
              onClick={() => navigate('/recherche?location=Kinshasa')}
              className="city-explore-card"
            >
              <div className="city-explore-img-wrap">
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS04aBjA76VbK6BtHJzacbKyEuzugLVVW8KOmYT9toamg&s=10" 
                  alt="Kinshasa, RDC"
                  className="city-explore-img"
                />
              </div>
              <div className="city-explore-info">
                <div>
                  <div className="city-explore-name">Kinshasa</div>
                  <div className="city-explore-country">RDC</div>
                </div>
                <div className="city-explore-chevron">
                  <ChevronRightIcon size={18} />
                </div>
              </div>
            </div>

            {/* City 3: Abidjan */}
            <div 
              onClick={() => navigate('/recherche?location=Abidjan')}
              className="city-explore-card"
            >
              <div className="city-explore-img-wrap">
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1Lu9CPrBLgdnopYiRWnYxwVNrc4LiRaok0w0F1flidQ&s=10" 
                  alt="Abidjan, Côte d'Ivoire"
                  className="city-explore-img"
                />
              </div>
              <div className="city-explore-info">
                <div>
                  <div className="city-explore-name">Abidjan</div>
                  <div className="city-explore-country">Côte d'Ivoire</div>
                </div>
                <div className="city-explore-chevron">
                  <ChevronRightIcon size={18} />
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>




      {/* =========================================================================
          7. MOBILE APP BANNER ("BIENTÔT SUR MOBILE")
          ========================================================================= */}
      <section className="section-mobile-app">
        <div className="container">
          <div className="mobile-app-banner">
            
            {/* Left: Text Info */}
            <div className="mobile-app-content">
              <span className="mobile-app-tag">
                Habitoo partout avec vous
              </span>
              <h2 className="font-serif mobile-app-title">
                Bientôt sur mobile
              </h2>
              <p className="mobile-app-desc">
                Accédez à vos annonces, recevez des alertes et gérez vos rendez-vous, où que vous soyez.
              </p>
            </div>

            {/* Right: Dual iPhone Mockups with Habitoo App + Handwritten Note & Arrow */}
            <div className="mobile-app-visual">
              <img 
                src="/assets/mobile-app-mockup.png" 
                alt="Habitoo sur mobile - Restez connecté à vos projets !" 
                className="mobile-app-mockup-img"
              />
            </div>

          </div>
        </div>
      </section>


      {/* =========================================================================
          8. FAQ SECTION (Interactive Accordion, Pur React, Zéro Animation)
          ========================================================================= */}
      <section id="faq" className="section-faq">
        <div className="container">
          <div className="faq-header">
            <span className="faq-tag">FAQ et AIDE</span>
            <h2 className="font-serif faq-title">Questions fréquentes</h2>
            <p className="faq-subtitle">
              Tout ce que vous devez savoir pour vos projets d'acquisition, de location et d'intendance de standing.
            </p>
          </div>

          <div className="faq-list">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className={`faq-item ${isOpen ? 'faq-item-open' : ''}`}>
                  <button
                    type="button"
                    className="faq-question-btn"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-question-text">{item.question}</span>
                    <span className="faq-icon-indicator">
                      {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="faq-answer">
                      <p>{item.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* =========================================================================
          9. CONTACT SECTION (Deux Colonnes Épurées et Réassurance Privée)
          ========================================================================= */}
      <section id="contact" className="section-contact">
        <div className="container">
          <div className="contact-grid">
            
            {/* Colonne Gauche : Coordonnées Directes et Représentations */}
            <div className="contact-info-panel">
              <span className="contact-tag">CONTACT et SERVICE PRIVÉ</span>
              <h2 className="font-serif contact-title">
                Échangez avec nos conseillers privés
              </h2>
              <p className="contact-desc">
                Un projet d'acquisition, de vente ou de mise en gestion de standing ? Nos experts vous répondent sous 24h ouvrées.
              </p>

              <div className="contact-details-list">
                <div className="contact-detail-item">
                  <div className="contact-detail-icon">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="contact-detail-title">Siège et Bureau Principal</h4>
                    <p className="contact-detail-text">Cocody Ambassades, Boulevard de France</p>
                    <p className="contact-detail-sub">Abidjan, Côte d'Ivoire</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-detail-icon">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h4 className="contact-detail-title">Bureaux de liaison régionaux</h4>
                    <p className="contact-detail-text">Brazzaville : Quartier Mpila</p>
                    <p className="contact-detail-text">Kinshasa : Boulevard du 30 Juin, Gombe</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-detail-icon">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="contact-detail-title">Téléphone direct</h4>
                    <a href="tel:+2252722001122" className="contact-link">+225 27 22 00 11 22</a>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-detail-icon">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="contact-detail-title">Courriel direct</h4>
                    <a href="mailto:contact@habitoo.com" className="contact-link">contact@habitoo.com</a>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-detail-icon">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="contact-detail-title">Horaires d'ouverture</h4>
                    <p className="contact-detail-text">Lundi – Vendredi : 08h30 – 18h30</p>
                    <p className="contact-detail-sub">Samedi : 09h00 – 14h00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne Droite : Formulaire Rapide In-Situ */}
            <div className="contact-form-panel">
              {contactSubmitted ? (
                <div className="contact-success-box">
                  <div className="contact-success-icon">
                    <CheckCircle2 size={44} color="var(--verified-green)" />
                  </div>
                  <h3 className="contact-success-title">Demande transmise avec succès</h3>
                  <p className="contact-success-text">
                    Merci pour votre confiance. Un conseiller dédié Habitoo étudie vos éléments et prendra contact avec vous sous 24h ouvrées.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetContact}
                    className="btn-primary"
                    style={{ marginTop: '20px' }}
                  >
                    Envoyer une autre demande
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="contact-form">
                  <h3 className="contact-form-title">Transmettez-nous votre demande</h3>
                  
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-fullName">Nom et prénom *</label>
                    <input
                      id="contact-fullName"
                      type="text"
                      name="fullName"
                      value={contactForm.fullName}
                      onChange={handleContactChange}
                      required
                      placeholder="Ex: Jean-Marc Kouassi"
                      className="form-input"
                    />
                  </div>

                  <div className="contact-form-row">
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label" htmlFor="contact-phone">Téléphone *</label>
                      <input
                        id="contact-phone"
                        type="tel"
                        name="phone"
                        value={contactForm.phone}
                        onChange={handleContactChange}
                        required
                        placeholder="+225 07 00 00 00 00"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label" htmlFor="contact-email">Email *</label>
                      <input
                        id="contact-email"
                        type="email"
                        name="email"
                        value={contactForm.email}
                        onChange={handleContactChange}
                        required
                        placeholder="votre@email.com"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-projectType">Nature de votre projet *</label>
                    <select
                      id="contact-projectType"
                      name="projectType"
                      value={contactForm.projectType}
                      onChange={handleContactChange}
                      className="form-select"
                    >
                      <option value="Achat">Achat de bien d'exception</option>
                      <option value="Location">Location résidentielle de prestige</option>
                      <option value="Vente">Vente / Mandat d'un bien de standing</option>
                      <option value="Conciergerie">Conciergerie et Intendance privée</option>
                      <option value="Partenariat">Partenariat professionnel / Promoteur</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-message">Votre message ou cahier des charges *</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      value={contactForm.message}
                      onChange={handleContactChange}
                      required
                      placeholder="Précisez votre recherche, localisation souhaitée, budget ou question..."
                      className="form-textarea"
                    />
                  </div>

                  <button type="submit" className="btn-primary contact-submit-btn">
                    <Send size={16} />
                    <span>Envoyer ma demande</span>
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          PAGE CSS STYLING (Pixel-perfect alignment with prototype)
          ========================================================================= */}
      <style>{`
        /* ===== 1. HERO SECTION (COMPACT HEIGHT & BACKGROUND STOPPING AT VERTICAL MIDDLE OF SEARCH) ===== */
        .home-hero-section {
          position: relative;
          width: 100%;
          padding-top: clamp(20px, 3vw, 32px);
          padding-bottom: 0;
          background-color: transparent;
          overflow: visible;
        }
        .hero-bg-banner {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          /* Stops vertically right at the level of the search button */
          bottom: 82px;
          overflow: hidden;
          z-index: 1;
        }
        .hero-bg-picture {
          width: 100%;
          height: 100%;
          display: block;
        }
        .hero-bg-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 35%;
          /* Crisp & sharp: absolutely NO blur */
          filter: none !important;
          display: block;
        }
        .hero-bg-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0.72) 0%,
            rgba(255, 255, 255, 0.52) 30%,
            rgba(255, 255, 255, 0.15) 54%,
            transparent 72%
          );
          pointer-events: none;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }
        @media (max-width: 600px) {
          .hero-bg-overlay {
            background: linear-gradient(
              to bottom,
              rgba(255, 255, 255, 0.76) 0%,
              rgba(255, 255, 255, 0.52) 42%,
              rgba(255, 255, 255, 0.12) 75%,
              transparent 100%
            );
          }
        }
        @media (max-width: 768px) {
          .home-hero-section {
            padding-top: 66px !important;
          }
          .hero-upper-row {
            margin-bottom: 8px !important;
          }
          .hero-headline {
            font-size: 1.65rem !important;
            line-height: 1.14 !important;
            margin-bottom: 6px !important;
            letter-spacing: -0.5px !important;
          }
          .hero-subheadline {
            font-size: 0.8125rem !important;
            line-height: 1.35 !important;
            margin-bottom: 8px !important;
          }
        }
        .hero-content-container {
          position: relative;
          z-index: 2;
        }
        .hero-upper-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 16px;
          gap: 20px;
        }
        .hero-text-column {
          max-width: 580px;
        }
        .hero-pre-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #4B5563;
          margin-bottom: 8px;
          letter-spacing: 0.2px;
        }
        .hero-pre-tag-dash {
          display: inline-block;
          width: 18px;
          height: 3px;
          background-color: var(--primary-red);
          border-radius: 2px;
        }
        .hero-headline {
          font-size: clamp(1.8rem, 3.2vw, 2.55rem);
          font-weight: 800;
          line-height: 1.14;
          color: var(--obsidian-black);
          letter-spacing: -0.8px;
          margin-bottom: 8px;
        }
        .hero-headline-red {
          color: var(--primary-red);
          display: inline;
        }
        .hero-subheadline {
          font-size: clamp(0.85rem, 1.15vw, 0.9375rem);
          color: #1F2937;
          line-height: 1.45;
          margin-bottom: 14px;
          max-width: 500px;
          font-weight: 600;
        }

        .hero-search-anchor {
          position: relative;
          z-index: 20;
          margin-top: 4px;
        }

        /* Section Head Row (Common for Categories, Cities, Services) */
        .section-head-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 18px;
          gap: 12px;
        }
        .section-head-title {
          font-size: clamp(1.4rem, 2.4vw, 1.95rem);
          font-weight: 800;
          color: var(--obsidian-black);
          line-height: 1.2;
          margin: 0;
        }
        .section-head-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--primary-red);
          text-decoration: none;
          white-space: nowrap;
          transition: transform 0.15s ease, opacity 0.15s ease;
        }
        .section-head-link:hover {
          opacity: 0.85;
          transform: translateX(2px);
        }

        /* ===== 2. CATEGORIES SECTION ===== */
        .section-categories {
          padding: 36px 0 28px 0;
          background-color: #F9FAFB;
        }
        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }
        .category-card {
          position: relative;
          height: 190px;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: none;
          border: 1px solid var(--border-color);
          display: block;
          text-decoration: none;
          transition: transform 0.25s ease, border-color 0.25s ease;
        }
        .category-card:hover {
          transform: translateY(-4px);
          box-shadow: none;
          border-color: #9CA3AF;
        }
        .category-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .category-card:hover .category-card-img {
          transform: scale(1.04);
        }
        .category-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 60%);
        }
        .category-pill-badge {
          position: absolute;
          bottom: 14px;
          left: 14px;
          background-color: #FFFFFF;
          border-radius: 12px;
          padding: 8px 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: none;
          border: 1px solid rgba(0, 0, 0, 0.08);
        }
        .category-pill-icon {
          color: var(--obsidian-black);
          display: flex;
          align-items: center;
        }
        .category-pill-title {
          font-weight: 800;
          font-size: 0.9rem;
          color: var(--obsidian-black);
          line-height: 1.1;
        }
        .category-pill-sub {
          font-size: 0.75rem;
          color: #6B7280;
          font-weight: 500;
        }

        /* ===== 3. SHOWCASE SECTION ===== */
        .section-showcase {
          padding: 52px 0;
          background-color: #FFFFFF;
        }
        .showcase-red-dash {
          width: 28px;
          height: 3px;
          background-color: var(--primary-red);
          border-radius: 2px;
          margin-bottom: 10px;
        }
        .showcase-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 26px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .showcase-title {
          font-size: clamp(1.8rem, 3.2vw, 2.3rem);
          font-weight: 800;
          color: var(--obsidian-black);
          margin-bottom: 6px;
        }
        .showcase-subtitle {
          font-size: 0.9375rem;
          color: #6B7280;
        }
        .showcase-header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        @media (max-width: 600px) {
          .section-showcase {
            padding: 36px 0;
          }
          .showcase-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 18px;
          }
          .showcase-header-actions {
            width: 100%;
            justify-content: space-between;
          }
          .showcase-nav-arrows {
            display: none;
          }
        }
        .showcase-view-all {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-weight: 700;
          font-size: 0.875rem;
          color: var(--obsidian-black);
          text-decoration: none;
          transition: color 0.15s;
        }
        .showcase-view-all:hover {
          color: var(--primary-red);
        }
        .showcase-nav-arrows {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .showcase-arrow-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid var(--border-color);
          background-color: #FFFFFF;
          color: var(--obsidian-black);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s;
        }
        .showcase-arrow-btn:hover {
          border-color: var(--primary-red);
          color: var(--primary-red);
        }
        .showcase-filter-tabs {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 22px;
          flex-wrap: wrap;
        }
        .showcase-tab {
          padding: 7px 16px;
          border-radius: 9999px;
          font-size: 0.8125rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid var(--border-color);
          background-color: #FFFFFF;
          color: #4B5563;
          display: inline-flex;
          align-items: center;
        }
        .showcase-tab:hover {
          border-color: #9CA3AF;
          color: var(--obsidian-black);
          background-color: #F9FAFB;
        }
        .showcase-tab.active {
          background-color: var(--obsidian-black);
          color: #FFFFFF;
          border-color: var(--obsidian-black);
          box-shadow: none;
        }
        .showcase-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }
        .showcase-grid > div {
          box-shadow: none !important;
        }
        .showcase-grid > div:hover {
          box-shadow: none !important;
          border-color: #9CA3AF !important;
        }

        /* ===== 4. SERVICES SECTION ===== */
        .section-services {
          padding: 64px 0 60px;
          background-color: #FAF5F5;
        }
        .services-header,
        .services-section-header {
          text-align: left;
          max-width: 1000px;
          margin: 0 0 32px 0;
        }
        .services-tag {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--primary-red);
          letter-spacing: 1px;
          text-transform: uppercase;
          display: inline-block;
          margin-bottom: 8px;
        }
        .services-title {
          font-size: clamp(1.75rem, 2.8vw, 2.35rem);
          font-weight: 800;
          color: var(--obsidian-black);
          line-height: 1.2;
          margin-bottom: 8px;
        }
        .services-desc {
          font-size: 0.9375rem;
          color: #6B7280;
          line-height: 1.45;
          max-width: 850px;
          margin: 0;
        }

        .services-rows-container {
          display: flex;
          flex-direction: column;
          gap: 48px;
        }

        .service-split-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 36px;
          align-items: center;
          background-color: #FFFFFF;
          border-radius: 28px;
          padding: 32px;
          box-shadow: none;
          border: 1px solid rgba(0, 0, 0, 0.08);
          transition: transform 0.25s ease, border-color 0.25s ease;
        }
        .service-split-row:hover {
          box-shadow: none;
          border-color: rgba(0, 0, 0, 0.16);
        }

        @media (min-width: 960px) {
          .service-split-row {
            grid-template-columns: 1fr 1fr;
            gap: 56px;
            padding: 48px;
          }
        }

        /* Image column */
        .service-img-col {
          width: 100%;
        }
        .service-img-wrapper {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: none;
          border: 1px solid rgba(0, 0, 0, 0.08);
          aspect-ratio: 3 / 2;
          background-color: #E5E7EB;
        }
        .service-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }
        .service-split-row:hover .service-img {
          transform: scale(1.03);
        }

        /* Floating badge over image */
        .service-floating-card {
          position: absolute;
          bottom: 18px;
          left: 18px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-radius: 14px;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: none;
          border: 1px solid rgba(0, 0, 0, 0.08);
          max-width: calc(100% - 36px);
        }
        .service-floating-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background-color: var(--soft-tint);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .service-floating-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--obsidian-black);
          line-height: 1.2;
        }
        .service-floating-sub {
          font-size: 0.75rem;
          color: #6B7280;
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Text column */
        .service-text-col {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .service-badge-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background-color: var(--soft-tint);
          color: var(--primary-red);
          border-radius: 9999px;
          font-size: 0.8125rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          margin-bottom: 16px;
          width: fit-content;
        }
        .service-row-title {
          font-size: clamp(1.4rem, 2.2vw, 1.85rem);
          font-weight: 800;
          color: var(--obsidian-black);
          line-height: 1.3;
          margin-bottom: 14px;
        }
        .service-row-desc {
          font-size: 0.95rem;
          color: #4B5563;
          line-height: 1.6;
          margin-bottom: 22px;
        }

        .service-features-list {
          list-style: none;
          padding: 0;
          margin: 0 0 28px 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .service-features-list li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.9375rem;
          color: #374151;
          line-height: 1.45;
        }
        .service-check-icon {
          color: var(--primary-red);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .service-action-wrapper {
          display: flex;
          align-items: center;
        }
        .service-cta-link {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 13px 26px;
          border-radius: 9999px;
          background-color: var(--primary-red);
          color: #FFFFFF;
          font-weight: 700;
          font-size: 0.9375rem;
          box-shadow: none;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .service-cta-link:hover {
          background-color: #d10000;
          transform: translateY(-1px);
          box-shadow: none;
        }


        /* ===== 5. CITIES SECTION ===== */
        .section-cities {
          position: relative;
          padding: 64px 0;
          background: #111827 url('/assets/hero-terrace-skyline.jpg') center center/cover no-repeat;
          overflow: hidden;
        }
        .cities-bg-overlay {
          position: absolute;
          inset: 0;
          background: rgba(10, 15, 25, 0.82);
        }
        .cities-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 16px;
        }
        @media (max-width: 600px) {
          .cities-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
        }
        .cities-tag {
          font-size: 0.8125rem;
          font-weight: 700;
          color: #9CA3AF;
          display: block;
          margin-bottom: 6px;
        }
        .cities-title {
          font-size: clamp(1.8rem, 3.2vw, 2.3rem);
          font-weight: 800;
          color: #FFFFFF;
        }
        .cities-view-all-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.08);
          color: #FFFFFF;
          font-size: 0.85rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
        }
        .cities-view-all-btn:hover {
          background: #FFFFFF;
          color: #111827;
        }
        .cities-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 22px;
        }
        .city-explore-card {
          background-color: #FFFFFF;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: none;
          border: 1px solid rgba(255, 255, 255, 0.15);
          cursor: pointer;
          transition: transform 0.25s ease;
        }
        .city-explore-card:hover {
          transform: translateY(-4px);
          box-shadow: none;
        }
        .city-explore-img-wrap {
          height: 140px;
          width: 100%;
          overflow: hidden;
        }
        .city-explore-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.35s ease;
        }
        .city-explore-card:hover .city-explore-img {
          transform: scale(1.06);
        }
        .city-explore-info {
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #FFFFFF;
        }
        .city-explore-name {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--obsidian-black);
        }
        .city-explore-country {
          font-size: 0.75rem;
          color: #6B7280;
        }
        .city-explore-chevron {
          color: var(--obsidian-black);
          transition: transform 0.2s;
        }
        .city-explore-card:hover .city-explore-chevron {
          transform: translateX(4px);
          color: var(--primary-red);
        }

        /* ===== 5. PROFESSIONALS B2B SECTION ===== */
        .section-professionals {
          padding: 60px 0 68px;
          background-color: #FFFFFF;
        }
        .professionals-split {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          align-items: center;
        }
        @media (min-width: 960px) {
          .professionals-split {
            grid-template-columns: 460px 1fr;
            gap: 52px;
          }
        }
        .professionals-image-wrapper {
          border-radius: 22px;
          overflow: hidden;
          box-shadow: none;
          border: 1px solid rgba(0, 0, 0, 0.08);
          aspect-ratio: 4 / 3;
          background-color: #F3F4F6;
        }
        .professionals-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }
        .professionals-image-wrapper:hover .professionals-img {
          transform: scale(1.02);
        }
        .professionals-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }
        @media (min-width: 768px) {
          .professionals-content {
            grid-template-columns: 1.1fr 0.9fr;
            align-items: center;
          }
        }
        .professionals-tag {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--primary-red);
          letter-spacing: 0.8px;
          text-transform: uppercase;
          display: block;
          margin-bottom: 8px;
        }
        .professionals-title {
          font-size: clamp(1.8rem, 3.2vw, 2.3rem);
          font-weight: 800;
          color: var(--obsidian-black);
          line-height: 1.2;
          margin-bottom: 14px;
        }
        .professionals-desc {
          font-size: 0.9375rem;
          color: #4B5563;
          line-height: 1.5;
          margin-bottom: 24px;
        }
        .professionals-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 9999px;
          background-color: var(--primary-red);
          color: #FFFFFF;
          font-weight: 700;
          font-size: 0.9rem;
          border: none;
          box-shadow: none;
          cursor: pointer;
        }
        .professionals-features-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .pro-feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--obsidian-black);
        }
        .pro-feature-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background-color: var(--soft-tint);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        /* ===== 7. MOBILE APP BANNER (EXACT HIGH-RES REFERENCE MATCH) ===== */
        .section-mobile-app {
          padding: 44px 0 64px 0;
          background-color: #FFFFFF;
        }
        .mobile-app-banner {
          background-color: #E3020A;
          border-radius: 24px;
          max-width: 1140px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1.25fr;
          align-items: center;
          position: relative;
          overflow: hidden;
          box-shadow: none;
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 0 0 0 clamp(24px, 4.5vw, 56px);
        }
        .mobile-app-content {
          padding: clamp(36px, 4vw, 50px) 0;
          max-width: 440px;
        }
        .mobile-app-tag {
          font-size: 0.8125rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.92);
          display: block;
          margin-bottom: 8px;
          letter-spacing: 0.2px;
        }
        .mobile-app-title {
          font-family: var(--font-serif);
          font-size: clamp(2rem, 3.4vw, 2.75rem);
          font-weight: 800;
          color: #FFFFFF;
          line-height: 1.14;
          margin-bottom: 12px;
          letter-spacing: -0.5px;
        }
        .mobile-app-desc {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.92);
          line-height: 1.5;
        }
        .mobile-app-visual {
          position: relative;
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
          height: 100%;
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 40px, black 100%);
          mask-image: linear-gradient(to right, transparent 0%, black 40px, black 100%);
        }
        .mobile-app-mockup-img {
          width: 100%;
          max-width: 640px;
          height: auto;
          display: block;
        }
        @media (max-width: 899px) {
          .mobile-app-banner {
            grid-template-columns: 1fr;
            padding: 36px 20px 0 20px;
            text-align: center;
          }
          .mobile-app-content {
            padding: 0 0 20px 0;
            margin: 0 auto;
            max-width: 100%;
          }
          .mobile-app-visual {
            justify-content: center;
            width: 100%;
            -webkit-mask-image: none;
            mask-image: none;
          }
          .mobile-app-mockup-img {
            max-width: 480px;
          }
        }

        /* ===== 8. FAQ SECTION (ZERO ANIMATION, SHARP BORDERS) ===== */
        .section-faq {
          padding: 72px 0 64px;
          background-color: #FFFFFF;
          border-top: 1px solid var(--border-color);
        }
        .faq-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 40px auto;
        }
        .faq-tag {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--primary-red);
          letter-spacing: 0.8px;
          text-transform: uppercase;
          display: block;
          margin-bottom: 8px;
        }
        .faq-title {
          font-size: clamp(1.8rem, 3vw, 2.3rem);
          font-weight: 800;
          color: var(--obsidian-black);
          line-height: 1.2;
          margin-bottom: 12px;
        }
        .faq-subtitle {
          font-size: 0.95rem;
          color: #6B7280;
          line-height: 1.5;
        }
        .faq-list {
          max-width: 860px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .faq-item {
          background: #FAFAFA;
          border: 1px solid var(--border-color);
          border-radius: 10px;
          overflow: hidden;
          transition: none;
        }
        .faq-item-open {
          background: #FFFFFF;
          border-color: #D1D5DB;
        }
        .faq-question-btn {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 24px;
          text-align: left;
          background: transparent;
          border: none;
          cursor: pointer;
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 700;
          color: var(--obsidian-black);
          gap: 16px;
          transition: none;
        }
        .faq-item-open .faq-question-btn {
          color: var(--primary-red);
        }
        .faq-question-text {
          flex: 1;
        }
        .faq-icon-indicator {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background-color: rgba(0, 0, 0, 0.05);
          color: var(--obsidian-black);
          flex-shrink: 0;
          transition: none;
        }
        .faq-item-open .faq-icon-indicator {
          background-color: var(--primary-red-light);
          color: var(--primary-red);
        }
        .faq-answer {
          padding: 0 24px 20px 24px;
          font-size: 0.9375rem;
          color: #4B5563;
          line-height: 1.6;
          transition: none;
        }

        /* ===== 9. CONTACT SECTION (TWO-COLUMN CORPORATE) ===== */
        .section-contact {
          padding: 72px 0 80px;
          background-color: #F8F9FA;
          border-top: 1px solid var(--border-color);
        }
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 36px;
          align-items: start;
        }
        @media (min-width: 960px) {
          .contact-grid {
            grid-template-columns: 1fr 1fr;
            gap: 48px;
          }
        }
        .contact-info-panel, .contact-form-panel {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: clamp(24px, 3.5vw, 40px);
          box-shadow: var(--shadow-sm);
        }
        .contact-tag {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--primary-red);
          letter-spacing: 0.8px;
          text-transform: uppercase;
          display: block;
          margin-bottom: 8px;
        }
        .contact-title {
          font-size: clamp(1.6rem, 2.5vw, 2rem);
          font-weight: 800;
          color: var(--obsidian-black);
          line-height: 1.25;
          margin-bottom: 12px;
        }
        .contact-desc {
          font-size: 0.9375rem;
          color: #4B5563;
          line-height: 1.55;
          margin-bottom: 28px;
        }
        .contact-details-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .contact-detail-item {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }
        .contact-detail-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: var(--soft-tint);
          color: var(--primary-red);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .contact-detail-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--obsidian-black);
          margin-bottom: 2px;
        }
        .contact-detail-text {
          font-size: 0.875rem;
          color: #4B5563;
          line-height: 1.4;
        }
        .contact-detail-sub {
          font-size: 0.8125rem;
          color: #6B7280;
        }
        .contact-link {
          color: var(--obsidian-black);
          font-weight: 600;
          font-size: 0.9375rem;
          text-decoration: none;
          transition: color 0.15s;
        }
        .contact-link:hover {
          color: var(--primary-red);
          text-decoration: underline;
        }
        .contact-form-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--obsidian-black);
          margin-bottom: 20px;
        }
        .contact-form-row {
          display: flex;
          gap: 16px;
        }
        @media (max-width: 600px) {
          .contact-form-row {
            flex-direction: column;
            gap: 0;
          }
        }
        .contact-submit-btn {
          width: 100%;
          margin-top: 8px;
          cursor: pointer;
          border: none;
        }
        .contact-success-box {
          text-align: center;
          padding: 32px 16px;
        }
        .contact-success-icon {
          margin-bottom: 16px;
          display: flex;
          justify-content: center;
        }
        .contact-success-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--obsidian-black);
          margin-bottom: 8px;
        }
        .contact-success-text {
          font-size: 0.9375rem;
          color: #4B5563;
          line-height: 1.5;
          max-width: 440px;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
