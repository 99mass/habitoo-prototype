import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Search, 
  Plus, 
  Eye, 
  MessageSquare, 
  Flame, 
  CheckCircle, 
  Zap, 
  MapPin, 
  ExternalLink, 
  Edit3 
} from 'lucide-react';
import { PROPERTIES_DATA } from '../../../../data/propertiesData';

// Extraction et normalisation des annonces du professionnel
const USER_PROPERTIES = PROPERTIES_DATA
  .filter(p => p.isPro || p.advertiserType === 'PRO')
  .slice(0, 6)
  .map((p, idx) => {
    const isBoosted = idx === 0 || idx === 3;
    const views = [5420, 4110, 3890, 3120, 2480, 1950][idx] || 2000;
    const inquiries = [142, 98, 76, 64, 42, 31][idx] || 50;
    const score = [94, 82, 78, 86, 72, 68][idx] || 75;

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
      inquiries,
      score
    };
  });

export const ProPropertiesView = ({ onOpenCreditsModal }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'BOOSTED'

  const filteredProps = USER_PROPERTIES.filter(prop => {
    const matchesSearch = prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          prop.neighborhood.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || prop.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const boostedCount = USER_PROPERTIES.filter(p => p.status === 'BOOSTED').length;
  const activeCount = USER_PROPERTIES.filter(p => p.status === 'ACTIVE').length;

  return (
    <div className="habitoo-dash-section">
      
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
              Toutes ({USER_PROPERTIES.length})
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
          <Link to="/publier" className="habitoo-dash-btn-primary">
            <Plus size={14} />
            <span>Publier un nouveau mandat</span>
          </Link>
        </div>
      </div>

      {/* Liste complète des annonces */}
      <div className="habitoo-dash-card" style={{ padding: '0', overflow: 'hidden' }}>
        <table className="habitoo-dash-table">
          <thead>
            <tr>
              <th>Bien</th>
              <th>Catégorie</th>
              <th>Prix</th>
              <th>Performances</th>
              <th>Statut</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProps.map((prop) => (
              <tr key={prop.id}>
                {/* Bien : photo & titre */}
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

                {/* Catégorie */}
                <td>
                  <span className="habitoo-dash-table-type">{prop.type} ({prop.category})</span>
                </td>

                {/* Prix */}
                <td>
                  <strong className="habitoo-dash-table-price">{prop.price}</strong>
                </td>

                {/* Performances */}
                <td>
                  <div className="habitoo-dash-table-metrics">
                    <div className="habitoo-dash-table-metrics__row">
                      <span><Eye size={12} /> {prop.views.toLocaleString('fr-FR')} vues</span>
                      <span><MessageSquare size={12} /> {prop.inquiries} contacts</span>
                    </div>
                    <div className="habitoo-dash-table-score-bar">
                      <div
                        className="habitoo-dash-table-score-fill"
                        style={{ width: `${prop.score}%` }}
                      />
                    </div>
                  </div>
                </td>

                {/* Statut */}
                <td>
                  <span className={`habitoo-dash-table-badge habitoo-dash-table-badge--${prop.status.toLowerCase()}`}>
                    {prop.status === 'BOOSTED' ? <Flame size={11} /> : <CheckCircle size={11} />}
                    {prop.statusLabel}
                  </span>
                </td>

                {/* Actions directes */}
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

    </div>
  );
};
