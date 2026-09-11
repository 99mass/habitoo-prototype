import React from 'react';
import { Link } from 'react-router-dom';
import { useHabitoo } from '../context/HabitooContext';
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
  Droplets
} from 'lucide-react';

export const PropertyCard = ({ property, onHover = null, isHighlighted = false }) => {
  const { isFavorite, toggleFavorite, formatPrice } = useHabitoo();
  const favorite = isFavorite(property.id);

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
          {/* LOCATION / VENTE badge */}
          <span 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '4px 10px',
              fontSize: '0.72rem',
              fontWeight: 800,
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              color: 'var(--obsidian-black)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}
          >
            {property.category === 'VENTE' ? 'À VENDRE' : 'À LOUER'}
          </span>

          {/* PRO badge */}
          {(property.isPro || property.agent?.certified) && (
            <span 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                padding: '4px 8px',
                fontSize: '0.72rem',
                fontWeight: 800,
                borderRadius: '9999px',
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                boxShadow: '0 2px 6px rgba(37,99,235,0.25)',
                letterSpacing: '0.5px'
              }}
            >
              <ShieldCheck size={12} />
              PRO
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
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: favorite ? 'var(--primary-red)' : 'var(--obsidian-black)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            zIndex: 2,
            transition: 'transform 0.15s ease'
          }}
          title={favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Heart size={16} fill={favorite ? 'var(--primary-red)' : 'none'} color={favorite ? 'var(--primary-red)' : 'var(--obsidian-black)'} />
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
