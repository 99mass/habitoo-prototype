import React, { useState, useRef, useEffect } from 'react';
import L from 'leaflet';
import {
  MapPin,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Check,
  Plus,
  Minus,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Bed,
  Bath,
  Maximize2,
  ShieldCheck,
  Zap,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Phone,
  UserCheck,
  Edit3,
  ExternalLink,
  Building,
  Briefcase,
  Store,
  Warehouse,
  Users,
  Star,
  FileText
} from 'lucide-react';
import { 
  PROPERTY_TYPES, 
  PRO_CATEGORIES, 
  PRO_LEASE_TYPES, 
  PRO_AMENITIES_FILTERS 
} from '../../../../data/propertiesData';

const COUNTRIES = [
  { name: "Côte d'Ivoire", city: "Abidjan", coords: [5.3484, -3.9780] },
  { name: "RD Congo", city: "Kinshasa", coords: [-4.3217, 15.3125] },
  { name: "Congo", city: "Brazzaville", coords: [-4.2677, 15.2919] }
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

const DEFAULT_IMAGES = [
  '/assets/villa-abidjan-signature.jpg',
  '/assets/hero-villa.jpg',
  '/assets/category-maison.jpg',
  '/assets/duplex-congo-river.jpg'
];

// Leaflet Mini Map Component pour la prévisualisation architecturale
const PropertyMiniMap = ({ coordinates, address, neighborhood, city }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
        dragging: false
      }).setView(coordinates, 14);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
      }).addTo(map);

      const customIcon = L.divIcon({
        className: 'preview-map-pin-pulse',
        html: `
          <div style="
            width: 32px;
            height: 32px;
            background: #D92332;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(217, 35, 50, 0.4);
            border: 2px solid #FFFFFF;
          ">
            <div style="
              width: 10px;
              height: 10px;
              background: #FFFFFF;
              border-radius: 50%;
              transform: rotate(45deg);
            "></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });

      L.marker(coordinates, { icon: customIcon }).addTo(map);
      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView(coordinates, 14);
    }
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
          rel="noopener noreferrer"
          className="preview-map-link"
        >
          Google Maps →
        </a>
      </div>
    </div>
  );
};

export const ProNewPropertyForm = ({
  onCancel,
  onPublish,
  currentCredits = 45,
  userProfile
}) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const hashQuery = window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '';
      const params = new URLSearchParams(hashQuery || window.location.search);
      return params.get('drawer') === '1' || params.get('edit') === '1';
    }
    return false;
  });

  // Dropdown commodités
  const [isAmenitiesOpen, setIsAmenitiesOpen] = useState(false);
  const amenitiesDropdownRef = useRef(null);

  // Fermeture du popover au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (amenitiesDropdownRef.current && !amenitiesDropdownRef.current.contains(event.target)) {
        setIsAmenitiesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Coordonnées de l'agent / agence connecté(e)
  const agentName = userProfile?.name || 'Jean-Marc Kouassi';
  const agentBadge = userProfile?.badgeText || (userProfile?.agency ? 'Agence Professionnelle Partenaire' : 'Démarcheur Agréé PRO');
  const agentAvatar = userProfile?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80';
  const agentPhoneDefault = userProfile?.phone || '+225 07 89 22 14 00';
  const agentEmailDefault = userProfile?.email || 'pro@habitoo.ci';
  const agencyName = userProfile?.agency || agentName;

  // État du formulaire exactement aligné sur le parcours complet de /publier
  const [formData, setFormData] = useState({
    destination: 'HABITATION', // 'HABITATION' | 'PRO'
    proCategory: 'BUREAU', // 'BUREAU' | 'COMMERCE' | 'LOCAL_PRO' | 'ENTREPOT' | 'COWORKING' | 'AUTRE'
    leaseType: 'Bail professionnel',
    category: 'LOCATION', // 'LOCATION' | 'VENTE'
    type: PROPERTY_TYPES[0] || "Villa d'architecte",
    country: "Côte d'Ivoire",
    city: 'Abidjan',
    neighborhood: 'Riviera Golf',
    title: 'Somptueuse Villa Contemporaine avec Vue Lagune',
    description: "Propriété d'exception aux volumes généreux, finitions haut de gamme, grand jardin paysager et sécurité maximale.",
    price: 3500000,
    area: 480,
    bedrooms: 4,
    bathrooms: 3,
    offices: 4,
    workstations: 20,
    windowDisplay: 'Linéaire 8m vitré',
    storageArea: '35 m² avec accès livraison',
    ceilingHeight: '6.50 m',
    loadingDock: 'Quai de déchargement niveleur',
    waitingRoom: "Salle d'attente 18 m²",
    amenities: ['Piscine privée', 'Gardiennage H24', 'Groupe électrogène automatique', 'Climatisation intégrale'],
    images: DEFAULT_IMAGES,
    ownerPhone: agentPhoneDefault,
    ownerEmail: agentEmailDefault,
    autoBoost: false
  });

  const [errors, setErrors] = useState({});

  const currencyLabel = formData.city === 'Kinshasa' ? 'USD' : (formData.city === 'Brazzaville' ? 'FCFA' : 'FCFA');

  // Mise à jour du pays et de la ville correspondante
  const handleCountryChange = (countryName) => {
    const found = COUNTRIES.find(c => c.name === countryName) || COUNTRIES[0];
    setFormData(prev => ({
      ...prev,
      country: found.name,
      city: found.city
    }));
  };

  const currentCountryObj = COUNTRIES.find(c => c.name === formData.country) || COUNTRIES[0];
  const currentCoordinates = currentCountryObj.coords;

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const toggleAmenity = (amenity) => {
    setFormData(prev => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter(a => a !== amenity)
          : [...prev.amenities, amenity]
      };
    });
  };

  const validateStep1 = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = "Le titre est requis.";
    if (!formData.neighborhood.trim()) errs.neighborhood = "Le quartier est requis.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!formData.price || Number(formData.price) <= 0) errs.price = "Indiquez un montant valide.";
    if (!formData.area || Number(formData.area) <= 0) errs.area = "Indiquez une surface valide.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep(prev => prev + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const isProDest = formData.destination === 'PRO';
      const categoryLabel = PRO_CATEGORIES.find(c => c.id === formData.proCategory)?.label || formData.type;

      const newProperty = {
        id: `prop-pro-${Date.now()}`,
        destination: formData.destination,
        proCategory: isProDest ? formData.proCategory : undefined,
        leaseType: isProDest ? formData.leaseType : undefined,
        title: formData.title,
        type: isProDest ? categoryLabel : formData.type,
        category: formData.category === 'VENTE' ? 'Vente' : 'Location',
        city: formData.city,
        country: formData.country,
        neighborhood: formData.neighborhood,
        address: `${formData.neighborhood}, ${formData.city}`,
        price: `${Number(formData.price).toLocaleString('fr-FR')} ${currencyLabel}${formData.category === 'LOCATION' ? '/mois' : ''}`,
        priceXOF: formData.city === 'Kinshasa' ? null : Number(formData.price || 0),
        priceUSD: formData.city === 'Kinshasa' ? Number(formData.price || 0) : null,
        period: formData.category === 'LOCATION' ? '/mois' : '',
        images: formData.images,
        image: formData.images[0] || DEFAULT_IMAGES[0],
        specs: {
          area: formData.area || 0,
          bedrooms: isProDest ? undefined : formData.bedrooms,
          bathrooms: formData.bathrooms,
          offices: isProDest ? (formData.offices || 1) : undefined,
          workstations: isProDest && (formData.proCategory === 'COWORKING' || formData.proCategory === 'BUREAU') ? formData.workstations : undefined,
          restrooms: formData.bathrooms,
          windowDisplay: isProDest && formData.proCategory === 'COMMERCE' ? formData.windowDisplay : undefined,
          storageArea: isProDest && formData.proCategory === 'COMMERCE' ? formData.storageArea : undefined,
          ceilingHeight: isProDest && formData.proCategory === 'ENTREPOT' ? formData.ceilingHeight : undefined,
          loadingDock: isProDest && formData.proCategory === 'ENTREPOT' ? formData.loadingDock : undefined,
          waitingRoom: isProDest && formData.proCategory === 'LOCAL_PRO' ? formData.waitingRoom : undefined,
          security: "Gardiennage certifié PRO"
        },
        specsText: isProDest
          ? (formData.proCategory === 'COWORKING' ? `${formData.workstations || 15} postes • ${formData.area} m²` : `${formData.offices || 1} bureaux • ${formData.area} m²`)
          : `${formData.bedrooms} ch. • ${formData.area} m²`,
        amenities: formData.amenities,
        description: formData.description,
        isPro: true,
        advertiserType: 'PRO',
        agent: {
          name: agentName,
          agency: agencyName,
          avatar: agentAvatar,
          phone: formData.ownerPhone || agentPhoneDefault,
          email: formData.ownerEmail || agentEmailDefault,
          verified: true,
          proType: userProfile?.proType || (userProfile?.agency ? 'AGENCE' : 'DEMARCHEUR'),
          proId: userProfile?.id || undefined
        },
        status: formData.autoBoost ? 'BOOSTED' : 'ACTIVE',
        statusLabel: formData.autoBoost ? 'Boostée' : 'En ligne',
        views: 1,
        inquiries: 0,
        publishedAt: "Aujourd'hui"
      };

      setIsSubmitting(false);
      setIsMobileDrawerOpen(false);
      onPublish(newProperty, formData.autoBoost ? 15 : 0);
    }, 600);
  };

  const handlePrevPhoto = () => {
    setActivePhotoIndex(prev => (prev === 0 ? formData.images.length - 1 : prev - 1));
  };

  const handleNextPhoto = () => {
    setActivePhotoIndex(prev => (prev === formData.images.length - 1 ? 0 : prev + 1));
  };

  const currentPhotoUrl = formData.images[activePhotoIndex] || formData.images[0] || DEFAULT_IMAGES[0];

  // Gestion du téléversement et organisation des photos
  const photoInputRef = useRef(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handlePhotosUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const newUrls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newUrls]
    }));
    e.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const files = Array.from(e.dataTransfer.files || []).filter(f => f.type.startsWith('image/'));
    if (files.length === 0) return;
    const newUrls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newUrls]
    }));
  };

  const handleRemovePhoto = (index, e) => {
    e.stopPropagation();
    if (formData.images.length <= 1) {
      alert("L'annonce doit comporter au moins une photo.");
      return;
    }
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== index)
    }));
    setActivePhotoIndex(prev => {
      if (prev >= formData.images.length - 1) {
        return Math.max(0, formData.images.length - 2);
      }
      if (prev === index) {
        return Math.max(0, index - 1);
      }
      if (prev > index) {
        return prev - 1;
      }
      return prev;
    });
  };

  const handleSetCover = (index, e) => {
    e.stopPropagation();
    if (index === 0) return;
    setFormData(prev => {
      const selected = prev.images[index];
      const others = prev.images.filter((_, idx) => idx !== index);
      return {
        ...prev,
        images: [selected, ...others]
      };
    });
    setActivePhotoIndex(0);
  };

  // Composant du formulaire de saisie (utilisé sur desktop sticky et dans le tiroir mobile)
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
          <span className="step-name">Photos & Contact</span>
        </button>
      </div>

      {/* STEP 1: DESTINATION, TYPOLOGIE, LIEU ET TITRE */}
      {step === 1 && (
        <div className="publish-step-body animate-fadeIn">

          {/* Destination Selector: Habitation vs Immobilier Professionnel */}
          <div className="compact-form-row">
            <label className="compact-label" style={{ margin: 0 }}>Destination :</label>
            <div className="compact-segmented-control">
              <button
                type="button"
                className={`seg-btn ${formData.destination !== 'PRO' ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({
                  ...prev,
                  destination: 'HABITATION',
                  type: PROPERTY_TYPES[0] || "Villa d'architecte",
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

          {/* Opération Toggle: À Louer / À Vendre */}
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

          {/* Typologie / Catégorie & Pays */}
          <div className="publish-grid-2">
            {formData.destination === 'PRO' ? (
              <div className="compact-field">
                <label className="compact-label">Catégorie professionnelle</label>
                <select
                  className="compact-select"
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
              </div>
            ) : (
              <div className="compact-field">
                <label className="compact-label">Type de bien</label>
                <select
                  className="compact-select"
                  value={formData.type}
                  onChange={(e) => updateField('type', e.target.value)}
                >
                  {PROPERTY_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="compact-field">
              <label className="compact-label">Pays</label>
              <select
                className="compact-select"
                value={formData.country}
                onChange={(e) => handleCountryChange(e.target.value)}
              >
                {COUNTRIES.map(c => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quartier précis */}
          <div className="compact-field">
            <label className="compact-label">Quartier précis</label>
            <input
              type="text"
              className="compact-input"
              value={formData.neighborhood}
              onChange={(e) => updateField('neighborhood', e.target.value)}
              placeholder="ex: Riviera Golf, Cocody..."
            />
            {errors.neighborhood && (
              <span style={{ fontSize: '0.68rem', color: 'var(--primary-red)', marginTop: '2px', display: 'block' }}>
                {errors.neighborhood}
              </span>
            )}
          </div>

          {/* Titre de l'annonce */}
          <div className="compact-field">
            <label className="compact-label">Titre de l'annonce</label>
            <input
              type="text"
              className="compact-input"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder={formData.destination === 'PRO' ? "ex: Plateau de Bureaux Équipé — Quartier d'Affaires" : "ex: Somptueuse Villa Contemporaine avec Vue Lagune"}
            />
            {errors.title && (
              <span style={{ fontSize: '0.68rem', color: 'var(--primary-red)', marginTop: '2px', display: 'block' }}>
                {errors.title}
              </span>
            )}
          </div>

          {/* Description du bien */}
          <div className="compact-field">
            <label className="compact-label">Description du bien</label>
            <textarea
              rows={4}
              className="compact-textarea"
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Décrivez les atouts majeurs, les finitions, l'environnement et l'accès..."
            />
          </div>

          {/* Barre de navigation Étape 1 */}
          <div className="compact-step-footer">
            <span className="step-counter-text">Étape 1 sur 3</span>
            <button
              type="button"
              onClick={handleNext}
              className="btn-primary compact-action-btn"
            >
              <span>Caractéristiques</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: CARACTÉRISTIQUES ET COMMODITÉS */}
      {step === 2 && (
        <div className="publish-step-body animate-fadeIn">

          {/* Prix et Superficie */}
          <div className="publish-grid-2">
            <div className="compact-field">
              <label className="compact-label">
                {formData.category === 'LOCATION' ? 'Loyer mensuel' : 'Prix de vente'} ({currencyLabel})
              </label>
              <div className="compact-affix-box">
                <input
                  type="number"
                  className="compact-input"
                  value={formData.price}
                  onChange={(e) => updateField('price', Number(e.target.value))}
                  placeholder="3500000"
                />
                <span className="compact-affix-label">{currencyLabel}</span>
              </div>
              {errors.price && (
                <span style={{ fontSize: '0.68rem', color: 'var(--primary-red)', marginTop: '2px', display: 'block' }}>
                  {errors.price}
                </span>
              )}
            </div>

            <div className="compact-field">
              <label className="compact-label">
                {formData.destination === 'PRO' ? 'Superficie utile (m²)' : 'Superficie habitable (m²)'}
              </label>
              <div className="compact-affix-box">
                <input
                  type="number"
                  className="compact-input"
                  value={formData.area}
                  onChange={(e) => updateField('area', Number(e.target.value))}
                  placeholder="480"
                />
                <span className="compact-affix-label">m²</span>
              </div>
              {errors.area && (
                <span style={{ fontSize: '0.68rem', color: 'var(--primary-red)', marginTop: '2px', display: 'block' }}>
                  {errors.area}
                </span>
              )}
            </div>
          </div>

          {/* Critères dynamiques selon Destination */}
          {formData.destination === 'PRO' ? (
            <>
              {/* Socle Commun Pro : Toilettes & Type de bail */}
              <div className="publish-grid-2">
                <div className="compact-field">
                  <label className="compact-label">Toilettes</label>
                  <div className="compact-counter">
                    <button
                      type="button"
                      className="counter-btn"
                      onClick={() => updateField('bathrooms', Math.max(1, formData.bathrooms - 1))}
                    >
                      <Minus size={12} />
                    </button>
                    <span className="counter-text">{formData.bathrooms} toilettes</span>
                    <button
                      type="button"
                      className="counter-btn"
                      onClick={() => updateField('bathrooms', formData.bathrooms + 1)}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                <div className="compact-field">
                  <label className="compact-label">Type de bail contractuel</label>
                  <select
                    className="compact-select"
                    value={formData.leaseType}
                    onChange={(e) => updateField('leaseType', e.target.value)}
                  >
                    {PRO_LEASE_TYPES.map(lease => (
                      <option key={lease} value={lease}>{lease}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Critères spécifiques selon la catégorie PRO */}
              {formData.proCategory === 'BUREAU' && (
                <div className="publish-grid-2">
                  <div className="compact-field">
                    <label className="compact-label">Bureaux fermés</label>
                    <div className="compact-counter">
                      <button
                        type="button"
                        className="counter-btn"
                        onClick={() => updateField('offices', Math.max(0, (formData.offices || 1) - 1))}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="counter-text">{formData.offices || 0} bureau(x)</span>
                      <button
                        type="button"
                        className="counter-btn"
                        onClick={() => updateField('offices', (formData.offices || 0) + 1)}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="compact-field">
                    <label className="compact-label">Postes en open-space</label>
                    <input
                      type="number"
                      className="compact-input"
                      placeholder="ex: 15"
                      value={formData.workstations || ''}
                      onChange={(e) => updateField('workstations', Number(e.target.value))}
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
                      className="compact-input"
                      placeholder="ex: 8 mètres sur rue"
                      value={formData.windowDisplay || ''}
                      onChange={(e) => updateField('windowDisplay', e.target.value)}
                    />
                  </div>

                  <div className="compact-field">
                    <label className="compact-label">Espace réserve / Stockage</label>
                    <input
                      type="text"
                      className="compact-input"
                      placeholder="ex: 25 m² arrière-boutique"
                      value={formData.storageArea || ''}
                      onChange={(e) => updateField('storageArea', e.target.value)}
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
                      className="compact-input"
                      placeholder="ex: 8.5 mètres"
                      value={formData.ceilingHeight || ''}
                      onChange={(e) => updateField('ceilingHeight', e.target.value)}
                    />
                  </div>

                  <div className="compact-field">
                    <label className="compact-label">Accès logistique / Quai</label>
                    <select
                      className="compact-select"
                      value={formData.loadingDock || 'Quai de déchargement niveleur'}
                      onChange={(e) => updateField('loadingDock', e.target.value)}
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
                        onClick={() => updateField('offices', Math.max(1, (formData.offices || 1) - 1))}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="counter-text">{formData.offices || 1} pièce(s)</span>
                      <button
                        type="button"
                        className="counter-btn"
                        onClick={() => updateField('offices', (formData.offices || 0) + 1)}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="compact-field">
                    <label className="compact-label">Salle d'attente</label>
                    <select
                      className="compact-select"
                      value={formData.waitingRoom || "Salle d'attente dédiée"}
                      onChange={(e) => updateField('waitingRoom', e.target.value)}
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
                      className="compact-input"
                      placeholder="ex: 30"
                      value={formData.workstations || ''}
                      onChange={(e) => updateField('workstations', Number(e.target.value))}
                    />
                  </div>

                  <div className="compact-field">
                    <label className="compact-label">Salles de réunion équipées</label>
                    <div className="compact-counter">
                      <button
                        type="button"
                        className="counter-btn"
                        onClick={() => updateField('offices', Math.max(0, (formData.offices || 1) - 1))}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="counter-text">{formData.offices || 0} salle(s)</span>
                      <button
                        type="button"
                        className="counter-btn"
                        onClick={() => updateField('offices', (formData.offices || 0) + 1)}
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
            <div className="publish-grid-2" style={{ marginBottom: '12px' }}>
              <div className="compact-field">
                <label className="compact-label">Chambres (suites)</label>
                <div className="compact-counter">
                  <button
                    type="button"
                    className="counter-btn"
                    onClick={() => updateField('bedrooms', Math.max(1, formData.bedrooms - 1))}
                  >
                    <Minus size={12} />
                  </button>
                  <span className="counter-text">{formData.bedrooms} ch.</span>
                  <button
                    type="button"
                    className="counter-btn"
                    onClick={() => updateField('bedrooms', formData.bedrooms + 1)}
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
                    onClick={() => updateField('bathrooms', Math.max(1, formData.bathrooms - 1))}
                  >
                    <Minus size={12} />
                  </button>
                  <span className="counter-text">{formData.bathrooms} sdb</span>
                  <button
                    type="button"
                    className="counter-btn"
                    onClick={() => updateField('bathrooms', formData.bathrooms + 1)}
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Commodités et Équipements Multi-Select (adapté PRO / HABITATION) */}
          <div className="compact-field" ref={amenitiesDropdownRef} style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
              <label className="compact-label" style={{ margin: 0 }}>
                {formData.destination === 'PRO' ? 'Prestations & Équipements professionnels' : 'Commodités et Équipements'}
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
                  formData.amenities.map(a => (
                    <span key={a} className="amenity-chip-tag">
                      {a}
                      <button
                        type="button"
                        className="chip-close-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAmenity(a);
                        }}
                      >
                        <X size={10} />
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
                        <span>{amenity}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Barre de navigation Étape 2 */}
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
              onClick={handleNext}
              className="btn-primary compact-action-btn"
            >
              <span>Photos et Contact</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: TÉLÉVERSEMENT PHOTOS ET CONTACT PRO */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="publish-step-body animate-fadeIn">

          {/* Galerie de photos */}
          <div className="compact-field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label className="compact-label" style={{ margin: 0 }}>Photos du bien</label>
              <span style={{ fontSize: '0.68rem', color: 'var(--graphite-gray)', fontWeight: 600 }}>
                {formData.images.length} photo(s)
              </span>
            </div>

            <div
              className={`compact-upload-dropzone ${isDraggingOver ? 'dragging' : ''}`}
              onClick={() => photoInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload size={15} color="var(--primary-red)" />
              <span className="dropzone-label">Ajouter des photos HD</span>
              <span style={{ fontSize: '0.68rem', color: 'var(--graphite-gray)' }}>
                Glissez-déposez ou cliquez pour ajouter des fichiers
              </span>
              <input
                type="file"
                ref={photoInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                multiple
                onChange={handlePhotosUpload}
              />
            </div>

            <div className="uploaded-thumbnails-bar">
              {formData.images.map((imgUrl, i) => (
                <div
                  key={i}
                  className={`thumb-item ${activePhotoIndex === i ? 'is-active' : ''}`}
                  onClick={() => setActivePhotoIndex(i)}
                  title={i === 0 ? "Photo de couverture" : "Cliquer pour afficher dans la prévisualisation"}
                >
                  <img src={imgUrl} alt={`Photo ${i + 1}`} />
                  {i === 0 ? (
                    <span className="thumb-badge-cover">Couverture</span>
                  ) : (
                    <button
                      type="button"
                      className="thumb-set-cover-btn"
                      title="Définir comme photo de couverture"
                      onClick={(e) => handleSetCover(i, e)}
                    >
                      Couv.
                    </button>
                  )}
                  <button
                    type="button"
                    className="thumb-del-btn"
                    title="Supprimer la photo"
                    onClick={(e) => handleRemovePhoto(i, e)}
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Contact PRO : Informations du compte professionnel */}
          <div className="compact-field" style={{ marginTop: '12px' }}>
            <div className="pro-contact-locked-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src={agentAvatar} alt={agentName} className="pro-contact-avatar" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--obsidian-black)' }}>{agencyName}</span>
                    <span className="preview-owner-tag pro-badge" style={{ fontSize: '0.62rem', padding: '1px 6px' }}>{agentBadge}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px', color: 'var(--graphite-gray)', fontSize: '0.75rem' }}>
                    <Phone size={12} color="var(--primary-red)" />
                    <span style={{ fontWeight: 600, color: 'var(--obsidian-black)' }}>{formData.ownerPhone || agentPhoneDefault}</span>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '0.68rem', color: '#6B7280', margin: '8px 0 0', borderTop: '1px solid #F3F4F6', paddingTop: '6px' }}>
                Les demandes d'acquéreurs et prises de rendez-vous seront directement transmises à vos coordonnées certifiées.
              </p>
            </div>
          </div>

          {/* Option Boost instantané */}
          <div
            style={{
              backgroundColor: formData.autoBoost ? '#FEF2F2' : '#F9FAFB',
              border: `1.5px solid ${formData.autoBoost ? 'var(--primary-red)' : 'var(--border-color)'}`,
              borderRadius: '8px',
              padding: '10px 12px',
              marginTop: '12px',
              marginBottom: '16px',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onClick={() => updateField('autoBoost', !formData.autoBoost)}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '4px',
                  border: `1.5px solid ${formData.autoBoost ? 'var(--primary-red)' : 'var(--border-color)'}`,
                  backgroundColor: formData.autoBoost ? 'var(--primary-red)' : '#FFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {formData.autoBoost && <Check size={12} color="#FFF" />}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Zap size={13} color="var(--primary-red)" />
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--obsidian-black)' }}>
                      Activer le Boost immédiat
                    </span>
                    <span style={{ fontSize: '0.62rem', fontWeight: 800, padding: '1px 5px', borderRadius: '4px', backgroundColor: '#FEE2E2', color: 'var(--primary-red)' }}>
                      15 crédits
                    </span>
                  </div>
                  <p style={{ fontSize: '0.68rem', color: 'var(--graphite-gray)', margin: '2px 0 0' }}>
                    Propulse l'annonce en tête des résultats et en vitrine d'accueil. Solde disponible : <strong>{currentCredits} crédits</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Barre de soumission finale */}
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
              disabled={isSubmitting}
              className="btn-primary compact-action-btn"
              style={{ minWidth: '160px', justifyContent: 'center' }}
            >
              {isSubmitting ? (
                <span>Publication en cours...</span>
              ) : (
                <>
                  <span>Publier l'annonce</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

    </div>
  );

  return (
    <div className="pro-publish-wrapper animate-fadeIn">

      {/* Barre de retour */}
      <div className="pro-publish-topbar">
        <button
          type="button"
          onClick={onCancel}
          className="pro-publish-back-btn"
        >
          <ArrowLeft size={14} />
          <span>Retour aux annonces</span>
        </button>
      </div>

      {/* DISPOSITION EN 2 COLONNES EXACTE DE PUBLISHPROPERTYPAGE */}
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

                {/* Flèches de navigation */}
                {formData.images.length > 1 && (
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

                {/* Badges sur l'image */}
                <div className="preview-carousel-badges-bar">
                  <span className="preview-status-pill">
                    {formData.category === 'LOCATION' ? 'À Louer' : 'À Vendre'}
                  </span>
                  {formData.autoBoost && (
                    <span className="preview-boost-pill">
                      <Zap size={11} />
                      Boostée
                    </span>
                  )}
                </div>

                {/* Compteur de photos */}
                <div className="preview-carousel-counter">
                  {activePhotoIndex + 1} / {formData.images.length}
                </div>
              </div>

              {/* Vignettes miniatures */}
              {formData.images.length > 1 && (
                <div className="preview-carousel-thumbs-row">
                  {formData.images.map((imgUrl, i) => (
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="preview-type-tag">
                    {formData.destination === 'PRO'
                      ? (PRO_CATEGORIES.find(c => c.id === formData.proCategory)?.shortLabel || 'Immo Pro')
                      : formData.type}
                  </span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '2px 8px',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      borderRadius: '9999px',
                      backgroundColor: '#2563EB',
                      color: '#FFFFFF',
                      letterSpacing: '0.4px'
                    }}
                  >
                    <ShieldCheck size={11} strokeWidth={2.5} />
                    PRO
                  </span>
                </div>
                <div className="preview-address-row">
                  <MapPin size={15} color="var(--primary-red)" />
                  <span>{formData.neighborhood ? `${formData.neighborhood}, ` : ''}{formData.city}</span>
                </div>
              </div>

              <h1 className="preview-title-text font-serif">
                {formData.title || "Titre de l'annonce"}
              </h1>

              {/* Bannière tarifaire architecturale */}
              <div className="preview-price-banner">
                <div>
                  <span className="preview-price-caption">
                    {formData.category === 'LOCATION' ? 'Loyer mensuel' : 'Prix de vente'}
                  </span>
                  <div className="preview-price-val font-serif">
                    {Number(formData.price || 0).toLocaleString('fr-FR')} {currencyLabel}{formData.category === 'LOCATION' ? '/mois' : ''}
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

            {/* 5. COMMODITÉS ET PRESTATIONS */}
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

            {/* 6. CONTACT & PROFIL DU PROFESSIONNEL */}
            <div className="agency-contact-card">
              <div className="agency-card-layout">
                <img
                  src={agentAvatar}
                  alt={agentName}
                  className="agency-card-avatar"
                />
                <div className="agency-card-info">
                  <div className="agency-card-badge-row">
                    <span className="agency-partner-badge">
                      <ShieldCheck size={12} strokeWidth={2.5} />
                      <span>{agentBadge}</span>
                    </span>
                    <span className="agency-card-vitrine-btn" title="Consulter la vitrine certifiée">
                      <ExternalLink size={12} />
                      <span>Vitrine</span>
                    </span>
                  </div>
                  <h4 className="agency-name-title">
                    {agencyName}
                  </h4>
                  {/* Adresse seule, sans préfixe textuel conformément aux consignes */}
                  <div className="agency-advisor-text">
                    {formData.neighborhood ? `${formData.neighborhood}, ${formData.city}` : formData.city}
                  </div>
                  <div className="agency-rating-row">
                    <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 500 }}>
                      Nouveau professionnel certifié • Aucun avis pour l'instant
                    </span>
                  </div>
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
        {/* COLONNE DROITE : MODULE DE SAISIE PROCESS STICKY          */}
        {/* ========================================================= */}
        <div className="publish-form-sticky-col">
          {renderFormProcess()}
        </div>

      </div>

      {/* ========================================================= */}
      {/* EXPÉRIENCE RESPONSIVE MOBILE (< 1024px) : DRAWER LATÉRAL  */}
      {/* ========================================================= */}
      {!isSubmitting && (
        <button
          type="button"
          className="mobile-drawer-trigger"
          onClick={() => setIsMobileDrawerOpen(true)}
          aria-label="Modifier l'annonce"
          title="Modifier les paramètres de l'annonce"
        >
          <Edit3 size={15} />
          <span className="mobile-drawer-trigger-text">Modifier l'annonce</span>
        </button>
      )}

      {isMobileDrawerOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setIsMobileDrawerOpen(false)}>
          <div className="mobile-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit3 size={16} color="var(--primary-red, #D92332)" />
                <span className="font-serif" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--obsidian-black, #1A1A1A)' }}>
                  Paramètres de l'annonce
                </span>
              </div>
              <button
                type="button"
                className="mobile-drawer-close-btn"
                onClick={() => setIsMobileDrawerOpen(false)}
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

    </div>
  );
};
