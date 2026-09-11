import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import L from 'leaflet';
import { useHabitoo } from '../context/HabitooContext';
import { PROPERTIES_DATA } from '../data/propertiesData';
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
  X, 
  ChevronLeft,
  ChevronRight,
  Maximize,
  Building,
  Navigation
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: 'var(--obsidian-black)', fontWeight: 600 }}>
          <MapPin size={16} color="var(--primary-red)" style={{ flexShrink: 0 }} />
          <span>{address || `${neighborhood}, ${city}`}</span>
        </div>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${coordinates[0]},${coordinates[1]}`}
          target="_blank"
          rel="noreferrer"
          style={{
            fontSize: '0.75rem',
            color: 'var(--primary-red)',
            fontWeight: 700,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            whiteSpace: 'nowrap'
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
    bookVisit
  } = useHabitoo();

  // Check if viewing preview from publish page
  const isPreview = id === 'preview-card' || id === 'preview';
  let previewData = null;
  if (isPreview) {
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

  // Find property
  const property = isPreview && previewData
    ? {
        id: 'preview-card',
        title: previewData.title || "Titre de l'annonce",
        type: previewData.type || "Villa d'architecte",
        category: previewData.category || "LOCATION",
        city: previewData.city || "Abidjan",
        country: previewData.country || "Côte d'Ivoire",
        neighborhood: previewData.neighborhood || "Quartier",
        address: previewData.address || `${previewData.neighborhood || 'Quartier'}, ${previewData.city || 'Abidjan'}`,
        priceXOF: previewData.priceXOF,
        priceUSD: previewData.priceUSD,
        priceXAF: previewData.priceXAF,
        period: previewData.period || '',
        specs: previewData.specs || { bedrooms: 4, bathrooms: 4, area: 400, security: "Gardiennage certifié" },
        amenities: previewData.amenities && previewData.amenities.length > 0
          ? previewData.amenities
          : ["Groupe électrogène automatique", "Forage / Réserve d'eau", "Gardiennage H24", "Climatisation intégrale"],
        coordinates: previewData.city === 'Kinshasa' ? [-4.3217, 15.3125] : previewData.city === 'Brazzaville' ? [-4.2677, 15.2919] : [5.3484, -3.9780],
        images: previewData.images && previewData.images.length > 0
          ? previewData.images
          : ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85"],
        description: previewData.description || "Propriété d'exception offrant un confort absolu et des prestations de haut standing.",
        auditDate: "Aujourd'hui",
        auditStatus: "Fiche en cours de publication — Données fournies par le déclarant",
        chargesBreakdown: {
          copropriete: "À définir",
          securite: "Inclus",
          depotGarantie: "Caution sous séquestre sécurisé",
          energie: "Compteur individuel"
        },
        agent: {
          name: previewData.ownerName || "Propriétaire Déclarant",
          agency: (previewData.userRole === 'AGENCE' || previewData.userRole === 'MANDATAIRE') ? "Agence Immobilière Agréée" : "Propriétaire Direct",
          phone: previewData.ownerPhone || "+225 07 00 00 00",
          verified: true
        }
      }
    : (PROPERTIES_DATA.find(p => p.id === id) || PROPERTIES_DATA[0]);

  const favorite = isFavorite(property.id);

  // Carousel & Lightbox States
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Booking Form States
  const [visitDate, setVisitDate] = useState('2025-03-02');
  const [visitTime, setVisitTime] = useState('11:00 - 12:00');
  const [paymentMethod, setPaymentMethod] = useState('Orange Money');
  const [phoneNumber, setPhoneNumber] = useState('+225 07 88 99 00');
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);

  const timeSlots = [
    "09:30 - 10:30",
    "11:00 - 12:00",
    "14:30 - 15:30",
    "16:30 - 17:30"
  ];

  const paymentOptions = [
    { name: "Mobile money", type: "mobile", badge: "OM", color: "#FF7900" },
    { name: "Carte Bancaire", type: "card", badge: "CB", color: "#1A1A1A" }
  ];

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    bookVisit(property, visitDate, visitTime, paymentMethod);
    setIsBookingSuccess(true);
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
      <div style={{ backgroundColor: 'var(--surface-white)', borderBottom: '1px solid var(--border-color)', padding: '14px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: 'var(--graphite-gray)' }}>
            <Link to="/" style={{ color: 'var(--graphite-gray)' }}>Accueil</Link>
            <span>/</span>
            <Link to={`/recherche?location=${property.city}`} style={{ color: 'var(--graphite-gray)' }}>{property.city}</Link>
            <span>/</span>
            <span style={{ color: 'var(--obsidian-black)', fontWeight: 600 }}>{property.neighborhood}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => toggleFavorite(property.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
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
              <span>{favorite ? "Favori sauvegardé" : "Sauvegarder"}</span>
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
                padding: '8px 14px',
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

      {/* 2. MAIN 2-COLUMN LAYOUT: Left = Booking Widget, Right = Carousel & Details */}
      <div className="container">
        <div className="pdp-layout-grid">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: PLANIFIER UNE VISITE (Sticky Booking Widget) */}
          {/* ========================================================= */}
          <div 
            id="visite"
            className="pdp-booking-col"
            style={{
              position: 'sticky',
              top: '24px',
              backgroundColor: 'var(--surface-white)',
              borderRadius: 'var(--radius-banner)',
              boxShadow: 'var(--shadow-lg)',
              padding: '28px',
              zIndex: 50
            }}
          >
            {isBookingSuccess ? (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <div 
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--verified-green-bg)',
                    color: 'var(--verified-green)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px'
                  }}
                >
                  <CheckCircle2 size={32} />
                </div>

                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px' }}>
                  Visite Confirmée !
                </h3>

                <p style={{ fontSize: '0.8125rem', color: 'var(--graphite-gray)', marginBottom: '20px' }}>
                  Votre visite est programmée pour le <strong>{visitDate}</strong> de <strong>{visitTime}</strong>. L'agent vous contactera pour confirmer les détails.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    onClick={() => navigate('/mon-compte')}
                    className="btn-primary"
                    style={{ width: '100%' }}
                  >
                    Voir dans mon Espace
                  </button>

                  <button
                    onClick={() => setIsBookingSuccess(false)}
                    className="btn-ghost-dark"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    Planifier une autre visite
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit}>
                
                {/* Header */}
                <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '2px solid var(--border-light)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-red)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Réservation Sécurisée
                  </span>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 700, marginTop: '2px' }}>
                    Planifier une Visite
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

                {/* Payment Method */}
                <div className="form-group">
                  <label className="form-label">Mode de paiement</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '10px' }}>
                    {paymentOptions.map(op => {
                      const isSelected = paymentMethod === op.name;
                      return (
                        <button
                          key={op.name}
                          type="button"
                          onClick={() => setPaymentMethod(op.name)}
                          style={{
                            padding: '8px 4px',
                            borderRadius: '6px',
                            border: isSelected ? '2px solid var(--primary-red)' : '1px solid var(--border-color)',
                            backgroundColor: isSelected ? 'var(--soft-tint)' : 'var(--surface-white)',
                            fontSize: '0.6875rem',
                            fontWeight: 700,
                            color: isSelected ? 'var(--primary-red)' : 'var(--obsidian-black)',
                            textAlign: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          {op.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', height: '48px', fontSize: '0.9375rem' }}
                >
                  <Lock size={15} />
                  <span>Réserver — 10 000 FCFA</span>
                </button>

                <div style={{ textAlign: 'center', marginTop: '12px' }}>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--graphite-gray)' }}>
                    Annulation sans frais jusqu'à 2h avant la visite
                  </span>
                </div>

              </form>
            )}
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: CAROUSEL, TITLE, SPECS, AGENCY, MINI-MAP   */}
          {/* ========================================================= */}
          <div className="pdp-content-col">
            
            {/* 1. PHOTO CAROUSEL */}
            <div className="pdp-carousel-container" style={{ marginBottom: '28px' }}>
              <div 
                className="pdp-carousel-main-frame"
                onClick={() => setIsLightboxOpen(true)}
                title="Cliquer pour afficher en grand format"
              >
                <img 
                  src={property.images[activePhotoIndex]} 
                  alt={`${property.title} — photo ${activePhotoIndex + 1}`}
                  className="pdp-carousel-main-img"
                />

                {/* Category Badge */}
                <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 5 }}>
                  <span className="badge-tag badge-location">{property.category}</span>
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
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  padding: '20px 24px',
                  backgroundColor: 'var(--surface-white)',
                  borderRadius: 'var(--radius-card)',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--graphite-gray)', display: 'block', fontWeight: 600 }}>
                    {property.category === 'LOCATION' ? 'Loyer mensuel' : 'Prix de vente'}
                  </span>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--obsidian-black)' }}>
                    {formatPrice(property.priceXOF, property.priceUSD, property.priceXAF, property.period)}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--graphite-gray)', display: 'block', fontWeight: 600 }}>Charges de copropriété</span>
                  <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--obsidian-black)' }}>
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
                marginBottom: '32px'
              }}
            >
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
                  <span>H24 & Blindé</span>
                </div>
              </div>
            </div>

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
            <div 
              className="agency-contact-card"
              style={{
                backgroundColor: 'var(--surface-white)',
                borderRadius: 'var(--radius-card)',
                border: '1px solid var(--border-color)',
                padding: '24px',
                marginBottom: '36px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img 
                    src={property.agent.avatar} 
                    alt={property.agent.name} 
                    style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-color)' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--graphite-gray)', fontWeight: 700 }}>
                        Agence Immobilière Mandataire
                      </span>
                    </div>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--obsidian-black)', margin: 0 }}>
                      {property.agent.agency}
                    </h4>
                    <div style={{ fontSize: '0.875rem', color: 'var(--graphite-gray)', marginTop: '2px' }}>
                      Conseiller dédié : <strong>{property.agent.name}</strong>
                    </div>
                  </div>
                </div>

                <a 
                  href={`tel:${property.agent.phone}`} 
                  className="btn-dark"
                  style={{ padding: '12px 20px', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
                >
                  <Phone size={15} />
                  <span>Contacter l'agence ({property.agent.phone})</span>
                </a>
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

      {/* 4. MOBILE STICKY BOOKING BAR */}
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
          onClick={() => {
            const el = document.getElementById('visite');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="btn-primary"
          style={{ padding: '10px 18px', fontSize: '0.875rem', gap: '6px' }}
        >
          <Calendar size={15} />
          <span>Réserver visite</span>
        </button>
      </div>

      {/* Styles */}
      <style>{`
        /* ===== 2-COLUMN LAYOUT ===== */
        .pdp-layout-grid {
          display: grid;
          grid-template-columns: 390px minmax(0, 1fr);
          gap: 40px;
          align-items: start;
          margin-top: 28px;
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

        /* ===== RESPONSIVE ===== */
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
            order: 2 !important;
            width: 100% !important;
            position: static !important;
          }
          .pdp-page-container {
            padding-bottom: 120px !important;
          }
          .mobile-sticky-booking-bar {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: var(--surface-white);
            border-top: 1px solid var(--border-color);
            padding: 12px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            z-index: 850;
            box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.08);
          }
          .mobile-sticky-price-label {
            display: block;
            font-size: 0.6875rem;
            color: var(--graphite-gray);
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .mobile-sticky-price-val {
            font-size: 1.15rem;
            font-weight: 800;
            color: var(--obsidian-black);
            line-height: 1.2;
          }
        }
      `}</style>

    </div>
  );
};

export default PropertyDetailPage;
