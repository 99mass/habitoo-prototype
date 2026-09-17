import React, { useState } from 'react';
import { X, Flame, Check, ShieldCheck, Sparkles, Smartphone, CreditCard, Lock, ArrowRight } from 'lucide-react';
import { OperatorSelectorGrid, CardBrandLogos } from './PaymentOperatorLogos';

const BOOST_OPTIONS = [
  {
    id: 'boost-7',
    days: 7,
    title: 'Boost 7 jours',
    subtitle: 'Visibilité prioritaire immédiate',
    price: 5000,
    priceFormatted: '5 000 FCFA',
    popular: true,
    perks: ['Tête de liste des recherches', 'Badge Annonce Boostée 🔥', 'Contacts directs prioritaires']
  },
  {
    id: 'boost-14',
    days: 14,
    title: 'Boost 14 jours',
    subtitle: 'Présence maximale 2 semaines',
    price: 9000,
    priceFormatted: '9 000 FCFA',
    popular: false,
    badge: 'Économie 10%',
    perks: ['Tête de liste pendant 14 jours', 'Badge Annonce Boostée 🔥', 'Contacts directs prioritaires']
  }
];

export const ParticulierBoostModal = ({
  isOpen,
  onClose,
  property,
  onBoostSuccess
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState('boost-7');
  const [paymentMethod, setPaymentMethod] = useState('mobile_money');
  const [operator, setOperator] = useState('Wave');
  const [phoneNumber, setPhoneNumber] = useState('07 08 09 10 11');

  // Card fields
  const [cardHolder, setCardHolder] = useState('Propriétaire Habitoo');
  const [cardNumber, setCardNumber] = useState('4532 8901 2345 8821');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('784');

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !property) return null;

  const selectedOption = BOOST_OPTIONS.find(o => o.id === selectedOptionId) || BOOST_OPTIONS[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      if (onBoostSuccess) {
        onBoostSuccess(property.id, selectedOption.days);
      }

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1800);
    }, 1200);
  };

  return (
    <div className="particulier-boost-modal-overlay" onClick={onClose}>
      <div className="particulier-boost-modal-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button 
          type="button" 
          className="particulier-boost-modal-close" 
          onClick={onClose}
          aria-label="Fermer"
        >
          <X size={18} />
        </button>

        {isSuccess ? (
          <div className="particulier-boost-success-state">
            <div className="particulier-boost-success-icon">
              <Check size={30} strokeWidth={2.8} />
            </div>
            <h3 className="particulier-boost-success-title">Annonce boostée !</h3>
            <p className="particulier-boost-success-desc">
              <strong>« {property.title} »</strong> est maintenant en tête des résultats pour <strong>{selectedOption.days} jours</strong>.
            </p>
            <div className="particulier-boost-success-tag">
              <Flame size={14} />
              <span>Actif jusqu'au {new Date(Date.now() + selectedOption.days * 86400000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</span>
            </div>
          </div>
        ) : (
          <div>
            {/* Modal Header */}
            <div className="particulier-boost-modal-head">
              <div className="particulier-boost-icon-badge">
                <Flame size={20} />
              </div>
              <h2 className="particulier-boost-title">Booster votre annonce</h2>
              <p className="particulier-boost-subtitle">
                Propulsez <strong>« {property.title} »</strong> en tête du catalogue.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Formules de Boost */}
              <div className="particulier-boost-options-grid">
                {BOOST_OPTIONS.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedOptionId(opt.id)}
                      className={`particulier-boost-opt-card ${isSelected ? 'selected' : ''}`}
                      role="button"
                      tabIndex={0}
                    >
                      {opt.popular && (
                        <span className="particulier-boost-tag popular">Recommandé</span>
                      )}
                      {opt.badge && (
                        <span className="particulier-boost-tag saving">{opt.badge}</span>
                      )}

                      <div className="particulier-boost-opt-header">
                        <div className="particulier-boost-radio">
                          {isSelected && <div className="particulier-boost-radio-dot" />}
                        </div>
                        <div>
                          <strong className="particulier-boost-opt-title">{opt.title}</strong>
                          <span className="particulier-boost-opt-sub">{opt.subtitle}</span>
                        </div>
                      </div>

                      <div className="particulier-boost-price-row">
                        <strong className="particulier-boost-price-val">{opt.priceFormatted}</strong>
                      </div>

                      <ul className="particulier-boost-perks-list">
                        {opt.perks.map((perk, idx) => (
                          <li key={idx}>
                            <Sparkles size={11} color="var(--primary-red)" />
                            <span>{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              {/* Onglets Choix Paiement : Mobile Money vs Carte Bancaire */}
              <div className="particulier-boost-tabs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mobile_money')}
                  className={`particulier-boost-tab ${paymentMethod === 'mobile_money' ? 'active' : ''}`}
                >
                  <Smartphone size={15} />
                  <span>Mobile Money</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`particulier-boost-tab ${paymentMethod === 'card' ? 'active' : ''}`}
                >
                  <CreditCard size={15} />
                  <span>Carte Bancaire</span>
                </button>
              </div>

              {paymentMethod === 'mobile_money' ? (
                <>
                  {/* Sélection opérateur Mobile Money */}
                  <div className="particulier-boost-operator-section">
                    <OperatorSelectorGrid
                      selectedOperator={operator}
                      onSelectOperator={(op) => setOperator(op)}
                      compact={true}
                    />
                  </div>

                  {/* Numéro de débit */}
                  <div className="particulier-boost-phone-section">
                    <label className="particulier-boost-field-lbl">
                      Numéro {operator} :
                    </label>
                    <div className="particulier-boost-phone-input-wrap">
                      <Smartphone size={16} className="particulier-boost-phone-icon" />
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Ex: 07 08 09 10 11"
                        className="particulier-boost-phone-input"
                      />
                    </div>
                  </div>
                </>
              ) : (
                /* Formulaire Carte Bancaire */
                <div className="particulier-boost-card-section">
                  <div className="particulier-boost-field-group">
                    <label className="particulier-boost-field-lbl">Titulaire de la carte :</label>
                    <input
                      type="text"
                      required
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Nom et prénom"
                      className="particulier-boost-field-input"
                    />
                  </div>

                  <div className="particulier-boost-field-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <label className="particulier-boost-field-lbl" style={{ margin: 0 }}>Numéro de carte :</label>
                      <CardBrandLogos />
                    </div>
                    <div className="particulier-boost-input-with-icon">
                      <Lock size={14} className="particulier-boost-field-icon" />
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4532 •••• •••• ••••"
                        className="particulier-boost-field-input"
                      />
                    </div>
                  </div>

                  <div className="particulier-boost-card-row">
                    <div className="particulier-boost-field-group">
                      <label className="particulier-boost-field-lbl">Expiration :</label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/AA"
                        className="particulier-boost-field-input"
                      />
                    </div>
                    <div className="particulier-boost-field-group">
                      <label className="particulier-boost-field-lbl">CVC :</label>
                      <input
                        type="text"
                        required
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="123"
                        className="particulier-boost-field-input"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Footer CTA */}
              <div className="particulier-boost-footer">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="btn-primary particulier-boost-submit-btn"
                >
                  {isProcessing ? (
                    <span>Traitement en cours...</span>
                  ) : (
                    <>
                      <Flame size={16} />
                      <span>Payer et Activer ({selectedOption.priceFormatted})</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>

                <div className="particulier-boost-trust-row">
                  <ShieldCheck size={14} color="#16a34a" />
                  <span>Paiement sécurisé crypté SSL. Activation immédiate.</span>
                </div>
              </div>
            </form>
          </div>
        )}

      </div>

      <style>{`
        .particulier-boost-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(17, 24, 39, 0.72);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 16px;
          animation: fadeIn 0.2s ease-out;
        }
        .particulier-boost-modal-card {
          background: #FFFFFF;
          border-radius: var(--radius-banner, 18px);
          width: 100%;
          max-width: 540px;
          max-height: 92vh;
          overflow-y: auto;
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.22);
          position: relative;
          padding: 24px 24px 20px;
        }
        .particulier-boost-modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: var(--bg-main, #F3F4F6);
          border: none;
          color: var(--obsidian-black, #111827);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .particulier-boost-modal-close:hover {
          background: #E5E7EB;
        }
        .particulier-boost-modal-head {
          margin-bottom: 16px;
          padding-right: 28px;
        }
        .particulier-boost-icon-badge {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: linear-gradient(135deg, #FF6B00 0%, #F70000 100%);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
          box-shadow: 0 4px 12px rgba(247, 0, 0, 0.25);
        }
        .particulier-boost-title {
          font-family: var(--font-heading, sans-serif);
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--obsidian-black, #111827);
          margin: 0 0 4px 0;
        }
        .particulier-boost-subtitle {
          font-size: 0.8rem;
          color: var(--graphite-gray, #6B7280);
          margin: 0;
        }
        .particulier-boost-options-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 16px;
        }
        @media (max-width: 500px) {
          .particulier-boost-options-grid {
            grid-template-columns: 1fr;
          }
        }
        .particulier-boost-opt-card {
          border: 2px solid var(--border-color, #E5E7EB);
          border-radius: 12px;
          padding: 12px;
          cursor: pointer;
          position: relative;
          background: #FFFFFF;
          transition: all 0.15s ease;
        }
        .particulier-boost-opt-card:hover {
          border-color: #CBD5E1;
        }
        .particulier-boost-opt-card.selected {
          border-color: var(--primary-red, #F70000);
          background: rgba(247, 0, 0, 0.02);
          box-shadow: 0 2px 10px rgba(247, 0, 0, 0.08);
        }
        .particulier-boost-tag {
          position: absolute;
          top: -9px;
          right: 10px;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 999px;
          text-transform: uppercase;
        }
        .particulier-boost-tag.popular {
          background: var(--primary-red, #F70000);
          color: #FFFFFF;
        }
        .particulier-boost-tag.saving {
          background: #16a34a;
          color: #FFFFFF;
        }
        .particulier-boost-opt-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        .particulier-boost-radio {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid #CBD5E1;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .particulier-boost-opt-card.selected .particulier-boost-radio {
          border-color: var(--primary-red, #F70000);
        }
        .particulier-boost-radio-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--primary-red, #F70000);
        }
        .particulier-boost-opt-title {
          display: block;
          font-size: 0.88rem;
          color: var(--obsidian-black, #111827);
        }
        .particulier-boost-opt-sub {
          font-size: 0.7rem;
          color: var(--graphite-gray, #6B7280);
        }
        .particulier-boost-price-row {
          margin-bottom: 8px;
          padding-bottom: 6px;
          border-bottom: 1px solid var(--border-light, #F3F4F6);
        }
        .particulier-boost-price-val {
          font-family: var(--font-heading, sans-serif);
          font-size: 1.15rem;
          color: var(--obsidian-black, #111827);
        }
        .particulier-boost-perks-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .particulier-boost-perks-list li {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.7rem;
          color: var(--obsidian-black, #111827);
        }

        /* Tabs Paiement */
        .particulier-boost-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 14px;
          border-bottom: 1px solid var(--border-color, #E5E7EB);
          padding-bottom: 8px;
        }
        .particulier-boost-tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid var(--border-color, #E5E7EB);
          background: var(--bg-main, #F9FAFB);
          color: var(--graphite-gray, #6B7280);
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .particulier-boost-tab:hover {
          border-color: #CBD5E1;
        }
        .particulier-boost-tab.active {
          background: var(--obsidian-black, #111827);
          border-color: var(--obsidian-black, #111827);
          color: #FFFFFF;
        }

        .particulier-boost-operator-section {
          margin-bottom: 12px;
        }
        .particulier-boost-field-lbl {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--obsidian-black, #111827);
          margin-bottom: 5px;
        }
        .particulier-boost-phone-section {
          margin-bottom: 16px;
        }
        .particulier-boost-phone-input-wrap {
          display: flex;
          align-items: center;
          border: 1px solid var(--border-color, #E5E7EB);
          border-radius: 8px;
          padding: 0 12px;
          background: #FFFFFF;
          height: 40px;
        }
        .particulier-boost-phone-icon {
          color: var(--graphite-gray, #6B7280);
          margin-right: 8px;
          flex-shrink: 0;
        }
        .particulier-boost-phone-input {
          border: none;
          outline: none;
          width: 100%;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--obsidian-black, #111827);
        }

        /* Carte Bancaire Section */
        .particulier-boost-card-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 16px;
        }
        .particulier-boost-field-group {
          display: flex;
          flex-direction: column;
        }
        .particulier-boost-field-input {
          height: 40px;
          border: 1px solid var(--border-color, #E5E7EB);
          border-radius: 8px;
          padding: 0 12px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--obsidian-black, #111827);
          outline: none;
          transition: border-color 0.15s ease;
        }
        .particulier-boost-field-input:focus {
          border-color: var(--primary-red, #F70000);
        }
        .particulier-boost-input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }
        .particulier-boost-input-with-icon .particulier-boost-field-icon {
          position: absolute;
          left: 12px;
          color: var(--graphite-gray, #6B7280);
        }
        .particulier-boost-input-with-icon .particulier-boost-field-input {
          padding-left: 34px;
          width: 100%;
        }
        .particulier-boost-card-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .particulier-boost-footer {
          margin-top: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .particulier-boost-submit-btn {
          width: 100%;
          height: 44px;
          font-size: 0.9rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
        }
        .particulier-boost-trust-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 0.7rem;
          color: var(--graphite-gray, #6B7280);
          text-align: center;
        }
        .particulier-boost-success-state {
          padding: 24px 8px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .particulier-boost-success-icon {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: #16a34a;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(22, 163, 74, 0.3);
        }
        .particulier-boost-success-title {
          font-family: var(--font-heading, sans-serif);
          font-size: 1.25rem;
          color: var(--obsidian-black, #111827);
          margin: 0;
        }
        .particulier-boost-success-desc {
          font-size: 0.85rem;
          color: var(--graphite-gray, #6B7280);
          max-width: 400px;
          line-height: 1.4;
          margin: 0;
        }
        .particulier-boost-success-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(255, 107, 0, 0.1);
          color: #EA580C;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 999px;
          border: 1px solid rgba(255, 107, 0, 0.22);
        }
      `}</style>
    </div>
  );
};

export default ParticulierBoostModal;
