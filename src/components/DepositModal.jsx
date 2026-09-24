import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHabitoo } from '../context/HabitooContext';
import { PROPERTY_TYPES, PRO_CATEGORIES, PRO_LEASE_TYPES, PRO_AMENITIES_FILTERS, LUXURY_AMENITIES_FILTERS } from '../data/propertiesData';
import { X, CheckCircle2, Upload, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

export const DepositModal = () => {
  const navigate = useNavigate();
  const { isDepositModalOpen, closeDepositModal, activeCity, depositInitialData, currentUser, addUserProperty } = useHabitoo();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    destination: 'HABITATION',
    proCategory: 'BUREAU',
    title: '',
    category: 'LOCATION',
    type: 'Villa d\'architecte',
    city: activeCity.name,
    neighborhood: '',
    price: '',
    area: '',
    bedrooms: '4',
    bathrooms: '4',
    leaseType: 'Bail commercial 3-6-9',
    offices: '4',
    workstations: '15',
    windowDisplay: '6 mètres sur rue',
    storageArea: '25 m²',
    ceilingHeight: '7.5 m',
    loadingDock: 'Quai de déchargement niveleur',
    waitingRoom: 'Salle d\'attente dédiée',
    amenities: ['+ Groupe Électrogène', '+ Forage / Réserve d\'eau', '+ Gardiennage H24'],
    ownerName: '',
    ownerPhone: '',
    ownerEmail: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isDepositModalOpen) {
      const defaultOwnerName = currentUser?.name || '';
      const defaultOwnerPhone = currentUser?.phone || '';
      const defaultOwnerEmail = currentUser?.email || '';

      if (depositInitialData) {
        const isPro = depositInitialData.destination === 'PRO';
        setFormData({
          destination: isPro ? 'PRO' : 'HABITATION',
          proCategory: depositInitialData.proCategory || 'BUREAU',
          title: depositInitialData.title || '',
          category: depositInitialData.category || 'VENTE',
          type: depositInitialData.type || (isPro ? 'Bureaux' : 'Villa d\'architecte'),
          city: depositInitialData.city || activeCity.name,
          neighborhood: depositInitialData.neighborhood || '',
          price: depositInitialData.price || '',
          area: depositInitialData.area || '',
          bedrooms: depositInitialData.bedrooms || '4',
          bathrooms: depositInitialData.bathrooms || '4',
          amenities: (depositInitialData.amenities && depositInitialData.amenities.length > 0)
            ? depositInitialData.amenities
            : ['+ Groupe Électrogène', '+ Forage / Réserve d\'eau', '+ Gardiennage H24'],
          ownerName: defaultOwnerName,
          ownerPhone: defaultOwnerPhone,
          ownerEmail: defaultOwnerEmail
        });
      } else {
        setFormData({
          destination: 'HABITATION',
          proCategory: 'BUREAU',
          title: '',
          category: 'LOCATION',
          type: 'Villa d\'architecte',
          city: activeCity.name,
          neighborhood: '',
          price: '',
          area: '',
          bedrooms: '4',
          bathrooms: '4',
          amenities: ['+ Groupe Électrogène', '+ Forage / Réserve d\'eau', '+ Gardiennage H24'],
          ownerName: defaultOwnerName,
          ownerPhone: defaultOwnerPhone,
          ownerEmail: defaultOwnerEmail
        });
      }
      setStep(1);
      setIsSubmitted(false);
    }
  }, [isDepositModalOpen, depositInitialData, activeCity.name, currentUser]);

  const handleClose = () => {
    setIsSubmitted(false);
    setStep(1);
    closeDepositModal();
  };

  const toggleAmenity = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (addUserProperty) {
      const isPro = formData.destination === 'PRO';
      const randomRef = `HAB-${formData.city.substring(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const proCategoryObj = PRO_CATEGORIES.find(c => c.id === formData.proCategory);

      addUserProperty({
        id: `user-prop-${Date.now()}`,
        ref: randomRef,
        destination: isPro ? 'PRO' : 'HABITATION',
        proCategory: isPro ? formData.proCategory : null,
        leaseType: isPro ? formData.leaseType : null,
        title: formData.title || (isPro ? 'Local professionnel de standing' : 'Propriété d\'exception'),
        type: isPro ? (proCategoryObj?.label || 'Bureaux') : formData.type,
        category: formData.category,
        city: formData.city,
        neighborhood: formData.neighborhood,
        address: `${formData.neighborhood || formData.city}, ${formData.city}`,
        priceXOF: formData.city !== 'Kinshasa' && formData.city !== 'Brazzaville' ? Number(formData.price || 0) : null,
        priceUSD: formData.city === 'Kinshasa' ? Number(formData.price || 0) : null,
        priceXAF: formData.city === 'Brazzaville' ? Number(formData.price || 0) : null,
        period: formData.category === 'LOCATION' ? '/mois' : '',
        specs: {
          area: Number(formData.area) || 0,
          bedrooms: isPro ? 0 : (Number(formData.bedrooms) || 0),
          bathrooms: Number(formData.bathrooms) || 0,
          offices: isPro && (formData.proCategory === 'BUREAU' || formData.proCategory === 'LOCAL_PRO' || formData.proCategory === 'COWORKING') ? (Number(formData.offices) || null) : null,
          workstations: isPro && (formData.proCategory === 'BUREAU' || formData.proCategory === 'COWORKING') ? (Number(formData.workstations) || null) : null,
          windowDisplay: isPro && formData.proCategory === 'COMMERCE' ? (formData.windowDisplay || null) : null,
          storageArea: isPro && formData.proCategory === 'COMMERCE' ? (formData.storageArea || null) : null,
          ceilingHeight: isPro && formData.proCategory === 'ENTREPOT' ? (formData.ceilingHeight || null) : null,
          loadingDock: isPro && formData.proCategory === 'ENTREPOT' ? Boolean(formData.loadingDock && !formData.loadingDock.toLowerCase().includes('sans')) : false,
          waitingRoom: isPro && formData.proCategory === 'LOCAL_PRO' ? (formData.waitingRoom || null) : null,
          restrooms: Number(formData.bathrooms) || 1,
          security: 'Gardiennage certifié'
        },
        amenities: formData.amenities,
        images: [
          isPro 
            ? 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'
            : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
        ],
        ownerName: formData.ownerName || currentUser?.name || 'Propriétaire',
        ownerPhone: formData.ownerPhone || currentUser?.phone || '',
        ownerEmail: formData.ownerEmail || currentUser?.email || '',
        isPro: false,
        advertiserType: 'PARTICULIER',
        agent: {
          name: formData.ownerName || currentUser?.name || 'Propriétaire Direct',
          agency: 'Propriétaire Direct',
          avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          phone: formData.ownerPhone || currentUser?.phone || '+225 07 00 00 00',
          verified: true
        }
      });
    }
    setIsSubmitted(true);
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isDepositModalOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDepositModalOpen]);

  if (!isDepositModalOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div 
        className="modal-content deposit-modal-box" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="deposit-modal-title"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Fermer la fenêtre de dépôt"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#F1F3F5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--graphite-gray)',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {isSubmitted ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div 
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--verified-green-bg)',
                color: 'var(--verified-green)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}
            >
              <CheckCircle2 size={36} />
            </div>

            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>
              Annonce Publiée avec Succès
            </h3>

            <p style={{ color: 'var(--graphite-gray)', fontSize: '0.9375rem', lineHeight: 1.6, maxWidth: '460px', margin: '0 auto 24px auto' }}>
              Votre bien <strong>"{formData.title || (formData.destination === 'PRO' ? 'Local professionnel' : 'Propriété d\'exception')}"</strong> à <strong>{formData.neighborhood || activeCity.name}</strong> est désormais visible sur la plateforme Habitoo dans la catégorie {formData.destination === 'PRO' ? '« Immobilier professionnel »' : 'résidentielle'}.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {formData.destination === 'PRO' && (
                <button 
                  onClick={() => { handleClose(); navigate('/immobilier-professionnel'); }} 
                  className="btn-primary" 
                  style={{ width: '100%' }}
                >
                  Voir l'espace Immobilier professionnel
                </button>
              )}
              <button 
                onClick={handleClose} 
                className={formData.destination === 'PRO' ? 'btn-ghost-dark' : 'btn-primary'} 
                style={{ width: '100%' }}
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-red)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Étape {step} sur 3
                </span>
              </div>
              <h2 id="deposit-modal-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700 }}>
                Déposer un Bien d'Exception
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--graphite-gray)' }}>
                Rejoignez le premier réseau immobilier ultra-sécurisé d'Afrique de l'Ouest et Centrale.
              </p>
            </div>

            {/* Step 1: Typologie & Localisation */}
            {step === 1 && (
              <div>
                <div className="form-group">
                  <label className="form-label">Destination du bien</label>
                  <div className="deposit-form-grid-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ 
                        ...formData, 
                        destination: 'HABITATION',
                        type: "Villa d'architecte"
                      })}
                      className={formData.destination !== 'PRO' ? 'btn-dark' : 'btn-white'}
                      style={{ padding: '10px', fontSize: '0.875rem' }}
                    >
                      Habitation
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ 
                        ...formData, 
                        destination: 'PRO',
                        type: 'Bureaux',
                        proCategory: formData.proCategory || 'BUREAU'
                      })}
                      className={formData.destination === 'PRO' ? 'btn-dark' : 'btn-white'}
                      style={{ padding: '10px', fontSize: '0.875rem' }}
                    >
                      Immobilier professionnel
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Type d'opération</label>
                  <div className="deposit-form-grid-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, category: 'LOCATION' })}
                      className={formData.category === 'LOCATION' ? 'btn-dark' : 'btn-white'}
                      style={{ padding: '10px', fontSize: '0.875rem' }}
                    >
                      Mettre en Location
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, category: 'VENTE' })}
                      className={formData.category === 'VENTE' ? 'btn-dark' : 'btn-white'}
                      style={{ padding: '10px', fontSize: '0.875rem' }}
                    >
                      Mettre en Vente
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    {formData.destination === 'PRO' ? 'Catégorie professionnelle' : 'Typologie du bien'}
                  </label>
                  {formData.destination === 'PRO' ? (
                    <select
                      className="form-select"
                      value={formData.proCategory}
                      onChange={(e) => {
                        const newCat = e.target.value;
                        const catObj = PRO_CATEGORIES.find(c => c.id === newCat);
                        setFormData({ 
                          ...formData, 
                          proCategory: newCat,
                          type: catObj?.label || newCat 
                        });
                      }}
                    >
                      {PRO_CATEGORIES.map(c => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                  ) : (
                    <select
                      className="form-select"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      {PROPERTY_TYPES.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="deposit-form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Ville</label>
                    <select
                      className="form-select"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    >
                      <option value="Abidjan">Abidjan (Côte d'Ivoire)</option>
                      <option value="Kinshasa">Kinshasa (RDC)</option>
                      <option value="Brazzaville">Brazzaville (Congo)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Quartier précis</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="ex: Riviera Golf, Gombe..."
                      value={formData.neighborhood}
                      onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Titre de l'annonce</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="ex: Somptueuse Villa Contemporaine avec Vue Lagune"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn-primary"
                  >
                    <span>Suivant : Caractéristiques</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Spécifications & Prix */}
            {step === 2 && (
              <div>
                <div className="deposit-form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Loyer mensuel ou Prix ({activeCity.currency})</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="ex: 3500000"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      {formData.destination === 'PRO' ? 'Superficie utile (m²)' : 'Surface habitable (m²)'}
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder={formData.destination === 'PRO' ? "ex: 320" : "ex: 550"}
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    />
                  </div>
                </div>

                {formData.destination === 'PRO' ? (
                  <>
                    {/* Common Base: Sanitaires & Type de bail */}
                    <div className="deposit-form-grid-2">
                      <div className="form-group">
                        <label className="form-label">Sanitaires / Points d'eau</label>
                        <input
                          type="number"
                          className="form-input"
                          value={formData.bathrooms}
                          onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Type de bail contractuel</label>
                        <select
                          className="form-select"
                          value={formData.leaseType}
                          onChange={(e) => setFormData({ ...formData, leaseType: e.target.value })}
                        >
                          {PRO_LEASE_TYPES.map(l => (
                            <option key={l} value={l}>{l}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Specialized criteria according to category */}
                    {formData.proCategory === 'BUREAU' && (
                      <div className="deposit-form-grid-2">
                        <div className="form-group">
                          <label className="form-label">Nombre de bureaux fermés</label>
                          <input
                            type="number"
                            className="form-input"
                            placeholder="ex: 4"
                            value={formData.offices}
                            onChange={(e) => setFormData({ ...formData, offices: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Postes de travail (open-space)</label>
                          <input
                            type="number"
                            className="form-input"
                            placeholder="ex: 15"
                            value={formData.workstations}
                            onChange={(e) => setFormData({ ...formData, workstations: e.target.value })}
                          />
                        </div>
                      </div>
                    )}

                    {formData.proCategory === 'COMMERCE' && (
                      <div className="deposit-form-grid-2">
                        <div className="form-group">
                          <label className="form-label">Linéaire de vitrine</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="ex: 8 mètres sur rue"
                            value={formData.windowDisplay}
                            onChange={(e) => setFormData({ ...formData, windowDisplay: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Espace réserve / Stockage</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="ex: 25 m² en arrière-boutique"
                            value={formData.storageArea}
                            onChange={(e) => setFormData({ ...formData, storageArea: e.target.value })}
                          />
                        </div>
                      </div>
                    )}

                    {formData.proCategory === 'ENTREPOT' && (
                      <div className="deposit-form-grid-2">
                        <div className="form-group">
                          <label className="form-label">Hauteur sous plafond (m)</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="ex: 8.5 mètres"
                            value={formData.ceilingHeight}
                            onChange={(e) => setFormData({ ...formData, ceilingHeight: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Accès logistique / Quai</label>
                          <select
                            className="form-select"
                            value={formData.loadingDock}
                            onChange={(e) => setFormData({ ...formData, loadingDock: e.target.value })}
                          >
                            <option value="Quai de déchargement niveleur">Quai niveleur gros porteurs</option>
                            <option value="Accès plain-pied semi-remorque">Accès de plain-pied camion</option>
                            <option value="Sans quai">Sans quai de déchargement</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {formData.proCategory === 'LOCAL_PRO' && (
                      <div className="deposit-form-grid-2">
                        <div className="form-group">
                          <label className="form-label">Cabinets / Salles de consultation</label>
                          <input
                            type="number"
                            className="form-input"
                            placeholder="ex: 3"
                            value={formData.offices}
                            onChange={(e) => setFormData({ ...formData, offices: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Salle d'attente</label>
                          <select
                            className="form-select"
                            value={formData.waitingRoom}
                            onChange={(e) => setFormData({ ...formData, waitingRoom: e.target.value })}
                          >
                            <option value="Salle d'attente dédiée">Salle d'attente dédiée</option>
                            <option value="Espace d'attente partagé">Espace d'attente partagé</option>
                            <option value="Sans salle d'attente">Sans salle d'attente</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {formData.proCategory === 'COWORKING' && (
                      <div className="deposit-form-grid-2">
                        <div className="form-group">
                          <label className="form-label">Capacité en postes de travail</label>
                          <input
                            type="number"
                            className="form-input"
                            placeholder="ex: 30"
                            value={formData.workstations}
                            onChange={(e) => setFormData({ ...formData, workstations: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Salles de réunion équipées</label>
                          <input
                            type="number"
                            className="form-input"
                            placeholder="ex: 2"
                            value={formData.offices}
                            onChange={(e) => setFormData({ ...formData, offices: e.target.value })}
                          />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="deposit-form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Nombre de Chambres</label>
                      <input
                        type="number"
                        className="form-input"
                        value={formData.bedrooms}
                        onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Nombre de Salles de Bain</label>
                      <input
                        type="number"
                        className="form-input"
                        value={formData.bathrooms}
                        onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">
                    {formData.destination === 'PRO' ? 'Équipements et Normes Professionnelles' : 'Équipements et Normes Africaines'}
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {(formData.destination === 'PRO' ? PRO_AMENITIES_FILTERS : LUXURY_AMENITIES_FILTERS).map(a => {
                      const selected = formData.amenities.includes(a);
                      return (
                        <button
                          key={a}
                          type="button"
                          onClick={() => toggleAmenity(a)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: 'var(--radius-pill)',
                            fontSize: '0.8125rem',
                            border: selected ? '1px solid var(--primary-red)' : '1px solid var(--border-color)',
                            backgroundColor: selected ? 'var(--soft-tint)' : 'var(--bg-main)',
                            color: selected ? 'var(--primary-red)' : 'var(--obsidian-black)',
                            fontWeight: 600
                          }}
                        >
                          {a}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn-ghost-dark"
                  >
                    <ArrowLeft size={16} />
                    <span>Retour</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="btn-primary"
                  >
                    <span>Suivant : Contacts</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Coordonnées & Validation */}
            {step === 3 && (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Nom complet du propriétaire ou de l'agence</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="ex: M. Abdoulaye Touré"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  />
                </div>

                <div className="deposit-form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Téléphone (WhatsApp)</label>
                    <input
                      type="tel"
                      required
                      className="form-input"
                      placeholder="ex: +225 07 00 00 00"
                      value={formData.ownerPhone}
                      onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Adresse Email</label>
                    <input
                      type="email"
                      required
                      className="form-input"
                      placeholder="ex: touré@contact.ci"
                      value={formData.ownerEmail}
                      onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                    />
                  </div>
                </div>


                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn-ghost-dark"
                  >
                    <ArrowLeft size={16} />
                    <span>Retour</span>
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <span>Valider</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      <style>{`
        .deposit-modal-box {
          padding: 32px;
        }
        .deposit-form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        @media (max-width: 640px) {
          .deposit-modal-box {
            padding: 24px 18px !important;
          }
          .deposit-form-grid-2 {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }
        }
      `}</style>
    </div>
  );
};
