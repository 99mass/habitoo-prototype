import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle2, 
  Download, 
  CreditCard,
  Building 
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

      {/* Historique des Règlements */}
      <div className="habitoo-dash-card" style={{ marginTop: '20px', padding: '0', overflow: 'hidden' }}>
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
              <th>Description & Réf.</th>
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

    </div>
  );
};
