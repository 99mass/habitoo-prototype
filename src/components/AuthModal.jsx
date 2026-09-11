import React, { useState, useEffect, useRef } from 'react';
import { useHabitoo } from '../context/HabitooContext';
import { 
  X, 
  Mail, 
  Phone, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  RefreshCw,
  Lock,
  ChevronDown,
  Check
} from 'lucide-react';

const COUNTRY_CODES = [
  { code: '+225', country: "Côte d'Ivoire", flag: '🇨🇮' },
  { code: '+243', country: 'RD Congo (Kinshasa)', flag: '🇨🇩' },
  { code: '+242', country: 'Congo (Brazzaville)', flag: '🇨🇬' },
  { code: '+221', country: 'Sénégal', flag: '🇸🇳' },
  { code: '+237', country: 'Cameroun', flag: '🇨🇲' },
  { code: '+229', country: 'Bénin', flag: '🇧🇯' },
  { code: '+228', country: 'Togo', flag: '🇹🇬' },
  { code: '+241', country: 'Gabon', flag: '🇬🇦' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+32', country: 'Belgique', flag: '🇧🇪' },
  { code: '+41', country: 'Suisse', flag: '🇨🇭' },
  { code: '+1', country: 'Canada / USA', flag: '🇨🇦' },
  { code: '+44', country: 'Royaume-Uni', flag: '🇬🇧' },
];

export const AuthModal = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    loginWithGoogle, 
    requestOtp, 
    verifyOtp,
    pendingAuth
  } = useHabitoo();

  // 'methods' | 'otp' | 'success'
  const [step, setStep] = useState('methods');
  const [authMethod, setAuthMethod] = useState('email'); // 'email' | 'phone'
  
  // Inputs
  const [emailInput, setEmailInput] = useState('');
  const [countryCode, setCountryCode] = useState('+225');
  const [phoneInput, setPhoneInput] = useState('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const countryDropdownRef = useRef(null);

  const selectedCountry = COUNTRY_CODES.find(c => c.code === countryCode) || COUNTRY_CODES[0];
  
  // OTP state (4 digits)
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendNotification, setResendNotification] = useState('');

  // Refs for 4 OTP inputs
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isAuthModalOpen) {
      setStep('methods');
      setOtpDigits(['', '', '', '']);
      setErrorMessage('');
      setResendNotification('');
      setIsSubmitting(false);
      setIsCountryDropdownOpen(false);
    }
  }, [isAuthModalOpen]);

  // Handle click outside country dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target)) {
        setIsCountryDropdownOpen(false);
      }
    };
    if (isCountryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCountryDropdownOpen]);

  // Focus first OTP input when step switches to 'otp'
  useEffect(() => {
    if (step === 'otp' && inputRefs[0].current) {
      setTimeout(() => {
        inputRefs[0].current?.focus();
      }, 100);
    }
  }, [step]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  // Handler: Direct Google Login
  const handleGoogleLogin = () => {
    setIsSubmitting(true);
    setErrorMessage('');
    
    // Simulate instantaneous Google OAuth verification
    setTimeout(() => {
      loginWithGoogle();
      setIsSubmitting(false);
      setStep('success');
      setTimeout(() => {
        closeAuthModal();
      }, 1100);
    }, 450);
  };

  // Handler: Request OTP (Email or Phone)
  const handleRequestOtp = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (authMethod === 'email') {
      if (!emailInput || !emailInput.includes('@')) {
        setErrorMessage('Veuillez renseigner une adresse email valide.');
        return;
      }
      requestOtp(emailInput, 'email');
    } else {
      const cleanPhone = phoneInput.replace(/\s+/g, '');
      if (!cleanPhone || cleanPhone.length < 6) {
        setErrorMessage('Veuillez renseigner un numéro de téléphone valide.');
        return;
      }
      requestOtp(`${countryCode} ${phoneInput}`, 'phone');
    }

    setStep('otp');
    setOtpDigits(['', '', '', '']);
  };

  // Handle OTP digit changes
  const handleDigitChange = (index, value) => {
    // Only accept single number
    const cleanVal = value.replace(/[^0-9]/g, '');
    
    // If pasting full code (e.g. "1111")
    if (cleanVal.length > 1) {
      const pasted = cleanVal.slice(0, 4).split('');
      const newDigits = [...otpDigits];
      pasted.forEach((d, i) => {
        if (i < 4) newDigits[i] = d;
      });
      setOtpDigits(newDigits);
      setErrorMessage('');
      const focusTarget = Math.min(pasted.length, 3);
      inputRefs[focusTarget].current?.focus();

      // If exactly 4 digits pasted, auto-verify
      if (newDigits.every(d => d !== '')) {
        submitOtp(newDigits.join(''));
      }
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);
    setErrorMessage('');

    // Advance focus if digit typed
    if (cleanVal && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    // If all 4 digits filled, auto-submit
    if (cleanVal && index === 3) {
      const fullCode = newDigits.join('');
      if (fullCode.length === 4) {
        submitOtp(fullCode);
      }
    }
  };

  // Handle Backspace navigation
  const handleKeyDownInput = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  // Submit OTP Verification
  const submitOtp = (codeToVerify) => {
    const code = codeToVerify || otpDigits.join('');
    if (code.length < 4) {
      setErrorMessage('Veuillez saisir les 4 chiffres du code de vérification.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    setTimeout(() => {
      const res = verifyOtp(code);
      setIsSubmitting(false);

      if (res.success) {
        setStep('success');
        setTimeout(() => {
          closeAuthModal();
        }, 1100);
      } else {
        setErrorMessage(res.message || 'Code invalide. En simulation, utilisez le code 1111.');
      }
    }, 400);
  };

  // Auto-fill simulation code
  const fillSimulationCode = () => {
    const codeArray = ['1', '1', '1', '1'];
    setOtpDigits(codeArray);
    setErrorMessage('');
    submitOtp('1111');
  };

  // Resend OTP
  const handleResend = () => {
    setResendNotification('Un nouveau code OTP (1111) a été envoyé avec succès !');
    setErrorMessage('');
    setTimeout(() => setResendNotification(''), 4000);
  };

  return (
    <div className="auth-modal-overlay" onClick={(e) => e.target === e.currentTarget && closeAuthModal()}>
      <div className="auth-modal-card">
        
        {/* Close Button */}
        <button 
          onClick={closeAuthModal} 
          className="auth-modal-close"
          aria-label="Fermer la fenêtre de connexion"
        >
          <X size={20} />
        </button>

        {/* STEP: METHODS */}
        {step === 'methods' && (
          <div>
            {/* Header branding */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              </div>
              <h2 style={{ 
                fontFamily: 'var(--font-heading)', 
                fontSize: '1.5rem', 
                fontWeight: 800, 
                color: 'var(--obsidian-black)',
                marginBottom: '6px'
              }}>
                Connexion ou Inscription
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--graphite-gray)', maxWidth: '340px', margin: '0 auto' }}>
                Accédez à vos visites sécurisées, favoris et portefeuille digital certifié.
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="auth-error-alert">
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* GOOGLE DIRECT LOGIN (Direct Pass) */}
            <button
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="google-auth-btn"
              title="Connexion instantanée avec Google (Passe directement)"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{isSubmitting ? 'Connexion Google en cours...' : 'Continuer avec Google'}</span>
            </button>

            {/* Divider */}
            <div className="auth-divider">
            </div>

            {/* Method Tabs: Email vs Phone */}
            <div className="auth-tabs">
              <button
                type="button"
                className={`auth-tab ${authMethod === 'email' ? 'active' : ''}`}
                onClick={() => {
                  setAuthMethod('email');
                  setErrorMessage('');
                }}
              >
                <Mail size={16} />
                <span>Adresse Email</span>
              </button>
              <button
                type="button"
                className={`auth-tab ${authMethod === 'phone' ? 'active' : ''}`}
                onClick={() => {
                  setAuthMethod('phone');
                  setErrorMessage('');
                }}
              >
                <Phone size={16} />
                <span>Numéro Mobile</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleRequestOtp}>
              {authMethod === 'email' ? (
                <div style={{ marginBottom: '18px' }}>
                  <label className="auth-input-label">Votre adresse email</label>
                  <div className="auth-input-wrapper">
                    <Mail size={18} className="auth-input-icon" />
                    <input 
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="ex: marc.kouassi@gmail.com"
                      className="auth-input-field"
                      autoFocus
                      required
                    />
                  </div>

                </div>
              ) : (
                <div style={{ marginBottom: '18px' }}>
                  <label className="auth-input-label">Votre numéro de téléphone</label>
                  
                  {/* Unified Phone Input Container */}
                  <div className="auth-phone-unified-container">
                    {/* Compact Country Selector Trigger */}
                    <div className="auth-country-dropdown-wrapper" ref={countryDropdownRef}>
                      <button
                        type="button"
                        className="auth-country-trigger"
                        onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                        aria-expanded={isCountryDropdownOpen}
                        title={selectedCountry?.country}
                      >
                        <span className="auth-country-flag">{selectedCountry?.flag}</span>
                        <span className="auth-country-code">{selectedCountry?.code}</span>
                        <ChevronDown 
                          size={13} 
                          className={`auth-country-chevron ${isCountryDropdownOpen ? 'open' : ''}`} 
                        />
                      </button>

                      {/* Floating Dropdown Menu */}
                      {isCountryDropdownOpen && (
                        <div className="auth-country-menu">
                          <div className="auth-country-menu-header">Sélectionner un indicatif</div>
                          <div className="auth-country-menu-list">
                            {COUNTRY_CODES.map((item) => {
                              const isSelected = item.code === countryCode;
                              return (
                                <button
                                  key={item.code}
                                  type="button"
                                  className={`auth-country-item ${isSelected ? 'selected' : ''}`}
                                  onClick={() => {
                                    setCountryCode(item.code);
                                    setIsCountryDropdownOpen(false);
                                  }}
                                >
                                  <span className="auth-country-item-flag">{item.flag}</span>
                                  <span className="auth-country-item-name">{item.country}</span>
                                  <span className="auth-country-item-code">{item.code}</span>
                                  {isSelected && <Check size={14} className="auth-country-item-check" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Vertical Divider */}
                    <div className="auth-phone-divider" />

                    {/* Wide & Readable Phone Input */}
                    <div className="auth-phone-input-box">
                      <input 
                        type="tel"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        placeholder="07 08 09 10 11"
                        className="auth-phone-input-field"
                        autoFocus
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '14px',
                  borderRadius: 'var(--radius-pill)',
                  fontWeight: 700,
                  fontSize: '0.95rem'
                }}
              >
                Recevoir le code de vérification
              </button>
            </form>

            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.75rem', color: 'var(--graphite-gray)' }}>
              En continuant, vous acceptez les Conditions d'Utilisation et la Charte de Séquestre Garanti d'Habitoo.
            </div>
          </div>
        )}

        {/* STEP: OTP VERIFICATION */}
        {step === 'otp' && (
          <div>
            {/* Back button */}
            <button
              type="button"
              onClick={() => {
                setStep('methods');
                setErrorMessage('');
              }}
              className="auth-back-btn"
            >
              <ArrowLeft size={16} />
              <span>Changer d'identifiant</span>
            </button>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: 'var(--soft-tint)',
                color: 'var(--primary-red)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto'
              }}>
                <Lock size={26} />
              </div>

              <h2 style={{ 
                fontFamily: 'var(--font-heading)', 
                fontSize: '1.4rem', 
                fontWeight: 800, 
                color: 'var(--obsidian-black)',
                marginBottom: '6px'
              }}>
                Code de vérification
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--graphite-gray)', margin: '0 auto', maxWidth: '320px' }}>
                Saisissez le code à 4 chiffres envoyé à :
              </p>
              <div style={{ 
                fontWeight: 700, 
                color: 'var(--obsidian-black)', 
                fontSize: '0.95rem',
                marginTop: '4px' 
              }}>
                {pendingAuth?.identifier}
              </div>
            </div>


            {/* Error Message */}
            {errorMessage && (
              <div className="auth-error-alert" style={{ marginBottom: '16px' }}>
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Resend success notice */}
            {resendNotification && (
              <div className="auth-resend-alert">
                <CheckCircle2 size={16} />
                <span>{resendNotification}</span>
              </div>
            )}

            {/* 4-Digit Inputs */}
            <div className="otp-inputs-grid">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  value={digit}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDownInput(index, e)}
                  className={`otp-digit-box ${digit ? 'filled' : ''} ${errorMessage ? 'error' : ''}`}
                />
              ))}
            </div>

            {/* Submit Button */}
            <button
              onClick={() => submitOtp()}
              disabled={isSubmitting || otpDigits.join('').length < 4}
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '14px',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 700,
                fontSize: '0.95rem',
                marginTop: '18px',
                opacity: otpDigits.join('').length < 4 ? 0.6 : 1,
                cursor: otpDigits.join('').length < 4 ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? 'Vérification...' : 'Valider et continuer'}
            </button>

            {/* Resend button */}
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button
                type="button"
                onClick={handleResend}
                className="auth-resend-btn"
              >
                <RefreshCw size={14} />
                <span>Renvoyer un nouveau code OTP</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP: SUCCESS */}
        {step === 'success' && (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(5,150,105,0.12)',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              animation: 'scaleIn 0.3s ease-out'
            }}>
              <CheckCircle2 size={36} />
            </div>
            <h3 style={{ 
              fontFamily: 'var(--font-heading)', 
              fontSize: '1.4rem', 
              fontWeight: 800, 
              color: 'var(--obsidian-black)',
              marginBottom: '6px'
            }}>
              Connexion Réussie !
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--graphite-gray)' }}>
              Bienvenue sur votre espace Habitoo sécurisé.
            </p>
          </div>
        )}

      </div>

      <style>{`
        .auth-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(17, 17, 17, 0.65);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 1100;
          animation: fadeIn 0.2s ease-out;
        }

        .auth-modal-card {
          background-color: var(--surface-white);
          border-radius: var(--radius-card);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          width: 100%;
          max-width: 440px;
          padding: 32px 28px;
          position: relative;
          border: 1px solid var(--border-color);
          animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }

        .auth-modal-close {
          position: absolute;
          top: 18px;
          right: 18px;
          background: transparent;
          border: none;
          color: var(--graphite-gray);
          cursor: pointer;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
        }
        .auth-modal-close:hover {
          background-color: var(--bg-main);
          color: var(--obsidian-black);
        }

        .google-auth-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 12px 18px;
          border-radius: var(--radius-pill);
          border: 1.5px solid var(--border-color);
          background-color: #FFFFFF;
          color: var(--obsidian-black);
          font-weight: 700;
          font-size: 0.9375rem;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.04);
        }
        .google-auth-btn:hover {
          background-color: #F8FAFC;
          border-color: #CBD5E1;
          box-shadow: 0 4px 10px rgba(0,0,0,0.08);
          transform: translateY(-1px);
        }
        .direct-badge {
          background-color: #E0F2FE;
          color: #0369A1;
          font-size: 0.6875rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: var(--radius-pill);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .auth-divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 20px 0;
        }
        .auth-divider::before,
        .auth-divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid var(--border-color);
        }
        .auth-divider span {
          padding: 0 12px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--graphite-gray);
        }

        .auth-tabs {
          display: flex;
          gap: 8px;
          background-color: var(--bg-main);
          padding: 4px;
          border-radius: var(--radius-pill);
          margin-bottom: 18px;
        }
        .auth-tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: var(--radius-pill);
          border: none;
          background: transparent;
          font-weight: 700;
          font-size: 0.8125rem;
          color: var(--graphite-gray);
          cursor: pointer;
          transition: all 0.2s;
        }
        .auth-tab.active {
          background-color: var(--surface-white);
          color: var(--primary-red);
          box-shadow: 0 2px 6px rgba(0,0,0,0.06);
        }

        .auth-input-label {
          display: block;
          font-size: 0.8125rem;
          font-weight: 700;
          color: var(--obsidian-black);
          margin-bottom: 6px;
        }
        .auth-input-wrapper {
          display: flex;
          align-items: center;
          position: relative;
          background-color: var(--bg-main);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 0 14px;
          transition: border-color 0.2s;
        }
        .auth-input-wrapper:focus-within {
          border-color: var(--primary-red);
          background-color: #FFF;
          box-shadow: 0 0 0 3px rgba(247,0,0,0.1);
        }
        .auth-input-icon {
          color: var(--graphite-gray);
          margin-right: 10px;
        }
        .auth-input-field {
          width: 100%;
          padding: 12px 0;
          background: transparent;
          border: none;
          outline: none;
          font-size: 0.9375rem;
          color: var(--obsidian-black);
          font-family: inherit;
        }
        .auth-phone-unified-container {
          display: flex;
          align-items: center;
          position: relative;
          background-color: var(--bg-main);
          border: 1.5px solid var(--border-color);
          border-radius: 12px;
          transition: all 0.2s ease;
        }
        .auth-phone-unified-container:focus-within {
          border-color: var(--primary-red);
          background-color: #FFFFFF;
          box-shadow: 0 0 0 3px rgba(247, 0, 0, 0.08);
        }

        .auth-country-dropdown-wrapper {
          position: relative;
          flex-shrink: 0;
        }
        .auth-country-trigger {
          display: flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          padding: 12px 10px 12px 12px;
          cursor: pointer;
          font-family: inherit;
          transition: color 0.15s;
        }
        .auth-country-trigger:hover {
          background-color: rgba(0, 0, 0, 0.02);
        }
        .auth-country-flag {
          font-size: 1.15rem;
          line-height: 1;
        }
        .auth-country-code {
          font-size: 0.9375rem;
          font-weight: 700;
          color: var(--obsidian-black);
          letter-spacing: -0.2px;
        }
        .auth-country-chevron {
          color: var(--graphite-gray);
          transition: transform 0.2s ease;
        }
        .auth-country-chevron.open {
          transform: rotate(180deg);
          color: var(--primary-red);
        }

        .auth-country-menu {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          width: 270px;
          background-color: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: 12px;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.16);
          z-index: 1000;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          animation: fadeIn 0.15s ease-out;
        }
        .auth-country-menu-header {
          padding: 8px 12px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--graphite-gray);
          background-color: var(--bg-main);
          border-bottom: 1px solid var(--border-color);
        }
        .auth-country-menu-list {
          overflow-y: auto;
          max-height: 220px;
          padding: 4px;
        }
        .auth-country-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border: none;
          background: transparent;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.15s;
          text-align: left;
          font-family: inherit;
        }
        .auth-country-item:hover {
          background-color: var(--bg-main);
        }
        .auth-country-item.selected {
          background-color: rgba(247, 0, 0, 0.06);
          color: var(--primary-red);
        }
        .auth-country-item-flag {
          font-size: 1.1rem;
          line-height: 1;
          flex-shrink: 0;
        }
        .auth-country-item-name {
          flex: 1;
          font-size: 0.84rem;
          font-weight: 500;
          color: var(--obsidian-black);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .auth-country-item.selected .auth-country-item-name {
          font-weight: 700;
          color: var(--primary-red);
        }
        .auth-country-item-code {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--graphite-gray);
          flex-shrink: 0;
        }
        .auth-country-item-check {
          color: var(--primary-red);
          flex-shrink: 0;
          margin-left: 2px;
        }

        .auth-phone-divider {
          width: 1px;
          height: 22px;
          background-color: var(--border-color);
          flex-shrink: 0;
        }

        .auth-phone-input-box {
          flex: 1;
          display: flex;
          align-items: center;
          padding: 0 12px;
          min-width: 0;
        }
        .auth-phone-input-field {
          width: 100%;
          padding: 12px 0;
          background: transparent;
          border: none;
          outline: none;
          font-size: 1rem;
          font-weight: 500;
          color: var(--obsidian-black);
          font-family: inherit;
          letter-spacing: 0.5px;
        }
        .auth-phone-input-field::placeholder {
          color: #A0AEC0;
          font-size: 0.9375rem;
          letter-spacing: normal;
        }
        .auth-field-hint {
          display: block;
          font-size: 0.75rem;
          color: var(--graphite-gray);
          margin-top: 6px;
        }

        .auth-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          color: var(--graphite-gray);
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          padding: 4px 0;
          margin-bottom: 8px;
          transition: color 0.15s;
        }
        .auth-back-btn:hover {
          color: var(--obsidian-black);
        }

        .auth-simulation-badge {
          background-color: var(--soft-tint);
          border: 1px dashed var(--primary-red);
          border-radius: 12px;
          padding: 10px 14px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          cursor: pointer;
          transition: background-color 0.15s;
        }
        .auth-simulation-badge:hover {
          background-color: rgba(247,0,0,0.08);
        }
        .simulation-fill-btn {
          background-color: var(--primary-red);
          color: #FFF;
          border: none;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 5px 10px;
          border-radius: var(--radius-pill);
          cursor: pointer;
          white-space: nowrap;
          transition: opacity 0.15s;
        }
        .simulation-fill-btn:hover {
          opacity: 0.9;
        }

        .otp-inputs-grid {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin: 16px auto;
          max-width: 280px;
        }
        .otp-digit-box {
          width: 56px;
          min-width: 0;
          height: 60px;
          text-align: center;
          font-size: 1.6rem;
          font-weight: 800;
          font-family: monospace;
          background-color: var(--bg-main);
          border: 2px solid var(--border-color);
          border-radius: 12px;
          color: var(--obsidian-black);
          outline: none;
          transition: all 0.2s;
          box-sizing: border-box;
        }
        .otp-digit-box:focus {
          border-color: var(--primary-red);
          background-color: #FFF;
          box-shadow: 0 0 0 3px rgba(247,0,0,0.15);
        }
        .otp-digit-box.filled {
          background-color: #FFF;
          border-color: var(--obsidian-black);
        }
        .otp-digit-box.error {
          border-color: #EF4444;
          background-color: #FEF2F2;
          color: #DC2626;
        }

        .auth-error-alert {
          background-color: #FEF2F2;
          color: #DC2626;
          border: 1px solid #FCA5A5;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 0.8125rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .auth-resend-alert {
          background-color: #ECFDF5;
          color: #059669;
          border: 1px solid #A7F3D0;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 0.8125rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .auth-resend-btn {
          background: transparent;
          border: none;
          color: var(--graphite-gray);
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: color 0.15s;
        }
        .auth-resend-btn:hover {
          color: var(--primary-red);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
