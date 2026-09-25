import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Youtube, ArrowRight, Check } from 'lucide-react';
import { useHabitoo } from '../context/HabitooContext';

export const Footer = () => {
  const { openAuthModal } = useHabitoo();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
      }, 3000);
    }
  };

  return (
    <footer 
      id="a-propos"
      style={{
        backgroundColor: '#0F131A',
        color: '#FFFFFF',
        paddingTop: '64px',
        paddingBottom: '32px',
        borderTop: '1px solid #1F2937'
      }}
    >
      <div className="container">
        
        {/* Main 5 Columns Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '36px',
            marginBottom: '48px'
          }}
        >
          {/* Col 1: Brand & Slogan */}
          <div style={{ minWidth: '200px' }}>
            <Link to="/" style={{ display: 'inline-block', marginBottom: '14px' }}>
              <img 
                src="/assets/Code_Generated_Image (1).png" 
                alt="Habitoo" 
                style={{ height: '36px', width: 'auto', objectFit: 'contain' }} 
              />
            </Link>
            <p style={{ color: '#9CA3AF', fontSize: '0.8125rem', lineHeight: 1.5, marginBottom: '18px' }}>
              Des lieux pour aujourd'hui et demain.
            </p>
            
            {/* Social Icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <a 
                href="https://facebook.com" 
                aria-label="Facebook"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D1D5DB',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary-red)'; e.currentTarget.style.color = 'var(--primary-red)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#D1D5DB'; }}
              >
                <Facebook size={15} />
              </a>
              <a 
                href="https://instagram.com" 
                aria-label="Instagram"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D1D5DB',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary-red)'; e.currentTarget.style.color = 'var(--primary-red)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#D1D5DB'; }}
              >
                <Instagram size={15} />
              </a>
              <a 
                href="https://linkedin.com" 
                aria-label="LinkedIn"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D1D5DB',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary-red)'; e.currentTarget.style.color = 'var(--primary-red)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#D1D5DB'; }}
              >
                <Linkedin size={15} />
              </a>
              <a 
                href="https://youtube.com" 
                aria-label="YouTube"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D1D5DB',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary-red)'; e.currentTarget.style.color = 'var(--primary-red)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#D1D5DB'; }}
              >
                <Youtube size={15} />
              </a>
            </div>
          </div>

          {/* Col 2: Particuliers */}
          <div>
            <h5 style={{ color: '#FFFFFF', fontSize: '0.9rem', fontWeight: 700, marginBottom: '14px' }}>
              Particuliers
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem' }}>
              <li>
                <Link to="/recherche?type=VENTE" style={{ color: '#9CA3AF', transition: 'color 0.15s' }} onMouseOver={(e) => e.target.style.color = '#FFF'} onMouseOut={(e) => e.target.style.color = '#9CA3AF'}>
                  Acheter
                </Link>
              </li>
              <li>
                <Link to="/recherche?type=LOCATION" style={{ color: '#9CA3AF', transition: 'color 0.15s' }} onMouseOver={(e) => e.target.style.color = '#FFF'} onMouseOut={(e) => e.target.style.color = '#9CA3AF'}>
                  Louer
                </Link>
              </li>
              <li>
                <Link to="/immobilier-professionnel" style={{ color: '#9CA3AF', transition: 'color 0.15s' }} onMouseOver={(e) => e.target.style.color = '#FFF'} onMouseOut={(e) => e.target.style.color = '#9CA3AF'}>
                  Immobilier professionnel
                </Link>
              </li>
              <li>
                <Link to="/publier" style={{ color: '#9CA3AF', transition: 'color 0.15s' }} onMouseOver={(e) => e.target.style.color = '#FFF'} onMouseOut={(e) => e.target.style.color = '#9CA3AF'}>
                  Vendre
                </Link>
              </li>
              <li>
                <Link to="/conciergerie" style={{ color: '#9CA3AF', transition: 'color 0.15s' }} onMouseOver={(e) => e.target.style.color = '#FFF'} onMouseOut={(e) => e.target.style.color = '#9CA3AF'}>
                  Conciergerie
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Professionnels */}
          <div>
            <h5 style={{ color: '#FFFFFF', fontSize: '0.9rem', fontWeight: 700, marginBottom: '14px' }}>
              Professionnels
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem' }}>
              <li>
                <a href="#/professionnels"  rel="noopener noreferrer" style={{ color: '#9CA3AF', transition: 'color 0.15s' }} onMouseOver={(e) => e.target.style.color = '#FFF'} onMouseOut={(e) => e.target.style.color = '#9CA3AF'}>
                  Nos offres
                </a>
              </li>
              <li>
                <a href="#/professionnels"  rel="noopener noreferrer" style={{ color: '#9CA3AF', transition: 'color 0.15s' }} onMouseOver={(e) => e.target.style.color = '#FFF'} onMouseOut={(e) => e.target.style.color = '#9CA3AF'}>
                  Devenir partenaire
                </a>
              </li>
              <li>
                <button 
                  onClick={openAuthModal} 
                  style={{ color: '#9CA3AF', background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer', textAlign: 'left', transition: 'color 0.15s' }} 
                  onMouseOver={(e) => e.target.style.color = '#FFF'} 
                  onMouseOut={(e) => e.target.style.color = '#9CA3AF'}
                >
                  Espace pro
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: À propos */}
          <div>
            <h5 style={{ color: '#FFFFFF', fontSize: '0.9rem', fontWeight: 700, marginBottom: '14px' }}>
              À propos
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem' }}>
              <li>
                <Link to="/a-propos#mission" style={{ color: '#9CA3AF', transition: 'color 0.15s' }} onMouseOver={(e) => e.target.style.color = '#FFF'} onMouseOut={(e) => e.target.style.color = '#9CA3AF'}>
                  Notre mission
                </Link>
              </li>
              <li>
                <a href="/#contact" style={{ color: '#9CA3AF', transition: 'color 0.15s' }} onMouseOver={(e) => e.target.style.color = '#FFF'} onMouseOut={(e) => e.target.style.color = '#9CA3AF'}>
                  Contact
                </a>
              </li>
              <li>
                <a href="/#faq" style={{ color: '#9CA3AF', transition: 'color 0.15s' }} onMouseOver={(e) => e.target.style.color = '#FFF'} onMouseOut={(e) => e.target.style.color = '#9CA3AF'}>
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Restez informé */}
          <div style={{ minWidth: '220px' }}>
            <h5 style={{ color: '#FFFFFF', fontSize: '0.9rem', fontWeight: 700, marginBottom: '6px' }}>
              Restez informé
            </h5>
            <p style={{ color: '#9CA3AF', fontSize: '0.8125rem', marginBottom: '12px', lineHeight: 1.4 }}>
              Recevez nos dernières annonces et actualités.
            </p>
            
            <form onSubmit={handleSubscribe} style={{ display: 'flex', position: 'relative', width: '100%', maxWidth: '280px' }}>
              <input 
                type="email" 
                placeholder="Votre email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 44px 10px 14px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  backgroundColor: '#FFFFFF',
                  color: '#1A1A1A',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                aria-label="S'inscrire à la newsletter"
                style={{
                  position: 'absolute',
                  right: '3px',
                  top: '3px',
                  bottom: '3px',
                  width: '36px',
                  backgroundColor: 'var(--primary-red)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-red-hover)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-red)'}
              >
                {subscribed ? <Check size={16} /> : <ArrowRight size={16} />}
              </button>
            </form>
            {subscribed && (
              <span style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '6px', display: 'block' }}>
                Merci pour votre inscription !
              </span>
            )}
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div 
          style={{
            paddingTop: '24px',
            borderTop: '1px solid #1F2937',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            fontSize: '0.8125rem',
            color: '#6B7280'
          }}
        >
          <div>
            © 2026 Habitoo. Tous droits réservés.
          </div>
          <div>
            Une nouvelle façon de se loger en Afrique
          </div>
        </div>

      </div>
    </footer>
  );
};
export default Footer;
