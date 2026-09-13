import React from 'react';
import './PaymentOperatorLogos.css';

export const PAYMENT_OPERATORS = [
  {
    id: 'Wave',
    label: 'Wave',
    logo: '/assets/payment/wave.png',
    badgeClass: 'habitoo-op-wave',
    hint: 'Paiement instantané sans frais via Wave'
  },
  {
    id: 'Orange Money',
    label: 'Orange Money',
    logo: '/assets/payment/orange-money.svg',
    badgeClass: 'habitoo-op-orange',
    hint: 'Autorisation USSD / Push Orange Money'
  },
  {
    id: 'MTN MoMo',
    label: 'MTN MoMo',
    logo: '/assets/payment/mtn.svg',
    badgeClass: 'habitoo-op-mtn',
    hint: 'Validation push direct MTN Mobile Money'
  },
  {
    id: 'Moov Money',
    label: 'Moov Money',
    logo: '/assets/payment/moov-money.png',
    badgeClass: 'habitoo-op-moov',
    hint: 'Paiement sécurisé Moov Money Flooz'
  },
  {
    id: 'Djamo',
    label: 'Djamo',
    logo: '/assets/payment/djamo.png',
    badgeClass: 'habitoo-op-djamo',
    hint: 'Débit direct carte / compte Djamo'
  }
];

export const PAYMENT_CARDS = [
  { id: 'visa', label: 'Visa', logo: '/assets/payment/visa.svg' },
  { id: 'mastercard', label: 'Mastercard', logo: '/assets/payment/mastercard.svg' }
];

export const OperatorSelectorGrid = ({ 
  selectedOperator, 
  onSelectOperator, 
  operators = PAYMENT_OPERATORS,
  compact = false 
}) => {
  return (
    <div className={`habitoo-operators-grid ${compact ? 'habitoo-operators-grid--compact' : ''}`}>
      {operators.map((op) => {
        const isSelected = selectedOperator === op.id || selectedOperator?.toLowerCase() === op.id.toLowerCase();
        return (
          <button
            key={op.id}
            type="button"
            className={`habitoo-op-card-btn ${isSelected ? 'habitoo-op-card-btn--active' : ''} ${op.badgeClass}`}
            onClick={() => onSelectOperator(op.id)}
            aria-label={`Payer avec ${op.label}`}
          >
            <div className="habitoo-op-logo-wrap">
              <img 
                src={op.logo} 
                alt={op.label} 
                className="habitoo-op-logo-img"
                loading="eager"
              />
            </div>
            <span className="habitoo-op-card-label">{op.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export const CardBrandLogos = () => {
  return (
    <div className="habitoo-card-brand-logos">
      {PAYMENT_CARDS.map((card) => (
        <img
          key={card.id}
          src={card.logo}
          alt={card.label}
          className={`habitoo-card-brand-img habitoo-card-brand-img--${card.id}`}
        />
      ))}
    </div>
  );
};
