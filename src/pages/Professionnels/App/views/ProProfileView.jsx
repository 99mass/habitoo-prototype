import React, { useState } from 'react';
import { 
  User, 
  Camera, 
  Phone, 
  Mail, 
  MapPin, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Save, 
  Upload, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

const AVATAR_PRESETS = [
  { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', label: 'Portrait 1 (Démarcheur)' },
  { url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80', label: 'Portrait 2 (Agence)' },
  { url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80', label: 'Portrait 3 (Directrice)' },
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', label: 'Portrait 4 (Conseiller)' }
];

export const ProProfileView = ({ 
  userProfile, 
  onSaveProfile,
  persona = 'demarcheur'
}) => {
  const [formData, setFormData] = useState({
    name: userProfile?.name || (persona === 'agence' ? 'Ivoire Prestige Conseil' : 'Jean-Marc Kouassi'),
    avatar: userProfile?.avatar || (persona === 'agence' 
      ? 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'
      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'),
    phone: userProfile?.phone || '+225 07 89 22 14 00',
    email: userProfile?.email || 'j.kouassi@habitoo-pro.ci',
    address: userProfile?.address || 'Immeuble Palm Club, 3ème étage, Boulevard Latrille',
    city: userProfile?.city || 'Abidjan',
    license: userProfile?.license || 'AGR-CI-2024-0892'
  });

  const [isPhotoPickerOpen, setIsPhotoPickerOpen] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectPresetAvatar = (url) => {
    updateField('avatar', url);
    setIsPhotoPickerOpen(false);
  };

  const handleApplyCustomAvatar = (e) => {
    e.preventDefault();
    if (customAvatarUrl.trim()) {
      updateField('avatar', customAvatarUrl.trim());
      setCustomAvatarUrl('');
      setIsPhotoPickerOpen(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      if (onSaveProfile) {
        onSaveProfile(formData);
      }
      setTimeout(() => setSaveSuccess(false), 4000);
    }, 500);
  };

  return (
    <div className="habitoo-dash-section">
      
      {/* En-tête de la page Profil */}
      <div className="habitoo-dash-page-header-row">
        <div>
          <h2 className="habitoo-dash-page-title">Profil Professionnel</h2>
          <p className="habitoo-dash-page-subtitle">
            Modifiez vos coordonnées de contact, votre photo et vos informations visibles par les acquéreurs.
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div className="habitoo-dash-toast-success" style={{ marginBottom: '20px' }}>
          <CheckCircle2 size={16} />
          <span>Vos modifications ont été enregistrées avec succès et appliquées à votre session.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="habitoo-dash-profile-layout">
        
        {/* CARTE AVATAR ET BADGES OFFICIELS */}
        <div className="habitoo-dash-card habitoo-dash-profile-side-card">
          <div className="habitoo-dash-profile-avatar-wrap">
            <img
              src={formData.avatar}
              alt={formData.name}
              className="habitoo-dash-profile-avatar-img"
            />
            <button
              type="button"
              className="habitoo-dash-profile-avatar-edit-btn"
              onClick={() => setIsPhotoPickerOpen(prev => !prev)}
              title="Modifier la photo de profil"
            >
              <Camera size={14} />
            </button>
          </div>

          <h3 className="habitoo-dash-profile-agent-name">{formData.name}</h3>
          
          <div className="habitoo-dash-badge habitoo-dash-badge--broker" style={{ margin: '8px auto' }}>
            <ShieldCheck size={12} />
            <span>{persona === 'agence' ? 'Agence Certifiée PRO' : 'Démarcheur Agréé PRO'}</span>
          </div>

          <p className="habitoo-dash-profile-city-text">
            <MapPin size={12} /> {formData.city}, Côte d'Ivoire
          </p>

          {/* Tiroir / Sélecteur d'avatar */}
          {isPhotoPickerOpen && (
            <div className="habitoo-dash-avatar-picker-box">
              <span className="habitoo-dash-avatar-picker-title">Choisir une photo de profil</span>
              <div className="habitoo-dash-avatar-picker-presets">
                {AVATAR_PRESETS.map((preset, idx) => (
                  <img
                    key={idx}
                    src={preset.url}
                    alt={preset.label}
                    className={`habitoo-dash-avatar-preset-thumb ${formData.avatar === preset.url ? 'habitoo-dash-avatar-preset-thumb--active' : ''}`}
                    onClick={() => handleSelectPresetAvatar(preset.url)}
                    title={preset.label}
                  />
                ))}
              </div>

              <div className="habitoo-dash-avatar-url-form">
                <input
                  type="url"
                  placeholder="Ou collez l'URL d'une image..."
                  value={customAvatarUrl}
                  onChange={e => setCustomAvatarUrl(e.target.value)}
                  className="habitoo-dash-input habitoo-dash-input--small"
                />
                <button
                  type="button"
                  onClick={handleApplyCustomAvatar}
                  className="habitoo-dash-btn-ghost habitoo-dash-btn-ghost--small"
                >
                  Appliquer
                </button>
              </div>
            </div>
          )}

          <div className="habitoo-dash-divider" style={{ margin: '20px 0' }} />

          <div className="habitoo-dash-profile-stats-mini">
            <div className="habitoo-dash-profile-stat-item">
              <span className="habitoo-dash-profile-stat-val">4.9 / 5</span>
              <span className="habitoo-dash-profile-stat-lbl">Satisfaction clients</span>
            </div>
            <div className="habitoo-dash-profile-stat-item">
              <span className="habitoo-dash-profile-stat-val">100%</span>
              <span className="habitoo-dash-profile-stat-lbl">Visites certifiées</span>
            </div>
          </div>
        </div>

        {/* CARTE FORMULAIRE COORDONNÉES */}
        <div className="habitoo-dash-card habitoo-dash-profile-main-card">
          <h3 className="habitoo-dash-section-title">Informations Générales</h3>

          <div className="habitoo-dash-form-row">
            <div className="habitoo-dash-form-group">
              <label className="habitoo-dash-label" htmlFor="profile-name">
                {persona === 'agence' ? "Raison Sociale de l'Agence" : "Nom complet"}
              </label>
              <input
                id="profile-name"
                type="text"
                className="habitoo-dash-input"
                value={formData.name}
                onChange={e => updateField('name', e.target.value)}
                required
              />
            </div>

            <div className="habitoo-dash-form-group">
              <label className="habitoo-dash-label" htmlFor="profile-license">
                Numéro d'agrément professionnel
              </label>
              <input
                id="profile-license"
                type="text"
                className="habitoo-dash-input"
                value={formData.license}
                onChange={e => updateField('license', e.target.value)}
                placeholder="Ex : AGR-CI-2024-0892"
              />
            </div>
          </div>

          <div className="habitoo-dash-form-row">
            <div className="habitoo-dash-form-group">
              <label className="habitoo-dash-label" htmlFor="profile-phone">
                Numéro de téléphone direct
              </label>
              <div className="habitoo-dash-input-icon-wrap">
                <Phone size={14} className="habitoo-dash-field-icon" />
                <input
                  id="profile-phone"
                  type="tel"
                  className="habitoo-dash-input habitoo-dash-input--with-icon"
                  value={formData.phone}
                  onChange={e => updateField('phone', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="habitoo-dash-form-group">
              <label className="habitoo-dash-label" htmlFor="profile-email">
                Adresse email professionnelle
              </label>
              <div className="habitoo-dash-input-icon-wrap">
                <Mail size={14} className="habitoo-dash-field-icon" />
                <input
                  id="profile-email"
                  type="email"
                  className="habitoo-dash-input habitoo-dash-input--with-icon"
                  value={formData.email}
                  onChange={e => updateField('email', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="habitoo-dash-form-row">
            <div className="habitoo-dash-form-group" style={{ flex: '2' }}>
              <label className="habitoo-dash-label" htmlFor="profile-address">
                Adresse physique du bureau ou cabinet
              </label>
              <div className="habitoo-dash-input-icon-wrap">
                <MapPin size={14} className="habitoo-dash-field-icon" />
                <input
                  id="profile-address"
                  type="text"
                  className="habitoo-dash-input habitoo-dash-input--with-icon"
                  value={formData.address}
                  onChange={e => updateField('address', e.target.value)}
                  placeholder="Immeuble, rue ou quartier..."
                  required
                />
              </div>
            </div>

            <div className="habitoo-dash-form-group" style={{ flex: '1' }}>
              <label className="habitoo-dash-label" htmlFor="profile-city">Ville</label>
              <input
                id="profile-city"
                type="text"
                className="habitoo-dash-input"
                value={formData.city}
                onChange={e => updateField('city', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="habitoo-dash-form-actions" style={{ justifyContent: 'flex-end', marginTop: '24px' }}>
            <button
              type="submit"
              className="habitoo-dash-btn-primary"
              disabled={isSaving}
            >
              {isSaving ? (
                <span>Enregistrement...</span>
              ) : (
                <>
                  <Save size={15} />
                  <span>Enregistrer les modifications</span>
                </>
              )}
            </button>
          </div>

        </div>

      </form>

    </div>
  );
};
