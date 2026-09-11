import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { useHabitoo } from '../context/HabitooContext';
import { ExternalLink, X, MapPin, CheckCircle2 } from 'lucide-react';

const isValidLatLng = (coords) => {
  return (
    Array.isArray(coords) &&
    coords.length >= 2 &&
    typeof coords[0] === 'number' &&
    !Number.isNaN(coords[0]) &&
    typeof coords[1] === 'number' &&
    !Number.isNaN(coords[1])
  );
};

const DEFAULT_CENTER = [5.3484, -3.9780]; // Abidjan fallback

export const MapPane = ({ 
  properties = [], 
  hoveredPropertyId = null, 
  onSelectProperty = null,
  isVisible = true 
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const navigate = useNavigate();
  const { activeCity, formatPrice } = useHabitoo();
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Helper to format short price tag (e.g. 3.5M FCFA, $5.8k)
  const formatShortPriceTag = (prop) => {
    if (activeCity.currency === "USD") {
      const usd = prop.priceUSD || Math.round(prop.priceXOF / 600);
      return usd >= 1000000 ? `$${(usd / 1000000).toFixed(1)}M` : `$${(usd / 1000).toFixed(0)}k`;
    }
    const val = activeCity.currency === "XAF" ? (prop.priceXAF || prop.priceXOF) : prop.priceXOF;
    if (val >= 1000000000) {
      return `${(val / 1000000000).toFixed(1)} Mrd`;
    } else if (val >= 1000000) {
      return `${(val / 1000000).toFixed(1)}M FCFA`;
    } else {
      return `${(val / 1000).toFixed(0)}k FCFA`;
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialCenter = isValidLatLng(activeCity?.coords) ? activeCity.coords : DEFAULT_CENTER;

      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      // Add clean monochrome CartoDB Positron tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
      }).addTo(map);

      // Add custom positioned zoom controls
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update center when activeCity changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const targetCoords = isValidLatLng(activeCity?.coords) ? activeCity.coords : DEFAULT_CENTER;

    if (mapContainerRef.current && mapContainerRef.current.clientWidth > 0 && mapContainerRef.current.clientHeight > 0) {
      try {
        map.flyTo(targetCoords, 13, { duration: 1.2 });
      } catch (err) {
        try {
          map.setView(targetCoords, 13);
        } catch (_) {}
      }
    } else {
      try {
        map.setView(targetCoords, 13);
      } catch (_) {}
    }
  }, [activeCity]);

  // Handle container resize & visibility toggle (e.g. mobile list/map switch)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapContainerRef.current) return;

    const handleResize = () => {
      if (mapContainerRef.current && mapContainerRef.current.clientWidth > 0 && mapContainerRef.current.clientHeight > 0) {
        map.invalidateSize();
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    resizeObserver.observe(mapContainerRef.current);

    if (isVisible) {
      setTimeout(handleResize, 50);
      setTimeout(handleResize, 200);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [isVisible]);

  // Render & Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    properties.forEach((prop) => {
      if (!isValidLatLng(prop.coordinates)) return;

      const isHovered = hoveredPropertyId === prop.id;
      const isSelected = selectedProperty?.id === prop.id;
      const priceText = formatShortPriceTag(prop);

      // Create custom HTML Price Tag Marker
      const iconHtml = `
        <div class="custom-price-marker ${isHovered || isSelected ? 'active' : ''}" 
             data-id="${prop.id}"
             style="
               background-color: ${isHovered || isSelected ? '#F70000' : '#1A1A1A'};
               color: #FFFFFF;
               padding: 6px 10px;
               border-radius: 9999px;
               font-family: 'Quicksand', -apple-system, sans-serif;
               font-size: 12px;
               font-weight: 700;
               white-space: nowrap;
               box-shadow: ${isHovered || isSelected ? '0 4px 16px rgba(247,0,0,0.45)' : '0 2px 8px rgba(0,0,0,0.22)'};
               border: 2px solid #FFFFFF;
               cursor: pointer;
               transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
               transform: ${isHovered || isSelected ? 'scale(1.12)' : 'scale(1)'};
               display: flex;
               align-items: center;
               gap: 4px;
             ">
          <span>${priceText}</span>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'habitoo-marker-wrapper',
        iconSize: [80, 32],
        iconAnchor: [40, 16]
      });

      const marker = L.marker(prop.coordinates, { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        setSelectedProperty(prop);
        if (onSelectProperty) onSelectProperty(prop);
        if (isValidLatLng(prop.coordinates)) {
          try {
            map.panTo(prop.coordinates);
          } catch (_) {}
        }
      });

      markersRef.current[prop.id] = marker;
    });

    // Fit bounds only if properties exist with valid coords and map has visible size
    const validCoords = properties
      .filter(p => isValidLatLng(p.coordinates))
      .map(p => p.coordinates);

    if (
      validCoords.length > 0 && 
      mapContainerRef.current && 
      mapContainerRef.current.clientWidth > 0 && 
      mapContainerRef.current.clientHeight > 0
    ) {
      try {
        const bounds = L.latLngBounds(validCoords);
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
        }
      } catch (err) {
        console.warn("Leaflet fitBounds error:", err);
      }
    }
  }, [properties, hoveredPropertyId, selectedProperty, activeCity]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '400px' }}>
      {/* Map Container */}
      <div 
        ref={mapContainerRef} 
        style={{ 
          width: '100%', 
          height: '100%',
          backgroundColor: '#EAEAE8' 
        }} 
      />

      {/* Floating Mini-Preview Card */}
      {selectedProperty && (
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '20px',
            right: '20px',
            maxWidth: '360px',
            backgroundColor: 'var(--surface-white)',
            borderRadius: 'var(--radius-card)',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-color)',
            overflow: 'hidden',
            zIndex: 1000,
            animation: 'scaleUp 0.2s ease-out'
          }}
        >
          <div style={{ position: 'relative', height: '140px' }}>
            <img 
              src={selectedProperty.images[0]} 
              alt={selectedProperty.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <button
              onClick={() => setSelectedProperty(null)}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: 'rgba(26,26,26,0.7)',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <X size={14} />
            </button>
            <div style={{ position: 'absolute', bottom: '8px', left: '8px' }}>
              <span className="badge-tag badge-verified">
                <CheckCircle2 size={10} />
                <span>AUDITÉ HABITOO</span>
              </span>
            </div>
          </div>

          <div style={{ padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--graphite-gray)', marginBottom: '4px' }}>
              <MapPin size={12} color="var(--primary-red)" />
              <span>{selectedProperty.neighborhood}, {selectedProperty.city}</span>
            </div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {selectedProperty.title}
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary-red)' }}>
                {formatPrice(selectedProperty.priceXOF, selectedProperty.priceUSD, selectedProperty.priceXAF, selectedProperty.period)}
              </span>
              <button
                onClick={() => navigate(`/bien/${selectedProperty.id}`)}
                className="btn-primary"
                style={{ padding: '6px 14px', fontSize: '0.75rem' }}
              >
                <span>Fiche</span>
                <ExternalLink size={12} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map Helper Badge */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-pill)',
          padding: '6px 14px',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--obsidian-black)',
          zIndex: 800,
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary-red)' }} />
        <span>{properties.length} biens géolocalisés</span>
      </div>
    </div>
  );
};
