import React, { useState } from 'react';
import { useHabitoo } from '../context/HabitooContext';
import { 
  ArrowRight, 
  CheckCircle2, 
  Check, 
  Send,
  Sparkles,
  ShieldCheck,
  Star,
  X,
  Phone,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Info
} from 'lucide-react';

export const ConciergeriePage = () => {
  const { activeCity, formatPrice } = useHabitoo();

  // Helper for pricing according to currency
  const formatServicePrice = (xofAmount) => {
    if (activeCity.currency === 'EUR') {
      const eur = Math.round(xofAmount / 655.957);
      return `${eur.toLocaleString('fr-FR')} €`;
    }
    return `${xofAmount.toLocaleString('fr-FR')} F`;
  };

  // 6 Services Catalog with illustrative, action-oriented photos
  const SERVICES_LIST = [
    {
      id: 'nettoyage',
      number: '01',
      badge: 'Service régulier',
      title: 'Nettoyage professionnel',
      shortTitle: 'Nettoyage',
      tagline: 'Impeccable, à chaque passage.',
      startingPrice: 15000,
      priceUnit: 'SESSION',
      // Real action: professional cleaner wiping surface with spray and cloth
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80',
      rating: '4.9',
      reviewCount: '320+ avis',
      description: "Notre équipe professionnelle intervient avec des équipements et produits éco-certifiés pour un entretien minutieux de vos villas, appartements ou bureaux. Remise en état complète, sols, vitres et dépoussiérage intégral.",
      inclusions: [
        "Produits éco-certifiés inclus",
        "Personnel qualifié et assuré",
        "Nettoyage en profondeur des sols et vitres",
        "Désinfection des sanitaires et cuisine"
      ]
    },
    {
      id: 'maintenance',
      number: '02',
      badge: 'Service périodique',
      title: 'Maintenance technique',
      shortTitle: 'Maintenance',
      tagline: 'Proactif, pas réactif.',
      startingPrice: 25000,
      priceUnit: 'VISITE',
      // Real action: technician inspecting HVAC/air conditioning unit with tools
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80',
      rating: '4.8',
      reviewCount: '190+ avis',
      description: "Contrôle préventif et systématique de vos équipements critiques : groupes électrogènes, climatiseurs, surpresseurs d'eau, tableaux électriques et plomberie pour éviter toute panne impromptue.",
      inclusions: [
        "Audit 40 points de contrôle",
        "Entretien filtres et recharge gaz clim",
        "Rapport technique numérique avec photos",
        "Vérification groupe électrogène et réserves"
      ]
    },
    {
      id: 'reparations',
      number: '03',
      badge: 'À la demande',
      title: 'Réparations et Dépannage',
      shortTitle: 'Réparations',
      tagline: 'Réparé vite, du premier coup.',
      startingPrice: 20000,
      priceUnit: 'INTERVENTION',
      // Real action: skilled artisan plumber/electrician working with tools
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1200&q=80',
      rating: '4.9',
      reviewCount: '410+ avis',
      description: "Plomberie, électricité, menuiserie, serrurerie ou maçonnerie : nos artisans certifiés interviennent en urgence ou sur rendez-vous avec des pièces de rechange d'origine et garantie de résultat.",
      inclusions: [
        "Artisans agréés et réactivité garantie",
        "Diagnostic précis et devis transparent",
        "Garantie 6 mois pièces et main d'œuvre",
        "Facture détaillée certifiée Habitoo"
      ]
    },
    {
      id: 'inspection',
      number: '04',
      badge: 'Ponctuel',
      title: 'Inspection et État des lieux',
      shortTitle: 'Inspection',
      tagline: 'Sachez avant de vous engager.',
      startingPrice: 50000,
      priceUnit: 'RAPPORT',
      // Real action: property inspector with tablet/clipboard inspecting structural room
      image: '/assets/inspection-service.jpg',
      rating: '5.0',
      reviewCount: '150+ avis',
      description: "États des lieux d'entrée et de sortie contradictoires, audits avant achat ou réception de chantier. Chaque défaut est consigné avec photographies HD horodatées et géolocalisées avec valeur juridique.",
      inclusions: [
        "Rapport PDF exhaustif avec 80+ clichés",
        "Horodatage et géolocalisation infalsifiables",
        "Relevé des index compteurs et équipements",
        "Signature électronique contradictoire"
      ]
    },
    {
      id: 'gestion',
      number: '05',
      badge: 'Continu',
      title: 'Gestion locative intégrale',
      shortTitle: 'Gestion locative',
      tagline: 'Encaissez vos loyers sans stress.',
      startingPrice: 8,
      priceUnit: '% DU LOYER',
      isPercentage: true,
      // Real action: handing over house keys to tenant/client
      image: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&w=1200&q=80',
      rating: '4.9',
      reviewCount: '580+ avis',
      description: "Déléguez à 100% l'intendance de votre bien : recherche et sélection de locataires vérifiés, encaissement, quittances, gestion des incidents et reversement automatique de vos loyers sur vos comptes en Afrique ou en Europe.",
      inclusions: [
        "Sélection rigoureuse des locataires",
        "Rédaction de baux sécurisés sous séquestre",
        "Encaissement et reversement garanti",
        "Assurance loyers impayés incluse"
      ]
    },
    {
      id: 'photographie',
      number: '06',
      badge: 'Ponctuel',
      title: 'Shooting et Visite 3D',
      shortTitle: 'Photographie',
      tagline: 'Des visuels qui font vendre.',
      startingPrice: 45000,
      priceUnit: 'SESSION',
      // Real action: architectural photographer with DSLR camera on tripod in a luxury living room
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80',
      rating: '4.9',
      reviewCount: '230+ avis',
      description: "Photographes spécialisés en architecture et immobilier d'exception. Prises de vue grand-angle, retouches soignées, plans aériens par drone et visites virtuelles immersives pour accélérer la commercialisation.",
      inclusions: [
        "Photographe professionnel d'architecture",
        "Retouches chromatiques haute définition",
        "Livraison express des clichés sous 24h",
        "Formats optimisés web et réseaux sociaux"
      ]
    }
  ];

  // Selected Service State (mono-service quote)
  const [selectedService, setSelectedService] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Quote Form Data
  const [quoteData, setQuoteData] = useState({
    fullName: '',
    phone: '',
    email: '',
    location: '',
    desiredDate: '',
    notes: ''
  });
  const [quoteSuccess, setQuoteSuccess] = useState(false);

  // Select a service: opens the collapsible panel pre-filled with this service
  const handleSelectService = (service) => {
    setSelectedService(service);
    setIsPanelOpen(true);
    setQuoteSuccess(false);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedService(null);
    setQuoteSuccess(false);
  };

  const handleQuoteSubmit = (e) => {
    e.preventDefault();
    setQuoteSuccess(true);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* 1. COMPACT HERO SECTION — Bande panoramique raccourcie (style Homepage) */}
      <section 
        className="concierge-hero-banner"
        style={{
          position: 'relative',
          minHeight: '100px',
          display: 'flex',
          alignItems: 'center',
          backgroundImage: 'url(/assets/hero-villa.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          overflow: 'hidden'
        }}
      >
        {/* Dark Protective Gradient Overlay */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.72) 45%, rgba(10,10,10,0.30) 100%)',
            zIndex: 1
          }}
        />

        <div className="container" style= {{ position: 'relative', zIndex: 2, padding: '18px 20px'}}>
          <div style={{ maxWidth: '680px' }}>
            <h1 
              className="font-serif"
              style={{
                fontSize: 'clamp(2rem, 4vw, 2.9rem)',
                fontWeight: 700,
                color: '#FFFFFF',
                lineHeight: 1.15,
                marginBottom: '10px',
                letterSpacing: '-0.5px'
              }}
            >
              Conciergerie et Intendance Privée
            </h1>

            <p 
              style={{ 
                color: 'rgba(255, 255, 255, 0.85)', 
                fontSize: 'clamp(0.95rem, 1.6vw, 1.1rem)', 
                lineHeight: 1.6, 
                margin: 0,
                maxWidth: '580px'
              }}
            >
              Gestion locative, entretien et maintenance de vos biens d'exception
            </p>
          </div>
        </div>
      </section>

      {/* 2. SPLIT SECTION: 2x2 Services Grid on Left + Collapsible Quote Panel on Right */}
      <section style={{ padding: '40px 0 0px 0' }}>
        <div className="container">
          
          <div className="concierge-split-layout">
            
            {/* LEFT COLUMN: 2x2 SERVICES CARDS */}
            <div className="concierge-cards-col">
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 className="font-serif" style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--obsidian-black)', margin: '0 0 4px 0' }}>
                    Ce que nous faisons
                  </h2>
                  <p style={{ fontSize: '0.875rem', color: 'var(--graphite-gray)', margin: 0 }}>
                    Cliquez sur un service pour demander votre devis personnalisé.
                  </p>
                </div>

                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--graphite-gray)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  6 services sur-mesure
                </span>
              </div>

              {/* 2 by 2 Cards Grid */}
              <div className="concierge-services-2x2-grid">
                {SERVICES_LIST.map((srv) => {
                  const isSelected = selectedService?.id === srv.id;
                  const formattedPrice = srv.isPercentage 
                    ? `${srv.startingPrice}% ${srv.priceUnit}`
                    : `${formatServicePrice(srv.startingPrice)} / ${srv.priceUnit}`;

                  return (
                    <div 
                      key={srv.id}
                      onClick={() => handleSelectService(srv)}
                      className={`concierge-service-card-2x2 ${isSelected ? 'selected' : ''}`}
                      style={{
                        backgroundImage: `url(${srv.image})`
                      }}
                    >
                      {/* Dark Gradient Overlay */}
                      <div className="concierge-card-overlay" />

                      {/* Top Bar: Number & Badge */}
                      <div className="concierge-card-top">
                        <span className="concierge-card-number">{srv.number}</span>
                        <span className="concierge-card-badge">{srv.badge}</span>
                      </div>

                      {/* Bottom Info */}
                      <div className="concierge-card-bottom">
                        <h3 className="font-serif concierge-card-title">
                          {srv.title}
                        </h3>

                        <p className="concierge-card-tagline">
                          {srv.tagline}
                        </p>

                        {/* CTA button inside card */}
                        <div className={`concierge-card-action ${isSelected ? 'active' : ''}`}>
                          {isSelected ? (
                            <>
                              <CheckCircle2 size={15} color="#FFFFFF" />
                              <span>Service sélectionné</span>
                            </>
                          ) : (
                            <>
                              <span>Demander un devis</span>
                              <ChevronRight size={14} />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* RIGHT COLUMN: COLLAPSIBLE QUOTE PANEL */}
            <div className="concierge-panel-col">
              <div className="concierge-sticky-panel">
                
                {!isPanelOpen || !selectedService ? (
                  /* Standby / Collapsed State */
                  <div className="concierge-panel-placeholder">
                    <div className="placeholder-icon">
                      <Sparkles size={28} color="var(--primary-red)" />
                    </div>

                    <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
                      Demande de devis sur-mesure
                    </h3>

                    <p style={{ fontSize: '0.875rem', color: 'var(--graphite-gray)', lineHeight: 1.6, marginBottom: '24px' }}>
                      Sélectionnez un service parmi les cartes à gauche pour ouvrir le formulaire et recevoir une proposition chiffrée gratuite sous 24h.
                    </p>

                    <div className="placeholder-perks">
                      <div className="perk-item">
                        <Check size={14} color="var(--verified-green)" />
                        <span>Devis mono-service gratuit et sans engagement</span>
                      </div>
                      <div className="perk-item">
                        <Check size={14} color="var(--verified-green)" />
                        <span>Rappel d'un conseiller sous 2h ouvrées</span>
                      </div>
                      <div className="perk-item">
                        <Check size={14} color="var(--verified-green)" />
                        <span>Interventions garanties et assurées</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Active Expanded State with Pre-filled Form */
                  <div className="concierge-quote-form-card">
                    
                    {/* Header with selected service info and close button */}
                    <div className="form-card-header">
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span className="badge-tag" style={{ backgroundColor: 'var(--soft-tint)', color: 'var(--primary-red)', fontSize: '0.6875rem', fontWeight: 700 }}>
                            {selectedService.badge}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--graphite-gray)' }}>Service N°{selectedService.number}</span>
                        </div>
                        <h3 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0 0 2px 0' }}>
                          {selectedService.title}
                        </h3>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--primary-red)', fontWeight: 700 }}>
                          À partir de {selectedService.isPercentage ? `${selectedService.startingPrice}% ${selectedService.priceUnit}` : `${formatServicePrice(selectedService.startingPrice)} / ${selectedService.priceUnit}`}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleClosePanel}
                        className="form-close-btn"
                        title="Replier le formulaire"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    {quoteSuccess ? (
                      /* Success confirmation */
                      <div className="quote-success-box">
                        <div className="success-icon-wrap">
                          <CheckCircle2 size={36} color="var(--verified-green)" />
                        </div>
                        <h4 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px' }}>
                          Demande de devis enregistrée !
                        </h4>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--graphite-gray)', lineHeight: 1.6, marginBottom: '18px' }}>
                          Merci <strong>{quoteData.fullName || 'Cher Client'}</strong>. Votre demande pour le service <strong>{selectedService.title}</strong> a bien été transmise à notre équipe conciergerie. Un conseiller vous contactera sous 2h ouvrées.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setQuoteSuccess(false);
                            setIsPanelOpen(false);
                            setSelectedService(null);
                          }}
                          className="btn-dark"
                          style={{ width: '100%', fontSize: '0.875rem' }}
                        >
                          Demander un autre service
                        </button>
                      </div>
                    ) : (
                      /* Form */
                      <form onSubmit={handleQuoteSubmit} className="quote-form-body">
                        
                        <div style={{ fontSize: '0.75rem', color: 'var(--graphite-gray)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Info size={14} color="var(--primary-red)" />
                          <span>Demande de devis exclusive pour ce service</span>
                        </div>

                        {/* Nom complet */}
                        <div className="form-group" style={{ marginBottom: '12px' }}>
                          <label className="form-label">Votre nom complet *</label>
                          <input
                            type="text"
                            required
                            placeholder="ex: Jean-Baptiste Kouassi"
                            className="form-input"
                            value={quoteData.fullName}
                            onChange={(e) => setQuoteData({ ...quoteData, fullName: e.target.value })}
                          />
                        </div>

                        {/* Téléphone WhatsApp */}
                        <div className="form-group" style={{ marginBottom: '12px' }}>
                          <label className="form-label">Numéro WhatsApp / Téléphone *</label>
                          <input
                            type="tel"
                            required
                            placeholder="+225 07 00 00 00 / +243..."
                            className="form-input"
                            value={quoteData.phone}
                            onChange={(e) => setQuoteData({ ...quoteData, phone: e.target.value })}
                          />
                        </div>

                        {/* Email */}
                        <div className="form-group" style={{ marginBottom: '12px' }}>
                          <label className="form-label">Adresse email *</label>
                          <input
                            type="email"
                            required
                            placeholder="votre.email@domaine.com"
                            className="form-input"
                            value={quoteData.email}
                            onChange={(e) => setQuoteData({ ...quoteData, email: e.target.value })}
                          />
                        </div>

                        {/* Localisation du bien */}
                        <div className="form-group" style={{ marginBottom: '12px' }}>
                          <label className="form-label">Ville et quartier du bien *</label>
                          <input
                            type="text"
                            required
                            placeholder="ex: Abidjan, Cocody Riviera Golf"
                            className="form-input"
                            value={quoteData.location}
                            onChange={(e) => setQuoteData({ ...quoteData, location: e.target.value })}
                          />
                        </div>

                        {/* Précisions ou Date */}
                        <div className="form-group" style={{ marginBottom: '18px' }}>
                          <label className="form-label">Précisions sur votre besoin (optionnel)</label>
                          <textarea
                            rows={2}
                            placeholder="Superficie, date souhaitée, contraintes particulières..."
                            className="form-textarea"
                            value={quoteData.notes}
                            onChange={(e) => setQuoteData({ ...quoteData, notes: e.target.value })}
                          />
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          className="btn-primary"
                          style={{
                            width: '100%',
                            height: '46px',
                            fontSize: '0.9375rem',
                            fontWeight: 700,
                            borderRadius: 'var(--radius-pill)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                          }}
                        >
                          <Send size={15} />
                          <span>Envoyer ma demande de devis</span>
                        </button>

                        <div style={{ textAlign: 'center', marginTop: '10px' }}>
                          <span style={{ fontSize: '0.6875rem', color: 'var(--graphite-light)' }}>
                            Gratuit et sans engagement • Réponse sous 2h ouvrées
                          </span>
                        </div>
                      </form>
                    )}

                  </div>
                )}

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Styles */}
      <style>{`
        /* ===== SPLIT 2x2 SERVICES + PANEL LAYOUT ===== */
        .concierge-split-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 390px;
          gap: 36px;
          align-items: start;
        }

        /* 2 by 2 Services Grid */
        .concierge-services-2x2-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 22px;
        }

        /* Service Card 2x2 */
        .concierge-service-card-2x2 {
          height: 380px;
          border-radius: 20px;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          box-shadow: var(--shadow-md);
          background-size: cover;
          background-position: center;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s, border 0.2s;
          border: 2px solid transparent;
        }
        .concierge-service-card-2x2:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 36px rgba(0,0,0,0.22);
        }
        .concierge-service-card-2x2.selected {
          border: 2px solid var(--primary-red);
          box-shadow: 0 0 0 3px rgba(247, 0, 0, 0.2), 0 16px 36px rgba(0,0,0,0.25);
        }

        /* Overlay */
        .concierge-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.85) 75%, rgba(0,0,0,0.96) 100%);
          z-index: 1;
        }

        .concierge-card-top {
          position: relative;
          z-index: 2;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .concierge-card-number {
          font-size: 0.8125rem;
          font-weight: 700;
          color: rgba(255,255,255,0.7);
          letter-spacing: 1px;
        }
        .concierge-card-badge {
          font-size: 0.6875rem;
          font-weight: 700;
          color: #FFFFFF;
          background-color: rgba(255,255,255,0.22);
          backdrop-filter: blur(8px);
          padding: 3px 10px;
          borderRadius: var(--radius-pill);
          border: 1px solid rgba(255,255,255,0.25);
        }

        .concierge-card-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 22px;
          z-index: 2;
          color: #FFFFFF;
        }
        .concierge-card-price {
          font-size: 0.6875rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(255,255,255,0.8);
          margin-bottom: 4px;
          display: block;
        }
        .concierge-card-title {
          font-size: 1.45rem;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0 0 4px 0;
          line-height: 1.2;
        }
        .concierge-card-tagline {
          font-size: 0.8125rem;
          color: rgba(255,255,255,0.75);
          margin: 0 0 14px 0;
          line-height: 1.4;
        }
        .concierge-card-action {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          color: #FFFFFF;
          padding: 6px 12px;
          border-radius: var(--radius-pill);
          background-color: rgba(255,255,255,0.18);
          backdrop-filter: blur(6px);
          transition: all 0.2s;
        }
        .concierge-card-action.active {
          background-color: var(--primary-red);
          color: #FFFFFF;
        }

        /* ===== RIGHT PANEL STYLES ===== */
        .concierge-sticky-panel {
          position: sticky;
          top: calc(var(--header-height) + 24px);
          z-index: 40;
        }
        .concierge-panel-placeholder {
          background-color: var(--surface-white);
          border-radius: var(--radius-card);
          border: 1px dashed var(--border-color);
          padding: 32px 24px;
          text-align: center;
          box-shadow: var(--shadow-sm);
        }
        .placeholder-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background-color: var(--soft-tint);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px auto;
        }
        .placeholder-perks {
          display: flex;
          flex-direction: column;
          gap: 8px;
          text-align: left;
          border-top: 1px solid var(--border-light);
          padding-top: 16px;
        }
        .perk-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          color: var(--graphite-gray);
          font-weight: 600;
        }

        /* Active Quote Form Card */
        .concierge-quote-form-card {
          background-color: var(--surface-white);
          border-radius: var(--radius-card);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-lg);
          overflow: hidden;
          animation: slideInPanel 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideInPanel {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .form-card-header {
          padding: 20px 24px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          background-color: #FAFAFA;
        }
        .form-close-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid var(--border-color);
          background: var(--surface-white);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--graphite-gray);
          transition: all 0.2s;
        }
        .form-close-btn:hover {
          color: var(--obsidian-black);
          background-color: var(--bg-main);
        }
        .quote-form-body {
          padding: 24px;
        }
        .quote-success-box {
          padding: 36px 24px;
          text-align: center;
        }
        .success-icon-wrap {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: var(--verified-green-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px auto;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 992px) {
          .concierge-split-layout {
            grid-template-columns: 100% !important;
          }
          .concierge-sticky-panel {
            position: fixed !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            top: auto !important;
            z-index: 1000 !important;
            padding: 0 !important;
          }
          .concierge-panel-placeholder {
            display: none !important;
          }
          .concierge-quote-form-card {
            border-radius: 20px 20px 0 0 !important;
            max-height: 85vh !important;
            overflow-y: auto !important;
            box-shadow: 0 -8px 30px rgba(0,0,0,0.3) !important;
          }
        }

        @media (max-width: 640px) {
          .concierge-services-2x2-grid {
            grid-template-columns: 1fr !important;
          }
          .concierge-service-card-2x2 {
            height: 320px !important;
          }
        }
      `}</style>

    </div>
  );
};

export default ConciergeriePage;
