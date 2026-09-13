import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Search,
  Plus,
  Flame,
  CheckCircle,
  Zap,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Eye,
  BedDouble,
  ShieldCheck,
  X
} from 'lucide-react';
import { PROPERTIES_DATA } from '../../../../data/propertiesData';
import { ProNewPropertyForm } from './ProNewPropertyForm';

// Extraction et normalisation des annonces initiales du professionnel
const INITIAL_PROPERTIES = PROPERTIES_DATA
  .filter(p => p.isPro || p.advertiserType === 'PRO')
  .slice(0, 6)
  .map((p, idx) => {
    const isBoosted = idx === 0 || idx === 3;
    const views = [5420, 4110, 3890, 3120, 2480, 1950][idx] || 2000;
    const inquiries = [142, 98, 76, 64, 42, 31][idx] || 50;

    return {
      id: p.id,
      title: p.title,
      type: p.type,
      category: p.category === 'LOCATION' ? 'Location' : 'Vente',
      city: p.city,
      neighborhood: p.neighborhood,
      price: `${p.priceXOF.toLocaleString('fr-FR')} FCFA${p.period || ''}`,
      image: p.images[0] || '/assets/villa-abidjan-signature.jpg',
      specs: `${p.specs.bedrooms} ch. • ${p.specs.area} m²`,
      status: isBoosted ? 'BOOSTED' : 'ACTIVE',
      statusLabel: isBoosted ? 'Boostée' : 'En ligne',
      views,
      inquiries
    };
  });

export const ProPropertiesView = ({
  onOpenCreditsModal,
  credits = 45,
  action,
  onNavigateNew,
  onCancelNew,
  propertiesList,
  onAddProperty,
  userProfile
}) => {
  // Liste locale si non fournie depuis le layout
  const [localProps, setLocalProps] = useState(INITIAL_PROPERTIES);
  const [localIsCreating, setLocalIsCreating] = useState(false);
  const [successToast, setSuccessToast] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);

  const propsData = propertiesList || localProps;
  const isCreating = action === 'new' || localIsCreating;

  const matchedFullProp = PROPERTIES_DATA.find(p => p.id === selectedProperty?.id);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'BOOSTED'

  const filteredProps = propsData.filter(prop => {
    const matchesSearch = prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.neighborhood.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || prop.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const boostedCount = propsData.filter(p => p.status === 'BOOSTED').length;
  const activeCount = propsData.filter(p => p.status === 'ACTIVE').length;

  const handleStartCreate = () => {
    if (onNavigateNew) {
      onNavigateNew();
    } else {
      setLocalIsCreating(true);
    }
  };

  const handleCancelCreate = () => {
    if (onCancelNew) {
      onCancelNew();
    } else {
      setLocalIsCreating(false);
    }
  };

  const handlePublishProperty = (newProp, creditsUsed) => {
    if (onAddProperty) {
      onAddProperty(newProp, creditsUsed);
    } else {
      setLocalProps(prev => [newProp, ...prev]);
    }

    handleCancelCreate();
    setSuccessToast(`L'annonce « ${newProp.title} » a été publiée avec succès sur Habitoo PRO.`);
    setTimeout(() => setSuccessToast(''), 5000);
  };

  // Si on est en mode création in-space
  if (isCreating) {
    return (
      <ProNewPropertyForm
        onCancel={handleCancelCreate}
        onPublish={handlePublishProperty}
        currentCredits={credits}
        userProfile={userProfile}
      />
    );
  }

  return (
    <div className="habitoo-dash-section">

      {/* Toast de confirmation de publication */}
      {successToast && (
        <div className="habitoo-dash-toast-success">
          <CheckCircle2 size={16} />
          <span>{successToast}</span>
        </div>
      )}

      {/* Barre d'outils et actions */}
      <div className="habitoo-dash-toolbar">
        <div className="habitoo-dash-toolbar__left">
          <div className="habitoo-dash-search-input-wrap">
            <Search size={15} />
            <input
              type="text"
              placeholder="Rechercher une annonce par titre, quartier..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="habitoo-dash-search-input"
            />
          </div>

          <div className="habitoo-dash-filter-group">
            <button
              type="button"
              className={`habitoo-dash-filter-pill ${statusFilter === 'ALL' ? 'habitoo-dash-filter-pill--active' : ''}`}
              onClick={() => setStatusFilter('ALL')}
            >
              Toutes ({propsData.length})
            </button>
            <button
              type="button"
              className={`habitoo-dash-filter-pill ${statusFilter === 'ACTIVE' ? 'habitoo-dash-filter-pill--active' : ''}`}
              onClick={() => setStatusFilter('ACTIVE')}
            >
              En ligne ({activeCount})
            </button>
            <button
              type="button"
              className={`habitoo-dash-filter-pill ${statusFilter === 'BOOSTED' ? 'habitoo-dash-filter-pill--active' : ''}`}
              onClick={() => setStatusFilter('BOOSTED')}
            >
              Boostées ({boostedCount})
            </button>
          </div>
        </div>

        <div className="habitoo-dash-toolbar__right">
          <button
            type="button"
            className="habitoo-dash-btn-primary"
            onClick={handleStartCreate}
          >
            <Plus size={14} />
            <span>Publier une annonce</span>
          </button>
        </div>
      </div>

      {/* Desktop : Table complète des annonces (masquée sur mobile via CSS) */}
      <div className="habitoo-dash-card pro-desktop-only" style={{ padding: '0', overflow: 'hidden' }}>
        <table className="habitoo-dash-table">
          <thead>
            <tr>
              <th>Bien</th>
              <th>Catégorie</th>
              <th>Prix</th>
              <th>Statut</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProps.map((prop) => (
              <tr key={prop.id}>
                <td>
                  <div className="habitoo-dash-table-prop">
                    <img src={prop.image} alt={prop.title} className="habitoo-dash-table-prop__thumb" />
                    <div>
                      <h4 className="habitoo-dash-table-prop__title">{prop.title}</h4>
                      <div className="habitoo-dash-table-prop__loc">
                        <MapPin size={11} /> {prop.neighborhood}, {prop.city} • {prop.specs}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="habitoo-dash-table-type">{prop.type} ({prop.category})</span>
                </td>
                <td>
                  <strong className="habitoo-dash-table-price">{prop.price}</strong>
                </td>
                <td>
                  <span className={`habitoo-dash-table-badge habitoo-dash-table-badge--${prop.status.toLowerCase()}`}>
                    {prop.status === 'BOOSTED' ? <Flame size={11} /> : <CheckCircle size={11} />}
                    {prop.statusLabel}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div className="habitoo-dash-table-actions">
                    <button
                      type="button"
                      className={`habitoo-dash-btn-boost-table ${prop.status === 'BOOSTED' ? 'habitoo-dash-btn-boost-table--active' : ''}`}
                      onClick={() => onOpenCreditsModal && onOpenCreditsModal()}
                    >
                      <Zap size={12} />
                      <span>{prop.status === 'BOOSTED' ? 'Boost Actif' : 'Booster'}</span>
                    </button>
                    <Link to={`/bien/${prop.id}`} className="habitoo-dash-btn-icon" title="Voir l'annonce sur le site">
                      <ExternalLink size={14} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile : Cards empilables (masquées sur desktop via CSS) */}
      <div className="pro-mobile-only pro-property-cards">
        {filteredProps.map((prop) => (
          <div
            key={prop.id}
            className="pro-property-card"
            onClick={() => setSelectedProperty(prop)}
            role="button"
            tabIndex={0}
            title="Appuyez pour voir les détails de l'annonce"
          >
            <div className="pro-property-card__image-wrap">
              <img src={prop.image} alt={prop.title} className="pro-property-card__image" />
              <span className={`pro-property-card__status pro-property-card__status--${prop.status.toLowerCase()}`}>
                {prop.status === 'BOOSTED' ? <Flame size={11} /> : <CheckCircle size={11} />}
                {prop.statusLabel}
              </span>
            </div>
            <div className="pro-property-card__body">
              <h4 className="pro-property-card__title">{prop.title}</h4>
              <div className="pro-property-card__loc">
                <MapPin size={11} />
                <span>{prop.neighborhood}, {prop.city}</span>
              </div>
              <div className="pro-property-card__meta">
                <strong className="pro-property-card__price">{prop.price}</strong>
                <span className="pro-property-card__specs">{prop.specs}</span>
              </div>
              <div className="pro-property-card__actions" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className={`habitoo-dash-btn-boost-table ${prop.status === 'BOOSTED' ? 'habitoo-dash-btn-boost-table--active' : ''}`}
                  onClick={() => onOpenCreditsModal && onOpenCreditsModal()}
                >
                  <Zap size={12} />
                  <span>{prop.status === 'BOOSTED' ? 'Boost Actif' : 'Booster'}</span>
                </button>
                <button
                  type="button"
                  className="pro-property-card__btn-details"
                  onClick={() => setSelectedProperty(prop)}
                  title="Voir les détails complets de la fiche"
                >
                  <Eye size={13} />
                  <span>Voir détails</span>
                </button>
                <Link to={`/bien/${prop.id}`} className="habitoo-dash-btn-icon" title="Voir l'annonce sur le site">
                  <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modale Fiche de Gestion PRO (Mobile & Responsive) */}
      {selectedProperty && (
        <div className="habitoo-dash-modal-overlay" onClick={() => setSelectedProperty(null)}>
          <div
            className="habitoo-dash-modal pro-prop-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="pro-prop-modal-title"
          >
            <button
              type="button"
              className="habitoo-dash-modal__close pro-prop-modal__close"
              onClick={() => setSelectedProperty(null)}
              aria-label="Fermer la modale"
            >
              <X size={18} />
            </button>

            {/* Bannière avec Image principale & Badge statut */}
            <div className="pro-prop-modal__banner">
              <img
                src={selectedProperty.image}
                alt={selectedProperty.title}
                className="pro-prop-modal__img"
              />
              <div className="pro-prop-modal__banner-overlay">
                <div className="pro-prop-modal__badges">
                  <span className={`pro-property-card__status pro-property-card__status--${selectedProperty.status.toLowerCase()}`}>
                    {selectedProperty.status === 'BOOSTED' ? <Flame size={12} /> : <CheckCircle size={12} />}
                    {selectedProperty.statusLabel}
                  </span>
                  <span className="pro-prop-modal__category-tag">
                    {selectedProperty.category} • {selectedProperty.type}
                  </span>
                </div>
                <h3 id="pro-prop-modal-title" className="pro-prop-modal__title">
                  {selectedProperty.title}
                </h3>
                <span className="pro-prop-modal__price">{selectedProperty.price}</span>
              </div>
            </div>

            {/* Corps défilable de la modale */}
            <div className="pro-prop-modal__body">

              {/* Statistiques de performance PRO */}
              <div className="pro-prop-modal__perf-card">
                <span className="pro-prop-modal__section-title">Performances de visibilité</span>
                <div className="pro-prop-modal__perf-grid">
                  <div className="pro-prop-modal__perf-item">
                    <span className="pro-prop-modal__perf-val">{(selectedProperty.views || 2400).toLocaleString('fr-FR')}</span>
                    <span className="pro-prop-modal__perf-label">Vues cumulées</span>
                  </div>
                  <div className="pro-prop-modal__perf-item">
                    <span className="pro-prop-modal__perf-val">{(selectedProperty.inquiries || 45)}</span>
                    <span className="pro-prop-modal__perf-label">Demandes reçues</span>
                  </div>
                  <div className="pro-prop-modal__perf-item">
                    <span className="pro-prop-modal__perf-val">
                      {selectedProperty.status === 'BOOSTED' ? '+340%' : 'Standard'}
                    </span>
                    <span className="pro-prop-modal__perf-label">Priorité algorithme</span>
                  </div>
                </div>
              </div>

              {/* Localisation & Caractéristiques clés */}
              <div className="pro-prop-modal__section">
                <span className="pro-prop-modal__section-title">Caractéristiques du bien</span>
                <div className="pro-prop-modal__specs-grid">
                  <div className="pro-prop-modal__spec-chip">
                    <MapPin size={14} className="pro-prop-modal__icon" />
                    <span>{selectedProperty.neighborhood}, {selectedProperty.city}</span>
                  </div>
                  <div className="pro-prop-modal__spec-chip">
                    <BedDouble size={14} className="pro-prop-modal__icon" />
                    <span>{selectedProperty.specs}</span>
                  </div>
                  <div className="pro-prop-modal__spec-chip">
                    <ShieldCheck size={14} className="pro-prop-modal__icon" />
                    <span>Mandat PRO certifié</span>
                  </div>
                </div>
              </div>

              {/* Équipements phares */}
              {matchedFullProp?.amenities && matchedFullProp.amenities.length > 0 && (
                <div className="pro-prop-modal__section">
                  <span className="pro-prop-modal__section-title">Équipements certifiés</span>
                  <div className="pro-prop-modal__amenities-list">
                    {matchedFullProp.amenities.slice(0, 6).map((amenity, idx) => (
                      <div key={idx} className="pro-prop-modal__amenity-pill">
                        <CheckCircle size={12} className="pro-prop-modal__check-icon" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Statut du Boost & Action */}
              <div className="pro-prop-modal__boost-box">
                <div className="pro-prop-modal__boost-left">
                  <Zap size={18} className="pro-prop-modal__boost-icon" />
                  <div>
                    <strong>{selectedProperty.status === 'BOOSTED' ? 'Annonce en tête de recherche' : 'Booster pour maximiser les contacts'}</strong>
                    <p>{selectedProperty.status === 'BOOSTED' ? 'Votre bien bénéficie de la priorité algorithmique et d\'alertes push dédiées.' : 'Multipliez vos prises de contact auprès des acquéreurs qualifiés sous séquestre.'}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className={`habitoo-dash-btn-boost-table ${selectedProperty.status === 'BOOSTED' ? 'habitoo-dash-btn-boost-table--active' : ''}`}
                  onClick={() => {
                    setSelectedProperty(null);
                    onOpenCreditsModal && onOpenCreditsModal();
                  }}
                >
                  <Zap size={12} />
                  <span>{selectedProperty.status === 'BOOSTED' ? 'Gérer le Boost' : 'Booster (5 crédits)'}</span>
                </button>
              </div>

            </div>

            {/* Pied d'actions de la modale */}
            <div className="pro-prop-modal__footer">
              <Link
                to={`/bien/${selectedProperty.id}`}
                className="habitoo-dash-btn-primary pro-prop-modal__public-link"
              >
                <ExternalLink size={14} />
                <span>Voir la page publique</span>
              </Link>
              <button
                type="button"
                className="pro-prop-modal__close-btn"
                onClick={() => setSelectedProperty(null)}
              >
                Fermer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
