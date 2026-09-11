import React, { useState } from 'react';
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
  Rotate3d, 
  Award, 
  CreditCard, 
  FileText,
  BarChart3,
  ChevronRight as ChevronRightIcon,
  CheckCircle2,
  ClipboardCheck
} from 'lucide-react';

export const HomePage = () => {
  const { openAuthModal } = useHabitoo();
  const navigate = useNavigate();

  // Carousel pagination for "Nos dernières annonces"
  const [carouselIndex, setCarouselIndex] = useState(0);
  const itemsPerPage = 4;
  const totalListings = PROPERTIES_DATA.length;

  const handlePrev = () => {
    setCarouselIndex(prev => (prev > 0 ? prev - 1 : Math.max(0, totalListings - itemsPerPage)));
  };

  const handleNext = () => {
    setCarouselIndex(prev => (prev + itemsPerPage < totalListings ? prev + 1 : 0));
  };

  const displayedProperties = PROPERTIES_DATA.slice(carouselIndex, carouselIndex + itemsPerPage);

  return (
    <div className="habitoo-homepage" style={{ position: 'relative', overflowX: 'hidden', backgroundColor: '#FFFFFF' }}>
      
      {/* =========================================================================
          1. HERO SECTION (Compact, Sharp Terrace Background stopping at vertical middle of Search)
          ========================================================================= */}
      <section className="home-hero-section">
        
        {/* Background Banner with sharp terrace photo, stopping at vertical middle of search form */}
        <div className="hero-bg-banner">
          <img 
            src="/assets/hero-terrace-skyline.jpg" 
            alt="Habitoo - Immobilier d'exception en Afrique" 
            className="hero-bg-photo"
          />
          {/* Subtle light contrast overlay on left — ZERO blur */}
          <div className="hero-bg-overlay" />
        </div>

        {/* Floating Glass Badge centered vertically with respect to the background banner */}
        <div className="hero-bg-center-target hide-mobile">
          <div className="container hero-bg-badge-flex">
            <div className="hero-floating-glass-pill">
              Des lieux pour aujourd'hui et demain.
            </div>
          </div>
        </div>

        <div className="container hero-content-container">
          
          {/* Upper Hero Area: Text Left */}
          <div className="hero-upper-row">
            
            {/* Left: Heading, Subtitle & 3 Trust Badges */}
            <div className="hero-text-column">
              <h1 className="font-serif hero-headline">
                Trouvez plus<br />
                qu'un logement,<br />
                <span className="hero-headline-red">trouvez votre chez-vous.</span>
              </h1>

              <p className="hero-subheadline">
                Maisons, appartements, terrains... en location ou en vente, dans les plus grandes villes d'Afrique.
              </p>

              {/* 3 Trust Highlights matching prototype */}
              <div className="hero-trust-badges">
                <div className="hero-trust-badge">
                  <div className="hero-trust-icon-box">
                    <Home size={15} strokeWidth={2.2} />
                  </div>
                  <span>Annonces vérifiées</span>
                </div>

                <div className="hero-trust-badge">
                  <div className="hero-trust-icon-box">
                    <MapPin size={15} strokeWidth={2.2} />
                  </div>
                  <span>Particuliers et professionnels</span>
                </div>

                <div className="hero-trust-badge">
                  <div className="hero-trust-icon-box">
                    <Star size={15} strokeWidth={2.2} />
                  </div>
                  <span>Un accompagnement de confiance</span>
                </div>
              </div>
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
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" 
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
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80" 
                alt="Maisons pour toute la famille"
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
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80" 
                alt="Terrains investissez dans l'avenir"
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
                <span>Voir toutes les annonces ({totalListings})</span>
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
          <div className="services-section-header">
            <span className="services-tag">
              PLUS QU'UNE PLATEFORME D'ANNONCES
            </span>
            <h2 className="font-serif services-title">
              Des services pour vous accompagner
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
                  <span>01 • Conciergerie & Intendance</span>
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
                    <span>Accueil personnalisé & remise sécurisée des clés</span>
                  </li>
                  <li>
                    <CheckCircle2 size={18} className="service-check-icon" />
                    <span>Ménage professionnel & blanchisserie de standing</span>
                  </li>
                  <li>
                    <CheckCircle2 size={18} className="service-check-icon" />
                    <span>États des lieux contradictoires avec photos HD horodatées</span>
                  </li>
                  <li>
                    <CheckCircle2 size={18} className="service-check-icon" />
                    <span>Maintenance technique réactive & dépannage 7j/7</span>
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

            {/* SERVICE 2: Inspection de bien (DISPOSITION INVERSÉE: Texte GAUCHE, Image DROITE) */}
            <div className="service-split-row service-split-reverse">
              <div className="service-text-col">
                <div className="service-badge-chip">
                  <ClipboardCheck size={15} color="var(--primary-red)" />
                  <span>02 • Inspection de bien & État des lieux</span>
                </div>
                <h3 className="font-serif service-row-title">
                  Un état des lieux fiable pour une location en toute confiance
                </h3>
                <p className="service-row-desc">
                  Nos inspecteurs certifiés réalisent un audit complet et contradictoire de votre propriété. Sécurisez votre investissement et prévenez tout litige grâce à un rapport d'expertise numérique avec photos HD horodatées.
                </p>
                <ul className="service-features-list">
                  <li>
                    <CheckCircle2 size={18} className="service-check-icon" />
                    <span>Audit complet des pièces, surfaces, électricité & plomberie</span>
                  </li>
                  <li>
                    <CheckCircle2 size={18} className="service-check-icon" />
                    <span>Vérification de l'état des murs, plafonds, portes et menuiseries</span>
                  </li>
                  <li>
                    <CheckCircle2 size={18} className="service-check-icon" />
                    <span>Contrôle approfondi de la sécurité et conformité des équipements</span>
                  </li>
                  <li>
                    <CheckCircle2 size={18} className="service-check-icon" />
                    <span>Rapport d'inspection numérique détaillé avec photos et signature</span>
                  </li>
                </ul>
                <div className="service-action-wrapper">
                  <Link to="/conciergerie" className="service-cta-link">
                    <span>Demander une inspection</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              <div className="service-img-col">
                <Link to="/conciergerie" className="service-img-wrapper" style={{ display: 'block', textDecoration: 'none' }}>
                  <img 
                    src="/assets/inspection-service.jpg" 
                    alt="Inspection de bien et état des lieux Habitoo" 
                    className="service-img" 
                  />
                </Link>
              </div>
            </div>

            {/* SERVICE 3: Visite virtuelle 360° (AINSI DE SUITE: Image GAUCHE, Texte DROITE) */}
            <div className="service-split-row">
              <div className="service-img-col">
                <Link to="/conciergerie#visite-360" className="service-img-wrapper" style={{ display: 'block', textDecoration: 'none' }}>
                  <img 
                    src="/assets/visite-360-service.jpg" 
                    alt="Visite virtuelle 360 immersive Habitoo" 
                    className="service-img" 
                  />
                </Link>
              </div>

              <div className="service-text-col">
                <div className="service-badge-chip">
                  <Rotate3d size={15} color="var(--primary-red)" />
                  <span>03 • Visite Virtuelle 360°</span>
                </div>
                <h3 className="font-serif service-row-title">
                  Découvrez un bien comme si vous y étiez, où que vous soyez
                </h3>
                <p className="service-row-desc">
                  Offrez une expérience immersive ultra-réaliste pour prendre des décisions en toute sérénité. Idéal pour séduire les acheteurs et la diaspora sans déplacement, avec un partage instantané de la visite à vos proches.
                </p>
                <ul className="service-features-list">
                  <li>
                    <CheckCircle2 size={18} className="service-check-icon" />
                    <span>Immersion totale : explorez chaque pièce et chaque détail à 360°</span>
                  </li>
                  <li>
                    <CheckCircle2 size={18} className="service-check-icon" />
                    <span>Gain de temps : visitez à distance en quelques clics 24h/24</span>
                  </li>
                  <li>
                    <CheckCircle2 size={18} className="service-check-icon" />
                    <span>Vision réaliste et fidèle des volumes, de la luminosité et des finitions</span>
                  </li>
                  <li>
                    <CheckCircle2 size={18} className="service-check-icon" />
                    <span>Compatible smartphone, tablette, ordinateur et mode Casque VR</span>
                  </li>
                </ul>
                <div className="service-action-wrapper">
                  <Link to="/conciergerie#visite-360" className="service-cta-link">
                    <span>Découvrir la visite 360°</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* =========================================================================
          5. CITIES SECTION ("NOS VILLES" - Dark Panoramic Section)
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
          6. PROFESSIONNELS B2B SECTION (Two Pros with Laptop + Perks)
          ========================================================================= */}
      <section id="professionnels" className="section-professionals">
        <div className="container">
          <div className="professionals-split">
            
            {/* Left Column: Authentic African Real Estate Pros Image */}
            <div className="professionals-image-wrapper">
              <img 
                src="/assets/pro-african-agents.jpg" 
                alt="Professionnels de l'immobilier Habitoo" 
                className="professionals-img"
              />
            </div>

            {/* Center & Right Column: B2B Arguments & Feature Checklist */}
            <div className="professionals-content">
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

                <button 
                  onClick={openAuthModal}
                  className="btn-primary professionals-cta-btn"
                >
                  <span>Créer un compte professionnel</span>
                  <ArrowRight size={16} />
                </button>
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
          /* Stops right at the vertical middle of the search form */
          bottom: 65px;
          overflow: hidden;
          z-index: 1;
        }
        .hero-bg-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 25%;
          /* Crisp & sharp: absolutely NO blur */
          filter: none !important;
          display: block;
        }
        .hero-bg-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0.95) 0%,
            rgba(255, 255, 255, 0.88) 36%,
            rgba(255, 255, 255, 0.25) 58%,
            rgba(255, 255, 255, 0) 76%
          );
          pointer-events: none;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }
        @media (max-width: 960px) {
          .hero-bg-banner {
            bottom: 95px;
          }
        }
        @media (max-width: 600px) {
          .hero-bg-banner {
            bottom: 125px;
          }
          .hero-bg-overlay {
            background: linear-gradient(
              to bottom,
              rgba(255, 255, 255, 0.95) 0%,
              rgba(255, 255, 255, 0.88) 50%,
              rgba(255, 255, 255, 0.65) 100%
            );
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
          color: #374151;
          line-height: 1.45;
          margin-bottom: 14px;
          max-width: 500px;
          font-weight: 500;
        }
        .hero-trust-badges {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .hero-trust-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--obsidian-black);
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(0, 0, 0, 0.06);
          padding: 4px 8px;
          border-radius: 6px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.03);
        }
        .hero-trust-icon-box {
          color: var(--primary-red);
          display: flex;
          align-items: center;
        }

        /* Floating badge centered vertically with respect to the background banner */
        .hero-bg-center-target {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 65px;
          display: flex;
          align-items: center;
          pointer-events: none;
          z-index: 10;
        }
        @media (max-width: 960px) {
          .hero-bg-center-target {
            display: none !important;
          }
        }
        .hero-bg-badge-flex {
          display: flex;
          justify-content: flex-end;
          padding-right: clamp(16px, 4vw, 52px);
          width: 100%;
        }
        .hero-floating-glass-pill {
          pointer-events: auto;
          background: rgba(18, 18, 18, 0.88);
          color: #FFFFFF;
          padding: 10px 22px;
          border-radius: 10px;
          font-size: 0.84rem;
          font-weight: 600;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.18);
          white-space: nowrap;
        }

        .hero-search-anchor {
          position: relative;
          z-index: 20;
          margin-top: 4px;
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
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
          border: 1px solid var(--border-color);
          display: block;
          text-decoration: none;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .category-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
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
          box-shadow: 0 4px 14px rgba(0,0,0,0.12);
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
        .showcase-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }

        /* ===== 4. SERVICES SECTION ===== */
        .section-services {
          padding: 80px 0 96px;
          background-color: #FAF5F5;
        }
        .services-section-header {
          text-align: left;
          max-width: 1000px;
          margin: 0 0 52px 0;
        }
        .services-tag {
          font-size: 0.8125rem;
          font-weight: 800;
          color: var(--primary-red);
          letter-spacing: 1px;
          text-transform: uppercase;
          display: inline-block;
          margin-bottom: 12px;
        }
        .services-title {
          font-size: clamp(1.9rem, 3.2vw, 2.75rem);
          font-weight: 800;
          color: var(--obsidian-black);
          line-height: 1.25;
          margin-bottom: 14px;
        }
        .services-desc {
          font-size: 1.05rem;
          color: #4B5563;
          line-height: 1.6;
          max-width: 780px;
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
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(0, 0, 0, 0.05);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .service-split-row:hover {
          box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.09);
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
          box-shadow: 0 12px 32px -8px rgba(0, 0, 0, 0.12);
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
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.8);
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
          box-shadow: 0 4px 14px rgba(247, 0, 0, 0.25);
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .service-cta-link:hover {
          background-color: #d10000;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(247, 0, 0, 0.35);
        }

        /* Mobile responsive ordering for inverted row: ensure image is on top */
        @media (max-width: 959px) {
          .service-split-reverse .service-img-col {
            order: 1;
          }
          .service-split-reverse .service-text-col {
            order: 2;
          }
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
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          cursor: pointer;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .city-explore-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 32px rgba(0, 0, 0, 0.3);
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

        /* ===== 6. PROFESSIONALS B2B SECTION ===== */
        .section-professionals {
          padding: 68px 0;
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
          box-shadow: 0 14px 34px -8px rgba(0, 0, 0, 0.12);
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
          box-shadow: 0 4px 14px rgba(247, 0, 0, 0.3);
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
          box-shadow: 0 16px 36px rgba(227, 2, 10, 0.25);
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
      `}</style>
    </div>
  );
};

export default HomePage;
