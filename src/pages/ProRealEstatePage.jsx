import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useHabitoo } from '../context/HabitooContext';
import { 
  PROPERTIES_DATA, 
  PRO_CATEGORIES, 
  PRO_LEASE_TYPES,
  PRO_AMENITIES_FILTERS,
  CITIES 
} from '../data/propertiesData';
import { PropertyCard } from '../components/PropertyCard';
import { MapPane } from '../components/MapPane';
import { 
  Building2, 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  RotateCcw, 
  Map as MapIcon, 
  EyeOff, 
  X, 
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Check,
  Briefcase,
  Store,
  Warehouse,
  Users,
  Building,
  FileText
} from 'lucide-react';
import './ProRealEstatePage.css';

export const ProRealEstatePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { activeCity, formatPrice, userProperties = [] } = useHabitoo();

  // URL state synchronization
  const opParam = searchParams.get('type') || searchParams.get('op') || 'ALL'; // "ALL" | "LOCATION" | "VENTE"
  const catParam = searchParams.get('category') || searchParams.get('cat') || 'ALL'; // "ALL" | category ID
  const cityParam = searchParams.get('city') || '';
  const leaseParam = searchParams.get('lease') || 'ALL';
  const locationParam = searchParams.get('location') || '';
  const minAreaParam = searchParams.get('minArea') || '';
  const maxBudgetParam = searchParams.get('maxBudget') || '';
  const amenitiesParam = useMemo(() => searchParams.get('amenities')?.split(',').filter(Boolean) || [], [searchParams]);

  // Local state
  const [sortBy, setSortBy] = useState('recommandes');
  const [hoveredPropertyId, setHoveredPropertyId] = useState(null);
  const [showMap, setShowMap] = useState(true);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [mobileTab, setMobileTab] = useState('list'); // 'list' | 'map'
  
  // Drawer state & draft filters
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const filterBarRef = useRef(null);
  const [draftFilters, setDraftFilters] = useState({
    type: opParam,
    lease: leaseParam,
    city: cityParam,
    minArea: minAreaParam,
    maxBudget: maxBudgetParam,
    amenities: amenitiesParam
  });

  // Multi-select dropdown state for pro amenities
  const [isAmenitiesDropdownOpen, setIsAmenitiesDropdownOpen] = useState(false);
  const amenitiesDropdownRef = useRef(null);

  // Search input state
  const [locationInput, setLocationInput] = useState(locationParam);
  const searchBoxRef = useRef(null);

  useEffect(() => {
    document.title = "Immobilier professionnel - Habitoo";
  }, []);

  useEffect(() => {
    setLocationInput(locationParam);
  }, [locationParam]);

  // Keep draftFilters synchronized with URL parameters
  useEffect(() => {
    setDraftFilters({
      type: opParam,
      lease: leaseParam,
      city: cityParam,
      minArea: minAreaParam,
      maxBudget: maxBudgetParam,
      amenities: [...amenitiesParam]
    });
  }, [opParam, leaseParam, cityParam, minAreaParam, maxBudgetParam, amenitiesParam]);

  // Outside click listener for the integrated filter drawer
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterBarRef.current && !filterBarRef.current.contains(e.target)) {
        setIsFilterDropdownOpen(false);
        setIsAmenitiesDropdownOpen(false);
      }
    };
    if (isFilterDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterDropdownOpen]);

  // Outside click listener specifically for amenities dropdown inside the drawer
  useEffect(() => {
    const handleClickOutsideAmenities = (e) => {
      if (amenitiesDropdownRef.current && !amenitiesDropdownRef.current.contains(e.target)) {
        setIsAmenitiesDropdownOpen(false);
      }
    };
    if (isAmenitiesDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutsideAmenities);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideAmenities);
    };
  }, [isAmenitiesDropdownOpen]);

  // Toggle Drawer and re-sync draft state from URL
  const handleToggleDrawer = () => {
    if (!isFilterDropdownOpen) {
      setDraftFilters({
        type: opParam,
        lease: leaseParam,
        city: cityParam,
        minArea: minAreaParam,
        maxBudget: maxBudgetParam,
        amenities: [...amenitiesParam]
      });
    } else {
      setIsAmenitiesDropdownOpen(false);
    }
    setIsFilterDropdownOpen(prev => !prev);
  };

  // Apply filters from popover to URL
  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams);
    if (draftFilters.type && draftFilters.type !== 'ALL') params.set('type', draftFilters.type);
    else params.delete('type');

    if (draftFilters.lease && draftFilters.lease !== 'ALL') params.set('lease', draftFilters.lease);
    else params.delete('lease');

    if (draftFilters.city) params.set('city', draftFilters.city);
    else params.delete('city');

    if (draftFilters.minArea) params.set('minArea', draftFilters.minArea);
    else params.delete('minArea');

    if (draftFilters.maxBudget) params.set('maxBudget', draftFilters.maxBudget);
    else params.delete('maxBudget');

    if (draftFilters.amenities && draftFilters.amenities.length > 0) {
      params.set('amenities', draftFilters.amenities.join(','));
    } else {
      params.delete('amenities');
    }

    setSearchParams(params);
    setIsFilterDropdownOpen(false);
  };

  // Reset filters inside popover
  const handleResetFilters = () => {
    setDraftFilters({
      type: 'ALL',
      lease: 'ALL',
      city: '',
      minArea: '',
      maxBudget: '',
      amenities: []
    });
  };

  // Combine static and user-deposited pro properties
  const allProProperties = useMemo(() => {
    const userPro = (userProperties || []).filter(p => p.destination === 'PRO');
    const staticPro = PROPERTIES_DATA.filter(p => p.destination === 'PRO');
    return [...userPro, ...staticPro];
  }, [userProperties]);

  // Secondary active filters count for the "Filtres" button badge
  const secondaryActiveCount = useMemo(() => {
    let count = 0;
    if (opParam !== 'ALL') count++;
    if (leaseParam !== 'ALL') count++;
    if (cityParam) count++;
    if (minAreaParam) count++;
    if (maxBudgetParam) count++;
    if (amenitiesParam.length > 0) count += amenitiesParam.length;
    return count;
  }, [opParam, leaseParam, cityParam, minAreaParam, maxBudgetParam, amenitiesParam]);

  // Filter properties
  const filteredProperties = useMemo(() => {
    return allProProperties.filter(prop => {
      // 1. Transaction type (LOCATION vs VENTE)
      if (opParam !== 'ALL' && prop.category !== opParam) {
        return false;
      }

      // 2. Pro Category
      if (catParam !== 'ALL' && prop.proCategory !== catParam) {
        return false;
      }

      // 3. Lease type
      if (leaseParam !== 'ALL' && prop.leaseType !== leaseParam) {
        return false;
      }

      // 4. City filter
      if (cityParam && prop.city.toLowerCase() !== cityParam.toLowerCase()) {
        return false;
      }

      // 5. Min surface utile
      if (minAreaParam && (prop.specs?.area || 0) < Number(minAreaParam)) {
        return false;
      }

      // 6. Max budget
      if (maxBudgetParam) {
        const propPrice = activeCity?.currency === 'USD'
          ? (prop.priceUSD || Math.round((prop.priceXOF || 0) / 600))
          : (prop.priceXOF || prop.priceXAF || 0);
        if (propPrice > Number(maxBudgetParam)) {
          return false;
        }
      }

      // 7. Amenities
      if (amenitiesParam.length > 0) {
        const propAmenities = prop.amenities || [];
        const matchesAll = amenitiesParam.every(a => 
          propAmenities.some(pa => pa.toLowerCase().includes(a.toLowerCase()))
        );
        if (!matchesAll) return false;
      }

      // 8. Search query (keyword / neighborhood / address / city)
      if (locationParam) {
        const q = locationParam.toLowerCase().trim();
        const matches = 
          (prop.city && prop.city.toLowerCase().includes(q)) ||
          (prop.neighborhood && prop.neighborhood.toLowerCase().includes(q)) ||
          (prop.title && prop.title.toLowerCase().includes(q)) ||
          (prop.address && prop.address.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'prix-asc') {
        const priceA = a.priceXOF || a.priceUSD || a.priceXAF || 0;
        const priceB = b.priceXOF || b.priceUSD || b.priceXAF || 0;
        return priceA - priceB;
      }
      if (sortBy === 'prix-desc') {
        const priceA = a.priceXOF || a.priceUSD || a.priceXAF || 0;
        const priceB = b.priceXOF || b.priceUSD || b.priceXAF || 0;
        return priceB - priceA;
      }
      if (sortBy === 'surface-desc') {
        const areaA = a.specs?.area || 0;
        const areaB = b.specs?.area || 0;
        return areaB - areaA;
      }
      return 0;
    });
  }, [allProProperties, opParam, catParam, leaseParam, cityParam, minAreaParam, maxBudgetParam, amenitiesParam, locationParam, sortBy, activeCity]);

  // Handle direct filter changes
  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (!value || value === 'ALL') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    setSearchParams(params);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      updateFilter('location', locationInput.trim());
    }
  };

  const clearAllFilters = () => {
    setLocationInput('');
    setSearchParams({});
    setSortBy('recommandes');
  };

  // Trigger Leaflet resize on expand / collapse
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 120);
    return () => clearTimeout(timer);
  }, [isMapExpanded, showMap]);

  return (
    <div className="pro-serp-page">
      
      {/* 1. Hero Header with Background Image & Mineral Dark Overlay */}
      <header className="pro-hero-header">
        <div className="pro-hero-bg-overlay"></div>
        <div className="pro-hero-container">
          

          {/* Title and Tag */}
          <div className="pro-hero-content">
            <h1 className="pro-hero-title">
              Immobilier professionnel
            </h1>
            <p className="pro-hero-subtitle">
              Bureaux, commerces, locaux d'activité, entrepôts sécurisés et espaces partagés à Abidjan, Kinshasa et Brazzaville.
            </p>
          </div>

        </div>
      </header>

      {/* 2. Sub-Header / Sticky Filter Bar (Identical layout to /recherche) */}
      <div className="serp-filter-bar pro-filter-bar" ref={filterBarRef}>
        <div className="serp-filters-row">
          
          {/* Left Group: Search Bar + Catégorie pro en direct + Bouton Filtres (avec Popover) */}
          <div className="serp-filters-left">
            
            {/* Search Input */}
            <div className="serp-search-box" ref={searchBoxRef}>
              <Search size={15} className="serp-search-icon" />
              <input
                type="text"
                placeholder="Ville, quartier, zone d'activité..."
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="serp-search-input"
              />
              {locationInput && (
                <button
                  type="button"
                  onClick={() => {
                    setLocationInput('');
                    updateFilter('location', '');
                  }}
                  className="serp-search-clear"
                  title="Effacer la recherche"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Catégorie Pro (Directement accessible) */}
            <select
              value={catParam}
              onChange={(e) => updateFilter('category', e.target.value)}
              className={`serp-select ${catParam !== 'ALL' ? 'active-filter' : ''}`}
              title="Catégorie professionnelle"
            >
              <option value="ALL">Toutes catégories pro</option>
              {PRO_CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>

            {/* Bouton Accordéon « Filtres » */}
            <button
              type="button"
              className={`pro-filter-btn ${secondaryActiveCount > 0 ? 'has-active' : ''} ${isFilterDropdownOpen ? 'open' : ''}`}
              onClick={handleToggleDrawer}
              aria-expanded={isFilterDropdownOpen}
              title="Filtres avancés"
            >
              <SlidersHorizontal size={14} />
              <span>Filtres</span>
              {secondaryActiveCount > 0 && (
                <span className="pro-filter-btn-badge">{secondaryActiveCount}</span>
              )}
              {isFilterDropdownOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
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
                {filteredProperties.length > 1 ? 'biens pro' : 'bien pro'}
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
                <option value="surface-desc">Surface décroissante</option>
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
              {showMap ? <EyeOff size={15} /> : <MapIcon size={15} />}
              <span>{showMap ? 'Masquer carte' : 'Afficher carte'}</span>
            </button>

          </div>
        </div>

        {/* Volet Tiroir Intégré Pleine Largeur (Drawer accordéon sous la barre) */}
        {isFilterDropdownOpen && (
          <div className="pro-filters-drawer">
            <div className="pro-filters-drawer-inner">
              
              {/* En-tête du volet tiroir */}
              <div className="pro-drawer-header">
                <div className="pro-drawer-header-left">
                  <SlidersHorizontal size={16} className="pro-drawer-header-icon" />
                  <h3 className="pro-drawer-title">Critères de recherche avancés</h3>
                  {secondaryActiveCount > 0 && (
                    <span className="pro-drawer-count-badge">
                      {secondaryActiveCount} critère{secondaryActiveCount > 1 ? 's' : ''} actif{secondaryActiveCount > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <button 
                  type="button" 
                  className="pro-drawer-close" 
                  onClick={() => setIsFilterDropdownOpen(false)}
                  title="Fermer le volet"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Grille des critères avancés (3 colonnes équilibrées) */}
              <div className="pro-drawer-grid">
                
                {/* 1. Transaction */}
                <div className="pro-drawer-group">
                  <label className="pro-drawer-label">Transaction</label>
                  <div className="pro-segmented-btns">
                    <button
                      type="button"
                      className={`pro-segmented-btn ${draftFilters.type === 'ALL' ? 'active' : ''}`}
                      onClick={() => setDraftFilters(prev => ({ ...prev, type: 'ALL' }))}
                    >
                      Tout
                    </button>
                    <button
                      type="button"
                      className={`pro-segmented-btn ${draftFilters.type === 'LOCATION' ? 'active' : ''}`}
                      onClick={() => setDraftFilters(prev => ({ ...prev, type: 'LOCATION' }))}
                    >
                      À Louer
                    </button>
                    <button
                      type="button"
                      className={`pro-segmented-btn ${draftFilters.type === 'VENTE' ? 'active' : ''}`}
                      onClick={() => setDraftFilters(prev => ({ ...prev, type: 'VENTE' }))}
                    >
                      À Vendre
                    </button>
                  </div>
                </div>

                {/* 2. Ville */}
                <div className="pro-drawer-group">
                  <label className="pro-drawer-label">Ville</label>
                  <select
                    className="pro-drawer-select"
                    value={draftFilters.city}
                    onChange={(e) => setDraftFilters(prev => ({ ...prev, city: e.target.value }))}
                  >
                    <option value="">Toutes les villes</option>
                    <option value="Abidjan">Abidjan</option>
                    <option value="Kinshasa">Kinshasa</option>
                    <option value="Brazzaville">Brazzaville</option>
                  </select>
                </div>

                {/* 3. Type de bail contractuel */}
                <div className="pro-drawer-group">
                  <label className="pro-drawer-label">Type de bail</label>
                  <select
                    className="pro-drawer-select"
                    value={draftFilters.lease}
                    onChange={(e) => setDraftFilters(prev => ({ ...prev, lease: e.target.value }))}
                  >
                    <option value="ALL">Tous les baux</option>
                    {PRO_LEASE_TYPES.map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>

                {/* 4. Superficie min */}
                <div className="pro-drawer-group">
                  <label className="pro-drawer-label">Superficie min (m²)</label>
                  <select
                    className="pro-drawer-select"
                    value={draftFilters.minArea}
                    onChange={(e) => setDraftFilters(prev => ({ ...prev, minArea: e.target.value }))}
                  >
                    <option value="">Toute surface</option>
                    <option value="50">Dès 50 m²</option>
                    <option value="100">Dès 100 m²</option>
                    <option value="200">Dès 200 m²</option>
                    <option value="500">Dès 500 m²</option>
                    <option value="1000">Dès 1 000 m²</option>
                  </select>
                </div>

                {/* 5. Budget max */}
                <div className="pro-drawer-group">
                  <label className="pro-drawer-label">
                    Budget max ({activeCity?.currency === 'USD' ? '$' : 'FCFA'})
                  </label>
                  <select
                    className="pro-drawer-select"
                    value={draftFilters.maxBudget}
                    onChange={(e) => setDraftFilters(prev => ({ ...prev, maxBudget: e.target.value }))}
                  >
                    <option value="">Pas de limite</option>
                    {activeCity?.currency === 'USD' ? (
                      <>
                        <option value="2000">Jusqu'à $ 2 000</option>
                        <option value="5000">Jusqu'à $ 5 000</option>
                        <option value="10000">Jusqu'à $ 10 000</option>
                        <option value="20000">Jusqu'à $ 20 000</option>
                      </>
                    ) : (
                      <>
                        <option value="1500000">Jusqu'à 1,5M FCFA</option>
                        <option value="3000000">Jusqu'à 3M FCFA</option>
                        <option value="5000000">Jusqu'à 5M FCFA</option>
                        <option value="10000000">Jusqu'à 10M FCFA</option>
                      </>
                    )}
                  </select>
                </div>

                {/* 6. Prestations & Commodités pro (Dropdown Multi-Select) */}
                <div className="pro-drawer-group" ref={amenitiesDropdownRef}>
                  <label className="pro-drawer-label">
                    Prestations & Commodités
                    {draftFilters.amenities.length > 0 && (
                      <span className="pro-amenities-counter">({draftFilters.amenities.length})</span>
                    )}
                  </label>
                  
                  <div className="pro-multi-select-container">
                    <button
                      type="button"
                      className={`pro-multi-select-trigger ${isAmenitiesDropdownOpen ? 'open' : ''} ${draftFilters.amenities.length > 0 ? 'has-values' : ''}`}
                      onClick={() => setIsAmenitiesDropdownOpen(prev => !prev)}
                      aria-expanded={isAmenitiesDropdownOpen}
                    >
                      <div className="pro-multi-select-value">
                        {draftFilters.amenities.length === 0 ? (
                          <span className="pro-multi-select-placeholder">Choisir des commodités...</span>
                        ) : (
                          <span className="pro-multi-select-summary">
                            {draftFilters.amenities.length === 1 
                              ? draftFilters.amenities[0] 
                              : `${draftFilters.amenities.length} prestations sélectionnées`}
                          </span>
                        )}
                      </div>

                      <div className="pro-multi-select-actions">
                        {draftFilters.amenities.length > 0 && (
                          <span
                            role="button"
                            className="pro-multi-select-clear-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDraftFilters(prev => ({ ...prev, amenities: [] }));
                            }}
                            title="Effacer les prestations"
                          >
                            <X size={12} />
                          </span>
                        )}
                        <ChevronDown size={14} className={`pro-multi-select-arrow ${isAmenitiesDropdownOpen ? 'rotated' : ''}`} />
                      </div>
                    </button>

                    {/* Popover Menu des options du Multi-Select */}
                    {isAmenitiesDropdownOpen && (
                      <div className="pro-multi-select-dropdown">
                        <div className="pro-multi-select-header">
                          <span className="pro-multi-select-title">Prestations pro ({draftFilters.amenities.length})</span>
                          {draftFilters.amenities.length > 0 && (
                            <button
                              type="button"
                              className="pro-multi-select-reset-link"
                              onClick={() => setDraftFilters(prev => ({ ...prev, amenities: [] }))}
                            >
                              Tout désélectionner
                            </button>
                          )}
                        </div>
                        <div className="pro-multi-select-list">
                          {PRO_AMENITIES_FILTERS.map(amenity => {
                            const isChecked = draftFilters.amenities.includes(amenity);
                            return (
                              <label key={amenity} className={`pro-multi-select-option ${isChecked ? 'selected' : ''}`}>
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setDraftFilters(prev => ({ ...prev, amenities: [...prev.amenities, amenity] }));
                                    } else {
                                      setDraftFilters(prev => ({ ...prev, amenities: prev.amenities.filter(a => a !== amenity) }));
                                    }
                                  }}
                                />
                                <span className="pro-option-text">{amenity}</span>
                                {isChecked && <Check size={14} className="pro-option-check-icon" />}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Badges amovibles sous le sélecteur si prestations choisies */}
                  {draftFilters.amenities.length > 0 && (
                    <div className="pro-selected-tags">
                      {draftFilters.amenities.map(amenity => (
                        <span key={amenity} className="pro-selected-tag">
                          <span>{amenity}</span>
                          <button
                            type="button"
                            onClick={() => setDraftFilters(prev => ({
                              ...prev,
                              amenities: prev.amenities.filter(a => a !== amenity)
                            }))}
                            className="pro-tag-remove"
                            title={`Retirer ${amenity}`}
                          >
                            <X size={11} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Pied d'actions du tiroir */}
              <div className="pro-drawer-footer">
                <button
                  type="button"
                  className="pro-drawer-reset-btn"
                  onClick={handleResetFilters}
                >
                  <RotateCcw size={13} />
                  <span>Réinitialiser les critères</span>
                </button>

                <div className="pro-drawer-footer-right">
                  <button
                    type="button"
                    className="pro-drawer-cancel-btn"
                    onClick={() => setIsFilterDropdownOpen(false)}
                  >
                    Fermer
                  </button>
                  <button
                    type="button"
                    className="pro-drawer-apply-btn"
                    onClick={handleApplyFilters}
                  >
                    Appliquer les filtres
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* 3. Main Content: Split View (Listings 55% / Map 45%) */}
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
        {/* Left Pane: Grid of Property Cards */}
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
                <Building2 size={48} color="var(--graphite-gray)" style={{ margin: '0 auto 16px auto', opacity: 0.5 }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
                  Aucun bien professionnel ne correspond à vos critères
                </h3>
                <p style={{ color: 'var(--graphite-gray)', fontSize: '0.875rem', marginBottom: '20px' }}>
                  Élargissez votre recherche géographique ou retirez certains filtres de catégorie ou de bail.
                </p>
                <button onClick={clearAllFilters} className="btn-primary">
                  Afficher tous les biens professionnels
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
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Right Pane: Sticky MapPane */}
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
            {/* Expand / Collapse Chevron Button */}
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

      {/* 4. Mobile Bottom Floating Tab Toggle (Liste vs Carte) */}
      <div className="serp-mobile-bottom-tabs">
        <button
          type="button"
          className={`serp-mobile-tab-btn ${mobileTab === 'list' ? 'active' : ''}`}
          onClick={() => setMobileTab('list')}
        >
          <Building2 size={16} />
          <span>Liste ({filteredProperties.length})</span>
        </button>
        <button
          type="button"
          className={`serp-mobile-tab-btn ${mobileTab === 'map' ? 'active' : ''}`}
          onClick={() => {
            setShowMap(true);
            setMobileTab('map');
          }}
        >
          <MapIcon size={16} />
          <span>Carte</span>
        </button>
      </div>

    </div>
  );
};
