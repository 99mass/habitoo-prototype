import React, { useState, useEffect } from 'react';
import { useHabitoo } from '../context/HabitooContext';
import { PROPERTY_TYPES, LUXURY_AMENITIES_FILTERS } from '../data/propertiesData';
import { X, CheckCircle2, Upload, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

export const DepositModal = () => {
  const { isDepositModalOpen, closeDepositModal, activeCity, depositInitialData, currentUser } = useHabitoo();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
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
        setFormData({
          title: depositInitialData.title || '',
          category: depositInitialData.category || 'VENTE',
          type: depositInitialData.type || 'Villa d\'architecte',
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
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '32px' }}
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
              Votre bien <strong>"{formData.title || 'Propriété d\'exception'}"</strong> à <strong>{formData.neighborhood || activeCity.name}</strong> est désormais visible sur la plateforme Habitoo. Les locataires et acheteurs qualifiés peuvent dès à présent le consulter.
            </p>

            <button onClick={handleClose} className="btn-primary" style={{ width: '100%' }}>
              Retour à l'accueil
            </button>
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
                  <label className="form-label">Type d'opération</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
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
                  <label className="form-label">Typologie du bien</label>
                  <select
                    className="form-select"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    {PROPERTY_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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
                    <label className="form-label">Surface habitable (m²)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="ex: 550"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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

                <div className="form-group">
                  <label className="form-label">Équipements & Normes Africaines</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {LUXURY_AMENITIES_FILTERS.map(a => {
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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
    </div>
  );
};
