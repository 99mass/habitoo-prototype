import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useHabitoo } from '../context/HabitooContext';
import { PROPERTIES_DATA } from '../data/propertiesData';
import { PropertyCard } from '../components/PropertyCard';
import { 
  ShieldCheck, 
  Star, 
  MapPin, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  MessageSquare,
  ArrowLeft
} from 'lucide-react';
import './VitrinePage.css';

export const VitrinePage = () => {
  const navigate = useNavigate();
  const { proId } = useParams();
  const { proProfiles, userProperties } = useHabitoo();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  // Profil actif résolu selon le paramètre URL ou fallback sur le premier profil
  const activeProfile = useMemo(() => {
    if (!proProfiles || proProfiles.length === 0) return null;
    if (proId) {
      const found = proProfiles.find(p => p.id === proId);
      if (found) return found;
    }
    return proProfiles[0];
  }, [proProfiles, proId]);

  // Tous les biens combinés (mockés + utilisateur éventuel)
  const allProperties = useMemo(() => {
    const list = [...PROPERTIES_DATA];
    if (userProperties && userProperties.length > 0) {
      list.unshift(...userProperties);
    }
    return list;
  }, [userProperties]);

  // Biens rattachés au profil sélectionné
  const proProperties = useMemo(() => {
    if (!activeProfile) return [];
    const ids = new Set(activeProfile.propertyIds || []);
    return allProperties.filter(prop => ids.has(prop.id));
  }, [activeProfile, allProperties]);

  // Filtre de catégorie du carrousel
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('ALL'); // 'ALL' | 'LOCATION' | 'VENTE'

  // Biens filtrés pour le carrousel
  const filteredProperties = useMemo(() => {
    if (activeCategoryFilter === 'ALL') return proProperties;
    return proProperties.filter(p => p.category === activeCategoryFilter);
  }, [proProperties, activeCategoryFilter]);

  // Référence et défilement du carrousel moderne
  const carouselTrackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgressPercent, setScrollProgressPercent] = useState(25);

  const checkScrollBounds = () => {
    if (carouselTrackRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselTrackRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll > 0) {
        const percent = Math.min(100, Math.max(15, ((scrollLeft + clientWidth) / scrollWidth) * 100));
        setScrollProgressPercent(percent);
      } else {
        setScrollProgressPercent(100);
      }
    }
  };

  useEffect(() => {
    const track = carouselTrackRef.current;
    if (track) {
      track.addEventListener('scroll', checkScrollBounds, { passive: true });
      checkScrollBounds();
      return () => track.removeEventListener('scroll', checkScrollBounds);
    }
  }, [filteredProperties]);

  const handleScrollCarousel = (direction) => {
    if (carouselTrackRef.current) {
      const scrollAmount = 340;
      carouselTrackRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Statistiques des avis
  const reviewsList = activeProfile?.reviews || [];
  const hasReviews = reviewsList.length > 0;

  const averageScore = useMemo(() => {
    if (!hasReviews) return 0;
    const total = reviewsList.reduce((acc, r) => acc + (Number(r.score) || 5), 0);
    return (total / reviewsList.length).toFixed(1);
  }, [reviewsList, hasReviews]);

  // Extraction propre des initiales pour la pastille avatar
  const getInitials = (nameStr) => {
    if (!nameStr) return 'CL';
    const parts = nameStr.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  if (!activeProfile) {
    return (
      <div className="vitrine-page">
        <div className="vitrine-container" style={{ textAlign: 'center', paddingTop: '80px' }}>
          <p>Profil professionnel introuvable.</p>
          <Link to="/" style={{ color: '#111111', fontWeight: 600, marginTop: '14px', display: 'inline-block' }}>
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  const isAgence = activeProfile.type === 'AGENCE';

  return (
    <div className="vitrine-page">
      <div className="vitrine-container">

        {/* Navigation / Bouton Retour */}
        <div className="vitrine-top-nav">
          <button
            type="button"
            onClick={handleGoBack}
            className="vitrine-back-btn"
            aria-label="Retour à la page précédente"
          >
            <ArrowLeft size={15} />
            <span>Retour</span>
          </button>
        </div>

        {/* 1. MINI CARTE D'IDENTITÉ (STRUCTURE IDENTIQUE DÉMARCHEUR & AGENCE) */}
        <section 
          className={`vitrine-id-card ${isAgence ? 'vitrine-id-card--agency' : 'vitrine-id-card--broker'}`}
          aria-label="Carte d'identité du professionnel"
        >
          {/* Avatar / Photo de profil */}
          <div className="vitrine-id-avatar-wrap">
            <img
              src={activeProfile.avatar}
              alt={activeProfile.name}
              className="vitrine-id-avatar"
            />
          </div>

          {/* Bloc d'en-tête (Nom, Badge, Rôle) */}
          <div className="vitrine-id-top-block">
            <div className="vitrine-id-header-row">
              <h1 className="vitrine-id-name">{activeProfile.name}</h1>
              <span className="vitrine-id-badge">
                <ShieldCheck size={12} strokeWidth={2.5} />
                <span>{activeProfile.badge}</span>
              </span>
            </div>

            <p className="vitrine-id-role">{activeProfile.title}</p>
          </div>

          {/* Ligne métadonnées (Localisation, Date, Réf) */}
          <div className="vitrine-id-meta-row">
            <span className="vitrine-id-meta-item">
              <MapPin size={13} className="vitrine-id-meta-icon" />
              <span>{activeProfile.city}, {activeProfile.country}</span>
            </span>

            <span className="vitrine-id-meta-sep">•</span>

            <span className="vitrine-id-meta-item">
              <Calendar size={13} className="vitrine-id-meta-icon" />
              <span>{activeProfile.stats.memberSince}</span>
            </span>

            {activeProfile.license && (
              <>
                <span className="vitrine-id-meta-sep">•</span>
                <span className="vitrine-id-license">Réf. {activeProfile.license}</span>
              </>
            )}
          </div>
        </section>

        {/* 2. CARROUSEL MODERNE DES BIENS (PEEK EFFECT & ZÉRO OVERFLOW) */}
        <section className="vitrine-carousel-section" aria-label="Biens mis en ligne">
          <div className="vitrine-section-head">
            <div className="vitrine-section-title-wrap">
              <h2 className="vitrine-section-title">Biens mis en ligne</h2>
              <span className="vitrine-section-count">
                ({filteredProperties.length})
              </span>
            </div>

            {/* Filtres de catégorie : Tous, À louer, À vendre */}
            <div className="vitrine-filter-pills" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeCategoryFilter === 'ALL'}
                onClick={() => setActiveCategoryFilter('ALL')}
                className={`vitrine-filter-btn ${activeCategoryFilter === 'ALL' ? 'vitrine-filter-btn--active' : ''}`}
              >
                Tous ({proProperties.length})
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeCategoryFilter === 'LOCATION'}
                onClick={() => setActiveCategoryFilter('LOCATION')}
                className={`vitrine-filter-btn ${activeCategoryFilter === 'LOCATION' ? 'vitrine-filter-btn--active' : ''}`}
              >
                À louer ({proProperties.filter(p => p.category === 'LOCATION').length})
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeCategoryFilter === 'VENTE'}
                onClick={() => setActiveCategoryFilter('VENTE')}
                className={`vitrine-filter-btn ${activeCategoryFilter === 'VENTE' ? 'vitrine-filter-btn--active' : ''}`}
              >
                À vendre ({proProperties.filter(p => p.category === 'VENTE').length})
              </button>
            </div>
          </div>

          {/* Carrousel avec défilement fluide et aperçu carte suivante */}
          {filteredProperties.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
              <p style={{ color: '#666666', fontSize: '0.88rem' }}>Aucun bien dans cette catégorie pour le moment.</p>
            </div>
          ) : (
            <div className="vitrine-carousel-viewport">
              <div 
                ref={carouselTrackRef}
                className="vitrine-carousel-track-peek"
                tabIndex={0}
                aria-label="Carrousel des biens disponibles"
              >
                {filteredProperties.map((property) => (
                  <div key={property.id} className="vitrine-carousel-card-wrap">
                    <PropertyCard property={property} />
                  </div>
                ))}
              </div>

              {/* Pied de carrousel : progression et flèches de défilement */}
              <div className="vitrine-carousel-footer">
                <div className="vitrine-carousel-progress-track">
                  <div 
                    className="vitrine-carousel-progress-bar"
                    style={{ width: `${scrollProgressPercent}%` }}
                  />
                </div>

                <div className="vitrine-carousel-controls">
                  <button
                    type="button"
                    onClick={() => handleScrollCarousel('left')}
                    disabled={!canScrollLeft}
                    className="vitrine-carousel-btn-modern"
                    aria-label="Précédent"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleScrollCarousel('right')}
                    disabled={!canScrollRight}
                    className="vitrine-carousel-btn-modern"
                    aria-label="Suivant"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 3. SECTION AVIS & RÉPUTATION RESTRUCTURÉE */}
        <section className="vitrine-reviews-section" aria-label="Avis clients certifiés">
          <div className="vitrine-reviews-head-row">
            <h2 className="vitrine-reviews-heading">Avis clients certifiés</h2>

            {hasReviews && (
              <div className="vitrine-reviews-score-pill">
                <Star size={13} fill="#D97706" color="#D97706" />
                <span>{averageScore} / 5</span>
                <span style={{ color: '#888888', fontWeight: 500, fontSize: '0.78rem' }}>
                  • {reviewsList.length} avis
                </span>
              </div>
            )}
          </div>

          {/* CAS 1 : IL Y A DES AVIS (CARTES MODERNISÉES) */}
          {hasReviews ? (
            <div className="vitrine-reviews-grid-v2">
              {reviewsList.map((review) => (
                <article key={review.id} className="vitrine-review-card-v2">
                  <div className="vitrine-review-card-top">
                    <div className="vitrine-reviewer-identity">
                      <div className="vitrine-reviewer-initials">
                        {getInitials(review.author)}
                      </div>
                      <div>
                        <strong className="vitrine-reviewer-name">{review.author}</strong>
                        <span className="vitrine-review-date-text">{review.date}</span>
                      </div>
                    </div>

                    <div className="vitrine-review-stars-row">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={12}
                          fill={s <= review.score ? "#D97706" : "none"}
                          color={s <= review.score ? "#D97706" : "#D1D5DB"}
                          strokeWidth={s <= review.score ? 0 : 1.5}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="vitrine-review-quote">
                    "{review.comment}"
                  </p>

                  {review.propertyTitle && (
                    <div className="vitrine-review-property-footer">
                      Visite effectuée : <strong>{review.propertyTitle}</strong>
                    </div>
                  )}
                </article>
              ))}
            </div>
          ) : (
            /* CAS 2 : AUCUN AVIS (BOÎTE ÉPURÉE SANS BOUTON) */
            <div className="vitrine-empty-reviews-box-clean">
              <div className="vitrine-empty-reviews-icon">
                <MessageSquare size={22} strokeWidth={1.8} />
              </div>
              <h3 className="vitrine-empty-reviews-title">Aucun avis pour le moment</h3>
              <p className="vitrine-empty-reviews-desc">
                Ce professionnel n'a pas encore reçu d'avis vérifiés sur ses mandats. Les évaluations sont publiées suite aux visites effectuées sous séquestre Habitoo.
              </p>
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default VitrinePage;
