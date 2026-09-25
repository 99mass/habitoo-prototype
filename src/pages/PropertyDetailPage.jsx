import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import L from 'leaflet';
import { useHabitoo } from '../context/HabitooContext';
import { PROPERTIES_DATA, PRO_CATEGORIES } from '../data/propertiesData';
import { 
  Heart, 
  Share2, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  CreditCard, 
  Lock, 
  Phone, 
  MessageCircle,
  X, 
  ChevronLeft,
  ChevronRight,
  Maximize,
  Building,
  Navigation,
  Star,
  ArrowRight,
  ExternalLink,
  Briefcase,
  Users,
  FileText,
  Store,
  Building2
} from 'lucide-react';

// Leaflet Mini Map Component
const PropertyMiniMap = ({ coordinates, address, neighborhood, city }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length < 2) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: coordinates,
        zoom: 14,
        zoomControl: true,
        attributionControl: false,
        scrollWheelZoom: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      // Custom red pin marker
      const customIcon = L.divIcon({
        className: 'custom-property-pin',
        html: `
          <div style="
            width: 36px;
            height: 36px;
            background: #F70000;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 14px rgba(247,0,0,0.45);
            border: 2px solid #FFFFFF;
          ">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(45deg);">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36]
      });

      L.marker(coordinates, { icon: customIcon }).addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [coordinates]);

  return (
    <div style={{ borderRadius: 'var(--radius-card)', overflow: 'hidden', border: '1px solid var(--border-color)', position: 'relative' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '280px', backgroundColor: '#EAEAE8' }} />
      <div 
        style={{
          position: 'absolute',
          bottom: '14px',
          left: '14px',
          right: '14px',
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(8px)',
          padding: '10px 16px',
          borderRadius: '10px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          zIndex: 400,
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: 'var(--obsidian-black)', fontWeight: 600, minWidth: 0, flex: 1 }}>
          <MapPin size={16} color="var(--primary-red)" style={{ flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{address || `${neighborhood}, ${city}`}</span>
        </div>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${coordinates[0]},${coordinates[1]}`}
          rel="noreferrer"
          style={{
            fontSize: '0.75rem',
            color: 'var(--primary-red)',
            fontWeight: 700,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}
        >
          <Navigation size={13} />
          <span>Itinéraire</span>
        </a>
      </div>
    </div>
  );
};

export const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    formatPrice, 
    isFavorite, 
    toggleFavorite, 
    bookVisit,
    userProperties,
    proProfiles
  } = useHabitoo();

  // 1. Resolve raw property data from preview, location.state, userProperties or static data
  const isPreview = id === 'preview-card' || id === 'preview';
  let previewData = null;
  if (isPreview || location.state?.previewProperty) {
    if (location.state?.previewProperty) {
      previewData = location.state.previewProperty;
    } else {
      try {
        const stored = localStorage.getItem('habitoo_preview_property');
        if (stored) previewData = JSON.parse(stored);
      } catch (e) {
        console.error("Erreur lecture previewProperty:", e);
      }
    }
  }

  // Find candidate property from userProperties, previewData, static data or default fallback
  const foundUserProp = (userProperties && userProperties.find(p => String(p.id) === String(id))) 
    || (previewData && String(previewData.id) === String(id) ? previewData : null);
  const foundStaticProp = PROPERTIES_DATA.find(p => String(p.id) === String(id));

  let rawProperty = null;
  if (isPreview && previewData) {
    rawProperty = { ...previewData, id: 'preview-card' };
  } else if (foundUserProp) {
    rawProperty = foundUserProp;
  } else if (previewData && id?.startsWith('prop-pub-')) {
    rawProperty = previewData;
  } else if (foundStaticProp) {
    rawProperty = foundStaticProp;
  } else if (location.state?.previewProperty) {
    rawProperty = location.state.previewProperty;
  } else {
    rawProperty = PROPERTIES_DATA[0];
  }

  // 2. Normalize and guarantee all required fields so user properties render without any undefined crashes
  const city = rawProperty.city || 'Abidjan';
  const defaultCoords = city === 'Kinshasa' ? [-4.3217, 15.3125] : city === 'Brazzaville' ? [-4.2677, 15.2919] : [5.3484, -3.9780];
  const isProDestination = rawProperty.destination === 'PRO';
  const proCategoryObj = PRO_CATEGORIES.find(c => c.id === rawProperty.proCategory);
  const isPro = rawProperty.isPro ?? (rawProperty.userRole === 'AGENCE' || rawProperty.userRole === 'MANDATAIRE' || rawProperty.advertiserType === 'PRO');
  const advertiserType = rawProperty.advertiserType || (isPro ? 'PRO' : 'PARTICULIER');
  const ownerNameFallback = rawProperty.ownerName || rawProperty.agent?.name || "Propriétaire Déclarant";

  const property = {
    ...rawProperty,
    id: rawProperty.id || id || 'prop-default',
    destination: rawProperty.destination || 'HABITATION',
    proCategory: rawProperty.proCategory || null,
    leaseType: rawProperty.leaseType || null,
    title: rawProperty.title || "Titre de l'annonce",
    type: rawProperty.type || (isProDestination ? (proCategoryObj?.label || 'Bureaux') : "Villa d'architecte"),
    category: rawProperty.category || "LOCATION",
    city: city,
    country: rawProperty.country || (city === 'Kinshasa' ? 'RD Congo' : city === 'Brazzaville' ? 'Congo' : "Côte d'Ivoire"),
    neighborhood: rawProperty.neighborhood || 'Quartier',
    address: rawProperty.address || `${rawProperty.neighborhood || 'Quartier'}, ${city}`,
    priceXOF: rawProperty.priceXOF ?? (city === 'Kinshasa' ? null : (rawProperty.price || null)),
    priceUSD: rawProperty.priceUSD ?? (city === 'Kinshasa' ? (rawProperty.price || null) : null),
    priceXAF: rawProperty.priceXAF ?? (city === 'Brazzaville' ? (rawProperty.price || null) : null),
    period: rawProperty.period !== undefined ? rawProperty.period : (rawProperty.category === 'VENTE' ? '' : '/mois'),
    specs: {
      bedrooms: rawProperty.specs?.bedrooms ?? (isProDestination ? 0 : 4),
      bathrooms: rawProperty.specs?.bathrooms ?? 3,
      area: rawProperty.specs?.area ?? (isProDestination ? 250 : 350),
      offices: rawProperty.specs?.offices ?? null,
      workstations: rawProperty.specs?.workstations ?? null,
      restrooms: rawProperty.specs?.restrooms ?? rawProperty.specs?.bathrooms ?? null,
      windowDisplay: rawProperty.specs?.windowDisplay ?? null,
      loadingDock: rawProperty.specs?.loadingDock ?? false,
      security: rawProperty.specs?.security || "Gardiennage certifié"
    },
    amenities: rawProperty.amenities && rawProperty.amenities.length > 0
      ? rawProperty.amenities
      : (isProDestination 
          ? ["Fibre optique très haut débit", "Groupe électrogène automatique", "Climatisation intégrale", "Gardiennage H24 & Vidéosurveillance"]
          : ["Groupe électrogène automatique", "Forage / Réserve d'eau", "Gardiennage H24", "Climatisation intégrale"]),
    coordinates: rawProperty.coordinates || defaultCoords,
    images: rawProperty.images && rawProperty.images.length > 0
      ? rawProperty.images
      : ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85"],
    description: rawProperty.description || (isProDestination ? "Espace professionnel de premier ordre bénéficiant d'aménagements modernes et d'un emplacement stratégique pour votre entreprise." : "Propriété d'exception offrant un confort absolu et des prestations de haut standing."),
    auditDate: rawProperty.auditDate || "Vérifié récemment",
    auditStatus: rawProperty.auditStatus || (rawProperty.status ? `Annonce ${rawProperty.status}` : "Annonce certifiée conforme"),
    chargesBreakdown: {
      copropriete: rawProperty.chargesBreakdown?.copropriete || "Inclus",
      securite: rawProperty.chargesBreakdown?.securite || "Inclus",
      depotGarantie: rawProperty.chargesBreakdown?.depotGarantie || (isProDestination ? "3 mois de garantie sous séquestre" : "Caution de garantie standard"),
      energie: rawProperty.chargesBreakdown?.energie || "Compteur individuel"
    },
    agent: {
      name: rawProperty.agent?.name || ownerNameFallback,
      agency: rawProperty.agent?.agency || (isPro ? "Agence Immobilière Agréée" : "Propriétaire Direct"),
      avatar: rawProperty.agent?.avatar || rawProperty.ownerAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      phone: rawProperty.agent?.phone || rawProperty.ownerPhone || "+225 07 00 00 00",
      verified: true,
      proType: rawProperty.agent?.proType || (isPro ? "AGENCE" : null),
      proId: rawProperty.agent?.proId || null,
      title: rawProperty.agent?.title || null
    },
    isPro: isPro,
    advertiserType: advertiserType
  };

  const favorite = isFavorite(property.id);
  const isVente = property.category === 'VENTE';
  const isProListing = property.isPro ?? (property.advertiserType === 'PRO' || (property.agent?.agency && property.agent.agency !== 'Particulier' && !property.agent.agency.includes('Direct Propriétaire') && !property.agent.agency.includes('Propriétaire Direct')));
  const isParticulierListing = !isProListing || property.advertiserType === 'PARTICULIER';
  const isDemarcheur = isProListing && (
    property.agent?.proType === 'DEMARCHEUR' ||
    property.agent?.type === 'DEMARCHEUR' ||
    property.agent?.agency?.toLowerCase().includes('démarcheur') ||
    (property.agent?.title && property.agent.title.toLowerCase().includes('démarcheur'))
  );

  const matchedProProfile = useMemo(() => {
    if (!proProfiles || !isProListing) return null;
    if (property.agent?.proId) {
      const found = proProfiles.find(p => p.id === property.agent.proId);
      if (found) return found;
    }
    if (isDemarcheur) {
      return proProfiles.find(p => p.type === 'DEMARCHEUR');
    }
    return proProfiles.find(p => p.type === 'AGENCE');
  }, [proProfiles, property.agent, isProListing, isDemarcheur]);

  const proReviews = matchedProProfile?.reviews || [];
  const proReviewsCount = proReviews.length;
  const proAvgScore = proReviewsCount > 0 
    ? (proReviews.reduce((acc, r) => acc + (Number(r.score) || 5), 0) / proReviewsCount).toFixed(1)
    : null;

  const ownerPhone = property.agent?.phone || property.ownerPhone || "+225 07 08 09 10 11";
  const cleanPhoneForWa = ownerPhone.replace(/[^0-9]/g, '');
  const ownerName = property.agent?.name || property.ownerName || "Propriétaire Déclarant";


  // Carousel & Lightbox States
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Booking Form States
  const [visitDate, setVisitDate] = useState('2025-03-02');
  const [visitTime, setVisitTime] = useState('11:00 - 12:00');
  const [phoneNumber, setPhoneNumber] = useState('+225 07 88 99 00');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const timeSlots = [
    "09:30 - 10:30",
    "11:00 - 12:00",
    "14:30 - 15:30",
    "16:30 - 17:30"
  ];

  // Créneaux personnalisés configurés par le propriétaire particulier
  const customOwnerSlots = React.useMemo(() => {
    try {
      const savedSlots = localStorage.getItem('habitoo_user_avail_slots');
      if (savedSlots) {
        const parsed = JSON.parse(savedSlots);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(s => s.start && s.end ? `${s.start} - ${s.end}` : s.time || '').filter(Boolean);
        }
      }
    } catch (e) {}
    return ['09:00 - 12:00', '14:00 - 17:00'];
  }, []);

  const customOwnerDays = React.useMemo(() => {
    try {
      const savedDays = localStorage.getItem('habitoo_user_avail_days');
      if (savedDays) {
        const parsed = JSON.parse(savedDays);
        if (Array.isArray(parsed)) {
          const activeDays = parsed.filter(d => d.active).map(d => d.label);
          if (activeDays.length > 0) return activeDays.join(' · ');
        }
      }
    } catch (e) {}
    return 'Lun - Sam';
  }, []);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    navigate(`/checkout?id=${property.id}`, {
      state: {
        property,
        visitDate,
        visitTime,
        amount: 10000
      }
    });
  };

  // Carousel Navigation
  const nextPhoto = (e) => {
    e?.stopPropagation();
    setActivePhotoIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevPhoto = (e) => {
    e?.stopPropagation();
    setActivePhotoIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  // Lightbox Keyboard listener
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextPhoto();
      else if (e.key === 'ArrowLeft') prevPhoto();
      else if (e.key === 'Escape') setIsLightboxOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen]);

  // Touch Swipe for Mobile Carousel
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 40) {
      // Swiped left -> next
      nextPhoto();
    } else if (diff < -40) {
      // Swiped right -> prev
      prevPhoto();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <div className="pdp-page-container" style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* PREVIEW BANNER IF ACCESSING VIA PREVIEW CARD */}
      {isPreview && (
        <div style={{ backgroundColor: '#FEF3C7', borderBottom: '1px solid #F59E0B', padding: '10px 0' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#92400E' }}>
              👀 <strong>Mode Prévisualisation :</strong> Fiche détaillée de votre annonce telle que vos futurs acquéreurs ou locataires la verront.
            </span>
            <button 
              type="button" 
              onClick={() => navigate('/publier')} 
              className="btn-primary" 
              style={{ padding: '6px 14px', fontSize: '0.8125rem' }}
            >
              ← Retour à la publication
            </button>
          </div>
        </div>
      )}

      {/* 1. TOP BREADCRUMB & ACTIONS BAR */}
      <div style={{ backgroundColor: 'var(--surface-white)', borderBottom: '1px solid var(--border-color)', padding: '12px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: '1 1 auto' }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--surface-white)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--obsidian-black)',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <ChevronLeft size={16} />
              <span>Retour</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: 'var(--graphite-gray)', minWidth: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              <Link to="/" style={{ color: 'var(--graphite-gray)' }}>Accueil</Link>
              <span>/</span>
              <Link to={isProDestination ? "/immobilier-professionnel" : "/recherche"} style={{ color: 'var(--graphite-gray)' }}>
                {isProDestination ? "Immobilier professionnel" : "Recherche"}
              </Link>
              <span>/</span>
              <Link to={isProDestination ? `/immobilier-professionnel?city=${property.city}` : `/recherche?location=${property.city}`} style={{ color: 'var(--graphite-gray)' }}>
                {property.city}
              </Link>
              <span>/</span>
              <span style={{ color: 'var(--obsidian-black)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>{property.neighborhood}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button
              onClick={() => toggleFavorite(property.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 12px',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--surface-white)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: favorite ? 'var(--primary-red)' : 'var(--obsidian-black)',
                cursor: 'pointer'
              }}
            >
              <Heart size={16} fill={favorite ? 'var(--primary-red)' : 'none'} />
              <span>{favorite ? "Favori" : "Sauvegarder"}</span>
            </button>

            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                alert("Lien de la propriété copié dans le presse-papier.");
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 12px',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--surface-white)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Share2 size={16} />
              <span>Partager</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. MAIN 2-COLUMN LAYOUT: Left = Carousel & Details, Right = Sticky Booking Widget */}
      <div className="container">
        <div className="pdp-layout-grid">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: CAROUSEL, TITLE, SPECS, AGENCY, MINI-MAP   */}
          {/* ========================================================= */}
          <div className="pdp-content-col">
            
            {/* 1. PHOTO CAROUSEL */}
            <div className="pdp-carousel-container" style={{ marginBottom: '28px' }}>
              <div 
                className="pdp-carousel-main-frame"
                onClick={() => setIsLightboxOpen(true)}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                title="Cliquer pour afficher en grand format"
              >
                <img 
                  src={property.images[activePhotoIndex]} 
                  alt={`${property.title} — photo ${activePhotoIndex + 1}`}
                  className="pdp-carousel-main-img"
                />

                {/* Category & Advertiser Badges */}
                <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 5, display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span 
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '5px 12px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      borderRadius: '9999px',
                      backgroundColor: isVente ? 'var(--primary-red)' : '#111827',
                      color: '#FFFFFF',
                      boxShadow: isVente 
                        ? '0 2px 8px rgba(247, 0, 0, 0.4)' 
                        : '0 2px 8px rgba(0, 0, 0, 0.3)',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase'
                    }}
                  >
                    {isVente ? 'À VENDRE' : 'À LOUER'}
                  </span>

                  {isProDestination && (
                    <span 
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '5px 11px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        borderRadius: '9999px',
                        backgroundColor: '#1E293B',
                        color: '#F8FAFC',
                        border: '1px solid rgba(255,255,255,0.2)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                        letterSpacing: '0.4px',
                        textTransform: 'uppercase'
                      }}
                    >
                      <Briefcase size={12} />
                      {proCategoryObj?.label || 'Immo Pro'}
                    </span>
                  )}

                  {isProListing ? (
                    <span 
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '5px 11px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        borderRadius: '9999px',
                        backgroundColor: '#2563EB',
                        color: '#FFFFFF',
                        boxShadow: '0 2px 8px rgba(37,99,235,0.35)',
                        letterSpacing: '0.4px'
                      }}
                    >
                      <ShieldCheck size={13} strokeWidth={2.5} />
                      PRO
                    </span>
                  ) : (
                    <span 
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '5px 11px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        borderRadius: '9999px',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        color: '#374151',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        letterSpacing: '0.4px',
                        border: '1px solid rgba(0,0,0,0.06)'
                      }}
                    >
                      PARTICULIER
                    </span>
                  )}
                </div>

                {/* Fullscreen Magnify Trigger */}
                <div className="pdp-carousel-zoom-btn">
                  <Maximize size={15} />
                  <span>Agrandir</span>
                </div>

                {/* Prev Button */}
                <button
                  type="button"
                  onClick={prevPhoto}
                  className="pdp-carousel-nav-btn prev"
                  title="Photo précédente"
                >
                  <ChevronLeft size={22} />
                </button>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={nextPhoto}
                  className="pdp-carousel-nav-btn next"
                  title="Photo suivante"
                >
                  <ChevronRight size={22} />
                </button>

                {/* Slide Counter Badge */}
                <div className="pdp-carousel-counter">
                  {activePhotoIndex + 1} / {property.images.length}
                </div>
              </div>

              {/* Thumbnails Row */}
              <div className="pdp-carousel-thumbs">
                {property.images.map((thumbUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhotoIndex(idx)}
                    className={`pdp-carousel-thumb-btn ${activePhotoIndex === idx ? 'active' : ''}`}
                  >
                    <img src={thumbUrl} alt={`Miniature ${idx + 1}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* 2. HEADER: Title, Coordinates, Price Banner */}
            <div style={{ marginBottom: '28px' }}>
              <h1 
                className="font-serif" 
                style={{ fontSize: 'clamp(1.75rem, 3.2vw, 2.35rem)', fontWeight: 700, marginBottom: '10px', lineHeight: 1.25 }}
              >
                {property.title}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9375rem', color: 'var(--graphite-gray)', marginBottom: '20px' }}>
                <MapPin size={16} color="var(--primary-red)" />
                <span>{property.address}</span>
              </div>

              {/* Price Banner */}
              <div className="pdp-price-banner">
                <div>
                  <span className="pdp-price-label">
                    {property.category === 'LOCATION' ? 'Loyer mensuel' : 'Prix de vente'}
                  </span>
                  <div className="pdp-price-amount">
                    {formatPrice(property.priceXOF, property.priceUSD, property.priceXAF, property.period)}
                  </div>
                </div>
                <div className="pdp-price-charges">
                  <span className="pdp-charges-label">Charges de copropriété</span>
                  <span className="pdp-charges-amount">
                    {property.chargesBreakdown.copropriete}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. KEY SPECS GRID */}
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '16px',
                padding: '22px',
                backgroundColor: 'var(--surface-white)',
                borderRadius: 'var(--radius-card)',
                border: '1px solid var(--border-color)',
                marginBottom: isProDestination && (property.specs.windowDisplay || property.specs.loadingDock) ? '16px' : '32px'
              }}
            >
              {isProDestination ? (
                <>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--graphite-gray)', display: 'block' }}>Superficie utile</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1.2rem', fontWeight: 700, marginTop: '2px' }}>
                      <Maximize2 size={18} color="var(--primary-red)" />
                      <span>{property.specs.area} m²</span>
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--graphite-gray)', display: 'block' }}>
                      {property.specs.workstations ? 'Postes de travail' : (property.proCategory === 'LOCAL_PRO' ? 'Nombre de pièces' : 'Bureaux fermés')}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1.2rem', fontWeight: 700, marginTop: '2px' }}>
                      {property.specs.workstations ? (
                        <>
                          <Users size={18} color="var(--primary-red)" />
                          <span>{property.specs.workstations} postes</span>
                        </>
                      ) : (
                        <>
                          <Briefcase size={18} color="var(--primary-red)" />
                          <span>{property.specs.offices ?? (property.specs.bedrooms || 1)} {property.proCategory === 'LOCAL_PRO' ? 'pièces' : 'bureaux'}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--graphite-gray)', display: 'block' }}>Toilettes</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1.2rem', fontWeight: 700, marginTop: '2px' }}>
                      <Bath size={18} color="var(--primary-red)" />
                      <span>{property.specs.restrooms ?? property.specs.bathrooms ?? 2} toilettes</span>
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--graphite-gray)', display: 'block' }}>Bail / Régime</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', fontWeight: 700, marginTop: '6px', color: 'var(--obsidian-black)' }}>
                      <FileText size={16} color="var(--primary-red)" />
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {property.leaseType || (isVente ? 'Pleine propriété' : 'Bail professionnel')}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--graphite-gray)', display: 'block' }}>Chambres</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1.2rem', fontWeight: 700, marginTop: '2px' }}>
                      <Bed size={18} color="var(--primary-red)" />
                      <span>{property.specs.bedrooms} suites</span>
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--graphite-gray)', display: 'block' }}>Salles de bain</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1.2rem', fontWeight: 700, marginTop: '2px' }}>
                      <Bath size={18} color="var(--primary-red)" />
                      <span>{property.specs.bathrooms} bains</span>
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--graphite-gray)', display: 'block' }}>Surface habitable</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1.2rem', fontWeight: 700, marginTop: '2px' }}>
                      <Maximize2 size={18} color="var(--primary-red)" />
                      <span>{property.specs.area} m²</span>
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--graphite-gray)', display: 'block' }}>Sécurité</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', fontWeight: 700, marginTop: '6px', color: 'var(--verified-green)' }}>
                      <ShieldCheck size={16} />
                      <span>H24 et Blindé</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Extra Pro Characteristics (Vitrine / Quai de chargement) */}
            {isProDestination && (property.specs.windowDisplay || property.specs.loadingDock) && (
              <div 
                style={{
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'wrap',
                  marginBottom: '32px',
                  padding: '12px 16px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: 'var(--radius-input)',
                  fontSize: '0.875rem'
                }}
              >
                {property.specs.windowDisplay && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Store size={16} color="var(--primary-red)" />
                    <span><strong>Vitrine & linéaire :</strong> {property.specs.windowDisplay}</span>
                  </div>
                )}
                {property.specs.loadingDock && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Building2 size={16} color="var(--primary-red)" />
                    <span><strong>Accès logistique :</strong> Quai de déchargement lourd opérationnel</span>
                  </div>
                )}
              </div>
            )}

            {/* 4. DESCRIPTION */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>
                Description du bien
              </h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--graphite-gray)', lineHeight: 1.8 }}>
                {property.description}
              </p>
            </div>

            {/* 5. AMENITIES */}
            <div style={{ marginBottom: '36px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px' }}>
                Commodités
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                {property.amenities.map((amenity, i) => (
                  <div 
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 16px',
                      backgroundColor: 'var(--surface-white)',
                      borderRadius: 'var(--radius-input)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.875rem',
                      fontWeight: 600
                    }}
                  >
                    <CheckCircle2 size={16} color="var(--primary-red)" style={{ flexShrink: 0 }} />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. AGENT & AGENCY CONTACT CARD */}
            <div className="agency-contact-card">
              <div className="agency-card-layout">
                <img 
                  src={property.agent?.avatar || property.ownerAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"} 
                  alt={property.agent?.name || ownerName} 
                  className="agency-card-avatar"
                />
                <div className="agency-card-info">
                  <div className="agency-card-badge-row">
                    {isProListing ? (
                      <span className="agency-partner-badge">
                        <ShieldCheck size={12} strokeWidth={2.5} />
                        <span>{isDemarcheur ? 'Démarcheur Agréé PRO' : 'Agence Professionnelle Partenaire'}</span>
                      </span>
                    ) : (
                      <span className="agency-direct-badge">
                        <span>Annonce Directe</span>
                      </span>
                    )}

                    {isProListing && (
                      <Link
                        to={
                          property.agent?.proId 
                            ? `/vitrine/${property.agent.proId}` 
                            : (isDemarcheur ? '/vitrine/demarcheur-kouassi' : '/vitrine/agence-ivoire')
                        }
                        className="agency-card-vitrine-btn"
                        title="Consulter la vitrine certifiée"
                      >
                        <ExternalLink size={12} />
                        <span>Vitrine</span>
                      </Link>
                    )}
                  </div>
                  <h4 className="agency-name-title">
                    {isProListing 
                      ? (isDemarcheur ? (property.agent?.name || ownerName) : (property.agent?.agency || "Agence Partenaire"))
                      : ownerName
                    }
                  </h4>
                  <div className="agency-advisor-text">
                    {property.neighborhood ? `${property.neighborhood}, ${property.city}` : (property.address || property.city)}
                  </div>

                  {isProListing && (
                    <div className="agency-rating-row">
                      {proReviewsCount > 0 ? (
                        <>
                          <div className="agency-rating-pill">
                            <Star size={11} fill="#D97706" color="#D97706" />
                            <span>{proAvgScore} / 5</span>
                          </div>
                          <span className="agency-rating-count">
                            ({proReviewsCount} avis)
                          </span>
                        </>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 500 }}>
                          Nouveau professionnel certifié • Aucun avis pour l'instant
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 7. MINI MAP: Position du bien sur la carte */}
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '14px' }}>
                Localisation du bien
              </h3>
              <PropertyMiniMap 
                coordinates={property.coordinates}
                address={property.address}
                neighborhood={property.neighborhood}
                city={property.city}
              />
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: MODULE DE RÉSERVATION (Sticky Widget)       */}
          {/* ========================================================= */}
          <div 
            id="visite"
            className="pdp-booking-col"
            style={{
              position: 'sticky',
              top: '100px',
              alignSelf: 'start',
              height: 'fit-content',
              backgroundColor: 'var(--surface-white)',
              borderRadius: 'var(--radius-banner)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.07)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              padding: '20px 22px',
              zIndex: 50
            }}
          >
            {isParticulierListing ? (
              /* ========================================================= */
              /* BLOC PARTICULIER : CONTACT DIRECT SANS FRAIS DE VISITE   */
              /* ========================================================= */
              <div className="pdp-particulier-booking-box">
                <div style={{ marginBottom: '16px', paddingBottom: '14px', borderBottom: '2px solid var(--border-light)' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700, marginTop: '8px' }}>
                    {isProDestination ? "Contacter pour visite d'entreprise" : "Contacter pour une visite"}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--graphite-gray)', marginTop: '4px', lineHeight: 1.4 }}>
                    {isProDestination 
                      ? "Échangez directement avec le bailleur pour obtenir le bail, le plan et convenir d'une visite des locaux."
                      : "Échangez directement avec le propriétaire pour convenir d'une visite."}
                  </p>
                </div>

                {/* Coordonnées & Badge Propriétaire */}
                <div style={{ 
                  padding: '14px', 
                  backgroundColor: 'var(--bg-main)', 
                  borderRadius: 'var(--radius-input)', 
                  border: '1px solid var(--border-color)',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      backgroundColor: 'rgba(247,0,0,0.1)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: 'var(--primary-red)', 
                      fontWeight: 700, 
                      fontSize: '1rem' 
                    }}>
                      {ownerName.charAt(0)}
                    </div>
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--obsidian-black)' }}>{ownerName}</strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--graphite-gray)' }}>
                        {isProDestination ? "Bailleur / Propriétaire Direct" : "Propriétaire Déclarant"}
                      </span>
                    </div>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '8px 12px', 
                    background: '#FFFFFF', 
                    borderRadius: '6px', 
                    border: '1px dashed var(--border-color)' 
                  }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--graphite-gray)', fontWeight: 600 }}>Téléphone direct :</span>
                    <strong style={{ fontSize: '0.875rem', color: 'var(--obsidian-black)' }}>{ownerPhone}</strong>
                  </div>
                </div>

                {/* Créneaux suggérés */}
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--obsidian-black)' }}>
                    <Clock size={13} color="var(--primary-red)" />
                    <span>Créneaux de visite ({customOwnerDays}) :</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {customOwnerSlots.map((slotTime, idx) => (
                      <span key={idx} style={{ fontSize: '0.72rem', padding: '4px 8px', background: 'var(--bg-main)', borderRadius: '4px', border: '1px solid var(--border-color)', color: 'var(--obsidian-black)', fontWeight: 600 }}>
                        {slotTime}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTAs : Appel & WhatsApp */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <a 
                    href="#"
                    className="btn-primary"
                    style={{ width: '100%', height: '46px', fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <Phone size={15} />
                    <span>Contacter le bailleur</span>
                  </a>
                </div>
              </div>
            ) : (
              /* ========================================================= */
              /* BLOC PRO (AGENCE / DÉMARCHEUR) : RÉSERVATION AVEC SÉQUESTRE */
              /* ========================================================= */
              <form onSubmit={handleBookingSubmit}>
                
                {/* Header */}
                <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '2px solid var(--border-light)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-red)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {isProDestination 
                      ? (isVente ? "Acquisition B2B" : "Location Professionnelle")
                      : (isVente ? "Acquisition" : "Réservation Directe")}
                  </span>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 700, marginTop: '2px' }}>
                    {isProDestination ? "Dossier & Visite d'Entreprise" : "Planifier une Visite"}
                  </h3>
                </div>

                {/* Calendar */}
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} color="var(--primary-red)" />
                    <span>Choisir la date</span>
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={visitDate}
                    min="2025-02-28"
                    onChange={(e) => setVisitDate(e.target.value)}
                    required
                  />
                </div>

                {/* Time Slots */}
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} color="var(--primary-red)" />
                    <span>Créneau horaire</span>
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {timeSlots.map(slot => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setVisitTime(slot)}
                        style={{
                          padding: '8px 4px',
                          borderRadius: 'var(--radius-input)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          border: visitTime === slot ? '2px solid var(--primary-red)' : '1px solid var(--border-color)',
                          backgroundColor: visitTime === slot ? 'var(--soft-tint)' : 'var(--bg-main)',
                          color: visitTime === slot ? 'var(--primary-red)' : 'var(--obsidian-black)',
                          cursor: 'pointer'
                        }}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Transaction Fee Row */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  backgroundColor: 'var(--bg-main)',
                  borderRadius: 'var(--radius-input)',
                  border: '1px solid var(--border-color)',
                  marginTop: '16px',
                  marginBottom: '20px'
                }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--graphite-gray)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>
                      {isProDestination ? "Dossier technique & visite" : "Frais de réservation"}
                    </span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--obsidian-black)', fontWeight: 600 }}>
                      {isProDestination ? "Dossier complet et visite dédiée" : "Dossier et visite dédiée"}
                    </span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--obsidian-black)' }}>
                    10 000 FCFA
                  </div>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', height: '48px', fontSize: '0.9375rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Lock size={15} />
                  <span>Poursuivre la transaction</span>
                </button>

                <div style={{ textAlign: 'center', marginTop: '12px' }}>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--graphite-gray)' }}>
                    Paiement sécurisé multi-moyens (Mobile Money, Carte, PayPal)
                  </span>
                </div>

              </form>
            )}
          </div>

        </div>
      </div>

      {/* 3. LIGHTBOX MODAL — Grand format pour photos */}
      {isLightboxOpen && (
        <div className="pdp-lightbox-overlay" onClick={() => setIsLightboxOpen(false)}>
          <div className="pdp-lightbox-modal" onClick={(e) => e.stopPropagation()}>
            
            {/* Top Bar */}
            <div className="pdp-lightbox-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontWeight: 700, fontSize: '1rem', color: '#FFF' }}>{property.title}</span>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
                  ({activePhotoIndex + 1} / {property.images.length})
                </span>
              </div>

              <button 
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="pdp-lightbox-close-btn"
                title="Fermer (Échap)"
              >
                <X size={24} />
              </button>
            </div>

            {/* Main Image Stage */}
            <div className="pdp-lightbox-stage">
              <button 
                type="button"
                onClick={prevPhoto} 
                className="pdp-lightbox-nav prev"
                title="Photo précédente"
              >
                <ChevronLeft size={36} />
              </button>

              <img 
                src={property.images[activePhotoIndex]} 
                alt={`${property.title} - grand format`} 
                className="pdp-lightbox-image"
              />

              <button 
                type="button"
                onClick={nextPhoto} 
                className="pdp-lightbox-nav next"
                title="Photo suivante"
              >
                <ChevronRight size={36} />
              </button>
            </div>

            {/* Bottom Thumbnails */}
            <div className="pdp-lightbox-thumbs">
              {property.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`pdp-lightbox-thumb ${activePhotoIndex === idx ? 'active' : ''}`}
                >
                  <img src={img} alt={`Thumb ${idx + 1}`} />
                </button>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* 4. BOUTON FLOTTANT RESPONSIVE : PETITE FLÈCHE TRANSPARENTE À DROITE */}
      <button
        type="button"
        onClick={() => setIsMobileDrawerOpen(true)}
        className="mobile-floating-trigger-tab"
        title="Ouvrir le module de réservation"
        aria-label="Ouvrir le module de réservation"
      >
        <ChevronLeft size={20} />
      </button>

      {/* 5. VOLET LATÉRAL FLOTTANT (SIDE DRAWER MOBILE) */}
      <div 
        className={`mobile-booking-drawer-overlay ${isMobileDrawerOpen ? 'open' : ''}`}
        onClick={() => setIsMobileDrawerOpen(false)}
      >
        <div className="mobile-booking-drawer-panel" onClick={(e) => e.stopPropagation()}>
          
          {/* Header du volet */}
          <div className="mobile-drawer-header">
            <div>
              <span style={{ 
                fontSize: '0.6875rem', 
                fontWeight: 700, 
                color: isParticulierListing ? '#16a34a' : 'var(--primary-red)', 
                textTransform: 'uppercase', 
                letterSpacing: '0.5px' 
              }}>
                {isParticulierListing 
                  ? (isProDestination ? "Direct Bailleur • Sans Frais" : "Direct Particulier • Sans Frais") 
                  : isProDestination 
                    ? (isVente ? "Acquisition B2B" : "Location Professionnelle") 
                    : (isVente ? "Acquisition" : "Réservation Directe")}
              </span>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                {isParticulierListing 
                  ? (isProDestination ? "Contacter pour locaux" : "Contacter pour visiter") 
                  : (isProDestination ? "Dossier & Visite Pro" : "Planifier une Visite")}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(false)}
              className="mobile-drawer-close-btn"
              aria-label="Fermer"
            >
              <X size={20} />
            </button>
          </div>

          {isParticulierListing ? (
            /* Contenu Mobile Particulier */
            <div style={{ padding: '20px' }}>
              <div style={{ 
                padding: '14px', 
                backgroundColor: 'var(--bg-main)', 
                borderRadius: 'var(--radius-input)', 
                border: '1px solid var(--border-color)',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ 
                    width: '38px', 
                    height: '38px', 
                    borderRadius: '50%', 
                    backgroundColor: 'rgba(247,0,0,0.1)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'var(--primary-red)',
                    fontWeight: 700
                  }}>
                    {ownerName.charAt(0)}
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--obsidian-black)' }}>{ownerName}</strong>
                    <span style={{ fontSize: '0.72rem', color: 'var(--graphite-gray)' }}>Propriétaire Déclarant</span>
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '8px 10px', 
                  background: '#FFFFFF', 
                  borderRadius: '6px', 
                  border: '1px dashed var(--border-color)' 
                }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--graphite-gray)', fontWeight: 600 }}>Numéro :</span>
                  <strong style={{ fontSize: '0.875rem', color: 'var(--obsidian-black)' }}>{ownerPhone}</strong>
                </div>
              </div>

              {/* Plages suggérées */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                  <Clock size={13} color="var(--primary-red)" />
                  <span>Disponibilités ({customOwnerDays}) :</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {customOwnerSlots.map((slotTime, idx) => (
                    <span key={idx} style={{ fontSize: '0.72rem', padding: '3px 8px', background: 'var(--bg-main)', borderRadius: '4px', border: '1px solid var(--border-color)', fontWeight: 600 }}>
                      {slotTime}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions Mobile */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a 
                  href={`tel:${ownerPhone.replace(/\s+/g, '')}`}
                  className="btn-primary"
                  style={{ width: '100%', height: '46px', fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Phone size={15} />
                  <span>Appeler ({ownerPhone})</span>
                </a>

                <a 
                  href={`https://wa.me/${cleanPhoneForWa}?text=${encodeURIComponent(
                    isProDestination
                      ? `Bonjour, je vous contacte concernant votre bien professionnel Habitoo : "${property.title}". Nous souhaiterions recevoir le dossier technique et convenir d'une visite des locaux.`
                      : `Bonjour, je vous contacte au sujet de votre annonce Habitoo : "${property.title}". Est-il possible d'organiser une visite ?`
                  )}`}
                  style={{ 
                    width: '100%', 
                    height: '44px', 
                    borderRadius: 'var(--radius-input)', 
                    backgroundColor: '#25D366', 
                    color: '#FFFFFF', 
                    fontWeight: 700, 
                    fontSize: '0.84rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '8px',
                    textDecoration: 'none'
                  }}
                >
                  <MessageCircle size={16} />
                  <span>Discuter sur WhatsApp</span>
                </a>
              </div>

              <div style={{ textAlign: 'center', marginTop: '14px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--graphite-gray)' }}>
                  <ShieldCheck size={12} style={{ display: 'inline', verticalAlign: '-1px', marginRight: '4px', color: '#16a34a' }} />
                  Visite directe sans frais de réservation ni intermédiaire
                </span>
              </div>
            </div>
          ) : (
            /* Formulaire Pro dans le tiroir */
            <form onSubmit={handleBookingSubmit} style={{ padding: '20px' }}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} color="var(--primary-red)" />
                  <span>Choisir la date</span>
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={visitDate}
                  min="2025-02-28"
                  onChange={(e) => setVisitDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={14} color="var(--primary-red)" />
                  <span>Créneau horaire</span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {timeSlots.map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setVisitTime(slot)}
                      style={{
                        padding: '8px 4px',
                        borderRadius: 'var(--radius-input)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        border: visitTime === slot ? '2px solid var(--primary-red)' : '1px solid var(--border-color)',
                        backgroundColor: visitTime === slot ? 'var(--soft-tint)' : 'var(--bg-main)',
                        color: visitTime === slot ? 'var(--primary-red)' : 'var(--obsidian-black)',
                        cursor: 'pointer'
                      }}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                backgroundColor: 'var(--bg-main)',
                borderRadius: 'var(--radius-input)',
                border: '1px solid var(--border-color)',
                marginTop: '16px',
                marginBottom: '18px'
              }}>
                <div>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--graphite-gray)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>
                    Frais de réservation
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--obsidian-black)', fontWeight: 600 }}>
                    Dossier et visite dédiée
                  </span>
                </div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--obsidian-black)' }}>
                  10 000 FCFA
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', height: '46px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Lock size={15} />
                <span>Poursuivre la transaction</span>
              </button>

              <div style={{ textAlign: 'center', marginTop: '12px' }}>
                <span style={{ fontSize: '0.6875rem', color: 'var(--graphite-gray)' }}>
                  Paiement sécurisé multi-moyens (Mobile Money, Carte, PayPal)
                </span>
              </div>
            </form>
          )}

        </div>
      </div>

      {/* 6. MOBILE STICKY BOOKING BAR */}
      <div className="mobile-sticky-booking-bar">
        <div>
          <span className="mobile-sticky-price-label">
            {property.category === 'VENTE' ? 'Prix de vente' : 'Loyer mensuel'}
          </span>
          <div className="mobile-sticky-price-val">
            {formatPrice(property.priceXOF, property.priceUSD, property.priceXAF, property.category === 'VENTE' ? '' : property.period)}
          </div>
        </div>
        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className="btn-primary pdp-sticky-cta-btn"
        >
          {isParticulierListing ? <Phone size={15} /> : <Calendar size={15} />}
          <span>{isParticulierListing ? "Contacter" : "Réserver visite"}</span>
        </button>
      </div>

      {/* Styles */}
      <style>{`
        /* ===== 2-COLUMN LAYOUT ===== */
        .pdp-layout-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 380px;
          gap: 36px;
          align-items: start;
          margin-top: 28px;
          position: relative;
        }

        .pdp-price-banner {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          padding: 20px 24px;
          background-color: var(--surface-white);
          border-radius: var(--radius-card);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-sm);
        }
        .pdp-price-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--graphite-gray);
          display: block;
          font-weight: 600;
        }
        .pdp-price-amount {
          font-size: 2rem;
          font-weight: 800;
          color: var(--obsidian-black);
        }
        .pdp-price-charges {
          text-align: right;
        }
        .pdp-charges-label {
          font-size: 0.75rem;
          color: var(--graphite-gray);
          display: block;
          font-weight: 600;
        }
        .pdp-charges-amount {
          font-size: 0.9375rem;
          font-weight: 700;
          color: var(--obsidian-black);
        }

        .pdp-booking-col {
          position: sticky;
          top: 100px;
          align-self: start;
          height: fit-content;
        }

        /* ===== PHOTO CAROUSEL ===== */
        .pdp-carousel-main-frame {
          position: relative;
          width: 100%;
          height: clamp(200px, 20vw, 350px);
          border-radius: var(--radius-banner);
          overflow: hidden;
          background-color: #1A1A1A;
          cursor: pointer;
          box-shadow: var(--shadow-md);
        }
        .pdp-carousel-main-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .pdp-carousel-main-frame:hover .pdp-carousel-main-img {
          transform: scale(1.02);
        }
        .pdp-carousel-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.9);
          color: var(--obsidian-black);
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
          z-index: 10;
        }
        .pdp-carousel-nav-btn:hover {
          background-color: #FFFFFF;
          color: var(--primary-red);
          transform: translateY(-50%) scale(1.08);
        }
        .pdp-carousel-nav-btn.prev {
          left: 16px;
        }
        .pdp-carousel-nav-btn.next {
          right: 16px;
        }
        .pdp-carousel-zoom-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background-color: rgba(26, 26, 26, 0.75);
          backdrop-filter: blur(8px);
          color: #FFF;
          padding: 6px 12px;
          border-radius: var(--radius-pill);
          border: 1px solid rgba(255, 255, 255, 0.3);
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
          z-index: 5;
          transition: background-color 0.2s;
        }
        .pdp-carousel-main-frame:hover .pdp-carousel-zoom-btn {
          background-color: rgba(26, 26, 26, 0.95);
        }
        .pdp-carousel-counter {
          position: absolute;
          bottom: 16px;
          right: 16px;
          background-color: rgba(26, 26, 26, 0.75);
          backdrop-filter: blur(8px);
          color: #FFF;
          padding: 4px 12px;
          border-radius: var(--radius-pill);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          z-index: 5;
        }
        .pdp-carousel-thumbs {
          display: flex;
          gap: 10px;
          margin-top: 12px;
          overflow-x: auto;
          padding-bottom: 4px;
        }
        .pdp-carousel-thumb-btn {
          flex: 0 0 84px;
          height: 60px;
          border-radius: 8px;
          overflow: hidden;
          border: 2px solid transparent;
          cursor: pointer;
          padding: 0;
          background: none;
          transition: all 0.2s;
        }
        .pdp-carousel-thumb-btn img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .pdp-carousel-thumb-btn.active {
          border-color: var(--primary-red);
          transform: scale(1.04);
          box-shadow: 0 2px 8px rgba(247, 0, 0, 0.3);
        }

        /* ===== LIGHTBOX MODAL (GRAND FORMAT) ===== */
        .pdp-lightbox-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(10, 10, 10, 0.95);
          backdrop-filter: blur(12px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .pdp-lightbox-modal {
          width: 100%;
          max-width: 1180px;
          height: 90vh;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .pdp-lightbox-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 16px;
        }
        .pdp-lightbox-close-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #FFF;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .pdp-lightbox-close-btn:hover {
          background: rgba(255, 255, 255, 0.25);
          color: #FFF;
        }
        .pdp-lightbox-stage {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .pdp-lightbox-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border-radius: 8px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }
        .pdp-lightbox-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.15);
          color: #FFF;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.3);
          cursor: pointer;
          transition: all 0.2s;
          z-index: 10;
        }
        .pdp-lightbox-nav:hover {
          background-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-50%) scale(1.08);
        }
        .pdp-lightbox-nav.prev {
          left: 16px;
        }
        .pdp-lightbox-nav.next {
          right: 16px;
        }
        .pdp-lightbox-thumbs {
          display: flex;
          justify-content: center;
          gap: 10px;
          padding-top: 16px;
          overflow-x: auto;
        }
        .pdp-lightbox-thumb {
          width: 68px;
          height: 48px;
          border-radius: 6px;
          overflow: hidden;
          border: 2px solid transparent;
          cursor: pointer;
          padding: 0;
          background: none;
          opacity: 0.6;
          transition: all 0.2s;
        }
        .pdp-lightbox-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .pdp-lightbox-thumb.active {
          border-color: var(--primary-red);
          opacity: 1;
          transform: scale(1.08);
        }

        /* AGENT & AGENCY CONTACT CARD BASE STYLES */
        .agency-contact-card {
          background-color: var(--surface-white, #FFFFFF);
          border-radius: var(--radius-card, 12px);
          border: 1px solid var(--border-color, #E5E7EB);
          padding: 22px 24px;
          margin-bottom: 36px;
          box-shadow: var(--shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.05));
        }
        .agency-card-layout {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }
        .agency-card-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--border-color, #E5E7EB);
          flex-shrink: 0;
        }
        .agency-card-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
          flex: 1;
        }
        .agency-card-badge-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 5px;
          width: 100%;
        }
        .agency-card-vitrine-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: transparent;
          border: 1px solid rgba(0, 0, 0, 0.15);
          color: #1A1A1A;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.74rem;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: background-color 0.15s ease, border-color 0.15s ease;
          white-space: nowrap;
          flex-shrink: 0;
          font-family: inherit;
        }
        .agency-card-vitrine-btn:hover {
          background-color: #F4F5F7;
          border-color: rgba(0, 0, 0, 0.25);
          color: #111111;
        }
        .agency-partner-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 8px;
          border-radius: 9999px;
          background-color: #2563EB;
          color: #FFFFFF;
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 800;
          line-height: 1.25;
        }
        .agency-direct-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 8px;
          border-radius: 9999px;
          background-color: rgba(0, 0, 0, 0.06);
          color: var(--graphite-gray, #6B7280);
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 700;
        }
        .agency-name-title {
          font-size: 1.18rem;
          font-weight: 800;
          color: var(--obsidian-black, #111827);
          margin: 0;
          line-height: 1.25;
          word-break: break-word;
        }
        .agency-advisor-text {
          font-size: 0.85rem;
          color: var(--graphite-gray, #6B7280);
          margin-top: 3px;
          line-height: 1.35;
        }
        .agency-rating-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 7px;
          flex-wrap: wrap;
        }
        .agency-rating-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #FEF3C7;
          border: 1px solid #FDE68A;
          border-radius: 4px;
          padding: 2px 7px;
          font-size: 0.74rem;
          font-weight: 700;
          color: #92400E;
          white-space: nowrap !important;
          flex-shrink: 0;
        }
        .agency-rating-count {
          font-size: 0.74rem;
          color: var(--graphite-gray, #6B7280);
          white-space: nowrap;
        }

        /* ===== RESPONSIVE & MOBILE FLOATING DRAWER ===== */
        .mobile-floating-trigger-tab {
          display: none;
        }

        .mobile-booking-drawer-overlay {
          display: none;
        }

        .mobile-sticky-booking-bar {
          display: none;
        }

        @media (max-width: 992px) {
          .pdp-layout-grid {
            display: flex !important;
            flex-direction: column !important;
            gap: 28px !important;
          }
          .pdp-content-col {
            order: 1 !important;
            width: 100% !important;
          }
          .pdp-booking-col {
            display: none !important;
          }
          .pdp-page-container {
            padding-bottom: 120px !important;
          }

          /* Hide Floating Trigger Tab on Right Edge in favor of dedicated Sticky Bar */
          .mobile-floating-trigger-tab {
            display: none !important;
          }

          .pdp-carousel-main-frame {
            height: 250px !important;
            border-radius: var(--radius-card) !important;
          }

          /* Mobile Slide-Out Side Drawer */
          .mobile-booking-drawer-overlay {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.45);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
            z-index: 1050;
            opacity: 0;
            visibility: hidden;
            transition: all 0.25s ease;
          }

          .mobile-booking-drawer-overlay.open {
            opacity: 1;
            visibility: visible;
          }

          .mobile-booking-drawer-panel {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            width: min(88vw, 380px);
            background-color: var(--surface-white);
            box-shadow: -8px 0 30px rgba(0, 0, 0, 0.2);
            display: flex;
            flex-direction: column;
            transform: translateX(100%);
            transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
            overflow-y: auto;
          }

          .mobile-booking-drawer-overlay.open .mobile-booking-drawer-panel {
            transform: translateX(0);
          }

          .mobile-drawer-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 20px;
            border-bottom: 1px solid var(--border-color);
            background-color: var(--surface-white);
            position: sticky;
            top: 0;
            z-index: 10;
          }

          .mobile-drawer-close-btn {
            width: 34px;
            height: 34px;
            border-radius: 50%;
            background: #F0F2F5;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--obsidian-black);
            cursor: pointer;
          }

          /* Bottom Sticky Bar */
          .mobile-sticky-booking-bar {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: rgba(255, 255, 255, 0.96);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-top: 1px solid var(--border-color);
            padding: 10px 16px calc(10px + env(safe-area-inset-bottom, 0px)) 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            z-index: 950;
            box-shadow: 0 -4px 18px rgba(0, 0, 0, 0.08);
          }
          .mobile-sticky-price-label {
            display: block;
            font-size: 0.65rem;
            color: var(--graphite-gray);
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .mobile-sticky-price-val {
            font-size: 1.05rem;
            font-weight: 800;
            color: var(--obsidian-black);
            line-height: 1.2;
            white-space: nowrap;
          }
          .pdp-sticky-cta-btn {
            white-space: nowrap !important;
            flex-shrink: 0 !important;
            padding: 10px 16px !important;
            font-size: 0.85rem !important;
            gap: 6px !important;
          }

          @media (max-width: 640px) {
            .pdp-price-banner {
              flex-direction: column;
              align-items: flex-start;
              gap: 12px;
              padding: 16px 18px;
            }
            .pdp-price-amount {
              font-size: 1.75rem;
            }
            .pdp-price-charges {
              text-align: left !important;
              width: 100%;
              padding-top: 10px;
              border-top: 1px dashed var(--border-color);
            }
          }

          /* AGENT & AGENCY CONTACT CARD (RESPONSIVE) */
          .agency-contact-card {
            padding: 14px 16px;
            margin-bottom: 24px;
          }
          .agency-card-layout {
            gap: 12px;
          }
          .agency-card-avatar {
            width: 48px;
            height: 48px;
          }
          .agency-card-badge-row {
            display: contents;
          }
          .agency-partner-badge,
          .agency-direct-badge {
            order: 1;
            font-size: 0.62rem;
            padding: 2px 7px;
            margin-bottom: 5px;
            align-self: flex-start;
          }
          .agency-name-title {
            order: 2;
            font-size: 1.02rem;
          }
          .agency-advisor-text {
            order: 3;
            font-size: 0.78rem;
          }
          .agency-rating-row {
            order: 4;
            gap: 6px;
            margin-top: 6px;
          }
          .agency-card-vitrine-btn {
            order: 5;
            margin-top: 8px;
            align-self: flex-start;
          }
          .agency-rating-pill {
            font-size: 0.72rem;
            padding: 2px 6px;
          }
          .agency-rating-count {
            font-size: 0.72rem;
          }
        }
      `}</style>

    </div>
  );
};

export default PropertyDetailPage;
