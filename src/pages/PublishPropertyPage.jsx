import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import L from 'leaflet';
import { useHabitoo } from '../context/HabitooContext';
import { 
  PROPERTY_TYPES, 
  PRO_CATEGORIES, 
  PRO_LEASE_TYPES, 
  PRO_AMENITIES_FILTERS,
  COUNTRIES_DATA 
} from '../data/propertiesData';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  Sparkles, 
  Check, 
  ChevronDown, 
  Plus, 
  Minus, 
  X,
  Lock,
  Edit3,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Navigation,
  Image as ImageIcon,
  Building,
  Briefcase,
  Store,
  Warehouse,
  Users,
  Star,
  ExternalLink
} from 'lucide-react';

const COUNTRY_CODES = [
  { code: '+225', country: "Côte d'Ivoire", flag: '🇨🇮' },
  { code: '+243', country: 'RD Congo (Kinshasa)', flag: '🇨🇩' },
  { code: '+242', country: 'Congo (Brazzaville)', flag: '🇨🇬' },
  { code: '+221', country: 'Sénégal', flag: '🇸🇳' },
  { code: '+237', country: 'Cameroun', flag: '🇨🇲' },
  { code: '+229', country: 'Bénin', flag: '🇧🇯' },
  { code: '+228', country: 'Togo', flag: '🇹🇬' },
  { code: '+241', country: 'Gabon', flag: '🇬🇦' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+32', country: 'Belgique', flag: '🇧🇪' },
  { code: '+41', country: 'Suisse', flag: '🇨🇭' },
  { code: '+1', country: 'Canada / USA', flag: '🇨🇦' },
  { code: '+44', country: 'Royaume-Uni', flag: '🇬🇧' },
];

const ALL_AMENITIES = [
  'Groupe électrogène automatique',
  "Forage / Réserve d'eau",
  'Gardiennage H24',
  'Climatisation intégrale',
  'Piscine privée',
  'Fibre optique haut débit',
  'Ascenseur privatif',
  'Domotique intégrée',
  'Salle de sport privée',
  'Cuisine équipée haut standing',
  'Garage fermé'
];

const DEFAULT_COVER_IMAGE = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';

const CITY_COORDINATES = {
  'Abidjan': [5.3484, -3.9780],
  'Kinshasa': [-4.3217, 15.3125],
  'Brazzaville': [-4.2677, 15.2919],
  'Pointe-Noire': [-4.7975, 11.8504],
  'Yamoussoukro': [6.8276, -5.2893],
  'Assinie': [5.1278, -3.2847],
  'Lubumbashi': [-11.6609, 27.4794]
};

// Leaflet Mini Map Component pour la prévisualisation en direct
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

      const customIcon = L.divIcon({
        className: 'custom-property-pin',
        html: `
          <div style="
            width: 34px;
            height: 34px;
            background: #F70000;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 14px rgba(247,0,0,0.4);
            border: 2px solid #FFFFFF;
          ">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(45deg);">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 34]
      });

      L.marker(coordinates, { icon: customIcon }).addTo(map);
      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView(coordinates, 14);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [coordinates]);

  return (
    <div className="preview-map-container">
      <div ref={mapContainerRef} className="preview-map-instance" />
      <div className="preview-map-overlay-badge">
        <div className="preview-map-address">
          <MapPin size={15} color="var(--primary-red)" style={{ flexShrink: 0 }} />
          <span>{address || `${neighborhood}, ${city}`}</span>
        </div>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${coordinates[0]},${coordinates[1]}`}
          target="_blank"
          rel="noreferrer"
          className="preview-map-link"
        >
          <Navigation size={12} />
          <span>Itinéraire</span>
        </a>
      </div>
    </div>
  );
};

export const PublishPropertyPage = () => {
  const navigate = useNavigate();
  const { activeCity, currentUser, openAuthModal, addUserProperty, formatPrice } = useHabitoo();

  const handleGoBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const SIMULATED_USER_AVATAR = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80";
  const userAvatar = currentUser?.avatar || SIMULATED_USER_AVATAR;
  const userName = currentUser?.name || "M. Abdoulaye Touré";

  const isUserPro = Boolean(
    currentUser?.isPro ||
    currentUser?.role?.toLowerCase().includes('pro') ||
    currentUser?.role?.toLowerCase().includes('agent') ||
    currentUser?.role?.toLowerCase().includes('agence') ||
    currentUser?.role?.toLowerCase().includes('démarcheur') ||
    currentUser?.agency
  );

  const isUserDemarcheur = isUserPro && Boolean(
    currentUser?.proType === 'DEMARCHEUR' ||
    currentUser?.type === 'DEMARCHEUR' ||
    currentUser?.role?.toLowerCase().includes('démarcheur')
  );

  const userAgencyName = currentUser?.agency || (isUserDemarcheur ? userName : (isUserPro ? "Agence Immobilière Partenaire" : "Propriétaire Direct"));

  const [searchParams] = useSearchParams();
  const initialIsPro = searchParams.get('destination') === 'PRO' || searchParams.get('pro') === '1';

  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [publishedRefNumber, setPublishedRefNumber] = useState('');

  // Form state - Statut verrouillé de manière fixe à 'PROPRIETAIRE'
  const [formData, setFormData] = useState({
    destination: initialIsPro ? 'PRO' : 'HABITATION', // 'HABITATION' | 'PRO'
    proCategory: 'BUREAU', // 'BUREAU' | 'COMMERCE' | 'LOCAL_PRO' | 'ENTREPOT' | 'COWORKING' | 'AUTRE'
    leaseType: 'Bail professionnel',
    category: 'LOCATION', // 'LOCATION' | 'VENTE'
    type: initialIsPro ? "Bureaux" : "Villa d'architecte",
    country: activeCity?.country || "Côte d'Ivoire",
    city: activeCity?.name || 'Abidjan',
    neighborhood: initialIsPro ? 'Le Plateau' : 'Riviera Golf',
    title: initialIsPro ? "Plateau de Bureaux Équipé — Quartier d'Affaires" : "Somptueuse Villa Contemporaine avec Vue Lagune",
    description: initialIsPro ? "Locaux professionnels d'exception, modulables, climatisés et sécurisés avec connectivité fibre optique." : "Propriété d'exception aux volumes généreux, finitions haut de gamme, grand jardin paysager et sécurité maximale.",
    price: initialIsPro ? 4500000 : 3500000,
    area: initialIsPro ? 280 : 550,
    bedrooms: 4,
    bathrooms: 2,
    offices: 4,
    workstations: 15,
    windowDisplay: '6 mètres sur rue',
    storageArea: '25 m²',
    ceilingHeight: '7.5 m',
    loadingDock: 'Quai de déchargement niveleur',
    waitingRoom: "Salle d'attente dédiée",
    amenities: initialIsPro ? [
      'Fibre optique très haut débit',
      'Groupe électrogène automatique',
      'Climatisation intégrale',
      'Gardiennage H24 & Vidéosurveillance'
    ] : [
      'Groupe électrogène automatique',
      "Forage / Réserve d'eau",
      'Gardiennage H24',
      'Climatisation intégrale',
      'Piscine privée'
    ],
    userRole: 'PROPRIETAIRE', // Fixe et immuable : Propriétaire (particulier)
    ownerPhone: currentUser?.phone || '07 08 09 10',
    ownerEmail: currentUser?.email || 'contact@domaine.ci'
  });

  const selectedCountryObj = COUNTRIES_DATA.find(c => c.name === formData.country || c.cities.some(ci => ci.name === formData.city)) || COUNTRIES_DATA[0];

  const handleCountryChange = (countryName) => {
    const found = COUNTRIES_DATA.find(c => c.name === countryName) || COUNTRIES_DATA[0];
    setFormData(prev => ({
      ...prev,
      country: found.name,
      city: found.cities[0].name
    }));
  };

  const handleCityChange = (cityName) => {
    setFormData(prev => ({
      ...prev,
      city: cityName
    }));
  };

  // Photos state
  const [uploadedPhotos, setUploadedPhotos] = useState([DEFAULT_COVER_IMAGE]);
  const fileInputRef = useRef(null);

  // Active photo index for preview carousel
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Mobile drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(() => searchParams.get('edit') === '1');

  useEffect(() => {
    if (searchParams.get('edit') === '1') {
      setIsDrawerOpen(true);
    }
  }, [searchParams]);

  // Amenities dropdown state
  const [isAmenitiesOpen, setIsAmenitiesOpen] = useState(false);
  const amenitiesDropdownRef = useRef(null);

  // Country code selector state
  const [countryCode, setCountryCode] = useState('+225');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const countryDropdownRef = useRef(null);

  const selectedCountry = COUNTRY_CODES.find(c => c.code === countryCode) || COUNTRY_CODES[0];

  // Outside click listener for phone & amenities dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target)) {
        setIsCountryDropdownOpen(false);
      }
      if (amenitiesDropdownRef.current && !amenitiesDropdownRef.current.contains(e.target)) {
        setIsAmenitiesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle amenity toggle
  const toggleAmenity = (item) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(item)
        ? prev.amenities.filter(a => a !== item)
        : [...prev.amenities, item]
    }));
  };

  // Generate catchy title helper
  const generateTitle = () => {
    const adj = formData.category === 'LOCATION' ? 'Magnifique' : 'Exceptionnelle';
    const loc = formData.neighborhood ? `à ${formData.neighborhood}` : `à ${formData.city}`;
    const generated = `${adj} ${formData.type} avec Finitions Haut Standing ${loc}`;
    setFormData(prev => ({ ...prev, title: generated }));
  };

  // Handle multi-photos upload
  const handlePhotosUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newUrls = files.map(file => URL.createObjectURL(file));
      if (uploadedPhotos.length === 1 && uploadedPhotos[0] === DEFAULT_COVER_IMAGE) {
        setUploadedPhotos(newUrls);
      } else {
        setUploadedPhotos(prev => [...prev, ...newUrls]);
      }
    }
    if (e.target) e.target.value = '';
  };

  const removePhoto = (indexToRemove) => {
    setUploadedPhotos(prev => {
      const updated = prev.filter((_, idx) => idx !== indexToRemove);
      return updated.length === 0 ? [DEFAULT_COVER_IMAGE] : updated;
    });
    if (activePhotoIndex >= uploadedPhotos.length - 1) {
      setActivePhotoIndex(0);
    }
  };

  const currencyLabel = formData.city === 'Kinshasa' ? '$' : 'FCFA';

  // Construct property object formatted for detailed preview and storage
  const previewProperty = {
    id: 'preview-card',
    destination: formData.destination || 'HABITATION',
    proCategory: formData.destination === 'PRO' ? formData.proCategory : null,
    leaseType: formData.destination === 'PRO' ? formData.leaseType : null,
    title: formData.title || "Titre de l'annonce",
    type: formData.destination === 'PRO' 
      ? (PRO_CATEGORIES.find(c => c.id === formData.proCategory)?.label || formData.type)
      : formData.type,
    category: formData.category,
    city: formData.city,
    country: selectedCountryObj.name,
    neighborhood: formData.neighborhood || 'Quartier',
    address: `${formData.neighborhood || 'Quartier'}, ${formData.city}`,
    description: formData.description || "Propriété d'exception aux finitions de haut standing, volumes généreux et sécurité maximale.",
    images: uploadedPhotos.length > 0 ? uploadedPhotos : [DEFAULT_COVER_IMAGE],
    specs: {
      bedrooms: formData.destination === 'PRO' ? 0 : formData.bedrooms,
      bathrooms: formData.bathrooms,
      area: formData.area || 0,
      offices: formData.destination === 'PRO' && (formData.proCategory === 'BUREAU' || formData.proCategory === 'LOCAL_PRO' || formData.proCategory === 'COWORKING') ? (Number(formData.offices) || null) : null,
      workstations: formData.destination === 'PRO' && (formData.proCategory === 'BUREAU' || formData.proCategory === 'COWORKING') ? (Number(formData.workstations) || null) : null,
      restrooms: formData.destination === 'PRO' ? (Number(formData.bathrooms) || 1) : null,
      windowDisplay: formData.destination === 'PRO' && formData.proCategory === 'COMMERCE' ? (formData.windowDisplay || null) : null,
      storageArea: formData.destination === 'PRO' && formData.proCategory === 'COMMERCE' ? (formData.storageArea || null) : null,
      ceilingHeight: formData.destination === 'PRO' && formData.proCategory === 'ENTREPOT' ? (formData.ceilingHeight || null) : null,
      loadingDock: formData.destination === 'PRO' && formData.proCategory === 'ENTREPOT' ? Boolean(formData.loadingDock && !String(formData.loadingDock).toLowerCase().includes('sans')) : false,
      waitingRoom: formData.destination === 'PRO' && formData.proCategory === 'LOCAL_PRO' ? (formData.waitingRoom || null) : null,
      security: "Gardiennage certifié"
    },
    amenities: formData.amenities || [],
    priceXOF: selectedCountryObj.currency === 'XOF' ? Number(formData.price || 0) : null,
    priceUSD: selectedCountryObj.currency === 'USD' ? Number(formData.price || 0) : null,
    priceXAF: selectedCountryObj.currency === 'XAF' ? Number(formData.price || 0) : null,
    period: formData.category === 'LOCATION' ? '/mois' : '',
    ownerName: userName,
    ownerAvatar: userAvatar,
    ownerPhone: formData.ownerPhone || currentUser?.phone || '',
    ownerEmail: formData.ownerEmail || currentUser?.email || '',
    userRole: isUserPro ? (isUserDemarcheur ? 'DEMARCHEUR' : 'AGENCE') : 'PROPRIETAIRE',
    isPro: isUserPro,
    advertiserType: isUserPro ? 'PRO' : 'PARTICULIER',
    agent: {
      name: userName,
      agency: userAgencyName,
      avatar: userAvatar,
      phone: formData.ownerPhone || currentUser?.phone || '+225 07 00 00 00',
      verified: true,
      proType: isUserDemarcheur ? 'DEMARCHEUR' : (isUserPro ? 'AGENCE' : undefined),
      proId: currentUser?.proId || undefined
    }
  };

  const currentCoordinates = CITY_COORDINATES[formData.city] || [5.3484, -3.9780];

  // Carousel photo navigation helpers
  const currentImages = previewProperty.images;
  const currentPhotoUrl = currentImages[activePhotoIndex] || currentImages[0] || DEFAULT_COVER_IMAGE;

  const handleNextPhoto = (e) => {
    e?.stopPropagation();
    setActivePhotoIndex((prev) => (prev + 1) % currentImages.length);
  };

  const handlePrevPhoto = (e) => {
    e?.stopPropagation();
    setActivePhotoIndex((prev) => (prev - 1 + currentImages.length) % currentImages.length);
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const randomRef = `HAB-${formData.city.substring(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setPublishedRefNumber(randomRef);
    if (addUserProperty) {
      addUserProperty({
        ...previewProperty,
        ref: randomRef
      });
    }
    setIsDrawerOpen(false);
    setIsSubmitted(true);
  };

  // Sync preview property to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('habitoo_preview_property', JSON.stringify(previewProperty));
    } catch (e) {
      console.error("Erreur enregistrement aperçu :", e);
    }
  }, [formData, uploadedPhotos, userName, userAvatar]);

  // Auth gate check
  useEffect(() => {
    if (!currentUser) {
      openAuthModal();
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="publish-auth-wrapper">
        <div className="publish-auth-gate-card">
          <div className="auth-gate-icon">
            <Lock size={32} color="var(--primary-red)" />
          </div>
          <span className="auth-gate-badge">Accès Réservé</span>
          <h2 className="font-serif auth-gate-title">Connexion requise pour publier</h2>
          <p className="auth-gate-desc">
            Pour assurer la certification et la sécurité des transactions sur Habitoo, la publication d'un bien nécessite d'être connecté à votre espace membre.
          </p>
          <button 
            type="button" 
            onClick={() => openAuthModal()} 
            className="btn-primary" 
            style={{ padding: '10px 22px', margin: '0 auto', display: 'inline-flex' }}
          >
            <span>Se connecter / S'inscrire</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  // Composant du formulaire de paramétrage (utilisé dans la colonne droite desktop et dans le tiroir mobile)
  const renderFormProcess = () => (
    <div className="publish-process-card">

      {/* Stepper Navigation Ultra-Fin */}
      <div className="publish-stepper-bar">
        <button 
          type="button" 
          className={`publish-stepper-btn ${step === 1 ? 'active' : step > 1 ? 'done' : ''}`}
          onClick={() => setStep(1)}
        >
          <div className="step-circle">{step > 1 ? <Check size={11} /> : '1'}</div>
          <span className="step-name">Bien</span>
        </button>

        <div className="publish-stepper-line" />

        <button 
          type="button" 
          className={`publish-stepper-btn ${step === 2 ? 'active' : step > 2 ? 'done' : ''}`}
          onClick={() => setStep(2)}
        >
          <div className="step-circle">{step > 2 ? <Check size={11} /> : '2'}</div>
          <span className="step-name">Critères</span>
        </button>

        <div className="publish-stepper-line" />

        <button 
          type="button" 
          className={`publish-stepper-btn ${step === 3 ? 'active' : ''}`}
          onClick={() => setStep(3)}
        >
          <div className="step-circle">3</div>
          <span className="step-name">Contact</span>
        </button>
      </div>

      {/* STEP 1: TYPOLOGIE, LOCALISATION & DESCRIPTION */}
      {step === 1 && (
        <div className="publish-step-body animate-fadeIn">
          
          {/* Destination Selector: Habitation vs Immobilier professionnel */}
          <div className="compact-form-row">
            <label className="compact-label" style={{ margin: 0 }}>Destination :</label>
            <div className="compact-segmented-control">
              <button
                type="button"
                className={`seg-btn ${formData.destination !== 'PRO' ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({
                  ...prev,
                  destination: 'HABITATION',
                  type: "Villa d'architecte",
                  title: prev.destination === 'PRO' ? "Somptueuse Villa Contemporaine avec Vue Lagune" : prev.title
                }))}
              >
                Habitation
              </button>
              <button
                type="button"
                className={`seg-btn ${formData.destination === 'PRO' ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({
                  ...prev,
                  destination: 'PRO',
                  type: "Bureaux",
                  proCategory: prev.proCategory || 'BUREAU',
                  title: prev.destination !== 'PRO' ? "Plateau de Bureaux Équipé — Quartier d'Affaires" : prev.title
                }))}
              >
                Immobilier pro
              </button>
            </div>
          </div>

          {/* Operation Toggle: À Louer / À Vendre */}
          <div className="compact-form-row">
            <label className="compact-label" style={{ margin: 0 }}>Opération :</label>
            <div className="compact-segmented-control">
              <button
                type="button"
                className={`seg-btn ${formData.category === 'LOCATION' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, category: 'LOCATION' })}
              >
                À Louer
              </button>
              <button
                type="button"
                className={`seg-btn ${formData.category === 'VENTE' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, category: 'VENTE' })}
              >
                À Vendre
              </button>
            </div>
          </div>

          {/* Typology */}
          <div className="compact-field">
            <label className="compact-label">
              {formData.destination === 'PRO' ? "Catégorie professionnelle" : "Type de bien"}
            </label>
            {formData.destination === 'PRO' ? (
              <select
                className="form-select compact-input"
                value={formData.proCategory}
                onChange={(e) => {
                  const newCat = e.target.value;
                  const catObj = PRO_CATEGORIES.find(c => c.id === newCat);
                  setFormData(prev => ({
                    ...prev,
                    proCategory: newCat,
                    type: catObj?.label || newCat
                  }));
                }}
              >
                {PRO_CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            ) : (
              <select
                className="form-select compact-input"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                {PROPERTY_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            )}
          </div>

          {/* Pays & Ville liés */}
          <div className="publish-grid-2">
            <div className="compact-field">
              <label className="compact-label">Pays</label>
              <select
                className="form-select compact-input"
                value={formData.country}
                onChange={(e) => handleCountryChange(e.target.value)}
              >
                {COUNTRIES_DATA.map(c => (
                  <option key={c.id} value={c.name}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>

            <div className="compact-field">
              <label className="compact-label">Ville</label>
              <select
                className="form-select compact-input"
                value={formData.city}
                onChange={(e) => handleCityChange(e.target.value)}
              >
                {selectedCountryObj.cities.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Neighborhood */}
          <div className="compact-field">
            <label className="compact-label">Quartier précis</label>
            <input
              type="text"
              className="form-input compact-input"
              placeholder="ex: Riviera Golf, Gombe, Mpila..."
              value={formData.neighborhood}
              onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
              required
            />
          </div>

          {/* Title with AI Assistant */}
          <div className="compact-field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
              <label className="compact-label" style={{ margin: 0 }}>Titre de l'annonce</label>

            </div>
            <input
              type="text"
              className="form-input compact-input"
              placeholder="ex: Somptueuse Villa Contemporaine avec Vue Lagune"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {/* Description du bien */}
          <div className="compact-field">
            <label className="compact-label">Description du bien</label>
            <textarea
              rows={3}
              className="form-textarea compact-textarea"
              placeholder="Décrivez les atouts majeurs (vue, finitions, standing, sécurité, volumes...)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Step 1 Footer */}
          <div className="compact-step-footer">
            <span className="step-counter-text">Étape 1 sur 3</span>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn-primary compact-action-btn"
            >
              <span>Caractéristiques</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: CARACTÉRISTIQUES & COMMODITÉS */}
      {step === 2 && (
        <div className="publish-step-body animate-fadeIn">
          
          {/* Price & Surface */}
          <div className="publish-grid-2">
            <div className="compact-field">
              <label className="compact-label">
                {formData.category === 'LOCATION' ? 'Loyer mensuel' : 'Prix de vente'} ({currencyLabel})
              </label>
              <div className="compact-affix-box">
                <input
                  type="number"
                  className="form-input compact-input"
                  placeholder="ex: 3500000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  required
                />
                <span className="affix-badge">{currencyLabel}</span>
              </div>
            </div>

            <div className="compact-field">
              <label className="compact-label">
                {formData.destination === 'PRO' ? 'Superficie utile (m²)' : 'Superficie habitable (m²)'}
              </label>
              <div className="compact-affix-box">
                <input
                  type="number"
                  className="form-input compact-input"
                  placeholder="ex: 550"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                  required
                />
                <span className="affix-badge">m²</span>
              </div>
            </div>
          </div>

          {/* Critères dynamiques selon Destination */}
          {formData.destination === 'PRO' ? (
            <>
              {/* Socle Commun Pro : Sanitaires & Type de bail */}
              <div className="publish-grid-2">
                <div className="compact-field">
                  <label className="compact-label">Toilettes</label>
                  <div className="compact-counter">
                    <button
                      type="button"
                      className="counter-btn"
                      onClick={() => setFormData(prev => ({ ...prev, bathrooms: Math.max(1, prev.bathrooms - 1) }))}
                    >
                      <Minus size={12} />
                    </button>
                    <span className="counter-text">{formData.bathrooms} toilettes</span>
                    <button
                      type="button"
                      className="counter-btn"
                      onClick={() => setFormData(prev => ({ ...prev, bathrooms: prev.bathrooms + 1 }))}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                <div className="compact-field">
                  <label className="compact-label">Type de bail contractuel</label>
                  <select
                    className="form-select compact-input"
                    value={formData.leaseType}
                    onChange={(e) => setFormData({ ...formData, leaseType: e.target.value })}
                  >
                    {PRO_LEASE_TYPES.map(lease => (
                      <option key={lease} value={lease}>{lease}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Critères Spécifiques Dédiés selon la Typologie */}
              {formData.proCategory === 'BUREAU' && (
                <div className="publish-grid-2">
                  <div className="compact-field">
                    <label className="compact-label">Bureaux fermés</label>
                    <div className="compact-counter">
                      <button
                        type="button"
                        className="counter-btn"
                        onClick={() => setFormData(prev => ({ ...prev, offices: Math.max(0, (prev.offices || 1) - 1) }))}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="counter-text">{formData.offices || 0} bureau(x)</span>
                      <button
                        type="button"
                        className="counter-btn"
                        onClick={() => setFormData(prev => ({ ...prev, offices: (prev.offices || 0) + 1 }))}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="compact-field">
                    <label className="compact-label">Postes en open-space</label>
                    <input
                      type="number"
                      className="form-input compact-input"
                      placeholder="ex: 15"
                      value={formData.workstations || ''}
                      onChange={(e) => setFormData({ ...formData, workstations: Number(e.target.value) })}
                    />
                  </div>
                </div>
              )}

              {formData.proCategory === 'COMMERCE' && (
                <div className="publish-grid-2">
                  <div className="compact-field">
                    <label className="compact-label">Linéaire de vitrine</label>
                    <input
                      type="text"
                      className="form-input compact-input"
                      placeholder="ex: 8 mètres sur rue"
                      value={formData.windowDisplay || ''}
                      onChange={(e) => setFormData({ ...formData, windowDisplay: e.target.value })}
                    />
                  </div>

                  <div className="compact-field">
                    <label className="compact-label">Espace réserve / Stockage</label>
                    <input
                      type="text"
                      className="form-input compact-input"
                      placeholder="ex: 25 m² arrière-boutique"
                      value={formData.storageArea || ''}
                      onChange={(e) => setFormData({ ...formData, storageArea: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {formData.proCategory === 'ENTREPOT' && (
                <div className="publish-grid-2">
                  <div className="compact-field">
                    <label className="compact-label">Hauteur sous plafond (m)</label>
                    <input
                      type="text"
                      className="form-input compact-input"
                      placeholder="ex: 8.5 mètres"
                      value={formData.ceilingHeight || ''}
                      onChange={(e) => setFormData({ ...formData, ceilingHeight: e.target.value })}
                    />
                  </div>

                  <div className="compact-field">
                    <label className="compact-label">Accès logistique / Quai</label>
                    <select
                      className="form-select compact-input"
                      value={formData.loadingDock || 'Quai de déchargement niveleur'}
                      onChange={(e) => setFormData({ ...formData, loadingDock: e.target.value })}
                    >
                      <option value="Quai de déchargement niveleur">Quai niveleur gros porteurs</option>
                      <option value="Accès plain-pied semi-remorque">Accès de plain-pied camion</option>
                      <option value="Sans quai">Sans quai de déchargement</option>
                    </select>
                  </div>
                </div>
              )}

              {formData.proCategory === 'LOCAL_PRO' && (
                <div className="publish-grid-2">
                  <div className="compact-field">
                    <label className="compact-label">Nombre de pièces</label>
                    <div className="compact-counter">
                      <button
                        type="button"
                        className="counter-btn"
                        onClick={() => setFormData(prev => ({ ...prev, offices: Math.max(1, (prev.offices || 1) - 1) }))}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="counter-text">{formData.offices || 1} pièce(s)</span>
                      <button
                        type="button"
                        className="counter-btn"
                        onClick={() => setFormData(prev => ({ ...prev, offices: (prev.offices || 0) + 1 }))}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="compact-field">
                    <label className="compact-label">Salle d'attente</label>
                    <select
                      className="form-select compact-input"
                      value={formData.waitingRoom || "Salle d'attente dédiée"}
                      onChange={(e) => setFormData({ ...formData, waitingRoom: e.target.value })}
                    >
                      <option value="Salle d'attente dédiée">Salle d'attente dédiée</option>
                      <option value="Espace d'attente partagé">Espace d'attente partagé</option>
                      <option value="Sans salle d'attente">Sans salle d'attente</option>
                    </select>
                  </div>
                </div>
              )}

              {formData.proCategory === 'COWORKING' && (
                <div className="publish-grid-2">
                  <div className="compact-field">
                    <label className="compact-label">Capacité postes de travail</label>
                    <input
                      type="number"
                      className="form-input compact-input"
                      placeholder="ex: 30"
                      value={formData.workstations || ''}
                      onChange={(e) => setFormData({ ...formData, workstations: Number(e.target.value) })}
                    />
                  </div>

                  <div className="compact-field">
                    <label className="compact-label">Salles de réunion équipées</label>
                    <div className="compact-counter">
                      <button
                        type="button"
                        className="counter-btn"
                        onClick={() => setFormData(prev => ({ ...prev, offices: Math.max(0, (prev.offices || 1) - 1) }))}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="counter-text">{formData.offices || 0} salle(s)</span>
                      <button
                        type="button"
                        className="counter-btn"
                        onClick={() => setFormData(prev => ({ ...prev, offices: (prev.offices || 0) + 1 }))}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Chambres & Salles de bain (Résidentiel) */
            <div className="publish-grid-2">
              <div className="compact-field">
                <label className="compact-label">Chambres</label>
                <div className="compact-counter">
                  <button
                    type="button"
                    className="counter-btn"
                    onClick={() => setFormData(prev => ({ ...prev, bedrooms: Math.max(1, prev.bedrooms - 1) }))}
                  >
                    <Minus size={12} />
                  </button>
                  <span className="counter-text">{formData.bedrooms} ch.</span>
                  <button
                    type="button"
                    className="counter-btn"
                    onClick={() => setFormData(prev => ({ ...prev, bedrooms: prev.bedrooms + 1 }))}
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>

              <div className="compact-field">
                <label className="compact-label">Salles de bain</label>
                <div className="compact-counter">
                  <button
                    type="button"
                    className="counter-btn"
                    onClick={() => setFormData(prev => ({ ...prev, bathrooms: Math.max(1, prev.bathrooms - 1) }))}
                  >
                    <Minus size={12} />
                  </button>
                  <span className="counter-text">{formData.bathrooms} sdb</span>
                  <button
                    type="button"
                    className="counter-btn"
                    onClick={() => setFormData(prev => ({ ...prev, bathrooms: prev.bathrooms + 1 }))}
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Commodités: Liste déroulante multi-sélection avec tags (adaptée PRO / HABITATION) */}
          <div className="compact-field" ref={amenitiesDropdownRef} style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
              <label className="compact-label" style={{ margin: 0 }}>
                {formData.destination === 'PRO' ? 'Prestations & Équipements professionnels' : 'Commodités'}
              </label>
              <span style={{ fontSize: '0.68rem', color: 'var(--graphite-gray)', fontWeight: 600 }}>
                {formData.amenities.length} sélectionnée(s)
              </span>
            </div>

            <div 
              className="multi-select-trigger-box" 
              onClick={() => setIsAmenitiesOpen(!isAmenitiesOpen)}
            >
              <div className="multi-select-tags-wrap">
                {formData.amenities.length === 0 ? (
                  <span className="multi-placeholder">Sélectionner des équipements...</span>
                ) : (
                  formData.amenities.map(item => (
                    <span key={item} className="amenity-chip-tag">
                      <span className="chip-text">{item}</span>
                      <button
                        type="button"
                        className="chip-close-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAmenity(item);
                        }}
                      >
                        <X size={9} />
                      </button>
                    </span>
                  ))
                )}
              </div>
              <ChevronDown size={14} className={`dropdown-chevron ${isAmenitiesOpen ? 'open' : ''}`} />
            </div>

            {isAmenitiesOpen && (
              <div className="multi-select-popover">
                <div className="popover-scroll-area">
                  {(formData.destination === 'PRO' ? PRO_AMENITIES_FILTERS : ALL_AMENITIES).map(amenity => {
                    const isSelected = formData.amenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        className={`popover-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleAmenity(amenity)}
                      >
                        <div className="popover-checkbox">
                          {isSelected && <Check size={10} color="#FFF" />}
                        </div>
                        <span className="popover-item-text">{amenity}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Step 2 Footer */}
          <div className="compact-step-footer">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="btn-ghost-dark compact-action-btn"
            >
              <ArrowLeft size={13} />
              <span>Précédent</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="btn-primary compact-action-btn"
            >
              <span>Photos et Contact</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: TÉLÉVERSEMENT PHOTOS & CONTACT */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="publish-step-body animate-fadeIn">
          
          {/* Photo Multi-Upload Dropzone & Thumbnails */}
          <div className="compact-field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
              <label className="compact-label" style={{ margin: 0 }}>Photos du bien</label>
              <span style={{ fontSize: '0.68rem', color: 'var(--graphite-gray)', fontWeight: 600 }}>
                {uploadedPhotos.length} photo(s)
              </span>
            </div>

            <div 
              className="compact-upload-dropzone"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={14} color="var(--primary-red)" />
              <span className="dropzone-label">Téléverser des photos de standing</span>
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept="image/*" 
                multiple
                onChange={handlePhotosUpload}
              />
            </div>

            {/* Thumbnails Row with Individual Delete */}
            <div className="uploaded-thumbnails-bar">
              {uploadedPhotos.map((url, idx) => (
                <div key={idx} className="thumb-item">
                  <img src={url} alt={`Photo ${idx + 1}`} />
                  {idx === 0 && <span className="thumb-badge-cover">Couverture</span>}
                  <button
                    type="button"
                    className="thumb-del-btn"
                    title="Supprimer la photo"
                    onClick={(e) => {
                      e.stopPropagation();
                      removePhoto(idx);
                    }}
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Row 1 Contact: Déclarant & Statut Verrouillé */}
          <div className="publish-grid-2">
            <div className="compact-field">
              <label className="compact-label">Déclarant</label>
              <div className="session-user-badge">
                <img 
                  src={userAvatar} 
                  alt={userName} 
                  className="session-user-img" 
                />
                <div className="session-user-info">
                  <span className="session-user-name">{userName}</span>
                </div>
              </div>
            </div>

            {/* STATUT VERROUILLÉ : Propriétaire (particulier) */}
            <div className="compact-field">
              <label className="compact-label">Statut</label>
              <div className="status-locked-badge-card">
                <div className="status-locked-header">
                  <span className="status-locked-title">Particulier</span>
                  <span className="status-locked-pill">Fixe</span>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2 Contact: WhatsApp & Email */}
          <div className="publish-grid-2">
            <div className="compact-field">
              <label className="compact-label">Téléphone</label>
              <div className="compact-phone-bar">
                <div className="phone-country-dropdown" ref={countryDropdownRef}>
                  <button
                    type="button"
                    className="country-trigger-btn"
                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                    aria-expanded={isCountryDropdownOpen}
                  >
                    <span className="flag">{selectedCountry?.flag}</span>
                    <span className="code">{selectedCountry?.code}</span>
                    <ChevronDown size={11} className={`chev ${isCountryDropdownOpen ? 'open' : ''}`} />
                  </button>

                  {isCountryDropdownOpen && (
                    <div className="country-floating-menu">
                      <div className="floating-scroll">
                        {COUNTRY_CODES.map((item) => {
                          const isSelected = item.code === countryCode;
                          return (
                            <button
                              key={item.code}
                              type="button"
                              className={`floating-item ${isSelected ? 'selected' : ''}`}
                              onClick={() => {
                                setCountryCode(item.code);
                                setIsCountryDropdownOpen(false);
                              }}
                            >
                              <span>{item.flag}</span>
                              <span className="c-name">{item.country}</span>
                              <span className="c-code">{item.code}</span>
                              {isSelected && <Check size={11} color="var(--primary-red)" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="phone-sep" />

                <input 
                  type="tel"
                  required
                  value={formData.ownerPhone}
                  onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                  placeholder="07 08 09 10"
                  className="compact-phone-input"
                />
              </div>
            </div>

            <div className="compact-field">
              <label className="compact-label">Email de contact</label>
              <input
                type="email"
                required
                className="form-input compact-input"
                placeholder="ex: contact@domaine.ci"
                value={formData.ownerEmail}
                onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
              />
            </div>
          </div>

          {/* Step 3 Footer */}
          <div className="compact-step-footer">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn-ghost-dark compact-action-btn"
            >
              <ArrowLeft size={13} />
              <span>Précédent</span>
            </button>
            <button
              type="submit"
              className="btn-primary compact-action-btn"
              style={{ fontWeight: 700 }}
            >
              <span>Publier mon annonce</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );

  return (
    <div className="publish-page-container">
      {/* Top Return CTA / Breadcrumb */}
      <div className="publish-top-nav-bar">
        <button
          type="button"
          onClick={handleGoBack}
          className="publish-back-btn"
          aria-label="Retour"
        >
          <ChevronLeft size={16} />
          <span>Retour</span>
        </button>
        <span className="publish-top-nav-title">Publication d'une annonce</span>
      </div>

      {isSubmitted ? (
        /* Success Screen */
        <div className="publish-success-wrapper">
          <div className="publish-success-card">
            <div className="publish-success-icon-wrap">
              <CheckCircle2 size={40} className="publish-success-icon" />
            </div>
            
            <span className="publish-success-badge">Annonce Enregistrée</span>
            
            <h2 className="font-serif publish-success-title">
              Félicitations, votre bien est prêt !
            </h2>

            <p className="publish-success-desc">
              Votre annonce <strong>« {formData.title} »</strong> à <strong>{formData.neighborhood}, {formData.city}</strong> a été enregistrée avec succès sous la référence <span className="publish-ref-tag">{publishedRefNumber}</span>.
            </p>

            <div className="publish-success-actions">
              <Link to="/mon-compte?tab=properties" className="btn-primary" style={{ padding: '10px 20px', justifyContent: 'center' }}>
                <span>Gérer mes annonces</span>
                <ArrowRight size={15} />
              </Link>
              {formData.destination === 'PRO' ? (
                <Link to="/immobilier-professionnel" className="btn-ghost-dark" style={{ padding: '8px 18px', fontSize: '0.8125rem', justifyContent: 'center' }}>
                  <span>Voir l'espace Immobilier professionnel</span>
                </Link>
              ) : (
                <Link to="/recherche" className="btn-ghost-dark" style={{ padding: '8px 18px', fontSize: '0.8125rem', justifyContent: 'center' }}>
                  <span>Voir le catalogue</span>
                </Link>
              )}
              <button 
                onClick={() => {
                  setIsSubmitted(false);
                  setStep(1);
                }}
                className="btn-ghost-dark"
                style={{ padding: '8px 18px', fontSize: '0.8125rem' }}
              >
                Publier une autre propriété
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* 2-Column Split: Colonne Gauche = Prévisualisation PropertyDetail, Colonne Droite = Formulaire Sticky */
        <div className="publish-layout-grid">
          
          {/* ========================================================= */}
          {/* COLONNE GAUCHE : PRÉVISUALISATION EN DIRECT TYPE DETAIL   */}
          {/* ========================================================= */}
          <div className="publish-preview-col">
            <div className="preview-rich-container">
              
              {/* 1. CAROUSEL PHOTO & BADGES */}
              <div className="preview-carousel-card">
                <div className="preview-carousel-main-wrap">
                  <img 
                    src={currentPhotoUrl} 
                    alt={formData.title} 
                    className="preview-carousel-main-img" 
                  />

                  {/* Badges Transaction & Statut Particulier */}
                  <div className="preview-carousel-badges">
                    <span className={`preview-badge-category ${formData.category === 'VENTE' ? 'vente' : 'location'}`}>
                      {formData.category === 'VENTE' ? 'À VENDRE' : 'À LOUER'}
                    </span>
                    {formData.destination === 'PRO' && (
                      <span className="preview-badge-status" style={{ backgroundColor: 'rgba(17,17,17,0.85)', color: '#FFFFFF' }}>
                        PRO
                      </span>
                    )}
                    <span className="preview-badge-status">
                      PARTICULIER
                    </span>
                  </div>

                  {/* Flèches de navigation photo */}
                  {currentImages.length > 1 && (
                    <>
                      <button 
                        type="button" 
                        className="preview-carousel-arrow prev"
                        onClick={handlePrevPhoto}
                        title="Photo précédente"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button 
                        type="button" 
                        className="preview-carousel-arrow next"
                        onClick={handleNextPhoto}
                        title="Photo suivante"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </>
                  )}

                  {/* Compteur d'images */}
                  <div className="preview-carousel-counter">
                    {activePhotoIndex + 1} / {currentImages.length}
                  </div>
                </div>

                {/* Vignettes miniatures */}
                {currentImages.length > 1 && (
                  <div className="preview-carousel-thumbs-row">
                    {currentImages.map((imgUrl, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`preview-thumb-btn ${activePhotoIndex === i ? 'active' : ''}`}
                        onClick={() => setActivePhotoIndex(i)}
                      >
                        <img src={imgUrl} alt={`Miniature ${i + 1}`} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. EN-TÊTE : TITRE, ADRESSE ET BANNIÈRE DE PRIX */}
              <div className="preview-header-card">
                <div className="preview-header-top">
                  <span className="preview-type-tag">{formData.type}</span>
                  <div className="preview-address-row">
                    <MapPin size={15} color="var(--primary-red)" />
                    <span>{formData.neighborhood ? `${formData.neighborhood}, ` : ''}{formData.city}</span>
                  </div>
                </div>

                <h1 className="font-serif preview-title-text">
                  {formData.title || "Titre de l'annonce"}
                </h1>

                {/* Bannière tarifaire architecturale */}
                <div className="preview-price-banner">
                  <div>
                    <span className="preview-price-caption">
                      {formData.category === 'LOCATION' ? 'Loyer mensuel' : 'Prix de vente'}
                    </span>
                    <div className="preview-price-val font-serif">
                      {formatPrice 
                        ? formatPrice(previewProperty.priceXOF, previewProperty.priceUSD, previewProperty.priceXAF, previewProperty.period)
                        : `${Number(formData.price || 0).toLocaleString()} ${currencyLabel}`}
                    </div>
                  </div>
                  <div className="preview-charges-box">
                    <span className="charges-caption">Charges et entretien</span>
                    <span className="charges-value">Inclus</span>
                  </div>
                </div>
              </div>

              {/* 3. GRILLE DES 4 CARACTÉRISTIQUES CLÉS */}
              <div className="preview-specs-grid">
                {formData.destination === 'PRO' ? (
                  <>
                    <div className="preview-spec-card">
                      <span className="spec-label">
                        {formData.proCategory === 'COMMERCE' ? 'Vitrine' :
                         formData.proCategory === 'ENTREPOT' ? 'Logistique' :
                         formData.proCategory === 'LOCAL_PRO' ? 'Pièces' :
                         formData.proCategory === 'COWORKING' ? 'Postes' : 'Bureaux'}
                      </span>
                      <div className="spec-val-row">
                        {formData.proCategory === 'COMMERCE' ? <Store size={17} color="var(--primary-red)" /> :
                         formData.proCategory === 'ENTREPOT' ? <Warehouse size={17} color="var(--primary-red)" /> :
                         formData.proCategory === 'COWORKING' ? <Users size={17} color="var(--primary-red)" /> :
                         <Building size={17} color="var(--primary-red)" />}
                        <span>
                          {formData.proCategory === 'COMMERCE' ? (formData.windowDisplay || 'Vitrine sur rue') :
                           formData.proCategory === 'ENTREPOT' ? (formData.ceilingHeight ? `Hsp ${formData.ceilingHeight}` : 'Accès logistique') :
                           formData.proCategory === 'LOCAL_PRO' ? `${formData.offices || 1} pièce(s)` :
                           formData.proCategory === 'COWORKING' ? `${formData.workstations || 15} postes` :
                           `${formData.offices || 1} bureau(x)`}
                        </span>
                      </div>
                    </div>

                    <div className="preview-spec-card">
                      <span className="spec-label">Toilettes</span>
                      <div className="spec-val-row">
                        <Bath size={17} color="var(--primary-red)" />
                        <span>{formData.bathrooms || 1} {formData.bathrooms > 1 ? 'toilettes' : 'toilette'}</span>
                      </div>
                    </div>

                    <div className="preview-spec-card">
                      <span className="spec-label">Superficie</span>
                      <div className="spec-val-row">
                        <Maximize2 size={17} color="var(--primary-red)" />
                        <span>{formData.area || 0} m²</span>
                      </div>
                    </div>

                    <div className="preview-spec-card">
                      <span className="spec-label">Usage / Bail</span>
                      <div className="spec-val-row" style={{ color: 'var(--obsidian-black)' }}>
                        <Briefcase size={17} color="var(--primary-red)" />
                        <span style={{ fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {formData.leaseType ? formData.leaseType.split(' ')[0] + ' ' + (formData.leaseType.split(' ')[1] || '') : 'Bail professionnel'}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="preview-spec-card">
                      <span className="spec-label">Chambres</span>
                      <div className="spec-val-row">
                        <Bed size={17} color="var(--primary-red)" />
                        <span>{formData.bedrooms} suites</span>
                      </div>
                    </div>

                    <div className="preview-spec-card">
                      <span className="spec-label">Salles de bain</span>
                      <div className="spec-val-row">
                        <Bath size={17} color="var(--primary-red)" />
                        <span>{formData.bathrooms} bains</span>
                      </div>
                    </div>

                    <div className="preview-spec-card">
                      <span className="spec-label">Superficie</span>
                      <div className="spec-val-row">
                        <Maximize2 size={17} color="var(--primary-red)" />
                        <span>{formData.area || 0} m²</span>
                      </div>
                    </div>

                    <div className="preview-spec-card">
                      <span className="spec-label">Sécurité</span>
                      <div className="spec-val-row" style={{ color: 'var(--verified-green)' }}>
                        <ShieldCheck size={17} />
                        <span>Certifiée</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* 4. DESCRIPTION DU BIEN */}
              <div className="preview-section-card">
                <h3 className="preview-section-title">
                  Description du bien
                </h3>
                <p className="preview-description-text">
                  {formData.description || "Propriété d'exception aux volumes généreux, finitions haut de gamme, grand jardin paysager et sécurité maximale."}
                </p>
              </div>

              {/* 5. COMMODITÉS & PRESTATIONS */}
              <div className="preview-section-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <h3 className="preview-section-title" style={{ margin: 0 }}>
                    Commodités et Équipements
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: 'var(--graphite-gray)', fontWeight: 600 }}>
                    {formData.amenities.length} prestation(s)
                  </span>
                </div>

                {formData.amenities.length === 0 ? (
                  <p style={{ fontSize: '0.8125rem', color: 'var(--graphite-gray)', fontStyle: 'italic', margin: 0 }}>
                    Aucune commodité sélectionnée pour l'instant.
                  </p>
                ) : (
                  <div className="preview-amenities-grid">
                    {formData.amenities.map(amenity => (
                      <div key={amenity} className="preview-amenity-chip">
                        <CheckCircle2 size={14} color="var(--primary-red)" style={{ flexShrink: 0 }} />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 6. AGENT & AGENCY CONTACT CARD */}
              <div className="agency-contact-card">
                <div className="agency-card-layout">
                  <img 
                    src={userAvatar} 
                    alt={userName} 
                    className="agency-card-avatar"
                  />
                  <div className="agency-card-info">
                    <div className="agency-card-badge-row">
                      {isUserPro ? (
                        <span className="agency-partner-badge">
                          <ShieldCheck size={12} strokeWidth={2.5} />
                          <span>{isUserDemarcheur ? 'Démarcheur Agréé PRO' : 'Agence Professionnelle Partenaire'}</span>
                        </span>
                      ) : (
                        <span className="agency-direct-badge">
                          <span>Annonce Directe</span>
                        </span>
                      )}

                      {isUserPro && (
                        <span
                          className="agency-card-vitrine-btn"
                          title="Consulter la vitrine certifiée"
                        >
                          <ExternalLink size={12} />
                          <span>Vitrine</span>
                        </span>
                      )}
                    </div>
                    <h4 className="agency-name-title">
                      {isUserPro ? (isUserDemarcheur ? userName : userAgencyName) : userName}
                    </h4>
                    <div className="agency-advisor-text">
                      {formData.neighborhood ? `${formData.neighborhood}, ${formData.city}` : formData.city}
                    </div>

                    {isUserPro && (
                      <div className="agency-rating-row">
                        <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 500 }}>
                          Nouveau professionnel certifié • Aucun avis pour l'instant
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 7. LOCALISATION DU BIEN & MINI CARTE */}
              <div className="preview-section-card">
                <h3 className="preview-section-title">
                  Localisation du bien
                </h3>
                <PropertyMiniMap 
                  coordinates={currentCoordinates}
                  address={formData.neighborhood ? `${formData.neighborhood}, ${formData.city}` : formData.city}
                  neighborhood={formData.neighborhood}
                  city={formData.city}
                />
              </div>

            </div>
          </div>

          {/* ========================================================= */}
          {/* COLONNE DROITE : MODULE DE SAISIE STICKY (DESKTOP)        */}
          {/* ========================================================= */}
          <div className="publish-form-sticky-col">
            <div className="sticky-form-wrapper">
              {renderFormProcess()}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* EXPÉRIENCE RESPONSIVE MOBILE (< 1024px)                  */}
      {/* ========================================================= */}
      
      {/* Déclencheur flottant discret ancré sur le bord droit */}
      {!isSubmitted && (
        <button 
          type="button" 
          className="mobile-drawer-trigger"
          onClick={() => setIsDrawerOpen(true)}
          aria-label="Modifier l'annonce"
          title="Modifier les paramètres de l'annonce"
        >
          <Edit3 size={15} />
          <span className="mobile-drawer-trigger-text">Modifier l'annonce</span>
        </button>
      )}

      {/* Tiroir latéral (drawer/sheet) épuré */}
      {isDrawerOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setIsDrawerOpen(false)}>
          <div className="mobile-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit3 size={16} color="var(--primary-red)" />
                <span className="font-serif" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--obsidian-black)' }}>
                  Paramètres de l'annonce
                </span>
              </div>
              <button 
                type="button" 
                className="mobile-drawer-close-btn"
                onClick={() => setIsDrawerOpen(false)}
                title="Fermer le volet"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="mobile-drawer-body">
              {renderFormProcess()}
            </div>
          </div>
        </div>
      )}

      {/* Scoped CSS épuré et architectural */}
      <style>{`
        .publish-top-nav-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          max-width: 1280px;
          margin-left: auto;
          margin-right: auto;
        }
        .publish-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: var(--radius-pill);
          border: 1px solid var(--border-color);
          background-color: var(--surface-white);
          color: var(--obsidian-black);
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: var(--shadow-sm);
        }
        .publish-back-btn:hover {
          border-color: var(--obsidian-black);
          background-color: #FAFAFA;
        }
        .publish-top-nav-title {
          font-size: 0.8125rem;
          color: var(--graphite-gray);
          font-weight: 500;
        }

        .publish-page-container {
          background-color: var(--bg-main);
          min-height: calc(100vh - var(--header-height));
          width: 100%;
          box-sizing: border-box;
          padding: 16px 20px 48px;
        }

        .publish-layout-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(360px, 420px);
          gap: 28px;
          max-width: 1280px;
          margin: 0 auto;
          align-items: flex-start;
          position: relative;
          width: 100%;
          box-sizing: border-box;
        }

        /* COLONNE GAUCHE : PRÉVISUALISATION EN DIRECT */
        .publish-preview-col {
          min-width: 0;
          width: 100%;
        }

        .preview-rich-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* 1. CAROUSEL & BADGES */
        .preview-carousel-card {
          background-color: var(--surface-white);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-card);
          overflow: hidden;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.03);
        }

        .preview-carousel-main-wrap {
          position: relative;
          width: 100%;
          height: 390px;
          background-color: #111111;
          overflow: hidden;
        }

        .preview-carousel-main-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .preview-carousel-badges {
          position: absolute;
          top: 14px;
          left: 14px;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .preview-badge-category {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.5px;
          border-radius: var(--radius-pill);
          color: #FFF;
        }
        .preview-badge-category.vente {
          background-color: var(--primary-red);
        }
        .preview-badge-category.location {
          background-color: #111827;
        }

        .preview-badge-status {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          border-radius: var(--radius-pill);
          background-color: rgba(255, 255, 255, 0.95);
          color: #374151;
          border: 1px solid rgba(0, 0, 0, 0.08);
        }

        .preview-carousel-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background-color: rgba(0, 0, 0, 0.55);
          color: #FFF;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: background-color 0.15s ease;
        }
        .preview-carousel-arrow:hover {
          background-color: rgba(0, 0, 0, 0.85);
        }
        .preview-carousel-arrow.prev { left: 12px; }
        .preview-carousel-arrow.next { right: 12px; }

        .preview-carousel-counter {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: rgba(0, 0, 0, 0.65);
          color: #FFF;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 3px 9px;
          border-radius: var(--radius-pill);
          z-index: 10;
        }

        .preview-carousel-thumbs-row {
          display: flex;
          gap: 8px;
          padding: 10px 14px;
          background-color: var(--surface-white);
          overflow-x: auto;
          scrollbar-width: thin;
        }

        .preview-thumb-btn {
          width: 58px;
          height: 44px;
          border-radius: 5px;
          overflow: hidden;
          border: 1.5px solid transparent;
          background: transparent;
          cursor: pointer;
          flex-shrink: 0;
          padding: 0;
          opacity: 0.65;
          transition: all 0.15s ease;
        }
        .preview-thumb-btn.active {
          border-color: var(--primary-red);
          opacity: 1;
        }
        .preview-thumb-btn img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* 2. EN-TÊTE & PRIX */
        .preview-header-card {
          background-color: var(--surface-white);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-card);
          padding: 22px 24px;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.03);
        }

        .preview-header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
          flex-wrap: wrap;
          gap: 8px;
        }

        .preview-type-tag {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: var(--graphite-gray);
        }

        .preview-address-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.84rem;
          color: var(--graphite-gray);
        }

        .preview-title-text {
          font-size: clamp(1.45rem, 2.5vw, 1.85rem);
          line-height: 1.25;
          color: var(--obsidian-black);
          margin-bottom: 16px;
        }

        .preview-price-banner {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          padding: 14px 18px;
          background-color: var(--bg-main);
          border: 1px solid var(--border-color);
          border-radius: 8px;
        }

        .preview-price-caption {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--graphite-gray);
          display: block;
          font-weight: 600;
        }

        .preview-price-val {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--obsidian-black);
          line-height: 1.2;
          margin-top: 2px;
        }

        .preview-charges-box {
          text-align: right;
        }

        .charges-caption {
          display: block;
          font-size: 0.7rem;
          color: var(--graphite-gray);
        }

        .charges-value {
          font-size: 0.84rem;
          font-weight: 700;
          color: var(--obsidian-black);
        }

        /* 3. GRILLE DES SPÉCIFICATIONS CLÉS */
        .preview-specs-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        @media (max-width: 680px) {
          .preview-specs-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .preview-spec-card {
          background-color: var(--surface-white);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-card);
          padding: 14px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
        }

        .spec-label {
          display: block;
          font-size: 0.7rem;
          color: var(--graphite-gray);
          font-weight: 500;
        }

        .spec-val-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.95rem;
          font-weight: 700;
          margin-top: 4px;
          color: var(--obsidian-black);
        }

        /* 4. BLOCS DE CONTENU */
        .preview-section-card {
          background-color: var(--surface-white);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-card);
          padding: 20px 22px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
        }

        .preview-section-title {
          font-family: var(--font-heading);
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--obsidian-black);
          margin-bottom: 12px;
        }

        .preview-description-text {
          font-size: 0.875rem;
          line-height: 1.7;
          color: var(--graphite-gray);
          margin: 0;
          white-space: pre-line;
        }

        /* 5. COMMODITÉS */
        .preview-amenities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 10px;
        }

        .preview-amenity-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background-color: var(--bg-main);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--obsidian-black);
        }

        /* 6. CARTE LEAFLET */
        .preview-map-container {
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid var(--border-color);
          position: relative;
        }

        .preview-map-instance {
          width: 100%;
          height: 240px;
          background-color: #EAEAE8;
        }

        .preview-map-overlay-badge {
          position: absolute;
          bottom: 12px;
          left: 12px;
          right: 12px;
          background-color: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          padding: 8px 14px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          z-index: 400;
          box-shadow: var(--shadow-sm);
        }

        .preview-map-address {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8125rem;
          color: var(--obsidian-black);
          font-weight: 600;
        }

        .preview-map-link {
          font-size: 0.72rem;
          color: var(--primary-red);
          font-weight: 700;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
        }

        /* 6. AGENT & AGENCY CONTACT CARD BASE STYLES */
        .agency-contact-card {
          background-color: var(--surface-white, #FFFFFF);
          border-radius: var(--radius-card, 12px);
          border: 1px solid var(--border-color, #E5E7EB);
          padding: 22px 24px;
          margin-bottom: 24px;
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
          white-space: nowrap;
          flex-shrink: 0;
          font-family: inherit;
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

        /* ========================================================= */
        /* COLONNE DROITE : MODULE DE SAISIE STICKY                 */
        /* ========================================================= */
        .publish-form-sticky-col {
          position: sticky;
          top: 86px;
          align-self: flex-start;
          max-height: calc(100vh - 100px);
          overflow-y: auto;
          overflow-x: hidden;
          scrollbar-width: thin;
          padding-bottom: 20px;
        }

        .publish-form-sticky-col::-webkit-scrollbar {
          width: 4px;
        }
        .publish-form-sticky-col::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.15);
          border-radius: 4px;
        }

        .publish-process-card {
          background-color: var(--surface-white);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-card);
          padding: 16px 18px;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
          box-sizing: border-box;
        }

        /* Stepper Bar */
        .publish-stepper-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: var(--bg-main);
          border-radius: 8px;
          padding: 6px 8px;
          margin-bottom: 12px;
          border: 1px solid var(--border-color);
          width: 100%;
          box-sizing: border-box;
          gap: 3px;
        }
        .publish-stepper-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          background: transparent;
          border: none;
          cursor: pointer;
          opacity: 0.55;
          padding: 2px 4px;
          transition: all 0.15s ease;
          min-width: 0;
          flex-shrink: 0;
        }
        .publish-stepper-btn.active { opacity: 1; }
        .publish-stepper-btn.done { opacity: 0.9; }
        
        .step-circle {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background-color: #FFF;
          border: 1.5px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--graphite-gray);
          flex-shrink: 0;
        }
        .publish-stepper-btn.active .step-circle {
          background-color: var(--primary-red);
          border-color: var(--primary-red);
          color: #FFF;
        }
        .publish-stepper-btn.done .step-circle {
          background-color: var(--verified-green);
          border-color: var(--verified-green);
          color: #FFF;
        }

        .step-name {
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--obsidian-black);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .publish-stepper-line {
          flex: 1;
          height: 1px;
          background-color: var(--border-color);
          margin: 0 4px;
          min-width: 6px;
        }

        /* Compact Form Controls */
        .compact-field {
          margin-bottom: 8px;
        }
        .compact-label {
          display: block;
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--obsidian-black);
          margin-bottom: 2px;
        }
        .compact-input {
          padding: 6px 10px !important;
          font-size: 0.8125rem !important;
          height: 34px !important;
          border-radius: 6px !important;
        }
        .compact-textarea {
          padding: 6px 10px !important;
          font-size: 0.78rem !important;
          border-radius: 6px !important;
          resize: none !important;
          line-height: 1.35;
          width: 100%;
          box-sizing: border-box;
          border: 1px solid var(--border-color);
          background-color: var(--bg-main);
          color: var(--obsidian-black);
          outline: none;
        }
        .compact-textarea:focus {
          border-color: var(--primary-red);
          background-color: #FFF;
        }

        .compact-form-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .compact-segmented-control {
          display: flex;
          background-color: var(--bg-main);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          padding: 2px;
          gap: 2px;
        }
        .seg-btn {
          padding: 4px 12px;
          border-radius: 4px;
          border: none;
          background: transparent;
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--graphite-gray);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .seg-btn.active {
          background-color: var(--obsidian-black);
          color: #FFF;
        }

        .publish-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .compact-ai-btn {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          background: transparent;
          border: none;
          color: var(--graphite-gray);
          font-size: 0.68rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
        }
        .compact-ai-btn:hover {
          color: var(--primary-red);
        }

        .compact-affix-box {
          position: relative;
          display: flex;
          align-items: center;
        }
        .compact-affix-box input {
          padding-right: 46px !important;
        }
        .affix-badge {
          position: absolute;
          right: 9px;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--graphite-gray);
          pointer-events: none;
        }

        .compact-counter {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: var(--bg-main);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          padding: 2px 7px;
          height: 34px;
          box-sizing: border-box;
        }
        .counter-btn {
          width: 22px;
          height: 22px;
          border-radius: 4px;
          background-color: #FFF;
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--obsidian-black);
        }
        .counter-btn:hover {
          background-color: var(--primary-red);
          border-color: var(--primary-red);
          color: #FFF;
        }
        .counter-text {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--obsidian-black);
        }

        /* COMMODITÉS MULTI-SELECT */
        .multi-select-trigger-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: var(--bg-main);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          padding: 4px 8px;
          min-height: 34px;
          cursor: pointer;
          box-sizing: border-box;
        }
        .multi-select-tags-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          align-items: center;
          flex: 1;
        }
        .multi-placeholder {
          font-size: 0.75rem;
          color: var(--graphite-gray);
        }
        .amenity-chip-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background-color: #FFF;
          border: 1px solid var(--border-color);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.68rem;
          font-weight: 500;
          color: var(--obsidian-black);
        }
        .chip-close-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          color: var(--graphite-gray);
        }
        .dropdown-chevron {
          color: var(--graphite-gray);
          transition: transform 0.15s ease;
          flex-shrink: 0;
          margin-left: 6px;
        }
        .dropdown-chevron.open {
          transform: rotate(180deg);
          color: var(--primary-red);
        }

        .multi-select-popover {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          background-color: #FFF;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          z-index: 120;
          overflow: hidden;
        }
        .popover-scroll-area {
          max-height: 180px;
          overflow-y: auto;
          padding: 4px;
        }
        .popover-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 8px;
          border: none;
          background: transparent;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.72rem;
          text-align: left;
        }
        .popover-item:hover { background-color: var(--bg-main); }
        .popover-item.selected { background-color: var(--soft-tint); color: var(--primary-red); font-weight: 600; }
        .popover-checkbox {
          width: 14px;
          height: 14px;
          border-radius: 3px;
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .popover-item.selected .popover-checkbox {
          background-color: var(--primary-red);
          border-color: var(--primary-red);
        }

        /* PHOTOS MULTI-UPLOAD */
        .compact-upload-dropzone {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          border: 1.5px dashed var(--border-color);
          background-color: var(--bg-main);
          border-radius: 6px;
          padding: 8px 12px;
          cursor: pointer;
          transition: all 0.15s ease;
          margin-bottom: 6px;
        }
        .compact-upload-dropzone:hover {
          border-color: var(--primary-red);
          background-color: #FFF;
        }
        .dropzone-label {
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--obsidian-black);
        }

        .uploaded-thumbnails-bar {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 2px;
        }
        .thumb-item {
          position: relative;
          width: 48px;
          height: 48px;
          border-radius: 5px;
          overflow: hidden;
          flex-shrink: 0;
          border: 1px solid var(--border-color);
        }
        .thumb-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .thumb-badge-cover {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          font-size: 0.55rem;
          background: rgba(0, 0, 0, 0.75);
          color: #FFF;
          text-align: center;
          font-weight: 700;
          padding: 1px;
        }
        .thumb-del-btn {
          position: absolute;
          top: 2px;
          right: 2px;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background-color: rgba(0, 0, 0, 0.65);
          color: #FFF;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }

        /* SESSION BADGE */
        .session-user-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          height: 38px;
          padding: 4px 8px;
          background: #f8fafc;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          box-sizing: border-box;
        }
        .session-user-img {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          object-fit: cover;
          border: 1.5px solid var(--primary-red);
          flex-shrink: 0;
        }
        .session-user-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .session-user-name {
          font-size: 0.74rem;
          font-weight: 700;
          color: var(--obsidian-black);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* STATUT VERROUILLÉ BADGE CARD */
        .status-locked-badge-card {
          background-color: #f8fafc;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          padding: 6px 8px;
          box-sizing: border-box;
          min-height: 38px;
        }
        .status-locked-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
        }
        .status-locked-title {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--obsidian-black);
        }
        .status-locked-pill {
          font-size: 0.58rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          background-color: rgba(0, 0, 0, 0.06);
          color: var(--graphite-gray);
          padding: 1px 5px;
          border-radius: 4px;
        }
        .status-locked-help {
          font-size: 0.62rem;
          color: var(--graphite-gray);
          line-height: 1.25;
          margin: 3px 0 0 0;
        }

        /* PHONE & EMAIL */
        .compact-phone-bar {
          display: flex;
          align-items: center;
          position: relative;
          background-color: var(--bg-main);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          height: 34px;
          box-sizing: border-box;
          min-width: 0;
          overflow: hidden;
        }
        .phone-country-dropdown { position: relative; flex-shrink: 0; }
        .country-trigger-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          background: transparent;
          border: none;
          padding: 4px 6px;
          cursor: pointer;
          flex-shrink: 0;
        }
        .flag { font-size: 0.95rem; }
        .code { font-size: 0.72rem; font-weight: 700; color: var(--obsidian-black); }
        .country-floating-menu {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          width: 220px;
          background-color: #FFF;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          z-index: 120;
          overflow: hidden;
        }
        .floating-scroll {
          overflow-y: auto;
          max-height: 160px;
          padding: 4px;
        }
        .floating-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 6px;
          border: none;
          background: transparent;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.72rem;
          text-align: left;
        }
        .floating-item:hover { background-color: var(--bg-main); }
        .c-name { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .c-code { font-weight: 600; color: var(--graphite-gray); font-size: 0.7rem; }
        .phone-sep { width: 1px; height: 16px; background-color: var(--border-color); flex-shrink: 0; }
        .compact-phone-input {
          flex: 1;
          min-width: 0;
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          padding: 4px 8px;
          font-size: 0.78rem;
          color: var(--obsidian-black);
          font-weight: 500;
        }

        .compact-step-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid var(--border-color);
          padding-top: 10px;
          margin-top: 10px;
        }
        .step-counter-text {
          font-size: 0.7rem;
          color: var(--graphite-gray);
          font-weight: 500;
        }
        .compact-action-btn {
          padding: 7px 16px !important;
          font-size: 0.78rem !important;
          border-radius: var(--radius-pill) !important;
        }

        /* ========================================================= */
        /* RESPONSIVE & MOBILE DRAWER STYLES                        */
        /* ========================================================= */
        .mobile-drawer-trigger {
          display: none;
        }

        @media (max-width: 1024px) {
          .publish-layout-grid {
            grid-template-columns: 1fr;
            padding-bottom: calc(90px + env(safe-area-inset-bottom, 0px));
          }

          /* Masquer le module sticky dans le flux ordinaire */
          .publish-form-sticky-col {
            display: none !important;
          }

          /* Déclencheur flottant ergonomique (Action Pill en bas) */
          .mobile-drawer-trigger {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            position: fixed;
            bottom: calc(20px + env(safe-area-inset-bottom, 0px));
            right: 20px;
            z-index: 500;
            background-color: var(--obsidian-black);
            color: #FFFFFF;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: var(--radius-pill);
            padding: 12px 20px;
            cursor: pointer;
            box-shadow: 0 6px 22px rgba(0, 0, 0, 0.35);
            transition: all 0.2s ease;
          }
          .mobile-drawer-trigger:hover {
            background-color: #000000;
            transform: translateY(-2px);
          }
          .mobile-drawer-trigger-text {
            font-size: 0.8125rem;
            font-weight: 700;
            letter-spacing: 0.4px;
            white-space: nowrap;
          }

          .preview-carousel-main-wrap {
            height: 250px;
            border-radius: var(--radius-card);
          }

          /* AGENT & AGENCY CONTACT CARD (RESPONSIVE) */
          .agency-contact-card {
            padding: 14px 16px;
            margin-bottom: 20px;
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

          @media (max-width: 640px) {
            .preview-price-banner {
              flex-direction: column;
              align-items: flex-start;
              gap: 10px;
              padding: 14px 16px;
            }
            .preview-price-val {
              font-size: 1.4rem;
            }
            .preview-charges-box {
              text-align: left;
              width: 100%;
              padding-top: 8px;
              border-top: 1px dashed var(--border-color);
            }
          }

          /* Volet plein écran latéral (100vw) pour éliminer tout débordement */
          .mobile-drawer-panel {
            width: 100vw !important;
            max-width: 100vw !important;
          }
          .mobile-drawer-body {
            padding: 12px !important;
          }
          .mobile-drawer-panel .publish-process-card {
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: transparent !important;
          }
          .publish-stepper-bar {
            padding: 6px 6px !important;
            gap: 2px !important;
            justify-content: space-between !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
          .publish-stepper-btn {
            padding: 2px 2px !important;
            gap: 4px !important;
            flex-shrink: 0;
          }
          .publish-stepper-line {
            min-width: 4px !important;
            margin: 0 2px !important;
          }
          .step-name {
            font-size: 0.65rem !important;
            letter-spacing: -0.2px;
          }
          .step-circle {
            width: 16px !important;
            height: 16px !important;
            font-size: 0.62rem !important;
          }
        }

        /* TIROIR LATÉRAL (DRAWER / SHEET) */
        .mobile-drawer-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 1500;
          display: flex;
          justify-content: flex-end;
        }

        .mobile-drawer-panel {
          width: 100vw;
          max-width: 100vw;
          height: 100%;
          background-color: var(--surface-white);
          box-shadow: -8px 0 30px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          animation: slideInRight 0.2s ease-out;
        }

        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .mobile-drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-color);
          background-color: #FAFAFA;
        }

        .mobile-drawer-close-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--graphite-gray);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 4px;
        }
        .mobile-drawer-close-btn:hover {
          color: var(--primary-red);
          background-color: rgba(0, 0, 0, 0.04);
        }

        .mobile-drawer-body {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
        }

        /* SUCCESS SCREEN */
        .publish-success-wrapper {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px 20px;
          box-sizing: border-box;
        }
        .publish-success-card {
          max-width: 480px;
          width: 100%;
          background-color: var(--surface-white);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 32px 24px;
          text-align: center;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
        }
        .publish-success-icon-wrap {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background-color: var(--verified-green-bg);
          color: var(--verified-green);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }
        .publish-success-badge {
          display: inline-block;
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--verified-green);
          background-color: var(--verified-green-bg);
          padding: 3px 10px;
          border-radius: var(--radius-pill);
          margin-bottom: 8px;
        }
        .publish-success-title {
          font-size: 1.45rem;
          color: var(--obsidian-black);
          margin-bottom: 8px;
        }
        .publish-success-desc {
          font-size: 0.85rem;
          color: var(--graphite-gray);
          line-height: 1.5;
          margin-bottom: 20px;
        }
        .publish-ref-tag {
          font-family: monospace;
          background-color: var(--bg-main);
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 700;
          color: var(--obsidian-black);
        }
        .publish-success-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        /* AUTH GATE */
        .publish-auth-wrapper {
          min-height: calc(100vh - var(--header-height));
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .publish-auth-gate-card {
          max-width: 440px;
          width: 100%;
          background: var(--surface-white);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 32px 24px;
          text-align: center;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
        }
        .auth-gate-icon {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: rgba(230, 57, 70, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
        }
        .auth-gate-badge {
          display: inline-block;
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: var(--primary-red);
          background: rgba(230, 57, 70, 0.08);
          padding: 3px 10px;
          border-radius: var(--radius-pill);
          margin-bottom: 10px;
        }
        .auth-gate-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--obsidian-black);
          margin-bottom: 8px;
        }
        .auth-gate-desc {
          font-size: 0.82rem;
          color: var(--graphite-gray);
          line-height: 1.5;
          margin-bottom: 20px;
        }

        .animate-fadeIn {
          animation: fadeIn 0.15s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(3px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default PublishPropertyPage;
