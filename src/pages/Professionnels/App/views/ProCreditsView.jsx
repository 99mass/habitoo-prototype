import React, { useState } from 'react';
import { 
  Zap, 
  Check, 
  Smartphone, 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  ArrowLeft, 
  CheckCircle2, 
  Flame, 
  Clock, 
  Sparkles,
  Download,
  AlertCircle
} from 'lucide-react';

const CREDIT_PACKS = [
  {
    id: 'starter',
    name: 'Pack Découverte',
    credits: 15,
    priceXOF: 25000,
    priceFormatted: '25 000 FCFA',
    unitPrice: '1 666 FCFA / crédit',
    desc: 'Idéal pour propulser 1 annonce phare pendant 7 jours.',
    popular: false
  },
  {
    id: 'pro',
    name: 'Pack Pro Signature',
    credits: 45,
    priceXOF: 60000,
    priceFormatted: '60 000 FCFA',
    unitPrice: '1 333 FCFA / crédit',
    desc: 'Notre formule la plus plébiscitée. Couvre 3 à 5 annonces simultanées.',
    popular: true,
    savingBadge: 'Économisez 20%'
  },
  {
    id: 'agency',
    name: 'Pack Agence Élite',
    credits: 120,
    priceXOF: 140000,
    priceFormatted: '140 000 FCFA',
    unitPrice: '1 166 FCFA / crédit',
    desc: 'Le tarif unitaire le plus avantageux pour portefeuilles denses.',
    popular: false,
    savingBadge: 'Économisez 35%'
  }
];

const OPERATORS = [
  { id: 'Wave', label: 'Wave', color: '#1dc4e9' },
  { id: 'Orange Money', label: 'Orange Money', color: '#ff6600' },
  { id: 'MTN MoMo', label: 'MTN MoMo', color: '#ffcc00' },
  { id: 'Moov Money', label: 'Moov Money', color: '#0055a5' }
];

export const ProCreditsView = ({ 
  currentCredits = 45, 
  onRechargeSuccess, 
  onBack 
}) => {
  const [selectedPackId, setSelectedPackId] = useState('pro');
  const [paymentMethod, setPaymentMethod] = useState('mobile_money'); // 'mobile_money' | 'card'
  const [mobileOperator, setMobileOperator] = useState('Wave');
  const [mobilePhone, setMobilePhone] = useState('+225 07 00 00 00 00');

  // État carte
  const [cardHolder, setCardHolder] = useState('Jean-Marc Kouassi');
  const [cardNumber, setCardNumber] = useState('4532 8901 2345 8821');
  const [cardExpiry, setCardExpiry] = useState('09/28');
  const [cardCvc, setCardCvc] = useState('784');

  const [isProcessing, setIsProcessing] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const selectedPack = CREDIT_PACKS.find(p => p.id === selectedPackId) || CREDIT_PACKS[1];

  const handlePay = (e) => {
    e.preventDefault();

    if (paymentMethod === 'mobile_money' && !mobilePhone.trim()) {
      setErrorMessage("Veuillez renseigner votre numéro de mobile.");
      return;
    }

    setErrorMessage('');
    setIsProcessing(true);

    const paymentLabel = paymentMethod === 'mobile_money'
      ? `${mobileOperator} (${mobilePhone})`
      : `Carte Bancaire (•••• ${cardNumber.slice(-4)})`;

    setTimeout(() => {
      const generatedReceipt = {
        reference: `HAB-BOOST-${Math.floor(100000 + Math.random() * 900000)}`,
        packName: selectedPack.name,
        creditsAdded: selectedPack.credits,
        amountFormatted: selectedPack.priceFormatted,
        method: paymentLabel,
        newBalance: currentCredits + selectedPack.credits,
        paidAt: new Date().toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      setIsProcessing(false);
      setReceipt(generatedReceipt);

      if (onRechargeSuccess) {
        onRechargeSuccess(selectedPack.credits);
      }
    }, 850);
  };

  // VUE REÇU DE CONFIRMATION OFFICIEL
  if (receipt) {
    return (
      <div className="habitoo-dash-section">
        <div className="habitoo-dash-receipt-card">
          <div className="habitoo-dash-receipt-icon">
            <CheckCircle2 size={36} color="#059669" />
          </div>

          <span className="habitoo-dash-receipt-tag">Paiement Validé et Crédits Ajoutés</span>
          <h2 className="habitoo-dash-receipt-title">Recharge de Crédits Confirmée</h2>
          <p className="habitoo-dash-receipt-lead">
            Votre compte PRO a été crédité instantanément de <strong>+{receipt.creditsAdded} Crédits Boost</strong>.
          </p>

          <div className="habitoo-dash-receipt-grid">
            <div className="habitoo-dash-receipt-row">
              <span>Référence :</span>
              <strong>{receipt.reference}</strong>
            </div>
            <div className="habitoo-dash-receipt-row">
              <span>Formule choisie :</span>
              <strong>{receipt.packName}</strong>
            </div>
            <div className="habitoo-dash-receipt-row">
              <span>Montant réglé :</span>
              <strong>{receipt.amountFormatted}</strong>
            </div>
            <div className="habitoo-dash-receipt-row">
              <span>Mode de paiement :</span>
              <strong>{receipt.method}</strong>
            </div>
            <div className="habitoo-dash-receipt-row">
              <span>Date et heure :</span>
              <span>{receipt.paidAt}</span>
            </div>
            <div className="habitoo-dash-receipt-row habitoo-dash-receipt-row--highlight">
              <span>Nouveau solde total :</span>
              <strong>
                <Zap size={13} className="habitoo-dash-credits-icon" /> {receipt.newBalance} Crédits
              </strong>
            </div>
          </div>

          <div className="habitoo-dash-receipt-actions">
            <button
              type="button"
              onClick={onBack}
              className="habitoo-dash-btn-primary"
            >
              Retourner à l'Espace PRO
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="habitoo-dash-btn-ghost"
            >
              <Download size={14} />
              <span>Imprimer le reçu officiel</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="habitoo-dash-section">
      
      {/* En-tête de la page dédiée */}
      <div className="habitoo-dash-create-header">
        <button
          type="button"
          onClick={onBack}
          className="habitoo-dash-btn-ghost"
        >
          <ArrowLeft size={14} />
          <span>Retour</span>
        </button>

        <div className="habitoo-dash-create-title-wrap">
          <div className="habitoo-dash-credits-top-badge">
            <Zap size={14} />
            <span>Solde Actuel : {currentCredits} Crédits Boost</span>
          </div>
          <h2 className="habitoo-dash-page-title">Recharger mes Crédits Boost</h2>
          <p className="habitoo-dash-page-subtitle">
            Multipliez par 4 la visibilité de vos annonces auprès des acquéreurs et locataires qualifiés.
          </p>
        </div>
      </div>

      {/* Grille : Sélection du pack à gauche & Checkout SaaS à droite */}
      <div className="habitoo-dash-checkout-layout">
        
        {/* COLONNE GAUCHE : SÉLECTION DES PACKS */}
        <div className="habitoo-dash-checkout-left">
          <h3 className="habitoo-dash-section-title">1. Choisissez votre pack de visibilité</h3>

          <div className="habitoo-dash-packs-grid">
            {CREDIT_PACKS.map(pack => {
              const isSelected = selectedPackId === pack.id;

              return (
                <div
                  key={pack.id}
                  className={`habitoo-dash-pack-card ${isSelected ? 'habitoo-dash-pack-card--selected' : ''}`}
                  onClick={() => setSelectedPackId(pack.id)}
                >
                  {pack.popular && (
                    <div className="habitoo-dash-pack-ribbon">
                      <Sparkles size={11} />
                      <span>Recommandé</span>
                    </div>
                  )}

                  {pack.savingBadge && !pack.popular && (
                    <div className="habitoo-dash-pack-badge-saving">
                      {pack.savingBadge}
                    </div>
                  )}

                  <div className="habitoo-dash-pack-top">
                    <div className="habitoo-dash-pack-radio">
                      {isSelected ? <div className="habitoo-dash-pack-radio-dot" /> : null}
                    </div>
                    <div>
                      <h4 className="habitoo-dash-pack-name">{pack.name}</h4>
                      <span className="habitoo-dash-pack-unit">{pack.unitPrice}</span>
                    </div>
                  </div>

                  <div className="habitoo-dash-pack-amount">
                    <div className="habitoo-dash-pack-credits">
                      <Zap size={16} className="habitoo-dash-credits-icon" />
                      <strong>{pack.credits}</strong>
                      <span>crédits</span>
                    </div>
                    <strong className="habitoo-dash-pack-price">{pack.priceFormatted}</strong>
                  </div>

                  <p className="habitoo-dash-pack-desc">{pack.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="habitoo-dash-boost-rules-box">
            <div className="habitoo-dash-boost-rules-title">
              <Flame size={14} color="#e11d48" />
              <span>Comment fonctionne le système de Boost ?</span>
            </div>
            <ul className="habitoo-dash-boost-rules-list">
              <li><strong>15 crédits</strong> = 1 boost prioritaire garanti pendant 7 jours.</li>
              <li>Positionnement prioritaire en tête du portail et dans les alertes acquéreurs.</li>
              <li>Crédits sans date d'expiration, utilisables à tout moment sur l'annonce de votre choix.</li>
            </ul>
          </div>
        </div>

        {/* COLONNE DROITE : FORMULAIRE DE PAIEMENT SAAS */}
        <div className="habitoo-dash-checkout-right">
          <div className="habitoo-dash-card habitoo-dash-checkout-card">
            
            <h3 className="habitoo-dash-checkout-card-title">2. Règlement sécurisé</h3>

            {/* Récapitulatif de la commande */}
            <div className="habitoo-dash-checkout-summary-bar">
              <div>
                <span className="habitoo-dash-summary-label">Formule sélectionnée :</span>
                <strong className="habitoo-dash-summary-val"> {selectedPack.name} (+{selectedPack.credits} crédits)</strong>
              </div>
              <strong className="habitoo-dash-summary-total">{selectedPack.priceFormatted}</strong>
            </div>

            {/* Choix Méthode : Mobile Money vs Carte */}
            <div className="habitoo-dash-method-selector">
              <button
                type="button"
                className={`habitoo-dash-method-btn ${paymentMethod === 'mobile_money' ? 'habitoo-dash-method-btn--active' : ''}`}
                onClick={() => setPaymentMethod('mobile_money')}
              >
                <Smartphone size={16} />
                <span>Mobile Money</span>
              </button>
              <button
                type="button"
                className={`habitoo-dash-method-btn ${paymentMethod === 'card' ? 'habitoo-dash-method-btn--active' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                <CreditCard size={16} />
                <span>Carte Bancaire</span>
              </button>
            </div>

            {errorMessage && (
              <div className="habitoo-dash-alert-error">
                <AlertCircle size={14} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handlePay} className="habitoo-dash-checkout-form">
              
              {/* Option Mobile Money */}
              {paymentMethod === 'mobile_money' && (
                <div className="habitoo-dash-mobile-money-fields">
                  <label className="habitoo-dash-label">Sélectionnez votre opérateur</label>
                  <div className="habitoo-dash-operator-grid">
                    {OPERATORS.map(op => (
                      <button
                        key={op.id}
                        type="button"
                        className={`habitoo-dash-operator-btn ${mobileOperator === op.id ? 'habitoo-dash-operator-btn--active' : ''}`}
                        onClick={() => setMobileOperator(op.id)}
                      >
                        <span className="habitoo-dash-operator-dot" style={{ backgroundColor: op.color }} />
                        <span>{op.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="habitoo-dash-form-group" style={{ marginTop: '16px' }}>
                    <label className="habitoo-dash-label" htmlFor="recharge-phone">
                      Numéro de compte {mobileOperator}
                    </label>
                    <div className="habitoo-dash-input-prefix-wrap">
                      <span className="habitoo-dash-input-prefix">+225</span>
                      <input
                        id="recharge-phone"
                        type="tel"
                        className="habitoo-dash-input habitoo-dash-input--prefixed"
                        placeholder="07 00 00 00 00"
                        value={mobilePhone.replace('+225 ', '')}
                        onChange={e => setMobilePhone(`+225 ${e.target.value}`)}
                        required
                      />
                    </div>
                    <span className="habitoo-dash-input-hint">
                      Une invite de validation USSD / push s'affichera directement sur votre téléphone.
                    </span>
                  </div>
                </div>
              )}

              {/* Option Carte Bancaire */}
              {paymentMethod === 'card' && (
                <div className="habitoo-dash-card-fields">
                  <div className="habitoo-dash-form-group">
                    <label className="habitoo-dash-label" htmlFor="card-holder">Nom sur la carte</label>
                    <input
                      id="card-holder"
                      type="text"
                      className="habitoo-dash-input"
                      value={cardHolder}
                      onChange={e => setCardHolder(e.target.value)}
                      required
                    />
                  </div>

                  <div className="habitoo-dash-form-group">
                    <label className="habitoo-dash-label" htmlFor="card-number">Numéro de carte</label>
                    <input
                      id="card-number"
                      type="text"
                      className="habitoo-dash-input"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                      required
                    />
                  </div>

                  <div className="habitoo-dash-form-row">
                    <div className="habitoo-dash-form-group">
                      <label className="habitoo-dash-label" htmlFor="card-expiry">Expiration</label>
                      <input
                        id="card-expiry"
                        type="text"
                        className="habitoo-dash-input"
                        value={cardExpiry}
                        onChange={e => setCardExpiry(e.target.value)}
                        placeholder="MM/AA"
                        required
                      />
                    </div>
                    <div className="habitoo-dash-form-group">
                      <label className="habitoo-dash-label" htmlFor="card-cvc">CVC</label>
                      <input
                        id="card-cvc"
                        type="password"
                        className="habitoo-dash-input"
                        value={cardCvc}
                        onChange={e => setCardCvc(e.target.value)}
                        placeholder="123"
                        maxLength="4"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Mentions de sécurité et bouton payer */}
              <div className="habitoo-dash-security-badge">
                <Lock size={12} />
                <span>Chiffrement SSL 256-bit • Transaction garantie par Habitoo</span>
              </div>

              <button
                type="submit"
                className="habitoo-dash-btn-primary habitoo-dash-btn-submit-pay"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span>Validation sécurisée en cours...</span>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    <span>Payer {selectedPack.priceFormatted} et Créditer</span>
                  </>
                )}
              </button>

            </form>

          </div>
        </div>

      </div>

    </div>
  );
};
