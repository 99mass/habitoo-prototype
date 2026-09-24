import React from 'react';
import { Link } from 'react-router-dom';
import { useHabitoo } from '../context/HabitooContext';
import { PRO_CATEGORIES } from '../data/propertiesData';
import { 
  Heart, 
  Bed, 
  Bath, 
  Maximize2, 
  ShieldCheck, 
  MapPin, 
  Calendar,
  CheckCircle2,
  Zap,
  Droplets,
  Briefcase,
  Store,
  Warehouse,
  Users,
  FileText,
  Building2
} from 'lucide-react';

export const PropertyCard = ({ property, onHover = null, isHighlighted = false }) => {
  const { isFavorite, toggleFavorite, formatPrice } = useHabitoo();
  const favorite = isFavorite(property.id);
  const isProListing = property.isPro ?? (property.advertiserType === 'PRO' || (property.agent?.agency && property.agent.agency !== 'Particulier' && property.agent.agency !== 'Direct Propriétaire'));
  const isVente = property.category === 'VENTE';
  const isProDestination = property.destination === 'PRO';
  const proCat = PRO_CATEGORIES.find(c => c.id === property.proCategory);

  return (
    <div
      onMouseEnter={() => onHover && onHover(property.id)}
      onMouseLeave={() => onHover && onHover(null)}
      style={{
        backgroundColor: 'var(--surface-white)',
        borderRadius: 'var(--radius-card)',
        border: isHighlighted ? '2px solid var(--primary-red)' : '1px solid var(--border-color)',
        overflow: 'hidden',
        boxShadow: isHighlighted ? 'var(--shadow-hover)' : 'var(--shadow-sm)',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {/* 16:10 Photo Container */}
      <Link
        to={`/bien/${property.id}`}
        state={{ previewProperty: property }}
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '62.5%', // 16:10 aspect ratio
          overflow: 'hidden',
          backgroundColor: '#E5E7EB',
          display: 'block',
          cursor: 'pointer'
        }}
      >
        <img
          src={property.images[0]}
          alt={property.title}
          loading="lazy"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />

        {/* Badges Overlay */}
        <div 
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            zIndex: 2
          }}
        >
          {/* LOCATION vs VENTE badge */}
          <span 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '4px 10px',
              fontSize: '0.72rem',
              fontWeight: 800,
              borderRadius: '9999px',
              backgroundColor: isVente ? 'var(--primary-red)' : '#111827',
              color: '#FFFFFF',
              boxShadow: isVente 
                ? '0 2px 8px rgba(247, 0, 0, 0.35)' 
                : '0 2px 8px rgba(0, 0, 0, 0.25)',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}
          >
            {isVente ? 'À VENDRE' : 'À LOUER'}
          </span>

          {/* Pro Category Badge */}
          {isProDestination && (
            <span 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 9px',
                fontSize: '0.7rem',
                fontWeight: 800,
                borderRadius: '9999px',
                backgroundColor: '#1E293B',
                color: '#F8FAFC',
                border: '1px solid rgba(255,255,255,0.25)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                letterSpacing: '0.4px',
                textTransform: 'uppercase'
              }}
            >
              <Briefcase size={11} />
              {proCat ? proCat.shortLabel : 'PRO'}
            </span>
          )}

          {/* PRO vs PARTICULIER badge */}
          {isProListing ? (
            <span 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 9px',
                fontSize: '0.7rem',
                fontWeight: 800,
                borderRadius: '9999px',
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                boxShadow: '0 2px 6px rgba(37,99,235,0.3)',
                letterSpacing: '0.4px'
              }}
            >
              <ShieldCheck size={12} strokeWidth={2.5} />
              PRO
            </span>
          ) : (
            <span 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 9px',
                fontSize: '0.7rem',
                fontWeight: 700,
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                color: '#374151',
                boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                letterSpacing: '0.4px',
                border: '1px solid rgba(0,0,0,0.06)'
              }}
            >
              PARTICULIER
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(property.id);
          }}
          className="card-favorite-btn icon-circle-btn"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '36px',
            height: '36px',
            minHeight: 'unset',
            aspectRatio: '1 / 1',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: favorite ? 'var(--primary-red)' : 'var(--obsidian-black)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.14)',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            zIndex: 2,
            transition: 'transform 0.15s ease',
            flexShrink: 0
          }}
          title={favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Heart size={17} fill={favorite ? 'var(--primary-red)' : 'none'} color={favorite ? 'var(--primary-red)' : 'var(--obsidian-black)'} />
        </button>
      </Link>

      {/* Card Content */}
      <div style={{ padding: 'clamp(14px, 3.5vw, 20px)', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between', minWidth: 0, overflow: 'hidden' }}>
        <Link 
          to={`/bien/${property.id}`}
          state={{ previewProperty: property }}
          style={{ display: 'block', width: '100%', textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
        >
        <div>
          {/* Location & Neighborhood */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8125rem', color: 'var(--graphite-gray)', marginBottom: '6px' }}>
            <MapPin size={13} color="var(--primary-red)" />
            <span style={{ fontWeight: 600, color: 'var(--obsidian-black)' }}>{property.neighborhood}</span>
            <span>•</span>
            <span>{property.city}</span>
          </div>

          {/* Title */}
          <h3 
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.125rem',
              fontWeight: 700,
              color: 'var(--obsidian-black)',
              marginBottom: '12px',
              lineHeight: 1.35,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              wordBreak: 'break-word'
            }}
          >
            {property.title}
          </h3>

          {/* Key Specs Row */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(8px, 2vw, 14px)',
              flexWrap: 'wrap',
              padding: '10px 0',
              borderBottom: '1px solid var(--border-light)',
              marginBottom: '16px',
              fontSize: '0.8125rem',
              color: 'var(--graphite-gray)'
            }}
          >
            {isProDestination ? (
              <>
                {/* Surface utile */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Maximize2 size={14} color="var(--obsidian-black)" />
                  <span style={{ fontWeight: 600, color: 'var(--obsidian-black)' }}>{property.specs.area}</span> m²
                </div>

                {/* Specific metric according to pro category */}
                {property.proCategory === 'BUREAU' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Briefcase size={14} color="var(--obsidian-black)" />
                    <span style={{ fontWeight: 600, color: 'var(--obsidian-black)' }}>
                      {property.specs.offices ?? (property.specs.workstations ? `${property.specs.workstations}p.` : 'Bureaux')}
                    </span>
                    {property.specs.offices ? ' bur.' : ''}
                  </div>
                )}

                {property.proCategory === 'COMMERCE' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Store size={14} color="var(--obsidian-black)" />
                    <span>Vitrine <strong style={{ color: 'var(--obsidian-black)' }}>{property.specs.windowDisplay || 'sur rue'}</strong></span>
                  </div>
                )}

                {property.proCategory === 'ENTREPOT' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Warehouse size={14} color="var(--obsidian-black)" />
                    <span style={{ fontWeight: 600, color: 'var(--obsidian-black)' }}>
                      {property.specs.loadingDock ? 'Quai déchargement' : 'Haute charge'}
                    </span>
                  </div>
                )}

                {property.proCategory === 'COWORKING' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={14} color="var(--obsidian-black)" />
                    <span style={{ fontWeight: 600, color: 'var(--obsidian-black)' }}>{property.specs.workstations || 20}</span> postes
                  </div>
                )}

                {(!property.proCategory || (property.proCategory !== 'BUREAU' && property.proCategory !== 'COMMERCE' && property.proCategory !== 'ENTREPOT' && property.proCategory !== 'COWORKING')) && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Building2 size={14} color="var(--obsidian-black)" />
                    <span style={{ fontWeight: 600, color: 'var(--obsidian-black)' }}>{property.specs.offices ? `${property.specs.offices} bur.` : 'Local pro'}</span>
                  </div>
                )}

                {/* Sanitaires */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Bath size={14} color="var(--obsidian-black)" />
                  <span style={{ fontWeight: 600, color: 'var(--obsidian-black)' }}>{property.specs.restrooms ?? property.specs.bathrooms ?? 1}</span> san.
                </div>

                {/* Bail */}
                {property.leaseType && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', backgroundColor: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>
                    <FileText size={11} color="var(--primary-red)" />
                    <span style={{ fontWeight: 600, color: '#334155' }}>{property.leaseType}</span>
                  </div>
                )}
              </>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Bed size={14} color="var(--obsidian-black)" />
                  <span style={{ fontWeight: 600, color: 'var(--obsidian-black)' }}>{property.specs.bedrooms}</span> ch.
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Bath size={14} color="var(--obsidian-black)" />
                  <span style={{ fontWeight: 600, color: 'var(--obsidian-black)' }}>{property.specs.bathrooms}</span> sdb
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Maximize2 size={14} color="var(--obsidian-black)" />
                  <span style={{ fontWeight: 600, color: 'var(--obsidian-black)' }}>{property.specs.area}</span> m²
                </div>
              </>
            )}
          </div>
        </div>
        </Link>

        {/* Price Row */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '4px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--graphite-gray)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '2px' }}>
                {property.category === 'VENTE' ? 'Prix de vente' : 'Loyer mensuel'}
              </span>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--obsidian-black)', letterSpacing: '-0.3px' }}>
                {formatPrice(property.priceXOF, property.priceUSD, property.priceXAF, property.category === 'VENTE' ? '' : property.period)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
