import React, { useState } from 'react';
import { X, Zap, Check, ShieldCheck, CreditCard, Smartphone } from 'lucide-react';

const PACKS = [
  { id: 'pack-5', credits: 5, price: '15 000 FCFA', perUnit: '3 000 F / crédit', popular: false },
  { id: 'pack-15', credits: 15, price: '40 000 FCFA', perUnit: '2 660 F / crédit', popular: true, savings: 'Économie 15%' },
  { id: 'pack-50', credits: 50, price: '120 000 FCFA', perUnit: '2 400 F / crédit', popular: false, savings: 'Économie 20%' }
];

export const BoostCreditsModal = ({ isOpen, onClose, currentCredits = 45, onRechargeSuccess }) => {
  const [selectedPack, setSelectedPack] = useState('pack-15');
  const [operator, setOperator] = useState('WAVE');
  const [phoneNumber, setPhoneNumber] = useState('07 89 22 14 00');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const packObj = PACKS.find(p => p.id === selectedPack);

  const handlePay = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      if (onRechargeSuccess) {
        onRechargeSuccess(packObj.credits);
      }
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1600);
    }, 1200);
  };

  return (
    <div className="habitoo-dash-modal-overlay" onClick={onClose}>
      <div className="habitoo-dash-modal" onClick={e => e.stopPropagation()}>
        <button type="button" className="habitoo-dash-modal__close" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="habitoo-dash-modal__head">
          <div className="habitoo-dash-modal__icon">
            <Zap size={20} />
          </div>
          <h3 className="habitoo-dash-modal__title">Recharge de Crédits Boost</h3>
          <p className="habitoo-dash-modal__desc">
            Propulsez vos annonces en tête de liste et multipliez vos consultations d'acquéreurs qualifiés.
          </p>
        </div>

        {isSuccess ? (
          <div className="habitoo-dash-modal-success">
            <div className="habitoo-dash-modal-success__check">
              <Check size={28} />
            </div>
            <h4 className="habitoo-dash-modal-success__title">Recharge Validée !</h4>
            <p className="habitoo-dash-modal-success__desc">
              +{packObj.credits} crédits ont été ajoutés à votre portefeuille. Nouveau solde : {currentCredits + packObj.credits} crédits.
            </p>
          </div>
        ) : (
          <form onSubmit={handlePay} className="habitoo-dash-modal__form">
            {/* Choix des packs */}
            <div className="habitoo-dash-packs-grid">
              {PACKS.map(pack => (
                <div
                  key={pack.id}
                  onClick={() => setSelectedPack(pack.id)}
                  className={`habitoo-dash-pack-card ${selectedPack === pack.id ? 'habitoo-dash-pack-card--active' : ''}`}
                >
                  {pack.popular && (
                    <span className="habitoo-dash-pack-tag">Recommandé</span>
                  )}
                  <strong className="habitoo-dash-pack-credits">{pack.credits} Crédits</strong>
                  <span className="habitoo-dash-pack-price">{pack.price}</span>
                  <span className="habitoo-dash-pack-unit">{pack.perUnit}</span>
                </div>
              ))}
            </div>

            {/* Méthode de paiement */}
            <div className="habitoo-dash-pay-section">
              <label className="habitoo-dash-pay-label">Opérateur Mobile Money :</label>
              <div className="habitoo-dash-ops-row">
                {['WAVE', 'ORANGE', 'MTN', 'MOOV'].map(op => (
                  <button
                    key={op}
                    type="button"
                    onClick={() => setOperator(op)}
                    className={`habitoo-dash-op-btn ${operator === op ? 'habitoo-dash-op-btn--active' : ''}`}
                  >
                    {op}
                  </button>
                ))}
              </div>

              <div className="habitoo-dash-phone-wrap">
                <Smartphone size={15} />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  placeholder="Numéro de débit Mobile Money"
                  className="habitoo-dash-phone-input"
                  required
                />
              </div>
            </div>

            <div className="habitoo-dash-modal-footer">
              <div className="habitoo-dash-modal-total">
                <span>Total à régler :</span>
                <strong>{packObj.price}</strong>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="habitoo-dash-btn-submit-recharge"
              >
                {isProcessing ? 'Validation en cours...' : `Confirmer le rechargement (+${packObj.credits} crédits)`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
