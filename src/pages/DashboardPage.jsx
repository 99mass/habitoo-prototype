import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useHabitoo } from '../context/HabitooContext';
import { PROPERTIES_DATA, CITIES } from '../data/propertiesData';
import { PropertyCard } from '../components/PropertyCard';
import { 
  User, 
  Camera, 
  Check, 
  AlertCircle, 
  AlertTriangle, 
  Calendar, 
  Heart, 
  Bell, 
  Settings, 
  Megaphone, 
  Plus, 
  Trash2, 
  Eye, 
  LogOut, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  ChevronRight, 
  X
} from 'lucide-react';

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80";

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Available tabs: profile, properties, visits, favorites, notifications, settings
  const requestedTab = searchParams.get('tab');
  const validTabs = ['profile', 'properties', 'visits', 'favorites', 'notifications', 'settings'];
  const [activeTab, setActiveTab] = useState(() => {
    return validTabs.includes(requestedTab) ? requestedTab : 'profile';
  });

  const { 
    scheduledVisits, 
    favorites, 
    currentUser, 
    logout,
    activeCity,
    setActiveCity,
    userProperties,
    deleteUserProperty,
    notifications,
    markAllNotificationsRead,
    deleteNotification,
    updateUserProfile,
    deleteAccount
  } = useHabitoo();

  // Redirect to home if disconnected
  useEffect(() => {
    if (!currentUser) {
      navigate('/', { replace: true });
    }
  }, [currentUser, navigate]);

  // Sync tab with URL search parameter
  useEffect(() => {
    if (requestedTab && validTabs.includes(requestedTab)) {
      setActiveTab(requestedTab);
    }
  }, [requestedTab]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setSearchParams({ tab: tabKey });
  };

  // Profile Edit State
  const initialNameParts = (currentUser?.name || 'M. Abdoulaye Touré').split(' ');
  const [profileForm, setProfileForm] = useState({
    firstName: initialNameParts.slice(0, -1).join(' ') || initialNameParts[0] || 'Abdoulaye',
    lastName: initialNameParts.length > 1 ? initialNameParts.slice(-1).join(' ') : 'Touré',
    email: currentUser?.email || 'abdoulaye.toure@habitoo.ci',
    phone: currentUser?.phone || '07 08 09 10 11',
    address: currentUser?.address || 'Riviera Golf, Cocody',
    city: currentUser?.city || activeCity?.name || 'Abidjan',
    avatar: currentUser?.avatar || DEFAULT_AVATAR
  });

  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const avatarInputRef = useRef(null);

  // When currentUser changes in context, sync form
  useEffect(() => {
    if (currentUser) {
      const parts = (currentUser.name || '').split(' ');
      setProfileForm(prev => ({
        ...prev,
        firstName: parts.slice(0, -1).join(' ') || parts[0] || prev.firstName,
        lastName: parts.length > 1 ? parts.slice(-1).join(' ') : prev.lastName,
        email: currentUser.email || prev.email,
        phone: currentUser.phone || prev.phone,
        avatar: currentUser.avatar || prev.avatar
      }));
    }
  }, [currentUser]);

  if (!currentUser) {
    return null;
  }

  const favoriteProperties = PROPERTIES_DATA.filter(p => favorites.includes(p.id));
  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  // Handle Profile Update
  const handleProfileSave = (e) => {
    e.preventDefault();
    const fullName = `${profileForm.firstName.trim()} ${profileForm.lastName.trim()}`.trim();
    updateUserProfile({
      name: fullName,
      email: profileForm.email.trim(),
      phone: profileForm.phone.trim(),
      address: profileForm.address.trim(),
      city: profileForm.city.trim(),
      avatar: profileForm.avatar
    });

    setSaveSuccessMsg("Vos informations personnelles ont été enregistrées avec succès !");
    setTimeout(() => {
      setSaveSuccessMsg('');
    }, 4000);
  };

  // Handle Avatar Upload
  const handleAvatarFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const newUrl = URL.createObjectURL(file);
      setProfileForm(prev => ({ ...prev, avatar: newUrl }));
    }
  };

  // Handle Account Deletion
  const handleConfirmDelete = () => {
    deleteAccount();
    setShowDeleteModal(false);
    navigate('/', { replace: true });
  };

  return (
    <div className="userspace-wrapper">
      <div className="container" style={{ maxWidth: '1080px', paddingTop: '24px', paddingBottom: '70px' }}>
        
        {/* Sleek Tab Navigation — Horizontal Scroll on mobile */}
        <nav className="userspace-tab-nav" aria-label="Navigation espace personnel">
          <button
            type="button"
            className={`userspace-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => handleTabChange('profile')}
          >
            <User size={16} />
            <span>Mon Profil</span>
          </button>

          <button
            type="button"
            className={`userspace-tab-btn ${activeTab === 'properties' ? 'active' : ''}`}
            onClick={() => handleTabChange('properties')}
          >
            <Megaphone size={16} />
            <span>Mes Annonces</span>
            {userProperties.length > 0 && (
              <span className="tab-counter-badge">{userProperties.length}</span>
            )}
          </button>

          <button
            type="button"
            className={`userspace-tab-btn ${activeTab === 'visits' ? 'active' : ''}`}
            onClick={() => handleTabChange('visits')}
          >
            <Calendar size={16} />
            <span>Mes Visites</span>
            {scheduledVisits.length > 0 && (
              <span className="tab-counter-badge">{scheduledVisits.length}</span>
            )}
          </button>

          <button
            type="button"
            className={`userspace-tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => handleTabChange('favorites')}
          >
            <Heart size={16} />
            <span>Favoris</span>
            {favoriteProperties.length > 0 && (
              <span className="tab-counter-badge">{favoriteProperties.length}</span>
            )}
          </button>

          <button
            type="button"
            className={`userspace-tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => handleTabChange('notifications')}
          >
            <Bell size={16} />
            <span>Notifications</span>
            {unreadNotifsCount > 0 && (
              <span className="tab-counter-badge notif-badge">{unreadNotifsCount}</span>
            )}
          </button>

          <button
            type="button"
            className={`userspace-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => handleTabChange('settings')}
          >
            <Settings size={16} />
            <span>Paramètres</span>
          </button>
        </nav>

        {/* ========================================================= */}
        {/* TAB 1: INFORMATIONS PERSONNELLES (PAR DÉFAUT)             */}
        {/* ========================================================= */}
        {activeTab === 'profile' && (
          <div className="userspace-panel animate-fadeIn">
            <div className="panel-card">
              <div className="panel-card-header">
                <div>
                  <h2 className="panel-title">Informations Personnelles</h2>
                  <p className="panel-subtitle">
                    Gérez vos coordonnées, votre identité et vos informations de contact visibles lors de vos interactions.
                  </p>
                </div>

              </div>

              {saveSuccessMsg && (
                <div className="alert-success-banner animate-fadeIn">
                  <CheckCircle2 size={18} />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleProfileSave}>
                {/* Photo de profil interactive */}
                <div className="profile-avatar-row">
                  <div className="avatar-preview-wrap">
                    <img 
                      src={profileForm.avatar} 
                      alt={currentUser.name} 
                      className="profile-avatar-img"
                    />
                    <button
                      type="button"
                      className="avatar-edit-fab"
                      title="Changer la photo de profil"
                      onClick={() => avatarInputRef.current?.click()}
                    >
                      <Camera size={15} />
                    </button>
                    <input 
                      type="file" 
                      ref={avatarInputRef} 
                      style={{ display: 'none' }} 
                      accept="image/*"
                      onChange={handleAvatarFile}
                    />
                  </div>

                  <div className="avatar-meta-info">
                    <div className="avatar-meta-title">Photo de Profil</div>
                    <p className="avatar-meta-hint">
                      Format JPG, PNG ou WEBP. Cette photo sera affichée sur vos annonces et lors de la réservation de visites.
                    </p>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      <button
                        type="button"
                        className="btn-ghost-dark btn-small"
                        onClick={() => avatarInputRef.current?.click()}
                      >
                        Téléverser une image
                      </button>
                      <button
                        type="button"
                        className="btn-ghost-dark btn-small"
                        onClick={() => setProfileForm(prev => ({ ...prev, avatar: DEFAULT_AVATAR }))}
                      >
                        Photo par défaut
                      </button>
                    </div>
                  </div>
                </div>

                <div className="form-divider" />

                {/* Grille des coordonnées */}
                <div className="profile-form-grid">
                  <div className="field-group">
                    <label className="field-label">Prénom</label>
                    <input 
                      type="text" 
                      className="field-input"
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                      placeholder="Ex: Abdoulaye"
                      required
                    />
                  </div>

                  <div className="field-group">
                    <label className="field-label">Nom de famille</label>
                    <input 
                      type="text" 
                      className="field-input"
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                      placeholder="Ex: Touré"
                      required
                    />
                  </div>

                  <div className="field-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <label className="field-label" style={{ margin: 0 }}>Adresse Email</label>
                    </div>
                    <div className="input-with-icon">
                      <Mail size={16} className="input-leading-icon" />
                      <input 
                        type="email" 
                        className="field-input has-icon"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        placeholder="nom@exemple.com"
                      />
                    </div>
                  </div>

                  <div className="field-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <label className="field-label" style={{ margin: 0 }}>Téléphone et WhatsApp</label>
                    </div>
                    <div className="input-with-icon">
                      <Phone size={16} className="input-leading-icon" />
                      <input 
                        type="tel" 
                        className="field-input has-icon"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        placeholder="+225 07 00 00 00 00"
                      />
                    </div>
                  </div>

                  <div className="field-group">
                    <label className="field-label">Ville et Pays de résidence</label>
                    <div className="input-with-icon">
                      <Globe size={16} className="input-leading-icon" />
                      <input 
                        type="text" 
                        className="field-input has-icon"
                        value={profileForm.city}
                        onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                        placeholder="Ex: Abidjan, Côte d'Ivoire"
                      />
                    </div>
                  </div>

                  <div className="field-group">
                    <label className="field-label">Quartier / Adresse habituelle</label>
                    <div className="input-with-icon">
                      <MapPin size={16} className="input-leading-icon" />
                      <input 
                        type="text" 
                        className="field-input has-icon"
                        value={profileForm.address}
                        onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                        placeholder="Ex: Riviera Golf, Cocody"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-footer">
                  <button type="submit" className="btn-primary" style={{ padding: '10px 24px' }}>
                    <Check size={16} />
                    <span>Enregistrer les modifications</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: MES ANNONCES (SYNCHRONISÉES AVEC LA PUBLICATION)    */}
        {/* ========================================================= */}
        {activeTab === 'properties' && (
          <div className="userspace-panel animate-fadeIn">
            <div className="panel-header-action-row">
              <div>
                <h2 className="panel-title">Mes Annonces Publiées</h2>
                <p className="panel-subtitle">
                  Gérez vos biens en ligne, suivez la visibilité et modifiez vos annonces certifiées.
                </p>
              </div>
              <Link to="/publier" className="btn-primary" style={{ padding: '9px 18px', textDecoration: 'none' }}>
                <span>Publier une annonce</span>
              </Link>
            </div>

            {userProperties.length === 0 ? (
              <div className="empty-state-card">
                <div className="empty-state-icon">
                  <Megaphone size={32} color="var(--primary-red)" />
                </div>
                <h3 className="empty-state-title">Vous n'avez pas encore publié d'annonce</h3>
                <p className="empty-state-desc">
                  Mettez en valeur votre villa, appartement ou terrain en quelques minutes sur Habitoo. Vos annonces certifiées touchent directement des acquéreurs et locataires qualifiés.
                </p>
                <Link to="/publier" className="btn-primary" style={{ padding: '11px 24px', textDecoration: 'none' }}>
                  <span>Créer ma première annonce</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            ) : (
              <div className="properties-user-grid">
                {userProperties.map((property) => (
                  <div key={property.id} className="user-prop-card">
                    <div className="user-prop-thumb-wrap">
                      <img 
                        src={property.images?.[0] || DEFAULT_AVATAR} 
                        alt={property.title} 
                        className="user-prop-img"
                      />
                      <span className="prop-status-tag">{property.status || 'En ligne'}</span>
                      <span className="prop-category-tag">{property.category === 'VENTE' ? 'Vente' : 'Location'}</span>
                    </div>

                    <div className="user-prop-body">
                      <div className="user-prop-ref">Réf. {property.ref || property.id}</div>
                      <h4 className="user-prop-title">{property.title}</h4>
                      <div className="user-prop-location">
                        <MapPin size={12} />
                        <span>{property.neighborhood}, {property.city}</span>
                      </div>

                      <div className="user-prop-price">
                        {property.priceXOF 
                          ? `${Number(property.priceXOF).toLocaleString('fr-FR')} FCFA`
                          : property.priceUSD 
                          ? `$ ${Number(property.priceUSD).toLocaleString('en-US')}` 
                          : `${Number(property.price || 0).toLocaleString('fr-FR')} FCFA`}
                        {property.period && <span className="price-period">{property.period}</span>}
                      </div>

                      <div className="user-prop-actions">
                        <Link 
                          to={`/bien/${property.id}`} 
                          state={{ previewProperty: property }}
                          className="btn-ghost-dark btn-small"
                          style={{ flex: 1, textDecoration: 'none', justifyContent: 'center' }}
                        >
                          <Eye size={13} />
                          <span>Voir la fiche</span>
                        </Link>
                        <button
                          type="button"
                          className="btn-del-prop"
                          title="Supprimer l'annonce"
                          onClick={() => {
                            if (window.confirm("Êtes-vous sûr de vouloir retirer cette annonce de la plateforme ?")) {
                              deleteUserProperty(property.id);
                            }
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: MES VISITES SÉCURISÉES (CONSERVÉ)                   */}
        {/* ========================================================= */}
        {activeTab === 'visits' && (
          <div className="userspace-panel animate-fadeIn">
            <div className="panel-header-action-row">
              <div>
                <h2 className="panel-title">Mes Visites Sécurisées</h2>
                <p className="panel-subtitle">
                  Suivi de vos rendez-vous avec séquestre bancaire garanti par Habitoo.
                </p>
              </div>
              <Link to="/recherche" className="btn-ghost-dark" style={{ padding: '8px 16px', textDecoration: 'none' }}>
                <span>Explorer d'autres biens</span>
              </Link>
            </div>

            {scheduledVisits.length === 0 ? (
              <div className="empty-state-card">
                <div className="empty-state-icon">
                  <Calendar size={32} color="var(--primary-red)" />
                </div>
                <h3 className="empty-state-title">Aucune visite programmée</h3>
                <p className="empty-state-desc">
                  Explorez le catalogue Habitoo pour réserver une visite avec garantie de séquestre sécurisé.
                </p>
                <Link to="/recherche" className="btn-primary" style={{ padding: '10px 22px', textDecoration: 'none' }}>
                  Découvrir les biens
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {scheduledVisits.map((visit) => (
                  <div key={visit.id} className="visit-card-item">
                    <div className="visit-card-icon-box">
                      <Calendar size={22} color="var(--primary-red)" />
                    </div>

                    <div className="visit-card-content">
                      <div className="visit-card-badges">
                        <span className={`visit-status-tag ${visit.status === 'Confirmé' ? 'confirmed' : 'pending'}`}>
                          {visit.status.toUpperCase()}
                        </span>
                        <span className="visit-escrow-badge">
                          <ShieldCheck size={12} />
                          <span>{visit.escrowStatus}</span>
                        </span>
                      </div>

                      <h3 className="visit-title">{visit.propertyTitle}</h3>
                      <div className="visit-address">{visit.propertyAddress}</div>
                      
                      <div className="visit-meta-row">
                        <span>📅 {visit.date} ({visit.time})</span>
                        <span>•</span>
                        <span>Agent : <strong>{visit.agentName}</strong></span>
                      </div>
                    </div>

                    <Link 
                      to={`/bien/${visit.propertyId}`}
                      className="btn-ghost-dark btn-small"
                      style={{ padding: '8px 16px', textDecoration: 'none', alignSelf: 'center' }}
                    >
                      <span>Voir la fiche</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: MES FAVORIS (CONSERVÉ)                             */}
        {/* ========================================================= */}
        {activeTab === 'favorites' && (
          <div className="userspace-panel animate-fadeIn">
            <div className="panel-header-action-row">
              <div>
                <h2 className="panel-title">Mes Favoris</h2>
                <p className="panel-subtitle">
                  Retrouvez les propriétés sauvegardées pour vos futurs projets d'achat ou de location.
                </p>
              </div>
              <Link to="/recherche" className="btn-ghost-dark" style={{ padding: '8px 16px', textDecoration: 'none' }}>
                <span>Rechercher des biens</span>
              </Link>
            </div>

            {favoriteProperties.length === 0 ? (
              <div className="empty-state-card">
                <div className="empty-state-icon">
                  <Heart size={32} color="var(--primary-red)" />
                </div>
                <h3 className="empty-state-title">Aucun bien dans vos favoris</h3>
                <p className="empty-state-desc">
                  Cliquez sur l'icône cœur lors de vos recherches pour enregistrer vos propriétés préférées.
                </p>
                <Link to="/recherche" className="btn-primary" style={{ padding: '10px 22px', textDecoration: 'none' }}>
                  Explorer le catalogue
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '24px' }}>
                {favoriteProperties.map((prop) => (
                  <PropertyCard key={prop.id} property={prop} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: NOTIFICATIONS                                      */}
        {/* ========================================================= */}
        {activeTab === 'notifications' && (
          <div className="userspace-panel animate-fadeIn">
            <div className="panel-header-action-row">
              <div>
                <h2 className="panel-title">Notifications</h2>
                <p className="panel-subtitle">
                  Restez informé des confirmations de visites, alertes de séquestre et actualités de vos annonces.
                </p>
              </div>
              {notifications.length > 0 && (
                <button
                  type="button"
                  className="btn-ghost-dark btn-small"
                  onClick={markAllNotificationsRead}
                >
                  <Check size={14} />
                  <span>Tout marquer comme lu</span>
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="empty-state-card">
                <div className="empty-state-icon">
                  <Bell size={32} color="var(--graphite-gray)" />
                </div>
                <h3 className="empty-state-title">Aucune notification</h3>
                <p className="empty-state-desc">
                  Vous recevrez ici les mises à jour en direct concernant vos visites et vos annonces.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`notif-card-item ${notif.read ? 'read' : 'unread'}`}
                  >
                    <div className="notif-icon-wrap">
                      {notif.type === 'VISIT' ? (
                        <Calendar size={18} color="#2563EB" />
                      ) : notif.type === 'ESCROW' ? (
                        <ShieldCheck size={18} color="var(--verified-green)" />
                      ) : (
                        <Bell size={18} color="var(--primary-red)" />
                      )}
                    </div>

                    <div className="notif-content-area">
                      <div className="notif-top-row">
                        <span className="notif-title">{notif.title}</span>
                        <span className="notif-time">{notif.date}</span>
                      </div>
                      <p className="notif-message">{notif.message}</p>
                    </div>

                    <button
                      type="button"
                      className="notif-del-btn"
                      title="Supprimer cette notification"
                      onClick={() => deleteNotification(notif.id)}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: PARAMÈTRES (DEVISE, DÉCONNEXION & ZONE DANGER)       */}
        {/* ========================================================= */}
        {activeTab === 'settings' && (
          <div className="userspace-panel animate-fadeIn">
            <div className="panel-card" style={{ marginBottom: '24px' }}>
              <h2 className="panel-title">Marché et Devise par défaut</h2>
              <p className="panel-subtitle" style={{ marginBottom: '20px' }}>
                Sélectionnez votre marché régional actif pour adapter les annonces et la devise d'affichage sur l'ensemble de la plateforme.
              </p>

              <div className="settings-market-grid">
                {CITIES.map((city) => {
                  const isSelected = activeCity?.id === city.id;
                  return (
                    <button
                      key={city.id}
                      type="button"
                      className={`settings-market-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setActiveCity(city)}
                    >
                      <div className="market-card-flag">{city.flag}</div>
                      <div className="market-card-info">
                        <div className="market-card-name">{city.country}</div>
                      </div>
                      <div className="market-card-currency-pill">
                        {city.currency} ({city.symbol})
                      </div>
                      {isSelected && (
                        <div className="market-card-check">
                          <Check size={14} color="#FFF" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Session & Déconnexion */}
            <div className="panel-card" style={{ marginBottom: '24px' }}>
              <h3 className="panel-title" style={{ fontSize: '1.05rem' }}>Session active</h3>
              <p className="panel-subtitle" style={{ marginBottom: '16px' }}>
                Vous êtes actuellement connecté en tant que <strong>{currentUser.name}</strong> ({currentUser.email || currentUser.phone}).
              </p>
              
              <button
                type="button"
                className="btn-ghost-dark"
                style={{ padding: '9px 20px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                onClick={() => {
                  logout();
                  navigate('/', { replace: true });
                }}
              >
                <LogOut size={16} />
                <span>Se déconnecter de la session</span>
              </button>
            </div>

            {/* Zone de Danger (Suppression de compte) */}
            <div className="danger-zone-card">
              <div className="danger-zone-header">
                <div className="danger-icon-box">
                  <AlertTriangle size={20} color="#DC2626" />
                </div>
                <div>
                  <h3 className="danger-zone-title">Zone de Danger</h3>
                  <p className="danger-zone-desc">
                    La suppression de votre compte est définitive. Toutes vos données (annonces publiées, visites programmées, favoris et historique) seront irréversiblement effacées.
                  </p>
                </div>
              </div>

              <div className="danger-zone-action">
                <button
                  type="button"
                  className="btn-danger-delete"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <Trash2 size={15} />
                  <span>Supprimer définitivement mon compte</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODALE DE CONFIRMATION DE SUPPRESSION DE COMPTE */}
      {showDeleteModal && (
        <div className="modal-overlay-backdrop animate-fadeIn" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-danger-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="danger-modal-icon-circle">
              <AlertTriangle size={32} color="#DC2626" />
            </div>

            <h3 className="danger-modal-title">Supprimer définitivement le compte ?</h3>
            <p className="danger-modal-desc">
              Cette action est <strong>irréversible</strong>. Votre compte <strong>{currentUser.name}</strong>, vos annonces enregistrées et toutes vos préférences seront définitivement supprimés de cet appareil.
            </p>

            <div className="danger-modal-buttons">
              <button
                type="button"
                className="btn-ghost-dark"
                style={{ flex: 1, padding: '10px' }}
                onClick={() => setShowDeleteModal(false)}
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn-danger-confirm"
                style={{ flex: 1, padding: '10px' }}
                onClick={handleConfirmDelete}
              >
                Oui, supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCOPED COMPONENT STYLES */}
      <style>{`
        .userspace-wrapper {
          background-color: var(--bg-main);
          min-height: calc(100vh - var(--header-height));
          width: 100%;
        }

        /* TAB NAVIGATION BAR */
        .userspace-tab-nav {
          display: flex;
          align-items: center;
          gap: 6px;
          border-bottom: 2px solid var(--border-color);
          margin-bottom: 24px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .userspace-tab-nav::-webkit-scrollbar {
          display: none;
        }

        .userspace-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 18px;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          margin-bottom: -2px;
          font-family: var(--font-body);
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--graphite-gray);
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.18s ease;
          border-radius: 6px 6px 0 0;
        }
        .userspace-tab-btn:hover {
          color: var(--obsidian-black);
          background-color: rgba(0, 0, 0, 0.02);
        }
        .userspace-tab-btn.active {
          color: var(--primary-red);
          border-bottom-color: var(--primary-red);
          font-weight: 700;
        }

        .tab-counter-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: var(--border-color);
          color: var(--obsidian-black);
          font-size: 0.7rem;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: 10px;
          min-width: 16px;
        }
        .tab-counter-badge.notif-badge {
          background-color: var(--primary-red);
          color: #FFF;
        }

        /* PANELS & CARDS */
        .userspace-panel {
          width: 100%;
        }
        .panel-card {
          background-color: var(--surface-white);
          border: 1px solid var(--border-color);
          border-radius: 14px;
          padding: 24px 28px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.02);
        }

        .panel-card-header, .panel-header-action-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 20px;
        }
        .panel-title {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--obsidian-black);
          margin-bottom: 4px;
        }
        .panel-subtitle {
          font-size: 0.84rem;
          color: var(--graphite-gray);
          line-height: 1.45;
          margin: 0;
        }

        .badge-certified {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--verified-green);
          background-color: var(--verified-green-bg);
          padding: 4px 12px;
          border-radius: var(--radius-pill);
        }

        .alert-success-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          background-color: #ECFDF5;
          border: 1px solid #A7F3D0;
          color: #065F46;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 20px;
        }

        /* AVATAR ROW */
        .profile-avatar-row {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .avatar-preview-wrap {
          position: relative;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 2px solid var(--border-color);
          flex-shrink: 0;
        }
        .profile-avatar-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }
        .avatar-edit-fab {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 30px;
          height: 30px;
          min-height: unset !important;
          aspect-ratio: 1 / 1 !important;
          border-radius: 50% !important;
          background-color: var(--primary-red);
          color: #FFF;
          border: 2px solid #FFF;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: transform 0.15s ease;
          box-shadow: 0 2px 6px rgba(247, 0, 0, 0.35);
        }
        .avatar-edit-fab:hover {
          transform: scale(1.1);
        }

        .avatar-meta-info {
          flex: 1;
          min-width: 220px;
        }
        .avatar-meta-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--obsidian-black);
        }
        .avatar-meta-hint {
          font-size: 0.78rem;
          color: var(--graphite-gray);
          margin-top: 2px;
          line-height: 1.4;
        }

        .form-divider {
          height: 1px;
          background-color: var(--border-color);
          margin: 20px 0;
        }

        /* FORM GRID */
        .profile-form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        @media (max-width: 680px) {
          .profile-form-grid {
            grid-template-columns: 1fr;
          }
        }

        .field-group {
          display: flex;
          flex-direction: column;
        }
        .field-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--obsidian-black);
          margin-bottom: 4px;
        }
        .field-input {
          width: 100%;
          height: 40px;
          padding: 8px 12px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          font-size: 0.85rem;
          color: var(--obsidian-black);
          background-color: #FAFAFA;
          box-sizing: border-box;
          transition: all 0.15s ease;
        }
        .field-input:focus {
          outline: none;
          border-color: var(--primary-red);
          background-color: #FFF;
          box-shadow: 0 0 0 3px var(--soft-tint);
        }
        .field-input.has-icon {
          padding-left: 36px;
        }
        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-leading-icon {
          position: absolute;
          left: 12px;
          color: var(--graphite-gray);
          pointer-events: none;
        }
        .field-tag-verified {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--verified-green);
          background-color: var(--verified-green-bg);
          padding: 1px 6px;
          border-radius: 4px;
        }

        .form-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid var(--border-color);
        }
        .member-id-pill {
          font-size: 0.75rem;
          color: var(--graphite-gray);
        }

        /* EMPTY STATE */
        .empty-state-card {
          background-color: var(--surface-white);
          border: 1px dashed var(--border-color);
          border-radius: 14px;
          padding: 48px 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 10px;
        }
        .empty-state-icon {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background-color: var(--soft-tint);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }
        .empty-state-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--obsidian-black);
          margin-bottom: 6px;
        }
        .empty-state-desc {
          max-width: 440px;
          font-size: 0.84rem;
          color: var(--graphite-gray);
          line-height: 1.5;
          margin-bottom: 20px;
        }

        /* USER PROPERTIES GRID */
        .properties-user-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
          gap: 20px;
        }
        .user-prop-card {
          background-color: var(--surface-white);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
          display: flex;
          flex-direction: column;
        }
        .user-prop-thumb-wrap {
          position: relative;
          height: 155px;
          width: 100%;
        }
        .user-prop-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .prop-status-tag {
          position: absolute;
          top: 10px;
          left: 10px;
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--verified-green);
          background-color: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(4px);
          padding: 2px 8px;
          border-radius: var(--radius-pill);
        }
        .prop-category-tag {
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: 0.68rem;
          font-weight: 700;
          color: #FFF;
          background-color: rgba(0, 0, 0, 0.65);
          padding: 2px 8px;
          border-radius: var(--radius-pill);
        }

        .user-prop-body {
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .user-prop-ref {
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--graphite-gray);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .user-prop-title {
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--obsidian-black);
          margin: 3px 0 6px;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .user-prop-location {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          color: var(--graphite-gray);
          margin-bottom: 8px;
        }
        .user-prop-price {
          font-size: 1rem;
          font-weight: 800;
          color: var(--primary-red);
          margin-top: auto;
          margin-bottom: 12px;
        }
        .price-period {
          font-size: 0.72rem;
          font-weight: 500;
          color: var(--graphite-gray);
        }
        .user-prop-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          border-top: 1px solid var(--border-color);
          padding-top: 10px;
        }
        .btn-del-prop {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: 1px solid var(--border-color);
          background: transparent;
          color: #DC2626;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }
        .btn-del-prop:hover {
          background-color: #FEE2E2;
        }

        /* VISITS CARD ITEM */
        .visit-card-item {
          background-color: var(--surface-white);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 18px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .visit-card-icon-box {
          width: 46px;
          height: 46px;
          border-radius: 10px;
          background-color: var(--soft-tint);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .visit-card-content {
          flex: 1;
          min-width: 220px;
        }
        .visit-card-badges {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        .visit-status-tag {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .visit-status-tag.confirmed {
          background-color: var(--verified-green-bg);
          color: var(--verified-green);
        }
        .visit-status-tag.pending {
          background-color: #FEF3C7;
          color: #B45309;
        }
        .visit-escrow-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.7rem;
          color: var(--graphite-gray);
        }
        .visit-title {
          font-size: 0.98rem;
          font-weight: 700;
          color: var(--obsidian-black);
          margin-bottom: 2px;
        }
        .visit-address {
          font-size: 0.78rem;
          color: var(--graphite-gray);
          margin-bottom: 6px;
        }
        .visit-meta-row {
          font-size: 0.78rem;
          color: var(--obsidian-black);
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* NOTIFICATIONS */
        .notif-card-item {
          background-color: var(--surface-white);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          padding: 14px 16px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          transition: background-color 0.15s ease;
        }
        .notif-card-item.unread {
          border-left: 3px solid var(--primary-red);
          background-color: #FFF9F9;
        }
        .notif-icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background-color: var(--bg-main);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .notif-content-area {
          flex: 1;
          min-width: 0;
        }
        .notif-top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          margin-bottom: 2px;
        }
        .notif-title {
          font-size: 0.86rem;
          font-weight: 700;
          color: var(--obsidian-black);
        }
        .notif-time {
          font-size: 0.72rem;
          color: var(--graphite-gray);
        }
        .notif-message {
          font-size: 0.78rem;
          color: var(--graphite-gray);
          margin: 0;
          line-height: 1.4;
        }
        .notif-del-btn {
          border: none;
          background: transparent;
          color: var(--graphite-gray);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          opacity: 0.6;
        }
        .notif-del-btn:hover {
          opacity: 1;
          color: #DC2626;
        }

        /* SETTINGS: MARKETS */
        .settings-market-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 14px;
        }
        .settings-market-card {
          position: relative;
          background-color: var(--bg-main);
          border: 1.5px solid var(--border-color);
          border-radius: 10px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          text-align: left;
          transition: all 0.18s ease;
        }
        .settings-market-card:hover {
          border-color: var(--primary-red);
          background-color: #FFF;
        }
        .settings-market-card.selected {
          border-color: var(--primary-red);
          background-color: var(--soft-tint);
        }
        .market-card-flag {
          font-size: 1.8rem;
        }
        .market-card-info {
          flex: 1;
        }
        .market-card-name {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--obsidian-black);
        }
        .market-card-country {
          font-size: 0.75rem;
          color: var(--graphite-gray);
        }
        .market-card-currency-pill {
          font-size: 0.75rem;
          font-weight: 700;
          background: #FFF;
          border: 1px solid var(--border-color);
          padding: 3px 8px;
          border-radius: 4px;
          color: var(--obsidian-black);
        }
        .market-card-check {
          position: absolute;
          top: -6px;
          right: -6px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: var(--primary-red);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* DANGER ZONE */
        .danger-zone-card {
          background-color: #FEF2F2;
          border: 1px solid #FECACA;
          border-radius: 14px;
          padding: 24px 28px;
        }
        .danger-zone-header {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          margin-bottom: 18px;
        }
        .danger-icon-box {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          background-color: #FEE2E2;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .danger-zone-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: #991B1B;
          margin-bottom: 4px;
        }
        .danger-zone-desc {
          font-size: 0.82rem;
          color: #7F1D1D;
          margin: 0;
          line-height: 1.45;
        }
        .btn-danger-delete {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: #DC2626;
          color: #FFF;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 0.84rem;
          font-weight: 700;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }
        .btn-danger-delete:hover {
          background-color: #B91C1C;
        }

        /* DANGER MODAL */
        .modal-overlay-backdrop {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
          padding: 20px;
        }
        .modal-danger-dialog {
          background-color: #FFF;
          max-width: 420px;
          width: 100%;
          border-radius: 16px;
          padding: 28px 24px;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }
        .danger-modal-icon-circle {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background-color: #FEE2E2;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 14px;
        }
        .danger-modal-title {
          font-size: 1.2rem;
          font-weight: 800;
          color: #991B1B;
          margin-bottom: 8px;
        }
        .danger-modal-desc {
          font-size: 0.84rem;
          color: var(--graphite-gray);
          line-height: 1.45;
          margin-bottom: 22px;
        }
        .danger-modal-buttons {
          display: flex;
          gap: 10px;
        }
        .btn-danger-confirm {
          background-color: #DC2626;
          color: #FFF;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
        }
        .btn-danger-confirm:hover {
          background-color: #B91C1C;
        }

        .btn-small {
          padding: 6px 14px !important;
          font-size: 0.78rem !important;
        }

        .animate-fadeIn {
          animation: fadeIn 0.18s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
