import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHabitoo } from '../context/HabitooContext';
import { PROPERTY_TYPES, LUXURY_AMENITIES_FILTERS } from '../data/propertiesData';
import { 
  Search, 
  MapPin, 
  Home, 
  Coins, 
  SlidersHorizontal, 
  Check, 
  ChevronDown,
  X,
  Layers
} from 'lucide-react';

export const SearchWidget = ({ compact = false, onSearchSubmit = null }) => {
  const navigate = useNavigate();
  const { activeCity, formatPrice } = useHabitoo();

  // "VENTE" maps to "Acheter", "LOCATION" maps to "Louer"
  const [transactionType, setTransactionType] = useState("VENTE");
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [maxBudget, setMaxBudget] = useState(transactionType === "VENTE" ? 150000000 : 2500000);
  const [minSurface, setMinSurface] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [showAdvancedPanel, setShowAdvancedPanel] = useState(false);

  const typeDropdownRef = useRef(null);

  // Original list of African neighborhoods and prime locations across all markets
  const neighborhoodSuggestions = [
    "Abidjan", "Cocody Riviera Golf", "Le Plateau", "Cocody Ambassades", "Marcory Zone 4", "Deux Plateaux",
    "Kinshasa", "Kinshasa Gombe", "Kinshasa Ngaliema", "Macampagne", "Mont Fleuri",
    "Brazzaville", "Brazzaville Mpila", "Brazzaville Centre-Ville", "Bacongo"
  ];

  // Close type dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(e.target)) {
        setIsTypeDropdownOpen(false);
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

  const handleSearch = (e) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    params.set('type', transactionType);
    if (locationQuery) params.set('location', locationQuery);
    if (selectedTypes.length > 0) params.set('typologies', selectedTypes.join(','));
    if (maxBudget) params.set('budget', maxBudget.toString());
    if (minSurface) params.set('surfaceMin', minSurface.toString());
    if (selectedAmenities.length > 0) params.set('amenities', selectedAmenities.join(','));

    if (onSearchSubmit) {
      onSearchSubmit({
        transactionType,
        locationQuery,
        selectedTypes,
        maxBudget,
        minSurface,
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
      {/* Top Segmented Tabs: Acheter vs Louer */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          marginBottom: '6px',
          marginLeft: '4px'
        }}
      >
        <button
          type="button"
          onClick={() => handleTransactionChange("VENTE")}
          style={{
            padding: '7px 24px',
            borderRadius: '9999px',
            fontWeight: 700,
            fontSize: '0.875rem',
            backgroundColor: transactionType === "VENTE" ? 'var(--primary-red)' : '#FFFFFF',
            color: transactionType === "VENTE" ? '#FFFFFF' : '#374151',
            boxShadow: transactionType === "VENTE" 
              ? '0 4px 12px rgba(247, 0, 0, 0.3)' 
              : '0 2px 6px rgba(0, 0, 0, 0.05)',
            border: transactionType === "VENTE" ? 'none' : '1px solid rgba(0,0,0,0.08)',
            transition: 'all 0.2s ease',
            cursor: 'pointer'
          }}
        >
          Acheter
        </button>

        <button
          type="button"
          onClick={() => handleTransactionChange("LOCATION")}
          style={{
            padding: '7px 24px',
            borderRadius: '9999px',
            fontWeight: 700,
            fontSize: '0.875rem',
            backgroundColor: transactionType === "LOCATION" ? 'var(--primary-red)' : '#FFFFFF',
            color: transactionType === "LOCATION" ? '#FFFFFF' : '#374151',
            boxShadow: transactionType === "LOCATION" 
              ? '0 4px 12px rgba(247, 0, 0, 0.3)' 
              : '0 2px 6px rgba(0, 0, 0, 0.05)',
            border: transactionType === "LOCATION" ? 'none' : '1px solid rgba(0,0,0,0.08)',
            transition: 'all 0.2s ease',
            cursor: 'pointer'
          }}
        >
          Louer
        </button>
      </div>

      {/* Main White Card Container (Sleek, Compact Height) */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 14px 36px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(0, 0, 0, 0.07)',
          padding: compact ? '12px' : '14px 18px 12px 18px'
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
            {/* 1. LOCALISATION (OÙ ?) */}
            <div 
              className="search-field-box"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 14px',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                backgroundColor: '#FAFAFA',
                transition: 'all 0.15s ease'
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
                  Où ?
                </label>
                <input
                  id="hero-location-input"
                  type="text"
                  placeholder="Sélectionnez une ville ou quartier..."
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  list="neighborhood-suggestions-list"
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
                <datalist id="neighborhood-suggestions-list">
                  {neighborhoodSuggestions.map((n, i) => (
                    <option key={i} value={n} />
                  ))}
                </datalist>
              </div>
              {locationQuery && (
                <button
                  type="button"
                  onClick={() => setLocationQuery('')}
                  style={{ color: '#9CA3AF', cursor: 'pointer', padding: '2px', background: 'none', border: 'none' }}
                  aria-label="Effacer la localisation"
                >
                  <X size={13} />
                </button>
              )}
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
                      ? "Maison, appartement, terrain..." 
                      : `${selectedTypes.length} type(s) sélectionné(s)`}
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
              className="search-field-box"
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1px' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--obsidian-black)', lineHeight: 1.1 }}>
                    Budget max
                  </div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary-red)' }}>
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
            <div>
              <button
                type="submit"
                className="btn-primary"
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
          </div>
        </form>

        {/* Sub-bar: Recherche avancée + Checkbox Filter Pills */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginTop: '10px', 
            paddingTop: '8px',
            borderTop: '1px solid rgba(0, 0, 0, 0.05)',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          {/* Left: Quick Checkboxes */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', fontSize: '0.78rem' }}>
            <button
              type="button"
              onClick={() => setShowAdvancedPanel(!showAdvancedPanel)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                color: 'var(--primary-red)',
                fontWeight: 700,
                cursor: 'pointer',
                padding: '1px 0',
                border: 'none',
                background: 'none'
              }}
            >
              <SlidersHorizontal size={14} />
              <span>Recherche avancée</span>
            </button>

            {/* Checkbox item: Type de bien */}
            <label 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '5px', 
                cursor: 'pointer', 
                color: selectedTypes.length > 0 ? 'var(--primary-red)' : '#4B5563',
                fontWeight: selectedTypes.length > 0 ? 600 : 500,
                userSelect: 'none'
              }}
              onClick={() => setIsTypeDropdownOpen(true)}
            >
              <input 
                type="checkbox" 
                checked={selectedTypes.length > 0} 
                onChange={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                style={{ accentColor: 'var(--primary-red)', cursor: 'pointer' }} 
              />
              <span>Type de bien</span>
            </label>

            {/* Checkbox item: Prix */}
            <label 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '5px', 
                cursor: 'pointer', 
                color: '#4B5563',
                fontWeight: 500,
                userSelect: 'none'
              }}
              onClick={() => setShowAdvancedPanel(true)}
            >
              <input 
                type="checkbox" 
                checked={Boolean(maxBudget)} 
                onChange={() => setShowAdvancedPanel(true)}
                style={{ accentColor: 'var(--primary-red)', cursor: 'pointer' }} 
              />
              <span>Prix</span>
            </label>

            {/* Checkbox item: Surface */}
            <label 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '5px', 
                cursor: 'pointer', 
                color: minSurface ? 'var(--primary-red)' : '#4B5563',
                fontWeight: minSurface ? 600 : 500,
                userSelect: 'none'
              }}
              onClick={() => setShowAdvancedPanel(true)}
            >
              <input 
                type="checkbox" 
                checked={Boolean(minSurface)} 
                onChange={() => setShowAdvancedPanel(!showAdvancedPanel)}
                style={{ accentColor: 'var(--primary-red)', cursor: 'pointer' }} 
              />
              <span>Surface</span>
            </label>

            {/* Checkbox item: Équipements */}
            <label 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '5px', 
                cursor: 'pointer', 
                color: selectedAmenities.length > 0 ? 'var(--primary-red)' : '#4B5563',
                fontWeight: selectedAmenities.length > 0 ? 600 : 500,
                userSelect: 'none'
              }}
              onClick={() => setShowAdvancedPanel(true)}
            >
              <input 
                type="checkbox" 
                checked={selectedAmenities.length > 0} 
                onChange={() => setShowAdvancedPanel(!showAdvancedPanel)}
                style={{ accentColor: 'var(--primary-red)', cursor: 'pointer' }} 
              />
              <span>Équipements</span>
            </label>
          </div>

          {/* Right: Quick amenity indicators if any selected */}
          {selectedAmenities.length > 0 && (
            <div style={{ fontSize: '0.72rem', color: 'var(--primary-red)', fontWeight: 600 }}>
              {selectedAmenities.length} commodité(s) active(s)
            </div>
          )}
        </div>

        {/* Expandable Advanced Panel: Surface + High-Value African Luxury Amenities */}
        {showAdvancedPanel && (
          <div 
            style={{
              marginTop: '14px',
              paddingTop: '14px',
              borderTop: '1px solid var(--border-light)',
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--obsidian-black)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={15} color="var(--primary-red)" />
                <span>Critères et Commodités d'exception</span>
              </span>
              <button 
                type="button" 
                onClick={() => setShowAdvancedPanel(false)}
                style={{ fontSize: '0.75rem', color: '#6B7280', cursor: 'pointer', fontWeight: 600, background: 'none', border: 'none' }}
              >
                Fermer ✕
              </button>
            </div>

            {/* Surface filter */}
            <div style={{ marginBottom: '14px', maxWidth: '260px' }}>
              <label 
                htmlFor="surface-min-input"
                style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--obsidian-black)', marginBottom: '3px' }}
              >
                Surface minimum (m²)
              </label>
              <input 
                id="surface-min-input"
                type="number" 
                placeholder="ex: 150 m²" 
                value={minSurface}
                onChange={(e) => setMinSurface(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.82rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* High-Value African Luxury Amenities Filter Chips */}
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--graphite-gray)', marginBottom: '8px' }}>
                Commodités indispensables en Afrique
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {LUXURY_AMENITIES_FILTERS.map((amenity) => {
                  const isActive = selectedAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '9999px',
                        fontSize: '0.78rem',
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
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 960px) {
          .search-main-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .search-main-grid > div:last-child {
            grid-column: span 2;
          }
          .search-main-grid > div:last-child button {
            width: 100%;
            justify-content: center;
          }
        }
        @media (max-width: 600px) {
          .search-main-grid {
            grid-template-columns: 1fr !important;
          }
          .search-main-grid > div:last-child {
            grid-column: span 1;
          }
        }
      `}</style>
    </div>
  );
};

export default SearchWidget;
