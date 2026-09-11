import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useHabitoo } from '../context/HabitooContext';
import { PropertyCard } from '../components/PropertyCard';
import { PROPERTY_TYPES } from '../data/propertiesData';
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
  Image as ImageIcon
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

export const PublishPropertyPage = () => {
  const { activeCity, currentUser, openAuthModal, addUserProperty } = useHabitoo();

  const SIMULATED_USER_AVATAR = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80";
  const userAvatar = currentUser?.avatar || SIMULATED_USER_AVATAR;
  const userName = currentUser?.name || "M. Abdoulaye Touré";

  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [publishedRefNumber, setPublishedRefNumber] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    category: 'LOCATION', // 'LOCATION' | 'VENTE'
    type: "Villa d'architecte",
    city: activeCity?.name || 'Abidjan',
    neighborhood: 'Riviera Golf',
    title: "Somptueuse Villa Contemporaine avec Vue Lagune",
    description: "Propriété d'exception aux volumes généreux, finitions haut de gamme, grand jardin paysager et sécurité maximale.",
    price: 3500000,
    area: 550,
    bedrooms: 4,
    bathrooms: 4,
    amenities: [
      'Groupe électrogène automatique',
      "Forage / Réserve d'eau",
      'Gardiennage H24',
      'Climatisation intégrale',
      'Piscine privée'
    ],
    userRole: 'PROPRIETAIRE', // 'PROPRIETAIRE' | 'AGENCE'
    ownerPhone: currentUser?.phone || '',
    ownerEmail: currentUser?.email || ''
  });

  // Photos state (multi-upload)
  const [uploadedPhotos, setUploadedPhotos] = useState([DEFAULT_COVER_IMAGE]);
  const fileInputRef = useRef(null);

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
      // If only default photo was present, replace it; otherwise append
      if (uploadedPhotos.length === 1 && uploadedPhotos[0] === DEFAULT_COVER_IMAGE) {
        setUploadedPhotos(newUrls);
      } else {
        setUploadedPhotos(prev => [...prev, ...newUrls]);
      }
    }
    // Reset file input so re-selecting same files works
    if (e.target) e.target.value = '';
  };

  const removePhoto = (indexToRemove) => {
    setUploadedPhotos(prev => {
      const updated = prev.filter((_, idx) => idx !== indexToRemove);
      return updated.length === 0 ? [DEFAULT_COVER_IMAGE] : updated;
    });
  };

  const currencyLabel = formData.city === 'Kinshasa' ? '$' : 'FCFA';

  // Construct property object formatted for PropertyCard and PropertyDetailPage
  const previewProperty = {
    id: 'preview-card',
    title: formData.title || "Titre de l'annonce",
    type: formData.type || "Villa d'architecte",
    category: formData.category,
    city: formData.city,
    country: formData.city === 'Kinshasa' ? 'RD Congo' : formData.city === 'Brazzaville' ? 'Congo' : "Côte d'Ivoire",
    neighborhood: formData.neighborhood || 'Quartier',
    address: `${formData.neighborhood || 'Quartier'}, ${formData.city}`,
    description: formData.description || "Propriété d'exception aux finitions de haut standing.",
    images: uploadedPhotos.length > 0 ? uploadedPhotos : [DEFAULT_COVER_IMAGE],
    specs: {
      bedrooms: formData.bedrooms,
      bathrooms: formData.bathrooms,
      area: formData.area || 0,
      security: "Sécurité certifiée Habitoo"
    },
    amenities: formData.amenities || [],
    priceXOF: formData.city === 'Kinshasa' ? null : Number(formData.price || 0),
    priceUSD: formData.city === 'Kinshasa' ? Number(formData.price || 0) : null,
    priceXAF: formData.city === 'Brazzaville' ? Number(formData.price || 0) : null,
    period: formData.category === 'LOCATION' ? '/mois' : '',
    ownerName: userName,
    ownerAvatar: userAvatar,
    ownerPhone: formData.ownerPhone || currentUser?.phone || '',
    ownerEmail: formData.ownerEmail || currentUser?.email || '',
    userRole: formData.userRole,
    isPro: formData.userRole === 'AGENCE',
    advertiserType: formData.userRole === 'AGENCE' ? 'PRO' : 'PARTICULIER',
    agent: {
      name: userName,
      agency: formData.userRole === 'AGENCE' ? (formData.agencyName || "Agence Immobilière Agréée") : "Direct Propriétaire",
      avatar: userAvatar,
      phone: formData.ownerPhone || currentUser?.phone || '+225 07 00 00 00',
      verified: true
    }
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
    setIsSubmitted(true);
  };

  // Sync preview property to localStorage for direct detail page viewing
  useEffect(() => {
    try {
      localStorage.setItem('habitoo_preview_property', JSON.stringify(previewProperty));
    } catch (e) {
      console.error("Erreur enregistrement aperçu :", e);
    }
  }, [formData, uploadedPhotos, userName, userAvatar]);

  // If not logged in, prompt auth modal
  useEffect(() => {
    if (!currentUser) {
      openAuthModal();
    }
  }, [currentUser]);

  // Auth gate when accessing without active session
  if (!currentUser) {
    return (
      <div className="publish-viewport-page">
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

  return (
    <div className="publish-viewport-page">
      {isSubmitted ? (
        /* Success Screen */
        <div className="publish-success-wrapper">
          <div className="publish-success-card">
            <div className="publish-success-icon-wrap">
              <CheckCircle2 size={40} className="publish-success-icon" />
            </div>
            
            <span className="publish-success-badge">Annonce Validée</span>
            
            <h2 className="font-serif publish-success-title">
              Félicitations, votre bien est prêt !
            </h2>

            <p className="publish-success-desc">
              Votre annonce <strong>« {formData.title} »</strong> à <strong>{formData.neighborhood}, {formData.city}</strong> a été enregistrée avec succès sous la référence
            </p>

            <div className="publish-success-actions">
              <Link to="/recherche" className="btn-primary" style={{ padding: '10px 20px', justifyContent: 'center' }}>
                <span>Voir les annonces en ligne</span>
                <ArrowRight size={15} />
              </Link>
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
        /* 2-Column Split constrained to 100vh without page scrolling */
        <div className="publish-split-layout">
          
          {/* COLUMN 1: LE PROCESS (Formulaire compact rehaussé) */}
          <div className="publish-col-process">
            <div className="publish-process-card">

              {/* Stepper Navigation Ultra-Fin */}
              <div className="publish-stepper-bar">
                <button 
                  type="button" 
                  className={`publish-stepper-btn ${step === 1 ? 'active' : step > 1 ? 'done' : ''}`}
                  onClick={() => setStep(1)}
                >
                  <div className="step-circle">{step > 1 ? <Check size={11} /> : '1'}</div>
                  <span className="step-name">Lieu & Titre</span>
                </button>

                <div className="publish-stepper-line" />

                <button 
                  type="button" 
                  className={`publish-stepper-btn ${step === 2 ? 'active' : step > 2 ? 'done' : ''}`}
                  onClick={() => setStep(2)}
                >
                  <div className="step-circle">{step > 2 ? <Check size={11} /> : '2'}</div>
                  <span className="step-name">Caractéristiques</span>
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

              {/* STEP 1: TYPOLOGIE, LOCALISATION & DESCRIPTION */}
              {step === 1 && (
                <div className="publish-step-body animate-fadeIn">
                  
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

                  {/* Typology & Country */}
                  <div className="publish-grid-2">
                    <div className="compact-field">
                      <label className="compact-label">Type de bien</label>
                      <select
                        className="form-select compact-input"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      >
                        {PROPERTY_TYPES.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <div className="compact-field">
                      <label className="compact-label">Pays</label>
                      <select
                        className="form-select compact-input"
                        value={formData.city}
                        onChange={(e) => {
                          const newCity = e.target.value;
                          setFormData({ ...formData, city: newCity });
                        }}
                      >
                        <option value="Abidjan">Côte d'Ivoire</option>
                        <option value="Kinshasa">RDC</option>
                        <option value="Brazzaville">Congo</option>
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
                      rows={2}
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
                      <label className="compact-label">Superficie (m²)</label>
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

                  {/* Bedrooms & Bathrooms Counter */}
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

                  {/* Commodités: Liste déroulante multi-sélection avec tags */}
                  <div className="compact-field" ref={amenitiesDropdownRef} style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                      <label className="compact-label" style={{ margin: 0 }}>Commodités</label>
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
                          <span className="multi-placeholder">Cliquez pour choisir des commodités...</span>
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
                          {ALL_AMENITIES.map(amenity => {
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
                      <span>Photos & Contact</span>
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
                      <span className="dropzone-label">Cliquer pour téléverser une ou plusieurs photos</span>
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

                  {/* Row 1 Contact: Déclarant (Session active) & Statut */}
                  <div className="publish-grid-2">
                    <div className="compact-field">
                      <label className="compact-label">Déclarant (Session active)</label>
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

                    <div className="compact-field">
                      <label className="compact-label">Statut</label>
                      
                      {/* Version Desktop : Segmented control */}
                      <div className="compact-segmented-control status-segmented-desktop" style={{ height: '36px' }}>
                        <button
                          type="button"
                          className={`seg-btn ${formData.userRole === 'PROPRIETAIRE' ? 'active' : ''}`}
                          onClick={() => setFormData({ ...formData, userRole: 'PROPRIETAIRE' })}
                          style={{ fontSize: '0.72rem', padding: '4px 8px', flex: 1 }}
                        >
                          Propriétaire
                        </button>
                        <button
                          type="button"
                          className={`seg-btn ${formData.userRole === 'AGENCE' ? 'active' : ''}`}
                          onClick={() => setFormData({ ...formData, userRole: 'AGENCE' })}
                          style={{ fontSize: '0.72rem', padding: '4px 8px', flex: 1 }}
                        >
                          Agence
                        </button>
                      </div>

                      {/* Version Responsif / Mobile : Menu Déroulant (Dropdown) */}
                      <div className="status-dropdown-mobile">
                        <select
                          className="form-select compact-input"
                          value={formData.userRole}
                          onChange={(e) => setFormData({ ...formData, userRole: e.target.value })}
                          style={{ height: '36px', fontSize: '0.75rem', width: '100%' }}
                        >
                          <option value="PROPRIETAIRE">Propriétaire</option>
                          <option value="AGENCE">Agence</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Row 2 Contact: WhatsApp & Email */}
                  <div className="publish-grid-2">
                    <div className="compact-field">
                      <label className="compact-label">WhatsApp direct</label>
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
          </div>

          {/* COLUMN 2: VISUALISATION (Direct PropertyCard sans en-tête span) */}
          <div className="publish-col-preview">
            <div className="preview-card-wrapper">
              <PropertyCard property={previewProperty} />
            </div>
          </div>

        </div>
      )}

      {/* Scoped CSS for 100vh Zero-Scroll Layout */}
      <style>{`
        .publish-viewport-page {
          background-color: var(--bg-main);
          height: calc(100vh - var(--header-height));
          max-height: calc(100vh - var(--header-height));
          overflow: hidden;
          display: flex;
          align-items: flex-start;
          justify-content: center;
        }

        @media (max-width: 992px) {
          .publish-viewport-page {
            height: auto;
            max-height: none;
            overflow-y: auto;
          }
        }

        .publish-split-layout {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 24px;
          max-width: 1240px;
          width: 100%;
          height: 100%;
          padding: 18px 24px;
          box-sizing: border-box;
          align-items: flex-start;
        }

        @media (max-width: 992px) {
          .publish-split-layout {
            grid-template-columns: 1fr;
            height: auto;
            padding: 16px;
          }
        }

        /* COLUMN 1: PROCESS (REHAUSSÉE) */
        .publish-col-process {
          display: flex;
          flex-direction: column;
          min-width: 0;
          width: 100%;
        }

        .publish-process-card {
          background-color: var(--surface-white);
          border: 1px solid var(--border-color);
          border-radius: 14px;
          padding: 16px 20px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
          box-sizing: border-box;
        }

        /* Stepper Bar */
        .publish-stepper-bar {
          display: flex;
          align-items: center;
          background-color: var(--bg-main);
          border-radius: 8px;
          padding: 5px 8px;
          margin-bottom: 12px;
          border: 1px solid var(--border-color);
          overflow-x: auto;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
        .publish-stepper-bar::-webkit-scrollbar {
          display: none;
        }
        .publish-stepper-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          cursor: pointer;
          opacity: 0.55;
          padding: 2px 5px;
          transition: all 0.15s ease;
        }
        .publish-stepper-btn.active {
          opacity: 1;
        }
        .publish-stepper-btn.done {
          opacity: 0.9;
        }
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
        }
        .publish-stepper-line {
          flex: 1;
          height: 1px;
          background-color: var(--border-color);
          margin: 0 5px;
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
          border-radius: 7px !important;
        }
        .compact-textarea {
          padding: 6px 10px !important;
          font-size: 0.78rem !important;
          border-radius: 7px !important;
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
          border-radius: 7px;
          padding: 2px;
          gap: 2px;
        }
        .seg-btn {
          padding: 4px 12px;
          border-radius: 5px;
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
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
        }

        .status-segmented-desktop {
          display: flex;
        }
        .status-dropdown-mobile {
          display: none;
        }

        @media (max-width: 680px) {
          .status-segmented-desktop {
            display: none !important;
          }
          .status-dropdown-mobile {
            display: block !important;
          }
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

        /* Affix Box */
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

        /* Counter */
        .compact-counter {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: var(--bg-main);
          border: 1px solid var(--border-color);
          border-radius: 7px;
          padding: 2px 7px;
          height: 34px;
          box-sizing: border-box;
        }
        .counter-btn {
          width: 22px;
          height: 22px;
          border-radius: 5px;
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

        /* COMMODITÉS MULTI-SELECT DROPDOWN AVEC TAGS */
        .multi-select-trigger-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: var(--bg-main);
          border: 1px solid var(--border-color);
          border-radius: 7px;
          padding: 4px 8px;
          min-height: 34px;
          cursor: pointer;
          box-sizing: border-box;
          transition: border-color 0.15s ease;
        }
        .multi-select-trigger-box:hover {
          border-color: var(--obsidian-black);
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
        .chip-close-btn:hover {
          color: var(--primary-red);
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
          border-radius: 5px;
          cursor: pointer;
          font-size: 0.72rem;
          text-align: left;
          transition: background-color 0.1s ease;
        }
        .popover-item:hover {
          background-color: var(--bg-main);
        }
        .popover-item.selected {
          background-color: var(--soft-tint);
          color: var(--primary-red);
          font-weight: 600;
        }
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

        /* PHOTOS MULTI-UPLOAD DROPZONE */
        .compact-upload-dropzone {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          border: 1.5px dashed var(--border-color);
          background-color: var(--bg-main);
          border-radius: 7px;
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

        /* THUMBNAILS BAR */
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
          border-radius: 6px;
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
        .thumb-del-btn:hover {
          background-color: var(--primary-red);
        }

        /* Phone input bar */
        .compact-phone-bar {
          display: flex;
          align-items: center;
          position: relative;
          background-color: var(--bg-main);
          border: 1px solid var(--border-color);
          border-radius: 7px;
          height: 34px;
          box-sizing: border-box;
        }
        .compact-phone-bar:focus-within {
          border-color: var(--primary-red);
          background-color: #FFF;
        }
        .phone-country-dropdown {
          position: relative;
        }
        .country-trigger-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          background: transparent;
          border: none;
          padding: 4px 6px;
          cursor: pointer;
        }
        .flag { font-size: 0.95rem; }
        .code { font-size: 0.72rem; font-weight: 700; color: var(--obsidian-black); }
        .chev { color: var(--graphite-gray); }
        .chev.open { transform: rotate(180deg); color: var(--primary-red); }

        .country-floating-menu {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          width: 230px;
          background-color: #FFF;
          border: 1px solid var(--border-color);
          border-radius: 8px;
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
        .floating-item.selected { background-color: var(--soft-tint); color: var(--primary-red); }
        .c-name { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .c-code { font-weight: 600; color: var(--graphite-gray); font-size: 0.7rem; }

        .phone-sep {
          width: 1px;
          height: 16px;
          background-color: var(--border-color);
        }
        .compact-phone-input {
          flex: 1;
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          padding: 4px 8px;
          font-size: 0.78rem;
          color: var(--obsidian-black);
          font-weight: 500;
        }

        /* Session User Badge (Déclarant automatique) */
        .session-user-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          height: 36px;
          padding: 4px 10px;
          background: #f8fafc;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          box-sizing: border-box;
        }
        .session-user-img {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          object-fit: cover;
          border: 1.5px solid var(--primary-red);
          flex-shrink: 0;
        }
        .session-user-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
          line-height: 1.2;
        }
        .session-user-name {
          font-size: 0.76rem;
          font-weight: 700;
          color: var(--obsidian-black);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .session-user-status {
          font-size: 0.62rem;
          color: var(--verified-green);
          font-weight: 600;
        }

        /* Auth Gate Card (Connexion requise) */
        .publish-auth-gate-card {
          max-width: 440px;
          width: 100%;
          background: var(--surface-white);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 32px 24px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          margin: auto;
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

        /* Step Footer Actions */
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

        /* COLUMN 2: VISUALISATION / PREVIEW (PropertyCard Compactée) */
        .publish-col-preview {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 0;
          width: 100%;
        }

        .preview-card-wrapper {
          width: 100%;
          max-width: 380px;
          border-radius: var(--radius-card);
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
        }

        /* Compact overrides on PropertyCard to respect 100vh height */
        .preview-card-wrapper .property-card {
          box-shadow: none;
        }
        .preview-card-wrapper .card-image-wrap {
          height: 175px !important;
        }
        .preview-card-wrapper .card-body {
          padding: 12px 14px !important;
        }
        .preview-card-wrapper h3 {
          cursor: pointer;
          transition: color 0.15s ease;
        }
        .preview-card-wrapper h3:hover {
          color: var(--primary-red) !important;
        }
        .preview-card-wrapper .property-card-title {
          font-size: 0.92rem !important;
          margin-bottom: 4px !important;
        }
        .preview-card-wrapper .specs-row {
          margin-bottom: 8px !important;
          gap: 10px !important;
        }
        .preview-card-wrapper .property-card-price {
          font-size: 1.05rem !important;
        }
        .preview-card-wrapper .card-footer-cta {
          padding-top: 8px !important;
          margin-top: 8px !important;
        }

        /* Success Card */
        .publish-success-wrapper {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          box-sizing: border-box;
        }
        .publish-success-card {
          max-width: 480px;
          width: 100%;
          background-color: var(--surface-white);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 28px 24px;
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
          margin-bottom: 12px;
        }
        .publish-success-badge {
          display: inline-block;
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--verified-green);
          background-color: var(--verified-green-bg);
          padding: 2px 10px;
          border-radius: var(--radius-pill);
          margin-bottom: 6px;
        }
        .publish-success-title {
          font-size: 1.35rem;
          color: var(--obsidian-black);
          margin-bottom: 6px;
        }
        .publish-success-desc {
          font-size: 0.8125rem;
          color: var(--graphite-gray);
          line-height: 1.45;
          margin-bottom: 16px;
        }
        .publish-ref-tag {
          font-family: monospace;
          background-color: var(--bg-main);
          padding: 2px 5px;
          border-radius: 4px;
          font-weight: 700;
          color: var(--obsidian-black);
        }
        .publish-success-recap {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          background-color: var(--bg-main);
          border-radius: 8px;
          padding: 10px 12px;
          margin-bottom: 16px;
          text-align: left;
        }
        .publish-recap-label {
          display: block;
          font-size: 0.68rem;
          color: var(--graphite-gray);
        }
        .publish-recap-val {
          font-size: 0.78rem;
          color: var(--obsidian-black);
        }
        .publish-success-actions {
          display: flex;
          flex-direction: column;
          gap: 6px;
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
