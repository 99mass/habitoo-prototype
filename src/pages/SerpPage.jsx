import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useHabitoo } from '../context/HabitooContext';
import { PROPERTIES_DATA } from '../data/propertiesData';
import { PropertyCard } from '../components/PropertyCard';
import { MapPane } from '../components/MapPane';
import { 
  Map, 
  EyeOff,
  X, 
  Search, 
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Home,
  Building,
  RotateCcw,
  SlidersHorizontal
} from 'lucide-react';

const LOCATION_SUGGESTIONS = [
  { label: "Abidjan (Toute la ville)", value: "Abidjan", city: "Abidjan", country: "Côte d'Ivoire", zip: "01 BP" },
  { label: "Cocody Riviera Golf", value: "Cocody Riviera Golf", city: "Abidjan", country: "Côte d'Ivoire", zip: "08 BP" },
  { label: "Le Plateau", value: "Le Plateau", city: "Abidjan", country: "Côte d'Ivoire", zip: "01 BP" },
  { label: "Cocody Ambassades", value: "Cocody Ambassades", city: "Abidjan", country: "Côte d'Ivoire", zip: "08 BP" },
  { label: "Marcory Zone 4", value: "Marcory Zone 4", city: "Abidjan", country: "Côte d'Ivoire", zip: "11 BP" },
  { label: "Deux Plateaux", value: "Deux Plateaux", city: "Abidjan", country: "Côte d'Ivoire", zip: "06 BP" },
  { label: "Kinshasa (Toute la ville)", value: "Kinshasa", city: "Kinshasa", country: "RDC", zip: "BP 800" },
  { label: "Kinshasa Gombe", value: "Kinshasa Gombe", city: "Kinshasa", country: "RDC", zip: "BP 801" },
  { label: "Kinshasa Ngaliema", value: "Kinshasa Ngaliema", city: "Kinshasa", country: "RDC", zip: "BP 802" },
  { label: "Macampagne", value: "Macampagne", city: "Kinshasa", country: "RDC", zip: "BP 803" },
  { label: "Mont Fleuri", value: "Mont Fleuri", city: "Kinshasa", country: "RDC", zip: "BP 804" },
  { label: "Brazzaville (Toute la ville)", value: "Brazzaville", city: "Brazzaville", country: "Congo", zip: "BP 200" },
  { label: "Brazzaville Mpila", value: "Brazzaville Mpila", city: "Brazzaville", country: "Congo", zip: "BP 201" },
  { label: "Centre-Ville", value: "Centre-Ville", city: "Brazzaville", country: "Congo", zip: "BP 202" },
  { label: "Bacongo", value: "Bacongo", city: "Brazzaville", country: "Congo", zip: "BP 203" }
];

export const SerpPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { activeCity, formatPrice } = useHabitoo();

  const typeParam = searchParams.get('type') || 'ALL'; // "ALL" | "LOCATION" | "VENTE"
  const propertyTypeParam = searchParams.get('propertyType') || 'ALL'; // "ALL" | "villa" | "appartement" | "penthouse" | "residence"
  const countryParam = searchParams.get('country') || 'ALL';
  const locationParam = searchParams.get('location') || '';
  const typologiesParam = searchParams.get('typologies') ? searchParams.get('typologies').split(',') : [];
  const amenitiesParam = searchParams.get('amenities') ? searchParams.get('amenities').split(',') : [];
  const budgetParam = searchParams.get('budget') ? Number(searchParams.get('budget')) : null;

  const [sortBy, setSortBy] = useState('recommandes');
  const [hoveredPropertyId, setHoveredPropertyId] = useState(null);
  const [showMap, setShowMap] = useState(true);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [mobileTab, setMobileTab] = useState('list'); // 'list' | 'map'
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Active filter criteria count for mobile badge
  const activeCriteriaCount = useMemo(() => {
    let count = 0;
    if (typeParam !== 'ALL') count++;
    if (propertyTypeParam !== 'ALL') count++;
    if (countryParam !== 'ALL') count++;
    return count;
  }, [typeParam, propertyTypeParam, countryParam]);

  // Location search state & suggestions
  const [locationInput, setLocationInput] = useState(locationParam);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchBoxRef = useRef(null);

  // Sync location input when URL param changes
  useEffect(() => {
    setLocationInput(locationParam);
  }, [locationParam]);

  // Click outside to close auto-suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // When expanding or collapsing map, trigger resize for Leaflet map tiles
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 120);
    return () => clearTimeout(timer);
  }, [isMapExpanded, showMap]);

  // Filter Properties
  const filteredProperties = useMemo(() => {
    return PROPERTIES_DATA.filter(prop => {
      // Étanchéité stricte : Exclure tout bien à usage professionnel
      if (prop.destination === 'PRO') return false;

      // Transaction type filter (LOCATION vs VENTE)
      if (typeParam !== 'ALL' && prop.category !== typeParam) return false;

      // Property type filter (Maison & Villa, Appartement, Penthouse, Résidence)
      if (propertyTypeParam !== 'ALL') {
        const pType = (prop.type || '').toLowerCase();
        if (propertyTypeParam === 'villa' && !pType.includes('villa') && !pType.includes('maison')) return false;
        if (propertyTypeParam === 'appartement' && !pType.includes('appartement')) return false;
        if (propertyTypeParam === 'penthouse' && !pType.includes('penthouse')) return false;
        if (propertyTypeParam === 'residence' && !pType.includes('résidence') && !pType.includes('residence')) return false;
      }

      // Backward compatibility with typologies array from SearchWidget
      if (typologiesParam.length > 0) {
        const matchesType = typologiesParam.some(t => prop.type.toLowerCase().includes(t.toLowerCase()));
        if (!matchesType) return false;
      }

      // Country filter
      if (countryParam !== 'ALL' && prop.country.toLowerCase() !== countryParam.toLowerCase()) return false;

      // Location query: match neighborhood, city, country, address or zip
      if (locationParam) {
        const query = locationParam.toLowerCase().trim();
        const matches = 
          prop.city.toLowerCase().includes(query) ||
          prop.neighborhood.toLowerCase().includes(query) ||
          prop.country.toLowerCase().includes(query) ||
          prop.address.toLowerCase().includes(query);
        if (!matches) return false;
      }

      if (budgetParam && prop.priceXOF > budgetParam) return false;

      if (amenitiesParam.length > 0) {
        const matchesAmenities = amenitiesParam.every(a => {
          const cleanA = a.replace('+', '').trim().toLowerCase();
          return prop.amenities.some(am => am.toLowerCase().includes(cleanA));
        });
        if (!matchesAmenities) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'prix-asc') return a.priceXOF - b.priceXOF;
      if (sortBy === 'prix-desc') return b.priceXOF - a.priceXOF;
      return 0;
    });
  }, [typeParam, propertyTypeParam, countryParam, locationParam, typologiesParam, amenitiesParam, budgetParam, sortBy]);

  // Handle Location selection or submission
  const handleSelectLocation = (val) => {
    setLocationInput(val);
    setShowSuggestions(false);
    const newParams = new URLSearchParams(searchParams);
    if (val && val.trim()) {
      newParams.set('location', val.trim());
    } else {
      newParams.delete('location');
    }
    setSearchParams(newParams);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSelectLocation(locationInput);
    }
  };

  // Filter Transaction Type (Projet : Louer / Acheter)
  const handleTypeChange = (e) => {
    const val = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (val === 'ALL') {
      newParams.delete('type');
    } else {
      newParams.set('type', val);
    }
    setSearchParams(newParams);
  };

  // Filter Property Type (Maison, Appartement, etc.)
  const handlePropertyTypeChange = (e) => {
    const val = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (val === 'ALL') {
      newParams.delete('propertyType');
    } else {
      newParams.set('propertyType', val);
    }
    setSearchParams(newParams);
  };

  // Filter Country
  const handleCountryChange = (e) => {
    const val = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (val === 'ALL') {
      newParams.delete('country');
    } else {
      newParams.set('country', val);
    }
    setSearchParams(newParams);
  };

  // Remove specific filter helper
  const removeFilter = (key, value = null) => {
    const newParams = new URLSearchParams(searchParams);
    if (key === 'type') newParams.delete('type');
    else if (key === 'propertyType') newParams.delete('propertyType');
    else if (key === 'country') newParams.delete('country');
    else if (key === 'location') {
      newParams.delete('location');
      setLocationInput('');
    }
    else if (key === 'budget') newParams.delete('budget');
    else if (key === 'typologies') {
      const current = newParams.get('typologies')?.split(',') || [];
      const updated = current.filter(item => item !== value);
      if (updated.length > 0) newParams.set('typologies', updated.join(','));
      else newParams.delete('typologies');
    } else if (key === 'amenities') {
      const current = newParams.get('amenities')?.split(',') || [];
      const updated = current.filter(item => item !== value);
      if (updated.length > 0) newParams.set('amenities', updated.join(','));
      else newParams.delete('amenities');
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setLocationInput('');
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = 
    typeParam !== 'ALL' || 
    propertyTypeParam !== 'ALL' ||
    countryParam !== 'ALL' || 
    locationParam || 
    typologiesParam.length > 0 || 
    amenitiesParam.length > 0 || 
    budgetParam;

  // Filter suggestions matching input
  const filteredSuggestions = useMemo(() => {
    if (!locationInput || !locationInput.trim()) return LOCATION_SUGGESTIONS;
    const q = locationInput.toLowerCase().trim();
    return LOCATION_SUGGESTIONS.filter(item => 
      item.label.toLowerCase().includes(q) ||
      item.city.toLowerCase().includes(q) ||
      item.country.toLowerCase().includes(q) ||
      item.zip.toLowerCase().includes(q)
    );
  }, [locationInput]);

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: 'calc(100vh - var(--header-height))', margin: 0, padding: 0 }}>
      
      {/* Sub-Header / Filters Bar — Positioned directly beneath navbar with zero gap */}
      <div 
        className="serp-filter-bar"
        style={{
          backgroundColor: 'var(--surface-white)',
          borderBottom: '1px solid var(--border-color)',
          padding: '12px 24px',
          position: 'sticky',
          top: '0',
          zIndex: 100,
          margin: 0
        }}
      >
        <div className="serp-filters-row">
          
          {/* Left Group: Search Bar + Projet + Type de bien + Pays */}
          <div className="serp-filters-left">
            
            {/* Search Input with Auto-Suggestions (Ville, Quartier, Code Postal) */}
            <div className="serp-search-box" ref={searchBoxRef}>
              <Search size={15} className="serp-search-icon" />
              <input
                type="text"
                placeholder="Ville, quartier, code postal..."
                value={locationInput}
                onChange={(e) => {
                  setLocationInput(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleSearchKeyDown}
                className="serp-search-input"
              />
              {locationInput && (
                <button
                  type="button"
                  onClick={() => handleSelectLocation('')}
                  className="serp-search-clear"
                  title="Effacer la recherche"
                >
                  <X size={13} />
                </button>
              )}

              {/* Auto-suggestions dropdown */}
              {showSuggestions && (
                <div className="serp-suggestions-dropdown">
                  {locationInput.trim() && (
                    <div 
                      className="serp-suggestion-item serp-suggestion-direct"
                      onClick={() => handleSelectLocation(locationInput)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Search size={13} color="var(--primary-red)" />
                        <span>Rechercher <strong>"{locationInput}"</strong></span>
                      </div>
                      <span className="serp-suggestion-tag">Saisie libre</span>
                    </div>
                  )}

                  {filteredSuggestions.map((item, idx) => (
                    <div
                      key={idx}
                      className={`serp-suggestion-item ${locationParam === item.value ? 'active' : ''}`}
                      onClick={() => handleSelectLocation(item.value)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin size={13} color="var(--graphite-gray)" />
                        <span>{item.label}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="serp-suggestion-tag">{item.zip}</span>
                        <span className="serp-suggestion-tag">{item.country}</span>
                      </div>
                    </div>
                  ))}

                  {filteredSuggestions.length === 0 && !locationInput.trim() && (
                    <div style={{ padding: '12px 16px', fontSize: '0.8125rem', color: 'var(--graphite-gray)', textAlign: 'center' }}>
                      Aucune suggestion
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Projet : Vente / Location */}
            <select
              value={typeParam}
              onChange={handleTypeChange}
              className={`serp-select serp-filter-desktop-only ${typeParam !== 'ALL' ? 'active-filter' : ''}`}
              title="Projet : Louer ou Acheter"
            >
              <option value="ALL">Transaction</option>
              <option value="LOCATION">Location</option>
              <option value="VENTE">Vente</option>
            </select>

            {/* Type de bien : Maison, Appartement, Penthouse, etc. */}
            <select
              value={propertyTypeParam}
              onChange={handlePropertyTypeChange}
              className={`serp-select serp-filter-desktop-only ${propertyTypeParam !== 'ALL' ? 'active-filter' : ''}`}
              title="Type de bien"
            >
              <option value="ALL">Type de Maison</option>
              <option value="villa">Maison et Villa</option>
              <option value="appartement">Appartement</option>
              <option value="penthouse">Penthouse</option>
              <option value="residence">Résidence sécurisée</option>
            </select>

            {/* Country Filter */}
            <select
              value={countryParam}
              onChange={handleCountryChange}
              className={`serp-select serp-filter-desktop-only ${countryParam !== 'ALL' ? 'active-filter' : ''}`}
              title="Filtrer par pays"
            >
              <option value="ALL">Pays : Tous</option>
              <option value="Côte d'Ivoire">Côte d'Ivoire</option>
              <option value="RDC">RDC</option>
              <option value="Congo">Congo</option>
            </select>

            {/* Mobile Filter Toggle Button */}
            <button
              type="button"
              className={`serp-mobile-filter-btn ${activeCriteriaCount > 0 ? 'has-active' : ''} ${isMobileFiltersOpen ? 'open' : ''}`}
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              aria-expanded={isMobileFiltersOpen}
              title="Filtrer les annonces"
            >
              <SlidersHorizontal size={15} />
              <span>Filtres</span>
              {activeCriteriaCount > 0 && (
                <span className="serp-filter-badge">{activeCriteriaCount}</span>
              )}
            </button>

          </div>

          {/* Right Group: Results Count + Sort Dropdown + Map Toggle */}
          <div className="serp-filters-right">
            
            {/* Results Count */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.05rem', color: 'var(--obsidian-black)' }}>
                {filteredProperties.length}
              </span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--graphite-gray)', fontWeight: 600 }}>
                {filteredProperties.length > 1 ? 'biens' : 'bien'}
              </span>
            </div>

            <span style={{ color: 'var(--border-color)', margin: '0 4px' }}>|</span>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="serp-control-label">Trier :</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="serp-select"
                style={{ paddingRight: '28px' }}
              >
                <option value="recommandes">Recommandés</option>
                <option value="prix-asc">Prix croissant</option>
                <option value="prix-desc">Prix décroissant</option>
                <option value="nouveautes">Nouveautés</option>
              </select>
            </div>

            {/* Map Toggle Button */}
            <button 
              type="button"
              onClick={() => {
                if (isMapExpanded) setIsMapExpanded(false);
                setShowMap(!showMap);
              }}
              className={`serp-map-toggle ${showMap ? 'active' : ''}`}
            >
              {showMap ? <EyeOff size={15} /> : <Map size={15} />}
              <span>{showMap ? 'Masquer carte' : 'Afficher carte'}</span>
            </button>

          </div>
        </div>

        {/* Mobile Collapsible Filters Accordion Drawer */}
        {isMobileFiltersOpen && (
          <div className="serp-mobile-filters-drawer">
            <div className="serp-drawer-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SlidersHorizontal size={14} color="var(--obsidian-black)" />
                <span className="serp-drawer-title">Critères de recherche</span>
                {activeCriteriaCount > 0 && (
                  <span className="serp-drawer-badge">
                    {activeCriteriaCount} actif{activeCriteriaCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              {activeCriteriaCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete('type');
                    newParams.delete('propertyType');
                    newParams.delete('country');
                    setSearchParams(newParams);
                  }}
                  className="serp-drawer-reset-btn"
                >
                  <RotateCcw size={12} />
                  <span>Réinitialiser</span>
                </button>
              )}
            </div>

            <div className="serp-drawer-body">
              {/* 1. Transaction (Acheter / Louer / Tous) */}
              <div className="serp-drawer-field">
                <label className="serp-drawer-label">Projet / Transaction</label>
                <div className="serp-drawer-segmented">
                  <button
                    type="button"
                    className={`serp-seg-btn ${typeParam === 'ALL' ? 'active' : ''}`}
                    onClick={() => {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.delete('type');
                      setSearchParams(newParams);
                    }}
                  >
                    Tous
                  </button>
                  <button
                    type="button"
                    className={`serp-seg-btn ${typeParam === 'VENTE' ? 'active' : ''}`}
                    onClick={() => {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.set('type', 'VENTE');
                      setSearchParams(newParams);
                    }}
                  >
                    Acheter
                  </button>
                  <button
                    type="button"
                    className={`serp-seg-btn ${typeParam === 'LOCATION' ? 'active' : ''}`}
                    onClick={() => {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.set('type', 'LOCATION');
                      setSearchParams(newParams);
                    }}
                  >
                    Louer
                  </button>
                </div>
              </div>

              {/* 2. Type de bien */}
              <div className="serp-drawer-field">
                <label className="serp-drawer-label" htmlFor="mobile-filter-property-type">Type de bien</label>
                <select
                  id="mobile-filter-property-type"
                  value={propertyTypeParam}
                  onChange={handlePropertyTypeChange}
                  className="serp-drawer-select"
                >
                  <option value="ALL">Tous les types de biens</option>
                  <option value="villa">Maison et Villa</option>
                  <option value="appartement">Appartement</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="residence">Résidence sécurisée</option>
                </select>
              </div>

              {/* 3. Pays */}
              <div className="serp-drawer-field">
                <label className="serp-drawer-label" htmlFor="mobile-filter-country">Pays</label>
                <select
                  id="mobile-filter-country"
                  value={countryParam}
                  onChange={handleCountryChange}
                  className="serp-drawer-select"
                >
                  <option value="ALL">Tous les pays</option>
                  <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                  <option value="RDC">RDC</option>
                  <option value="Congo">Congo</option>
                </select>
              </div>
            </div>

            {/* Drawer Footer: Voir les biens / Replier */}
            <div className="serp-drawer-footer">
              <button
                type="button"
                className="serp-drawer-apply-btn"
                onClick={() => setIsMobileFiltersOpen(false)}
              >
                <span>Afficher les {filteredProperties.length} bien{filteredProperties.length > 1 ? 's' : ''}</span>
              </button>
            </div>
          </div>
        )}

        {/* Active Filter Pills Row */}
        {hasActiveFilters && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--graphite-gray)', textTransform: 'uppercase' }}>Filtres actifs :</span>
            
            {typeParam !== 'ALL' && (
              <span className="filter-chip">
                <span>Projet : {typeParam === 'LOCATION' ? 'À Louer' : 'À Vendre'}</span>
                <button onClick={() => removeFilter('type')} title="Supprimer"><X size={12} /></button>
              </span>
            )}

            {propertyTypeParam !== 'ALL' && (
              <span className="filter-chip">
                <span>
                  Type : {
                    propertyTypeParam === 'villa' ? 'Maison et Villa' :
                    propertyTypeParam === 'appartement' ? 'Appartement' :
                    propertyTypeParam === 'penthouse' ? 'Penthouse' :
                    propertyTypeParam === 'residence' ? 'Résidence sécurisée' : propertyTypeParam
                  }
                </span>
                <button onClick={() => removeFilter('propertyType')} title="Supprimer"><X size={12} /></button>
              </span>
            )}

            {countryParam !== 'ALL' && (
              <span className="filter-chip">
                <span>Pays : {countryParam}</span>
                <button onClick={() => removeFilter('country')} title="Supprimer"><X size={12} /></button>
              </span>
            )}

            {locationParam && (
              <span className="filter-chip">
                <span>Lieu : {locationParam}</span>
                <button onClick={() => removeFilter('location')} title="Supprimer"><X size={12} /></button>
              </span>
            )}

            {typologiesParam.map(t => (
              <span key={t} className="filter-chip">
                <span>{t}</span>
                <button onClick={() => removeFilter('typologies', t)} title="Supprimer"><X size={12} /></button>
              </span>
            ))}

            {amenitiesParam.map(a => (
              <span key={a} className="filter-chip">
                <span>{a}</span>
                <button onClick={() => removeFilter('amenities', a)} title="Supprimer"><X size={12} /></button>
              </span>
            ))}

            {budgetParam && (
              <span className="filter-chip">
                <span>Budget &lt; {formatPrice(budgetParam, Math.round(budgetParam/600), budgetParam)}</span>
                <button onClick={() => removeFilter('budget')} title="Supprimer"><X size={12} /></button>
              </span>
            )}

            <button
              onClick={clearAllFilters}
              style={{
                fontSize: '0.75rem',
                color: 'var(--primary-red)',
                fontWeight: 700,
                textDecoration: 'underline',
                marginLeft: '6px',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Tout réinitialiser
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area: Split View or Full Screen Map */}
      <div 
        className="serp-split-container"
        style={{
          display: 'grid',
          gridTemplateColumns: !showMap 
            ? '1fr' 
            : isMapExpanded 
              ? '1fr' 
              : '55% 45%',
          minHeight: 'calc(100vh - var(--header-height) - 62px)',
          position: 'relative',
          transition: 'grid-template-columns 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Left Pane: Grid of Properties (rendered if NOT isMapExpanded) */}
        {!isMapExpanded && (
          <div 
            className={`serp-results-pane ${mobileTab === 'map' ? 'mobile-hidden' : ''}`}
            style={{
              padding: '24px',
              overflowY: 'auto',
              maxHeight: 'calc(100vh - var(--header-height) - 62px)',
              width: '100%'
            }}
          >
            {filteredProperties.length === 0 ? (
              <div 
                style={{
                  textAlign: 'center',
                  padding: '64px 20px',
                  backgroundColor: 'var(--surface-white)',
                  borderRadius: 'var(--radius-card)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <ShieldCheck size={48} color="var(--graphite-gray)" style={{ margin: '0 auto 16px auto', opacity: 0.5 }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
                  Aucun bien ne correspond à vos critères
                </h3>
                <p style={{ color: 'var(--graphite-gray)', fontSize: '0.875rem', marginBottom: '20px' }}>
                  Essayez d'élargir votre zone géographique ou de retirer certains filtres.
                </p>
                <button onClick={clearAllFilters} className="btn-primary">
                  Afficher toutes les propriétés
                </button>
              </div>
            ) : (
              <div 
                className="serp-cards-container"
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(auto-fill, minmax(${showMap ? '280px' : '310px'}, 1fr))`,
                  gap: '20px'
                }}
              >
                {filteredProperties.map((prop) => (
                  <PropertyCard 
                    key={prop.id} 
                    property={prop}
                    onHover={(id) => setHoveredPropertyId(id)}
                    isHighlighted={hoveredPropertyId === prop.id}
                    layout="grid"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Right Pane: Map (conditionally shown) */}
        {showMap && (
          <div 
            className={`serp-map-pane ${isMapExpanded ? 'expanded' : ''} ${mobileTab === 'list' ? 'mobile-hidden' : ''}`}
            style={{
              position: 'sticky',
              top: 'calc(var(--header-height) + 62px)',
              height: 'calc(100vh - var(--header-height) - 62px)',
              borderLeft: isMapExpanded ? 'none' : '1px solid var(--border-color)',
              overflow: 'hidden',
              width: '100%'
            }}
          >
            {/* Expand / Collapse Chevron Button (matching sample1.png) */}
            <button
              type="button"
              className={`map-expand-btn ${isMapExpanded ? 'expanded' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsMapExpanded(!isMapExpanded);
              }}
              title={isMapExpanded ? "Restaurer la liste des annonces" : "Étendre la carte en plein écran"}
            >
              {isMapExpanded ? (
                <>
                  <ChevronRight size={18} />
                  <span className="map-expand-text">Afficher la liste</span>
                </>
              ) : (
                <ChevronLeft size={18} />
              )}
            </button>

            <MapPane 
              properties={filteredProperties} 
              hoveredPropertyId={hoveredPropertyId}
              isVisible={showMap && (mobileTab === 'map' || isMapExpanded)}
            />
          </div>
        )}

      </div>

      {/* Floating mobile toggle button */}
      <div className="serp-mobile-floating-switch">
        <button
          onClick={() => setMobileTab(mobileTab === 'list' ? 'map' : 'list')}
          className="btn-dark"
          style={{
            borderRadius: 'var(--radius-pill)',
            padding: '10px 20px',
            fontSize: '0.875rem',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {mobileTab === 'list' ? (
            <>
              <Map size={16} />
              <span>Afficher la carte</span>
            </>
          ) : (
            <>
              <ShieldCheck size={16} />
              <span>Afficher la liste</span>
            </>
          )}
        </button>
      </div>

      <style>{`
        /* ===== STICKY FILTER BAR ===== */
        .serp-filter-bar {
          transition: box-shadow 0.2s;
        }

        .serp-filters-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .serp-filters-left {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          flex: 1;
          min-width: 300px;
        }

        .serp-filters-right {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        /* Search input with suggestions */
        .serp-search-box {
          position: relative;
          min-width: 220px;
          max-width: 320px;
          flex: 1;
        }
        .serp-search-input {
          width: 100%;
          height: 40px;
          padding: 0 32px 0 38px;
          border-radius: var(--radius-pill);
          border: 1px solid var(--border-color);
          background: var(--surface-white);
          font-size: 0.8125rem;
          font-family: inherit;
          font-weight: 500;
          outline: none;
          transition: all 0.2s;
        }
        .serp-search-input:focus {
          border-color: var(--obsidian-black);
          box-shadow: 0 0 0 2px rgba(10, 10, 10, 0.08);
        }
        .serp-search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--graphite-gray);
          pointer-events: none;
        }
        .serp-search-clear {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: var(--graphite-gray);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
        }
        .serp-search-clear:hover {
          color: var(--obsidian-black);
        }

        /* Select dropdowns */
        .serp-select {
          height: 40px;
          padding: 0 32px 0 14px;
          border-radius: var(--radius-pill);
          border: 1px solid var(--border-color);
          background-color: var(--surface-white);
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--obsidian-black);
          outline: none;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%234A4A4A' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          transition: all 0.2s ease;
        }
        .serp-select:hover {
          border-color: var(--obsidian-black);
        }
        .serp-select.active-filter {
          border-color: var(--obsidian-black);
          background-color: #F8F9FA;
          color: var(--obsidian-black, #111111) !important;
          font-weight: 700;
          box-shadow: 0 0 0 1px var(--obsidian-black);
        }

        /* Auto-suggestions Dropdown */
        .serp-suggestions-dropdown {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          right: 0;
          background: #FFFFFF;
          border-radius: 12px;
          border: 1px solid var(--border-color);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
          z-index: 500;
          max-height: 280px;
          overflow-y: auto;
        }
        .serp-suggestion-item {
          padding: 10px 14px;
          font-size: 0.8125rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          transition: background 0.15s;
        }
        .serp-suggestion-item:hover {
          background: #F8F9FA;
        }
        .serp-suggestion-item.active {
          background: #F0F2F5;
          font-weight: 600;
        }
        .serp-suggestion-direct {
          border-bottom: 1px solid var(--border-light);
          background: #FFFDF9;
        }
        .serp-suggestion-tag {
          font-size: 0.6875rem;
          padding: 2px 6px;
          border-radius: 4px;
          background: rgba(0, 0, 0, 0.05);
          color: var(--graphite-gray);
          font-weight: 600;
        }

        /* Chips */
        .filter-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: var(--radius-pill);
          background-color: var(--soft-tint);
          border: 1px solid #FED7D7;
          color: var(--primary-red);
          font-size: 0.75rem;
          font-weight: 700;
        }
        .filter-chip button {
          display: flex;
          align-items: center;
          color: var(--primary-red);
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
        }

        /* SERP Controls */
        .serp-control-label {
          font-size: 0.8125rem;
          color: var(--graphite-gray);
          font-weight: 600;
        }

        /* Map toggle */
        .serp-map-toggle {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          height: 40px;
          border-radius: var(--radius-pill);
          border: 1px solid var(--border-color);
          background: var(--surface-white);
          color: var(--obsidian-black);
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
        }
        .serp-map-toggle.active {
          background: var(--obsidian-black);
          color: #FFF;
          border-color: var(--obsidian-black);
        }

        /* ===== MAP EXPAND / COLLAPSE BUTTON (sample1.png reference) ===== */
        .map-expand-btn {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          z-index: 1500;
          background-color: #FFFFFF;
          border: 1px solid var(--border-color);
          border-left: none;
          border-radius: 0 8px 8px 0;
          width: 26px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.15);
          color: var(--obsidian-black);
          transition: all 0.2s ease;
          padding: 0;
          pointer-events: auto;
        }
        .map-expand-btn:hover {
          background-color: #F8F9FA;
          color: var(--primary-red);
          width: 30px;
          box-shadow: 3px 2px 14px rgba(0, 0, 0, 0.22);
        }
        .map-expand-btn.expanded {
          left: 16px;
          border-left: 1px solid var(--border-color);
          border-radius: var(--radius-pill);
          width: auto;
          height: 42px;
          padding: 0 16px 0 12px;
          gap: 8px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
          background-color: #FFFFFF;
          font-size: 0.8125rem;
          font-weight: 700;
          color: var(--obsidian-black);
        }
        .map-expand-btn.expanded:hover {
          background-color: var(--obsidian-black);
          color: #FFFFFF;
          width: auto;
        }
        .map-expand-text {
          white-space: nowrap;
        }

        .serp-mobile-floating-switch {
          display: none;
        }

        @media (max-width: 960px) {
          .serp-split-container {
            grid-template-columns: 100% !important;
          }
          .serp-map-toggle {
            display: none !important;
          }
          .map-expand-btn {
            display: none !important;
          }
          .serp-results-pane.mobile-hidden {
            display: none !important;
          }
          .serp-map-pane {
            position: relative !important;
            top: 0 !important;
            height: calc(100vh - var(--header-height) - 130px) !important;
            border-left: none !important;
          }
          .serp-map-pane.mobile-hidden {
            display: none !important;
          }
          .serp-mobile-floating-switch {
            display: flex;
            position: fixed;
            bottom: calc(72px + env(safe-area-inset-bottom, 0px));
            left: 50%;
            transform: translateX(-50%);
            z-index: 995;
          }
        }

        /* Mobile filter toggle button (hidden on desktop) */
        .serp-mobile-filter-btn {
          display: none;
          align-items: center;
          gap: 6px;
          height: 40px;
          padding: 0 14px;
          border-radius: var(--radius-pill);
          border: 1px solid var(--border-color);
          background-color: var(--surface-white);
          font-size: 0.8125rem;
          font-weight: 700;
          color: var(--obsidian-black);
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .serp-mobile-filter-btn:hover {
          border-color: var(--obsidian-black);
        }
        .serp-mobile-filter-btn.has-active {
          border-color: var(--primary-red);
          background-color: var(--soft-tint);
          color: var(--primary-red);
        }
        .serp-mobile-filter-btn.open {
          background-color: var(--obsidian-black);
          color: #FFFFFF;
          border-color: var(--obsidian-black);
        }
        .serp-mobile-filter-btn.open .serp-filter-badge {
          background-color: #FFFFFF;
          color: var(--obsidian-black);
        }
        .serp-filter-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: var(--primary-red);
          color: #FFFFFF;
          font-size: 0.6875rem;
          font-weight: 800;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          line-height: 1;
        }

        /* Mobile Collapsible Filters Accordion Drawer */
        .serp-mobile-filters-drawer {
          background: var(--surface-white);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          margin-top: 10px;
          padding: 14px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
          animation: serpDrawerSlideDown 0.2s ease-out;
        }

        @keyframes serpDrawerSlideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .serp-drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 14px;
        }
        .serp-drawer-title {
          font-size: 0.875rem;
          font-weight: 800;
          color: var(--obsidian-black);
        }
        .serp-drawer-badge {
          font-size: 0.6875rem;
          font-weight: 700;
          padding: 2px 8px;
          background-color: var(--soft-tint);
          color: var(--primary-red);
          border-radius: var(--radius-pill);
          border: 1px solid rgba(229, 62, 62, 0.2);
        }
        .serp-drawer-reset-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--primary-red);
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 6px;
        }
        .serp-drawer-reset-btn:hover {
          text-decoration: underline;
        }

        .serp-drawer-body {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .serp-drawer-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .serp-drawer-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--graphite-gray);
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        /* Segmented control for transaction */
        .serp-drawer-segmented {
          display: flex;
          background-color: #F3F4F6;
          padding: 3px;
          border-radius: 10px;
          gap: 3px;
        }
        .serp-seg-btn {
          flex: 1;
          height: 36px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: transparent;
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--graphite-gray);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .serp-seg-btn.active {
          background-color: #FFFFFF;
          color: var(--obsidian-black);
          font-weight: 700;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        /* Selects in drawer */
        .serp-drawer-select {
          width: 100%;
          height: 42px;
          padding: 0 32px 0 14px;
          border-radius: 10px;
          border: 1px solid var(--border-color);
          background-color: var(--surface-white);
          font-size: 0.84rem;
          font-weight: 600;
          color: var(--obsidian-black);
          outline: none;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%234A4A4A' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          transition: border-color 0.15s;
        }
        .serp-drawer-select:focus {
          border-color: var(--obsidian-black);
        }

        .serp-drawer-footer {
          margin-top: 14px;
          padding-top: 12px;
          border-top: 1px solid var(--border-color);
        }
        .serp-drawer-apply-btn {
          width: 100%;
          height: 42px;
          background-color: var(--obsidian-black);
          color: #FFFFFF;
          border: none;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.15s ease;
        }
        .serp-drawer-apply-btn:hover {
          background-color: #222222;
        }

        @media (max-width: 768px) {
          .serp-filter-desktop-only {
            display: none !important;
          }
          .serp-mobile-filter-btn {
            display: inline-flex !important;
          }
          .serp-filter-bar {
            padding: 8px 12px !important;
          }
          .serp-filters-row {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 8px !important;
          }
          .serp-filters-left {
            display: flex !important;
            flex-wrap: nowrap !important;
            align-items: center !important;
            overflow-x: visible !important;
            padding-bottom: 0 !important;
            gap: 8px !important;
            min-width: 0 !important;
            width: 100% !important;
          }
          .serp-search-box {
            min-width: 0 !important;
            max-width: none !important;
            flex: 1 1 auto !important;
          }
          .serp-mobile-filter-btn {
            flex-shrink: 0 !important;
            height: 40px !important;
            padding: 0 12px !important;
            font-size: 0.78rem !important;
          }
          .serp-filters-right {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            width: 100% !important;
            padding-top: 4px !important;
            border-top: 1px solid rgba(0, 0, 0, 0.04) !important;
          }
          .serp-cards-container {
            grid-template-columns: 1fr !important;
            padding: 0 4px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SerpPage;
