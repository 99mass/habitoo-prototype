import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ProTopHeader } from './ProTopHeader';
import { ProTabView } from './ProTabView';
import { ProDashboardView } from './ProDashboardView';
import { ProPropertiesView } from './views/ProPropertiesView';
import { ProVisitsView } from './views/ProVisitsView';
import { ProRevenueView } from './views/ProRevenueView';
import { BoostCreditsModal } from './components/BoostCreditsModal';
import { 
  GraduationCap, 
  UserCheck, 
  Settings,
  ArrowRight
} from 'lucide-react';
import './ProDashboard.css';

export const ProDashboardLayout = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeTab = searchParams.get('tab') || 'overview';
  const [persona, setPersona] = useState('demarcheur'); // 'demarcheur' | 'agence'
  const [credits, setCredits] = useState(45);
  const [isCreditsModalOpen, setIsCreditsModalOpen] = useState(false);

  const handleSelectTab = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  const handleRechargeSuccess = (addedCredits) => {
    setCredits(prev => prev + addedCredits);
  };

  return (
    <div className="habitoo-dash-shell">
      {/* 1. Bandeau supérieur institutionnel */}
      <ProTopHeader
        persona={persona}
        onPersonaChange={setPersona}
        credits={credits}
        onOpenCreditsModal={() => setIsCreditsModalOpen(true)}
      />

      {/* 2. Barre d'onglets de prestige sticky (7 onglets épurés) */}
      <ProTabView
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        persona={persona}
      />

      {/* 3. Conteneur Full Canvas */}
      <main className="habitoo-dash-main">
        <div className="habitoo-dash-container">
          
          {/* Onglet 1 : Vue d'ensemble (Cockpit de décision) */}
          {activeTab === 'overview' && (
            <ProDashboardView
              onSelectTab={handleSelectTab}
              onOpenCreditsModal={() => setIsCreditsModalOpen(true)}
            />
          )}

          {/* Onglet 2 : Mes Annonces (Listing réel et complet) */}
          {activeTab === 'properties' && (
            <ProPropertiesView
              onOpenCreditsModal={() => setIsCreditsModalOpen(true)}
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
                  onClick={() => alert("Masterclass 'Sublimer vos mandats d'exception' démarrée.")}
                  className="habitoo-dash-btn-primary"
                >
                  Lancer la formation
                </button>
              </div>
            </div>
          )}

          {/* Onglet 6 : Profil & Réputation */}
          {activeTab === 'reputation' && (
            <div className="habitoo-dash-tab-placeholder">
              <div className="habitoo-dash-tab-placeholder__card">
                <div className="habitoo-dash-tab-placeholder__icon-wrap">
                  <UserCheck size={24} />
                </div>
                <h2 className="habitoo-dash-tab-placeholder__title">Profil & Réputation Certifiée</h2>
                <p className="habitoo-dash-tab-placeholder__desc">
                  Note globale : <strong>4.9 / 5 (48 avis vérifiés)</strong>. Votre profil accrédité est mis en avant sur toutes vos fiches de biens.
                </p>
                <button
                  type="button"
                  onClick={() => handleSelectTab('overview')}
                  className="habitoo-dash-btn-ghost"
                >
                  Retour à la vue d'ensemble
                </button>
              </div>
            </div>
          )}

          {/* Onglet 7 : Paramètres */}
          {activeTab === 'settings' && (
            <div className="habitoo-dash-tab-placeholder">
              <div className="habitoo-dash-tab-placeholder__card">
                <div className="habitoo-dash-tab-placeholder__icon-wrap">
                  <Settings size={24} />
                </div>
                <h2 className="habitoo-dash-tab-placeholder__title">Paramètres du Compte PRO</h2>
                <p className="habitoo-dash-tab-placeholder__desc">
                  Alertes SMS des nouvelles visites, coordonnées bancaires de virement et gestion de votre mot de passe.
                </p>
                <button
                  type="button"
                  onClick={() => handleSelectTab('overview')}
                  className="habitoo-dash-btn-ghost"
                >
                  Retour à la vue d'ensemble
                </button>
              </div>
            </div>
          )}

          {/* Fallback si ancien tab analytics */}
          {activeTab === 'analytics' && (
            <div className="habitoo-dash-tab-placeholder">
              <div className="habitoo-dash-tab-placeholder__card">
                <h2 className="habitoo-dash-tab-placeholder__title">Section retirée</h2>
                <button
                  type="button"
                  onClick={() => handleSelectTab('overview')}
                  className="habitoo-dash-btn-primary"
                >
                  Aller à la vue d'ensemble
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Modale d'appoint des crédits */}
      <BoostCreditsModal
        isOpen={isCreditsModalOpen}
        onClose={() => setIsCreditsModalOpen(false)}
        currentCredits={credits}
        onRechargeSuccess={handleRechargeSuccess}
      />
    </div>
  );
};
