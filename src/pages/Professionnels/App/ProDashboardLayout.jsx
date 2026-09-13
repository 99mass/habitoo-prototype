import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProTopHeader } from './ProTopHeader';
import { ProTabView } from './ProTabView';
import { ProDashboardView } from './ProDashboardView';
import { ProPropertiesView } from './views/ProPropertiesView';
import { ProVisitsView } from './views/ProVisitsView';
import { ProRevenueView } from './views/ProRevenueView';
import { ProCreditsView } from './views/ProCreditsView';
import { ProProfileView } from './views/ProProfileView';
import { ProSettingsView } from './views/ProSettingsView';
import { PROPERTIES_DATA } from '../../../data/propertiesData';
import { 
  GraduationCap, 
  ArrowRight
} from 'lucide-react';
import './ProDashboard.css';

// Initialisation des annonces du professionnel
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

export const ProDashboardLayout = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'overview';
  const actionParam = searchParams.get('action') || '';

  const [persona, setPersona] = useState('demarcheur'); // 'demarcheur' | 'agence'
  const [credits, setCredits] = useState(45);
  const [propertiesList, setPropertiesList] = useState(INITIAL_PROPERTIES);

  // État dynamique du profil synchronisé avec la navbar
  const [userProfile, setUserProfile] = useState({
    name: 'Jean-Marc Kouassi',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    phone: '+225 07 89 22 14 00',
    email: 'j.kouassi@habitoo-pro.ci',
    address: 'Immeuble Palm Club, 3ème étage, Boulevard Latrille',
    city: 'Abidjan',
    license: 'AGR-CI-2024-0892'
  });

  useEffect(() => {
    document.title = "Habitoo PRO | dashboard"
  
  }, []);

  const handleSelectTab = (tabId, params = {}) => {
    setSearchParams({ tab: tabId, ...params });
  };

  const handlePersonaChange = (newPersona) => {
    setPersona(newPersona);
    if (newPersona === 'agence') {
      setUserProfile(prev => ({
        ...prev,
        name: 'Ivoire Prestige Conseil',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'
      }));
    } else {
      setUserProfile(prev => ({
        ...prev,
        name: 'Jean-Marc Kouassi',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      }));
    }
  };

  const handleRechargeSuccess = (addedCredits) => {
    setCredits(prev => prev + addedCredits);
  };

  const handleAddProperty = (newProperty, creditsUsed = 0) => {
    setPropertiesList(prev => [newProperty, ...prev]);
    if (creditsUsed > 0) {
      setCredits(prev => Math.max(0, prev - creditsUsed));
    }
  };

  const handleSaveProfile = (updatedProfile) => {
    setUserProfile(prev => ({
      ...prev,
      ...updatedProfile
    }));
  };

  return (
    <div className="habitoo-dash-shell">
      {/* 1. Bandeau supérieur institutionnel épuré (sans rôle sous le nom, sans bouton publier) */}
      <ProTopHeader
        persona={persona}
        onPersonaChange={handlePersonaChange}
        credits={credits}
        onOpenCreditsModal={() => handleSelectTab('credits')}
        userProfile={userProfile}
      />

      {/* 2. Barre d'onglets de prestige sticky (7 onglets épurés avec 'Profil') */}
      <ProTabView
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        persona={persona}
        propertyCount={propertiesList.length}
      />

      {/* 3. Conteneur Full Canvas */}
      <main className="habitoo-dash-main">
        <div className="habitoo-dash-container">
          
          {/* Onglet 1 : Vue d'ensemble (Cockpit de décision sans mandats) */}
          {activeTab === 'overview' && (
            <ProDashboardView
              onSelectTab={handleSelectTab}
              onOpenCreditsModal={() => handleSelectTab('credits')}
            />
          )}

          {/* Onglet 2 : Mes Annonces (Listing sans colonne performance + publication in-space) */}
          {activeTab === 'properties' && (
            <ProPropertiesView
              onOpenCreditsModal={() => handleSelectTab('credits')}
              credits={credits}
              action={actionParam}
              onNavigateNew={() => handleSelectTab('properties', { action: 'new' })}
              onCancelNew={() => handleSelectTab('properties')}
              propertiesList={propertiesList}
              onAddProperty={handleAddProperty}
            />
          )}

          {/* Onglet 3 : Mes Visites (À faire vs Passées & Disponibilités) */}
          {activeTab === 'visits' && (
            <ProVisitsView />
          )}

          {/* Onglet 4 : Revenus (Finances, Virements, Historique) */}
          {activeTab === 'revenue' && (
            <ProRevenueView />
          )}

          {/* Onglet 5 : Habitoo Académie (Conditionnel démarcheur) */}
          {activeTab === 'academy' && persona === 'demarcheur' && (
            <div className="habitoo-dash-tab-placeholder">
              <div className="habitoo-dash-tab-placeholder__card">
                <div className="habitoo-dash-tab-placeholder__icon-wrap">
                  <GraduationCap size={24} />
                </div>
                <h2 className="habitoo-dash-tab-placeholder__title">Habitoo Académie</h2>
                <p className="habitoo-dash-tab-placeholder__desc">
                  Modules de perfectionnement professionnel : prise de vue immobilière, argumentation et déontologie de visite.
                </p>
                <button
                  type="button"
                  onClick={() => alert("Masterclass 'Sublimer vos biens d'exception' démarrée.")}
                  className="habitoo-dash-btn-primary"
                >
                  Lancer la formation
                </button>
              </div>
            </div>
          )}

          {/* Onglet 6 : Profil (Édition photo, coordonnées, biographie) */}
          {(activeTab === 'profile' || activeTab === 'reputation') && (
            <ProProfileView
              userProfile={userProfile}
              onSaveProfile={handleSaveProfile}
              persona={persona}
            />
          )}

          {/* Onglet 7 : Paramètres (Mot de passe, alertes, sessions actives) */}
          {activeTab === 'settings' && (
            <ProSettingsView />
          )}

          {/* Vue Dédiée Recharge Crédits Boost (Paiement SaaS Wave / Mobile Money / Carte) */}
          {activeTab === 'credits' && (
            <ProCreditsView
              currentCredits={credits}
              onRechargeSuccess={handleRechargeSuccess}
              onBack={() => handleSelectTab('properties')}
            />
          )}

        </div>
      </main>
    </div>
  );
};
