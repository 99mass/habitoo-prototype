import React, { useState } from 'react';
import { 
  Smartphone, 
  CreditCard, 
  Lock, 
  ShieldCheck, 
  ArrowLeft, 
  Info,
  AlertCircle
} from 'lucide-react';

const OPERATORS = ['Wave', 'Orange Money', 'MTN MoMo', 'Moov Money'];

export const StepCheckout = ({ formData, updateFormData, onPrev, onCompletePayment }) => {
  const [paymentMethod, setPaymentMethod] = useState(formData.paymentMethod || 'mobile_money');
  const [mobileOperator, setMobileOperator] = useState(formData.mobileOperator || 'Wave');
  const [mobilePhone, setMobilePhone] = useState(formData.mobilePhone || formData.phone || '+225 07 00 00 00 00');
  
  // Card state
  const [cardHolder, setCardHolder] = useState(formData.entityName || 'Marc-Aurèle Kouassi');
  const [cardNumber, setCardNumber] = useState('4532 8901 2345 8821');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('784');

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Calculate pricing
  const isAnnual = formData.billingCycle === 'annual';
  const rawAmount = formData.selectedPlan === 'premium'
    ? (isAnnual ? 350000 : 35000)
    : (isAnnual ? 150000 : 15000);

  const formattedAmount = `${rawAmount.toLocaleString('fr-FR')} FCFA`;
  const planTitle = formData.selectedPlan === 'premium' ? 'Formule Premium' : 'Formule PRO';

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
      const receipt = {
        reference: `HAB-PAY-${Math.floor(100000 + Math.random() * 900000)}`,
        amount: rawAmount,
        amountFormatted: formattedAmount,
        method: paymentLabel,
        planTitle,
        paidAt: new Date().toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      updateFormData({
        paymentMethod,
        mobileOperator,
        mobilePhone,
        paymentReceipt: receipt
      });

      setIsProcessing(false);
      onCompletePayment(receipt);
    }, 700);
  };

  return (
    <div className="habitoo-reg-step-content">
      
      {/* Header */}
      <div className="habitoo-step-header">
        <span className="habitoo-step-counter">Étape 04 sur 04</span>
        <h1 className="habitoo-step-title">
          Règlement de votre formule
        </h1>
        <p className="habitoo-step-lead">
          Paiement sécurisé par Mobile Money ou carte bancaire.
        </p>
      </div>

      {/* Compact Order Summary Box */}
      <div className="habitoo-checkout-summary">
        <div className="habitoo-summary-top">
          <div>
            <span className="habitoo-summary-plan-label">Montant à régler :</span>
            <strong className="habitoo-summary-plan-title"> {planTitle} ({isAnnual ? 'Annuel' : 'Mensuel'})</strong>
          </div>
          <div className="habitoo-summary-price">
            {formattedAmount}
          </div>
        </div>
      </div>

      {/* Payment Methods Grid */}
      <div className="habitoo-checkout-methods-tabs">
        <button
          type="button"
          className={`habitoo-checkout-tab ${paymentMethod === 'mobile_money' ? 'habitoo-checkout-tab--active' : ''}`}
          onClick={() => setPaymentMethod('mobile_money')}
        >
          <Smartphone size={16} />
          <span>Mobile Money</span>
        </button>

        <button
          type="button"
          className={`habitoo-checkout-tab ${paymentMethod === 'card' ? 'habitoo-checkout-tab--active' : ''}`}
          onClick={() => setPaymentMethod('card')}
        >
          <CreditCard size={16} />
          <span>Carte Bancaire</span>
        </button>
      </div>

      {/* Payment Form */}
      <form onSubmit={handlePay} className="habitoo-checkout-form">
        
        {paymentMethod === 'mobile_money' ? (
          <>
            <div className="habitoo-field-group">
              <label className="habitoo-field-label">
                Opérateur
              </label>
              <div className="habitoo-momo-pills-row">
                {OPERATORS.map((op) => (
                  <button
                    key={op}
                    type="button"
                    className={`habitoo-momo-pill ${mobileOperator === op ? 'habitoo-momo-pill--active' : ''}`}
                    onClick={() => setMobileOperator(op)}
                  >
                    {op}
                  </button>
                ))}
              </div>
            </div>

            <div className="habitoo-field-group">
              <label className="habitoo-field-label">
                Numéro de téléphone mobile *
              </label>
              <input
                type="tel"
                className="habitoo-field-input"
                value={mobilePhone}
                onChange={(e) => setMobilePhone(e.target.value)}
                placeholder="+225 07 00 00 00 00"
                required
              />
            </div>
          </>
        ) : (
          <>
            <div className="habitoo-form-row">
              <div className="habitoo-field-group">
                <label className="habitoo-field-label">
                  Titulaire de la carte *
                </label>
                <input
                  type="text"
                  className="habitoo-field-input"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  placeholder="Nom sur la carte"
                  required
                />
              </div>

              <div className="habitoo-field-group">
                <label className="habitoo-field-label">
                  Numéro de carte *
                </label>
                <input
                  type="text"
                  className="habitoo-field-input"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4532 •••• •••• ••••"
                  required
                />
              </div>
            </div>

            <div className="habitoo-form-row">
              <div className="habitoo-field-group">
                <label className="habitoo-field-label">
                  Expiration *
                </label>
                <input
                  type="text"
                  className="habitoo-field-input"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  placeholder="MM/AA"
                  maxLength={5}
                  required
                />
              </div>

              <div className="habitoo-field-group">
                <label className="habitoo-field-label">
                  Code CVC *
                </label>
                <input
                  type="password"
                  className="habitoo-field-input"
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                  placeholder="3 chiffres"
                  maxLength={4}
                  required
                />
              </div>
            </div>
          </>
        )}

        {errorMessage && (
          <div className="habitoo-kyc-error-banner" role="alert">
            <AlertCircle size={15} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Actions */}
        <div className="habitoo-step-actions-row">
          <button 
            type="button" 
            onClick={onPrev}
            className="habitoo-reg-btn-ghost"
            disabled={isProcessing}
          >
            <ArrowLeft size={16} />
            <span>Retour</span>
          </button>

          <button 
            type="submit" 
            className="habitoo-reg-btn-primary"
            disabled={isProcessing}
          >
            <Lock size={15} />
            <span>{isProcessing ? 'Validation...' : `Régler ${formattedAmount}`}</span>
          </button>
        </div>

      </form>

    </div>
  );
};

export default StepCheckout;
