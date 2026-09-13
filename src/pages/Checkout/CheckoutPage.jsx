import React, { useState } from 'react';
import { useLocation, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useHabitoo } from '../../context/HabitooContext';
import { PROPERTIES_DATA } from '../../data/propertiesData';
import { 
  ArrowLeft, 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  CreditCard, 
  Smartphone, 
  Calendar, 
  Clock, 
  MapPin, 
  Info,
  ExternalLink
} from 'lucide-react';
import { OperatorSelectorGrid, CardBrandLogos } from '../../components/PaymentOperatorLogos';
import './Checkout.css';

export const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { bookVisit, formatCurrencyAmount } = useHabitoo();

  // Retrieve property from location state or search param
  const propertyId = searchParams.get('id');
  const property = location.state?.property || 
    (propertyId ? PROPERTIES_DATA.find(p => p.id === propertyId) : null) || 
    PROPERTIES_DATA[0];

  const visitDate = location.state?.visitDate || "02 Mars 2025";
  const visitTime = location.state?.visitTime || "11:00 - 12:00";
  const reservationAmount = 10000; // 10 000 FCFA

  // Payment Method Selection: 'mobile_money' | 'card' | 'paypal'
  const [paymentMethod, setPaymentMethod] = useState('mobile_money');

  // Mobile Money Form State
  const [mobileOperator, setMobileOperator] = useState('Wave');
  const [mobilePhone, setMobilePhone] = useState('+225 07 88 99 00');

  // Card Form State
  const [cardNumber, setCardNumber] = useState('4532 8901 2345 8821');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('784');
  const [cardHolder, setCardHolder] = useState('Marc-Aurèle Kouassi');

  // Confirmation State (In-place)
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  // Trigger Confirmation
  const handleConfirmPayment = (e) => {
    e?.preventDefault();

    const paymentLabel = paymentMethod === 'mobile_money' 
      ? `${mobileOperator} (${mobilePhone})` 
      : paymentMethod === 'card' 
        ? `Carte bancaire (•••• ${cardNumber.slice(-4)})` 
        : `PayPal Express`;

    // Record visit and transaction in Context
    try {
      bookVisit(property, visitDate, visitTime, paymentLabel);
    } catch (err) {
      console.warn("Could not register visit in context:", err);
    }

    const receipt = {
      reference: `HAB-PAY-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      amount: reservationAmount,
      method: paymentLabel,
      propertyTitle: property.title,
      propertyAddress: property.address || `${property.neighborhood}, ${property.city}`,
      agentName: property.agent?.name || "Agent Habitoo",
      agentAgency: property.agent?.agency || "Agence Partenaire",
      visitDate,
      visitTime
    };

    setReceiptData(receipt);
    setIsConfirmed(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">

        {/* Back Link */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="checkout-back-link"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <ArrowLeft size={16} />
          <span>Retour à l'annonce</span>
        </button>

        {isConfirmed && receiptData ? (
          /* ========================================================= */
          /* ÉCRAN DE CONFIRMATION IMMÉDIAT (IN-PLACE)                */
          /* ========================================================= */
          <div className="checkout-success-wrap">
            <div className="checkout-success-icon-badge">
              <CheckCircle2 size={26} strokeWidth={2.2} />
            </div>

            <h1 className="checkout-success-title">
              Votre paiement a bien été pris en compte
            </h1>

            <p className="checkout-success-sub">
              Votre réservation de visite a été confirmée avec succès. L'agent en charge a reçu votre dossier et prendra contact avec vous.
            </p>

            {/* Receipt Summary Box */}
            <div className="checkout-receipt-box">
              <div className="checkout-receipt-grid">
                
                <div className="checkout-receipt-item">
                  <span className="checkout-receipt-lbl">Référence de transaction</span>
                  <span className="checkout-receipt-val">{receiptData.reference}</span>
                </div>

                <div className="checkout-receipt-item">
                  <span className="checkout-receipt-lbl">Montant réglé</span>
                  <span className="checkout-receipt-val checkout-receipt-val--serif">
                    {formatCurrencyAmount ? formatCurrencyAmount(receiptData.amount) : `${receiptData.amount.toLocaleString('fr-FR')} FCFA`}
                  </span>
                </div>

                <div className="checkout-receipt-item">
                  <span className="checkout-receipt-lbl">Mode de règlement</span>
                  <span className="checkout-receipt-val">{receiptData.method}</span>
                </div>

                <div className="checkout-receipt-item">
                  <span className="checkout-receipt-lbl">Date & heure du paiement</span>
                  <span className="checkout-receipt-val">{receiptData.date}</span>
                </div>

                <div className="checkout-receipt-item">
                  <span className="checkout-receipt-lbl">Bien immobilier</span>
                  <span className="checkout-receipt-val">{receiptData.propertyTitle}</span>
                </div>

                <div className="checkout-receipt-item">
                  <span className="checkout-receipt-lbl">Créneau de visite</span>
                  <span className="checkout-receipt-val">{receiptData.visitDate} ({receiptData.visitTime})</span>
                </div>

                <div className="checkout-receipt-item" style={{ gridColumn: '1 / -1' }}>
                  <span className="checkout-receipt-lbl">Conseiller référent</span>
                  <span className="checkout-receipt-val">
                    {receiptData.agentName} — {receiptData.agentAgency}
                  </span>
                </div>

              </div>
            </div>

            {/* Redirection Actions */}
            <div className="checkout-success-actions">
              <Link to="/" className="checkout-btn-home">
                Retour à l'accueil
              </Link>
              <Link to="/mon-compte" className="checkout-btn-account">
                Voir dans mon espace client
              </Link>
            </div>

          </div>
        ) : (
          /* ========================================================= */
          /* PASSERELLE DE PAIEMENT : 2 COLONNES                      */
          /* ========================================================= */
          <>
            <div className="checkout-header">
              <span className="checkout-pre-title">Transaction Sécurisée</span>
              <h1 className="checkout-title">Finalisation de la réservation</h1>
            </div>

            <div className="checkout-grid">
              
              {/* Left Column: Methods & Forms */}
              <div className="checkout-main-col">
                <div className="checkout-card">
                  <h2 className="checkout-section-title">Mode de paiement</h2>

                  {/* 3 Payment Methods Selector */}
                  <div className="checkout-methods-grid">
                    
                    {/* Method 1: Mobile Money */}
                    <div 
                      className={`checkout-method-tab ${paymentMethod === 'mobile_money' ? 'checkout-method-tab--active' : ''}`}
                      onClick={() => setPaymentMethod('mobile_money')}
                    >
                      <div className="checkout-method-icon-wrap">
                        <Smartphone size={18} />
                      </div>
                      <div className="checkout-method-name">Mobile Money</div>
                      <div className="checkout-method-sub">Wave, Orange, MTN, Moov</div>
                    </div>

                    {/* Method 2: Carte Bancaire */}
                    <div 
                      className={`checkout-method-tab ${paymentMethod === 'card' ? 'checkout-method-tab--active' : ''}`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <div className="checkout-method-icon-wrap">
                        <CreditCard size={18} />
                      </div>
                      <div className="checkout-method-name">Carte Bancaire</div>
                      <div className="checkout-method-sub">Visa, Mastercard</div>
                    </div>

                    {/* Method 3: PayPal */}
                    <div 
                      className={`checkout-method-tab ${paymentMethod === 'paypal' ? 'checkout-method-tab--active' : ''}`}
                      onClick={() => setPaymentMethod('paypal')}
                    >
                      <div className="checkout-method-icon-wrap">
                        <span style={{ fontWeight: 800, fontSize: '0.875rem', fontFamily: 'serif' }}>P</span>
                      </div>
                      <div className="checkout-method-name">PayPal</div>
                      <div className="checkout-method-sub">Paiement express</div>
                    </div>

                  </div>

                  {/* Forms depending on chosen method */}
                  <div className="checkout-form-body">
                    
                    {/* VIEW 1: MOBILE MONEY */}
                    {paymentMethod === 'mobile_money' && (
                      <form onSubmit={handleConfirmPayment}>
                        <div className="checkout-field-group">
                          <label className="checkout-label">Sélectionner votre opérateur Mobile Money</label>
                          <OperatorSelectorGrid
                            selectedOperator={mobileOperator}
                            onSelectOperator={setMobileOperator}
                          />
                        </div>

                        <div className="checkout-field-group">
                          <label className="checkout-label">Numéro de téléphone mobile</label>
                          <input
                            type="tel"
                            className="checkout-input"
                            value={mobilePhone}
                            onChange={(e) => setMobilePhone(e.target.value)}
                            placeholder="+225 07 00 00 00 00"
                            required
                          />
                        </div>

                        <div className="checkout-info-banner">
                          <Info size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div>
                            Une demande d'autorisation de débit de <strong>10 000 FCFA</strong> sera transmise instantanément sur votre mobile via <strong>{mobileOperator}</strong>.
                          </div>
                        </div>

                        <button type="submit" className="checkout-btn-confirm">
                          <Lock size={16} />
                          <span>Confirmer et régler 10 000 FCFA</span>
                        </button>
                      </form>
                    )}

                    {/* VIEW 2: CARTE BANCAIRE */}
                    {paymentMethod === 'card' && (
                      <form onSubmit={handleConfirmPayment}>
                        <div className="checkout-field-group">
                          <label className="checkout-label">Nom sur la carte</label>
                          <input
                            type="text"
                            className="checkout-input"
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value)}
                            placeholder="Nom et prénom du titulaire"
                            required
                          />
                        </div>

                        <div className="checkout-field-group">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <label className="checkout-label" style={{ margin: 0 }}>Numéro de carte</label>
                            <CardBrandLogos />
                          </div>
                          <div style={{ position: 'relative' }}>
                            <input
                              type="text"
                              className="checkout-input"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              placeholder="4532 •••• •••• ••••"
                              required
                            />
                          </div>
                        </div>

                        <div className="checkout-input-row">
                          <div className="checkout-field-group">
                            <label className="checkout-label">Date d'expiration</label>
                            <input
                              type="text"
                              className="checkout-input"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="MM/AA"
                              maxLength={5}
                              required
                            />
                          </div>
                          <div className="checkout-field-group">
                            <label className="checkout-label">Code CVC / CVV</label>
                            <input
                              type="password"
                              className="checkout-input"
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value)}
                              placeholder="3 chiffres"
                              maxLength={4}
                              required
                            />
                          </div>
                        </div>

                        <div className="checkout-info-banner">
                          <ShieldCheck size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div>
                            Paiement chiffré par protocole bancaire sécurisé SSL 256-bit. Aucune coordonnée complète n'est stockée en clair.
                          </div>
                        </div>

                        <button type="submit" className="checkout-btn-confirm">
                          <Lock size={16} />
                          <span>Confirmer et régler 10 000 FCFA</span>
                        </button>
                      </form>
                    )}

                    {/* VIEW 3: PAYPAL */}
                    {paymentMethod === 'paypal' && (
                      <div>
                        <div className="checkout-info-banner" style={{ marginTop: 0 }}>
                          <Info size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div>
                            Vous serez redirigé vers l'environnement sécurisé PayPal pour autoriser votre transaction de 10 000 FCFA.
                          </div>
                        </div>

                        <div style={{ padding: '8px 0', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={handleConfirmPayment}
                            className="checkout-btn-confirm"
                            style={{ backgroundColor: '#0070BA' }}
                          >
                            <ExternalLink size={15} />
                            <span>Poursuivre avec PayPal (Simulation)</span>
                          </button>
                        </div>
                      </div>
                    )}

                  </div>

                  <div className="checkout-secure-notice">
                    <ShieldCheck size={14} color="var(--verified-green)" />
                    <span>Transaction protégée par la garantie Habitoo</span>
                  </div>

                </div>
              </div>

              {/* Right Column: Transaction Summary Card */}
              <div className="checkout-summary-col">
                <div className="checkout-summary-card">
                  <h2 className="checkout-section-title">
                    Récapitulatif de réservation
                  </h2>

                  {/* Property Snippet */}
                  <div className="checkout-prop-snippet">
                    <img 
                      src={property.images?.[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80"} 
                      alt={property.title} 
                      className="checkout-prop-thumb"
                    />
                    <div className="checkout-prop-info">
                      <span className="checkout-prop-badge">
                        {property.category === 'VENTE' ? 'À VENDRE' : 'À LOUER'}
                      </span>
                      <h3 className="checkout-prop-title" title={property.title}>
                        {property.title}
                      </h3>
                      <div className="checkout-prop-loc">
                        <MapPin size={13} color="var(--primary-red)" />
                        <span>{property.neighborhood}, {property.city}</span>
                      </div>
                    </div>
                  </div>

                  {/* Scheduled Slot Details */}
                  <div className="checkout-line-items">
                    <div className="checkout-line-row">
                      <span className="checkout-line-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={14} /> Date retenue
                      </span>
                      <span className="checkout-line-value">{visitDate}</span>
                    </div>

                    <div className="checkout-line-row">
                      <span className="checkout-line-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} /> Créneau horaire
                      </span>
                      <span className="checkout-line-value">{visitTime}</span>
                    </div>

                    <div className="checkout-line-row">
                      <span className="checkout-line-label">Frais d'organisation visite</span>
                      <span className="checkout-line-value">10 000 FCFA</span>
                    </div>

                    <div className="checkout-line-row">
                      <span className="checkout-line-label">Frais de plateforme</span>
                      <span className="checkout-line-value checkout-line-value--free">Inclus</span>
                    </div>
                  </div>

                  {/* Total to pay */}
                  <div className="checkout-total-row">
                    <span className="checkout-total-label">Total à régler</span>
                    <span className="checkout-total-amount">10 000 FCFA</span>
                  </div>

                  {/* Reassurance pill */}
                  <div className="checkout-guarantee-pill">
                    <ShieldCheck size={16} color="var(--verified-green)" style={{ flexShrink: 0 }} />
                    <span>Visite accompagnée par un conseiller agréé Habitoo. Annulation possible sans pénalité.</span>
                  </div>

                </div>
              </div>

            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default CheckoutPage;
