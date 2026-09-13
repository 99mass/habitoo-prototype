import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle2, 
  Download, 
  CreditCard,
  Building,
  Eye,
  X,
  ShieldCheck
} from 'lucide-react';

const REVENUE_STATS = {
  availableBalance: 350000,
  monthlyRevenue: 1850000,
  yearlyRevenue: 12400000
};

const TRANSACTIONS = [
  {
    id: 'tx-101',
    date: '12 Septembre 2025',
    title: "Honoraires de transaction — Villa 'Le Belvédère'",
    ref: 'HON-BEL-01',
    type: 'CREDIT',
    amount: 1500000,
    status: 'DISPONIBLE'
  },
  {
    id: 'tx-102',
    date: '08 Septembre 2025',
    title: 'Frais de gestion mandat — Penthouse Laguna Sky',
    ref: 'MAN-LAG-92',
    type: 'CREDIT',
    amount: 350000,
    status: 'DISPONIBLE'
  },
  {
    id: 'tx-103',
    date: '01 Septembre 2025',
    title: 'Virement bancaire sortant vers BOA CI',
    ref: 'VIR-BOA-841',
    type: 'DEBIT',
    amount: -2500000,
    status: 'VIRE'
  },
  {
    id: 'tx-104',
    date: '28 Août 2025',
    title: 'Honoraires mandat — Manoir Les Baobabs',
    ref: 'HON-BAO-14',
    type: 'CREDIT',
    amount: 1200000,
    status: 'VIRE'
  }
];

export const ProRevenueView = () => {
  const [selectedTx, setSelectedTx] = useState(null);
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferDone, setTransferDone] = useState(false);

  const handleWithdraw = () => {
    setIsTransferring(true);
    setTimeout(() => {
      setIsTransferring(false);
      setTransferDone(true);
      setTimeout(() => setTransferDone(false), 3000);
    }, 1200);
  };

  return (
    <div className="habitoo-dash-section">
      
      {/* 3 Cartes de Chiffres Clés */}
      <div className="habitoo-dash-revenue-cards-grid">
        
        {/* Carte 1 : Solde disponible & Action virement */}
        <div className="habitoo-dash-card habitoo-dash-card--highlight">
          <div className="habitoo-dash-revenue-card-top">
            <span className="habitoo-dash-revenue-card-label">Solde disponible</span>
            <span className="habitoo-dash-badge habitoo-dash-badge--broker">Immédiat</span>
          </div>
          <strong className="habitoo-dash-revenue-card-amount">
            {REVENUE_STATS.availableBalance.toLocaleString('fr-FR')} FCFA
          </strong>
          <button
            type="button"
            className="habitoo-dash-btn-withdraw"
            onClick={handleWithdraw}
            disabled={isTransferring}
          >
            {isTransferring ? 'Virement en cours...' : transferDone ? 'Virement initié !' : 'Demander un virement'}
          </button>
        </div>

        {/* Carte 2 : Revenus du mois */}
        <div className="habitoo-dash-card">
          <span className="habitoo-dash-revenue-card-label">Revenus ce mois</span>
          <strong className="habitoo-dash-revenue-card-amount">
            {REVENUE_STATS.monthlyRevenue.toLocaleString('fr-FR')} FCFA
          </strong>
          <span className="habitoo-dash-revenue-card-sub">+18% par rapport au mois dernier</span>
        </div>

        {/* Carte 3 : Cumul annuel */}
        <div className="habitoo-dash-card">
          <span className="habitoo-dash-revenue-card-label">Total généré en 2025</span>
          <strong className="habitoo-dash-revenue-card-amount">
            {REVENUE_STATS.yearlyRevenue.toLocaleString('fr-FR')} FCFA
          </strong>
          <span className="habitoo-dash-revenue-card-sub">Sur l'ensemble de vos mandats</span>
        </div>

      </div>

      {/* Desktop : Historique des Règlements en tableau (masqué sur mobile) */}
      <div className="habitoo-dash-card pro-desktop-only" style={{ marginTop: '20px', padding: '0', overflow: 'hidden' }}>
        <div className="habitoo-dash-card__header" style={{ padding: '18px 22px 14px 22px', borderBottom: '1px solid #F0F2F5', marginBottom: '0' }}>
          <div>
            <h3 className="habitoo-dash-card__title">Historique des Règlements</h3>
            <p className="habitoo-dash-card__subtitle">
              Encaissements d'honoraires et virements sortants
            </p>
          </div>
        </div>

        <table className="habitoo-dash-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description et Réf.</th>
              <th>Type</th>
              <th>Montant</th>
              <th style={{ textAlign: 'right' }}>Statut</th>
            </tr>
          </thead>
          <tbody>
            {TRANSACTIONS.map((tx) => (
              <tr key={tx.id}>
                <td style={{ whiteSpace: 'nowrap', color: '#555555', fontSize: '0.8rem' }}>
                  {tx.date}
                </td>
                <td>
                  <strong style={{ display: 'block', fontSize: '0.82rem', color: '#1A1A1A' }}>
                    {tx.title}
                  </strong>
                  <span style={{ fontSize: '0.7rem', color: '#737373' }}>
                    Réf. : {tx.ref}
                  </span>
                </td>
                <td>
                  <span className={`habitoo-dash-tx-type ${tx.type === 'CREDIT' ? 'habitoo-dash-tx-type--in' : 'habitoo-dash-tx-type--out'}`}>
                    {tx.type === 'CREDIT' ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                    {tx.type === 'CREDIT' ? 'Entrée' : 'Virement'}
                  </span>
                </td>
                <td>
                  <strong style={{ fontSize: '0.88rem', color: tx.type === 'CREDIT' ? '#059669' : '#1A1A1A' }}>
                    {tx.amount > 0 ? `+${tx.amount.toLocaleString('fr-FR')}` : tx.amount.toLocaleString('fr-FR')} FCFA
                  </strong>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <span className={`habitoo-dash-table-badge ${tx.status === 'DISPONIBLE' ? 'habitoo-dash-table-badge--boosted' : 'habitoo-dash-table-badge--active'}`}>
                    {tx.status === 'DISPONIBLE' ? 'Disponible' : 'Viré'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile : Cartes des règlements (masquées sur desktop) */}
      <div className="pro-mobile-only" style={{ marginTop: '16px' }}>
        <div style={{ marginBottom: '12px' }}>
          <h3 className="habitoo-dash-card__title" style={{ fontSize: '1rem', margin: '0 0 2px 0' }}>Historique des Règlements</h3>
          <p className="habitoo-dash-card__subtitle" style={{ fontSize: '0.74rem', margin: 0 }}>
            Encaissements d'honoraires et virements sortants
          </p>
        </div>

        <div className="pro-tx-cards">
          {TRANSACTIONS.map((tx) => (
            <div
              key={tx.id}
              className="pro-tx-card"
              onClick={() => setSelectedTx(tx)}
              role="button"
              tabIndex={0}
              title="Appuyez pour voir le reçu de la transaction"
            >
              <div className="pro-tx-card__header">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 className="pro-tx-card__title">{tx.title}</h4>
                  <span className="pro-tx-card__date">{tx.date} • Réf. {tx.ref}</span>
                </div>
                <span className={`habitoo-dash-tx-type ${tx.type === 'CREDIT' ? 'habitoo-dash-tx-type--in' : 'habitoo-dash-tx-type--out'}`}>
                  {tx.type === 'CREDIT' ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                  {tx.type === 'CREDIT' ? 'Entrée' : 'Virement'}
                </span>
              </div>

              <div className="pro-tx-card__bottom">
                <div className="pro-tx-card__amount-wrap">
                  <strong className={`pro-tx-card__amount ${tx.type === 'CREDIT' ? 'pro-tx-card__amount--in' : 'pro-tx-card__amount--out'}`}>
                    {tx.amount > 0 ? `+${tx.amount.toLocaleString('fr-FR')}` : tx.amount.toLocaleString('fr-FR')} FCFA
                  </strong>
                  <span className={`habitoo-dash-table-badge ${tx.status === 'DISPONIBLE' ? 'habitoo-dash-table-badge--boosted' : 'habitoo-dash-table-badge--active'}`}>
                    {tx.status === 'DISPONIBLE' ? 'Disponible' : 'Viré'}
                  </span>
                </div>

                <button
                  type="button"
                  className="pro-tx-card__btn-details"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTx(tx);
                  }}
                  title="Voir les détails et le reçu"
                >
                  <Eye size={13} />
                  <span>Voir détails</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modale Reçu de Règlement PRO */}
      {selectedTx && (
        <div className="habitoo-dash-modal-overlay" onClick={() => setSelectedTx(null)}>
          <div
            className="habitoo-dash-modal pro-tx-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="pro-tx-modal-title"
          >
            <button
              type="button"
              className="habitoo-dash-modal__close pro-tx-modal__close"
              onClick={() => setSelectedTx(null)}
              aria-label="Fermer la modale"
            >
              <X size={18} />
            </button>

            {/* En-tête du Reçu */}
            <div className="pro-tx-modal__header">
              <div className="pro-tx-modal__badge-row">
                <span className={`habitoo-dash-tx-type ${selectedTx.type === 'CREDIT' ? 'habitoo-dash-tx-type--in' : 'habitoo-dash-tx-type--out'}`}>
                  {selectedTx.type === 'CREDIT' ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                  {selectedTx.type === 'CREDIT' ? 'Encaissement Entrant' : 'Virement Sortant'}
                </span>
                <span className={`habitoo-dash-table-badge ${selectedTx.status === 'DISPONIBLE' ? 'habitoo-dash-table-badge--boosted' : 'habitoo-dash-table-badge--active'}`}>
                  {selectedTx.status === 'DISPONIBLE' ? 'Fonds Disponibles' : 'Virement Exécuté'}
                </span>
              </div>

              <strong className={`pro-tx-modal__amount ${selectedTx.type === 'CREDIT' ? 'pro-tx-modal__amount--in' : 'pro-tx-modal__amount--out'}`}>
                {selectedTx.amount > 0 ? `+${selectedTx.amount.toLocaleString('fr-FR')}` : selectedTx.amount.toLocaleString('fr-FR')} FCFA
              </strong>
              <p id="pro-tx-modal-title" className="pro-tx-modal__title">{selectedTx.title}</p>
            </div>

            {/* Corps du Reçu */}
            <div className="pro-tx-modal__body">
              <div className="pro-tx-modal__section">
                <span className="pro-tx-modal__section-title">Informations de la transaction</span>
                <div className="pro-tx-modal__info-grid">
                  <div className="pro-tx-modal__info-item">
                    <span className="pro-tx-modal__info-label">Référence</span>
                    <strong className="pro-tx-modal__info-value font-mono">{selectedTx.ref}</strong>
                  </div>
                  <div className="pro-tx-modal__info-item">
                    <span className="pro-tx-modal__info-label">Date d'opération</span>
                    <span className="pro-tx-modal__info-value">{selectedTx.date}</span>
                  </div>
                  <div className="pro-tx-modal__info-item">
                    <span className="pro-tx-modal__info-label">Garantie & Séquestre</span>
                    <span className="pro-tx-modal__info-value" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#059669' }}>
                      <ShieldCheck size={13} /> Sécurisé Habitoo PRO
                    </span>
                  </div>
                  <div className="pro-tx-modal__info-item">
                    <span className="pro-tx-modal__info-label">Mode d'exécution</span>
                    <span className="pro-tx-modal__info-value">
                      {selectedTx.type === 'CREDIT' ? 'Compte séquestre notarié' : 'Virement instantané BOA CI'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pied d'action */}
            <div className="pro-tx-modal__footer">
              <button
                type="button"
                className="habitoo-dash-btn-primary pro-tx-modal__download-btn"
                onClick={() => alert('Téléchargement du reçu officiel Habitoo PRO (PDF)...')}
              >
                <Download size={14} />
                <span>Télécharger le reçu</span>
              </button>
              <button
                type="button"
                className="pro-tx-modal__close-btn"
                onClick={() => setSelectedTx(null)}
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
