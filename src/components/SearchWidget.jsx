import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHabitoo } from '../context/HabitooContext';
import { PROPERTY_TYPES, LUXURY_AMENITIES_FILTERS, COUNTRIES_DATA } from '../data/propertiesData';
import { 
  Search, 
  MapPin, 
  Home, 
  Coins, 
  Check, 
  ChevronDown,
  X, 
  Layers,
  Key,
  Tag,
  SlidersHorizontal
} from 'lucide-react';

export const SearchWidget = ({ compact = false, onSearchSubmit = null }) => {
  const navigate = useNavigate();
  const { activeCity, formatPrice } = useHabitoo();

  // "VENTE" maps to "Acheter", "LOCATION" maps to "Louer"
  const [transactionType, setTransactionType] = useState("VENTE");
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  const [selectedTypes, setSelectedTypes] = useState([]);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [maxBudget, setMaxBudget] = useState(transactionType === "VENTE" ? 150000000 : 2500000);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [isAmenitiesOpen, setIsAmenitiesOpen] = useState(() => typeof window !== 'undefined' ? window.innerWidth > 960 : true);

  const typeDropdownRef = useRef(null);
  const locationDropdownRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(e.target)) {
        setIsTypeDropdownOpen(false);
      }
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(e.target)) {
        setIsLocationDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleType = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleAmenity = (amenity) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const handleTransactionChange = (type) => {
    setTransactionType(type);
    if (type === "VENTE") {
      setMaxBudget(150000000);
    } else {
      setMaxBudget(2500000);
    }
  };

  const handleSelectCity = (country, city) => {
    setSelectedCountry(country.name);
    setSelectedCity(city.name);
    setLocationQuery(`${city.name}, ${country.name}`);
    setIsLocationDropdownOpen(false);
  };

  const handleSelectCountry = (country) => {
    setSelectedCountry(country.name);
    setSelectedCity('');
    setLocationQuery(`Toutes les villes (${country.name})`);
    setIsLocationDropdownOpen(false);
  };

  const handleClearLocation = () => {
    setSelectedCountry('');
    setSelectedCity('');
    setLocationQuery('');
  };


  const handleSearch = (e) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    params.set('type', transactionType);
    if (selectedCountry) {
      params.set('country', selectedCountry);
    }
    if (selectedCity) {
      params.set('location', selectedCity);
    } else if (locationQuery && !locationQuery.startsWith('Toutes les villes')) {
      params.set('location', locationQuery);
    }
    if (selectedTypes.length > 0) params.set('typologies', selectedTypes.join(','));
    if (maxBudget) params.set('budget', maxBudget.toString());
    if (selectedAmenities.length > 0) params.set('amenities', selectedAmenities.join(','));

    if (onSearchSubmit) {
      onSearchSubmit({
        transactionType,
        locationQuery: selectedCity || (locationQuery.startsWith('Toutes les villes') ? '' : locationQuery),
        country: selectedCountry,
        selectedTypes,
        maxBudget,
        selectedAmenities
      });
    } else {
      navigate(`/recherche?${params.toString()}`);
    }
  };

  return (
    <div 
      className="habitoo-search-container"
      style={{
        width: '100%',
        maxWidth: '1100px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 25
      }}
    >
      {/* Top Wave Tabs fused with the Form Card Background */}
      <div 
        className="search-wave-tabs-bar"
        style={{ 
          display: 'flex', 
          alignItems: 'flex-end', 
          marginBottom: '-1px', // Crucial: merges and fuses into the white form below
          position: 'relative',
          zIndex: 5,
          marginLeft: '0px'
        }}
      >
        <div
          className="search-wave-tabs-container"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px 16px 0 0',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            borderBottom: '1px solid #FFFFFF', // Creates unbroken white flow into the form
            boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.03)',
            padding: '4px 6px 0 6px',
            gap: '4px'
          }}
        >
          <button
            type="button"
            onClick={() => handleTransactionChange("VENTE")}
            className={`search-tab-btn tab-acheter ${transactionType === "VENTE" ? "active" : ""}`}
            style={{
              padding: '9px 20px 8px',
              borderRadius: '12px 12px 0 0',
              fontWeight: 800,
              fontSize: '0.85rem',
              backgroundColor: transactionType === "VENTE" ? 'var(--primary-red)' : '#FFFFFF',
              color: transactionType === "VENTE" ? '#FFFFFF' : '#4B5563',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Home size={15} color={transactionType === "VENTE" ? '#FFFFFF' : '#6B7280'} />
            <span>Acheter</span>
          </button>

          <button
            type="button"
            onClick={() => handleTransactionChange("LOCATION")}
            className={`search-tab-btn tab-louer ${transactionType === "LOCATION" ? "active" : ""}`}
            style={{
              padding: '9px 20px 8px',
              borderRadius: '12px 12px 0 0',
              fontWeight: 800,
              fontSize: '0.85rem',
              backgroundColor: transactionType === "LOCATION" ? 'var(--primary-red)' : '#FFFFFF',
              color: transactionType === "LOCATION" ? '#FFFFFF' : '#4B5563',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Key size={15} color={transactionType === "LOCATION" ? '#FFFFFF' : '#6B7280'} />
            <span>Louer</span>
          </button>
        </div>
      </div>

      {/* Main White Card Container (Fused to the tabs above) */}
      <div
        className="search-main-card"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          borderTopLeftRadius: '0px', // Seamless wave fusion with the tabs
          boxShadow: '0 14px 36px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          padding: compact ? '12px' : '16px 20px 14px 20px',
          position: 'relative',
          zIndex: 2
        }}
      >
        <form onSubmit={handleSearch}>
          <div 
            className="search-main-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1.1fr 1.2fr auto',
              gap: '10px',
              alignItems: 'center'
            }}
          >
            {/* 1. LOCALISATION — Recherche libre avec suggestions */}
            <div style={{ position: 'relative' }} ref={locationDropdownRef}>
              <div 
                className="search-field-box"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: isLocationDropdownOpen ? '1px solid var(--primary-red)' : '1px solid var(--border-color)',
                  backgroundColor: '#FAFAFA',
                  transition: 'all 0.15s ease',
                  cursor: 'text'
                }}
              >
                <div style={{ color: 'var(--primary-red)', flexShrink: 0 }}>
                  <MapPin size={20} />
                </div>
                <div style={{ flexGrow: 1, minWidth: 0 }}>
                  <label 
                    htmlFor="hero-location-input"
                    style={{ 
                      display: 'block', 
                      fontSize: '0.72rem', 
                      fontWeight: 800, 
                      color: 'var(--obsidian-black)', 
                      lineHeight: 1.1,
                      marginBottom: '1px',
                      cursor: 'pointer'
                    }}
                  >
                    Localisation
                  </label>
                  <input
                    id="hero-location-input"
                    type="text"
                    placeholder="Quartier, ville ou pays..."
                    value={locationQuery}
                    onChange={(e) => {
                      setLocationQuery(e.target.value);
                      setSelectedCountry('');
                      setSelectedCity('');
                      setIsLocationDropdownOpen(true);
                    }}
                    onFocus={() => setIsLocationDropdownOpen(true)}
                    style={{
                      width: '100%',
                      border: 'none',
                      background: 'transparent',
                      outline: 'none',
                      fontSize: '0.84rem',
                      color: 'var(--obsidian-black)',
                      fontWeight: locationQuery ? 600 : 400,
                      padding: 0,
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
                {locationQuery && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClearLocation();
                    }}
                    style={{ color: '#9CA3AF', cursor: 'pointer', padding: '2px', background: 'none', border: 'none' }}
                    aria-label="Effacer la localisation"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Suggestions dropdown */}
              {isLocationDropdownOpen && (() => {
                const q = locationQuery.toLowerCase().trim();
                const allSuggestions = COUNTRIES_DATA.flatMap(country => [
                  { label: country.name, sublabel: 'Pays', value: `Toutes les villes (${country.name})`, country: country.name, city: '' },
                  ...country.cities.map(city => ({
                    label: city.name,
                    sublabel: country.name,
                    value: `${city.name}, ${country.name}`,
                    country: country.name,
                    city: city.name
                  })),
                  ...(country.cities.flatMap(city =>
                    (city.neighborhoods || []).map(nh => ({
                      label: nh,
                      sublabel: `${city.name}, ${country.name}`,
                      value: `${nh}, ${city.name}`,
                      country: country.name,
                      city: city.name,
                      neighborhood: nh
                    }))
                  ))
                ]);
                const filtered = q
                  ? allSuggestions.filter(s =>
                      s.label.toLowerCase().includes(q) ||
                      s.sublabel.toLowerCase().includes(q) ||
                      s.value.toLowerCase().includes(q)
                    ).slice(0, 8)
                  : allSuggestions.slice(0, 8);

                return (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      left: 0,
                      width: '360px',
                      maxWidth: 'min(360px, calc(100vw - 32px))',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '14px',
                      boxShadow: '0 20px 48px rgba(0,0,0,0.14), 0 4px 12px rgba(0,0,0,0.06)',
                      border: '1px solid rgba(0,0,0,0.08)',
                      zIndex: 150,
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{ padding: '10px 14px 6px 14px', fontSize: '0.68rem', fontWeight: 800, color: 'var(--graphite-gray)', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #F1F5F9' }}>
                      Suggestions
                    </div>
                    <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                      {q && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsLocationDropdownOpen(false);
                          }}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 14px',
                            border: 'none',
                            background: 'rgba(235,33,46,0.05)',
                            textAlign: 'left',
                            cursor: 'pointer'
                          }}
                        >
                          <Search size={14} color="var(--primary-red)" style={{ flexShrink: 0 }} />
                          <span style={{ fontSize: '0.84rem', color: 'var(--obsidian-black)' }}>
                            Rechercher <strong>«&nbsp;{locationQuery}&nbsp;»</strong>
                          </span>
                        </button>
                      )}
                      {filtered.map((s, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setLocationQuery(s.value);
                            setSelectedCountry(s.country);
                            setSelectedCity(s.city || '');
                            setIsLocationDropdownOpen(false);
                          }}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '10px',
                            padding: '10px 14px',
                            border: 'none',
                            background: 'transparent',
                            textAlign: 'left',
                            cursor: 'pointer',
                            transition: 'background 0.12s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                            <MapPin size={13} color="var(--graphite-gray)" style={{ flexShrink: 0 }} />
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--obsidian-black)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {s.label}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--graphite-gray)', marginTop: '1px' }}>
                                {s.sublabel}
                              </div>
                            </div>
                          </div>
                          <span style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            color: '#64748B',
                            backgroundColor: '#F1F5F9',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            whiteSpace: 'nowrap',
                            flexShrink: 0
                          }}>
                            {s.neighborhood ? 'Quartier' : s.city ? 'Ville' : 'Pays'}
                          </span>
                        </button>
                      ))}
                      {filtered.length === 0 && (
                        <div style={{ padding: '14px 16px', fontSize: '0.8125rem', color: 'var(--graphite-gray)', textAlign: 'center' }}>
                          Aucune suggestion
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>


            {/* 2. TYPE DE BIEN (Multi-select dropdown) */}
            <div 
              style={{ position: 'relative' }} 
              ref={typeDropdownRef}
            >
              <div
                onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                className="search-field-box"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: isTypeDropdownOpen ? '1px solid var(--primary-red)' : '1px solid var(--border-color)',
                  backgroundColor: '#FAFAFA',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ color: 'var(--obsidian-black)', flexShrink: 0 }}>
                  <Home size={20} />
                </div>
                <div style={{ flexGrow: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--obsidian-black)', lineHeight: 1.1, marginBottom: '1px' }}>
                    Type de bien
                  </div>
                  <div 
                    style={{ 
                      fontSize: '0.84rem', 
                      color: selectedTypes.length > 0 ? 'var(--obsidian-black)' : '#6B7280', 
                      fontWeight: selectedTypes.length > 0 ? 600 : 400,
                      whiteSpace: 'nowrap', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis' 
                    }}
                  >
                    {selectedTypes.length === 0 
                      ? "Tous types" 
                      : selectedTypes.length === 1 
                        ? selectedTypes[0] 
                        : `${selectedTypes.length} type(s)`}
                  </div>
                </div>
                <ChevronDown 
                  size={15} 
                  color="#6B7280" 
                  style={{ 
                    transform: isTypeDropdownOpen ? 'rotate(180deg)' : 'none', 
                    transition: 'transform 0.2s',
                    flexShrink: 0
                  }} 
                />
              </div>

              {/* Multi-type Dropdown Menu */}
              {isTypeDropdownOpen && (
                <div 
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: 0,
                    right: 0,
                    minWidth: '250px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
                    border: '1px solid var(--border-color)',
                    padding: '8px',
                    zIndex: 100,
                    animation: 'fadeIn 0.15s ease-out'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', borderBottom: '1px solid #F3F4F6', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>
                      Typologies
                    </span>
                    {selectedTypes.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedTypes([])}
                        style={{ fontSize: '0.72rem', color: 'var(--primary-red)', fontWeight: 600, cursor: 'pointer', background: 'none', border: 'none' }}
                      >
                        Réinitialiser
                      </button>
                    )}
                  </div>
                  {PROPERTY_TYPES.map((type) => {
                    const isChecked = selectedTypes.includes(type);
                    return (
                      <div
                        key={type}
                        onClick={() => toggleType(type)}
                        style={{
                          padding: '7px 10px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.82rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontWeight: isChecked ? 700 : 400,
                          backgroundColor: isChecked ? 'var(--soft-tint)' : 'transparent',
                          color: isChecked ? 'var(--primary-red)' : 'var(--obsidian-black)',
                          transition: 'background-color 0.1s ease'
                        }}
                      >
                        <span>{type}</span>
                        {isChecked && <Check size={15} color="var(--primary-red)" strokeWidth={2.5} />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. BUDGET (Dynamic slider with live FCFA display) */}
            <div 
              className="search-field-box search-budget-box"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '7px 14px',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                backgroundColor: '#FAFAFA'
              }}
            >
              <div style={{ color: 'var(--obsidian-black)', flexShrink: 0 }}>
                <Coins size={20} />
              </div>
              <div style={{ flexGrow: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', gap: '8px' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--obsidian-black)', lineHeight: 1.1, whiteSpace: 'nowrap' }}>
                    Budget max
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary-red)', whiteSpace: 'nowrap' }}>
                    {formatPrice(
                      maxBudget, 
                      Math.round(maxBudget / 600), 
                      maxBudget, 
                      transactionType === "LOCATION" ? "/m" : ""
                    )}
                  </div>
                </div>
                <input
                  type="range"
                  min={transactionType === "LOCATION" ? 200000 : 25000000}
                  max={transactionType === "LOCATION" ? 8000000 : 600000000}
                  step={transactionType === "LOCATION" ? 100000 : 10000000}
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(Number(e.target.value))}
                  style={{
                    width: '100%',
                    height: '4px',
                    accentColor: 'var(--primary-red)',
                    cursor: 'pointer',
                    display: 'block'
                  }}
                  title="Ajuster le budget maximum"
                />
              </div>
            </div>

            {/* 4. ACTION: BOUTON ROUGE "RECHERCHER" */}
            <div className="search-submit-box">
              <button
                type="submit"
                className="btn-primary search-submit-btn"
                style={{
                  height: '46px',
                  padding: '0 26px',
                  borderRadius: '10px',
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap',
                  backgroundColor: 'var(--primary-red)',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 14px rgba(247, 0, 0, 0.3)',
                  cursor: 'pointer',
                  border: 'none'
                }}
              >
                <Search size={18} strokeWidth={2.4} />
                <span>Rechercher</span>
              </button>
            </div>

            {/* 5. COMMODITÉS INDISPENSABLES (Collapsible Accordion) */}
            <div 
              className="search-amenities-section"
              style={{ 
                marginTop: '14px', 
                paddingTop: '12px',
                borderTop: '1px solid rgba(0, 0, 0, 0.06)'
              }}
            >
              {/* Ligne 1: Titre au-dessus & Déclencheur Accordéon */}
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  marginBottom: isAmenitiesOpen ? '8px' : '0px', 
                  flexWrap: 'wrap', 
                  gap: '6px' 
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsAmenitiesOpen(!isAmenitiesOpen)}
                  className="amenities-toggle-btn"
                  aria-expanded={isAmenitiesOpen}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '2px 0',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    color: 'inherit',
                    textAlign: 'left'
                  }}
                >
                  <Layers size={14} color="var(--primary-red)" />
                  <span style={{ 
                    fontSize: '0.74rem', 
                    fontWeight: 800, 
                    color: 'var(--obsidian-black)', 
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span>Commodités indispensables :</span>
                    {selectedAmenities.length > 0 && (
                      <span style={{
                        backgroundColor: 'var(--primary-red)',
                        color: '#FFFFFF',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '1px 6px',
                        borderRadius: '9999px',
                        lineHeight: '1.2'
                      }}>
                        {selectedAmenities.length}
                      </span>
                    )}
                  </span>
                  <ChevronDown 
                    size={14} 
                    color="#6B7280" 
                    style={{ 
                      transform: isAmenitiesOpen ? 'rotate(180deg)' : 'none', 
                      transition: 'transform 0.15s ease',
                      flexShrink: 0
                    }} 
                  />
                </button>

                {selectedAmenities.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedAmenities([])}
                    style={{
                      fontSize: '0.72rem',
                      color: 'var(--primary-red)',
                      fontWeight: 700,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}
                  >
                    <X size={12} />
                    <span>Réinitialiser ({selectedAmenities.length})</span>
                  </button>
                )}
              </div>

              {/* Ligne 2: Options de commodités (Affichage/masquage instantané) */}
              {isAmenitiesOpen && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {LUXURY_AMENITIES_FILTERS.map((amenity) => {
                    const isActive = selectedAmenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className="amenity-chip-btn"
                        style={{
                          padding: '5px 14px',
                          borderRadius: '9999px',
                          fontSize: '0.76rem',
                          fontWeight: 600,
                          border: isActive ? '1px solid var(--primary-red)' : '1px solid var(--border-color)',
                          backgroundColor: isActive ? 'var(--soft-tint)' : '#F9FAFB',
                          color: isActive ? 'var(--primary-red)' : 'var(--obsidian-black)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {isActive && <Check size={12} color="var(--primary-red)" strokeWidth={2.5} />}
                        <span>{amenity}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </form>
      </div>

      <style>{`
        .search-submit-box {
          order: 4;
        }
        .search-amenities-section {
          grid-column: 1 / -1;
          order: 5;
        }
        @media (max-width: 960px) {
          .search-main-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 10px !important;
          }
          .search-budget-box {
            grid-column: span 2 !important;
            order: 3 !important;
          }
          .search-amenities-section {
            grid-column: span 2 !important;
            order: 4 !important;
            margin-top: 6px !important;
            padding-top: 10px !important;
          }
          .search-submit-box {
            grid-column: span 2 !important;
            order: 5 !important;
            margin-top: 4px !important;
          }
          .search-submit-box button {
            width: 100% !important;
            justify-content: center;
          }
        }
        @media (max-width: 768px) {
          .search-wave-tabs-bar {
            width: 100% !important;
            display: flex !important;
          }
          .search-wave-tabs-container {
            width: 100% !important;
            display: flex !important;
            box-sizing: border-box !important;
            border-radius: 18px 18px 0 0 !important;
            padding: 4px !important;
            gap: 4px !important;
            border-bottom: 1px solid #FFFFFF !important;
          }
          .search-tab-btn {
            flex: 1 1 50% !important;
            width: 50% !important;
            justify-content: center !important;
            padding: 10px 14px 9px !important;
            font-size: 0.88rem !important;
          }
          .tab-acheter {
            border-radius: 14px 0 0 0 !important;
          }
          .tab-louer {
            border-radius: 0 14px 0 0 !important;
          }
          .search-main-card {
            border-top-left-radius: 0 !important;
            border-top-right-radius: 0 !important;
            border-radius: 0 0 18px 18px !important;
            padding: 12px 10px 14px 10px !important;
          }
          .search-main-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 8px !important;
          }
          .search-field-box {
            padding: 7px 10px !important;
            min-height: 48px;
          }
          .search-budget-box {
            grid-column: span 2 !important;
            order: 3 !important;
          }
          .search-amenities-section {
            grid-column: span 2 !important;
            order: 4 !important;
            margin-top: 4px !important;
            padding-top: 10px !important;
          }
          .search-submit-box {
            grid-column: span 2 !important;
            order: 5 !important;
            margin-top: 4px !important;
          }
          .search-submit-box button {
            width: 100% !important;
            height: 46px !important;
            font-size: 0.95rem !important;
            border-radius: 12px !important;
            justify-content: center;
          }
          .amenity-chip-btn {
            padding: 4px 10px !important;
            font-size: 0.72rem !important;
          }
        }
        @media (max-width: 540px) {
          .search-main-grid {
            grid-template-columns: 1fr !important;
            gap: 8px !important;
          }
          .search-budget-box {
            grid-column: span 1 !important;
            order: 3 !important;
          }
          .search-amenities-section {
            grid-column: span 1 !important;
            order: 4 !important;
          }
          .search-submit-box {
            grid-column: span 1 !important;
            order: 5 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SearchWidget;
