import React, { useState, useRef, useEffect } from 'react';
import { 
  Shield, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  KeyRound,
  RotateCw
} from 'lucide-react';

export const StepProAuth = ({ onLoginSuccess, onStartRegistration }) => {
  // Views: 'login' | 'forgot_email' | 'forgot_otp' | 'forgot_password' | 'forgot_success'
  const [authSubView, setAuthSubView] = useState('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot password flow state
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [resendNotification, setResendNotification] = useState(false);

  // Refs for OTP inputs
  const otpInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Focus management on step change
  useEffect(() => {
    if (authSubView === 'forgot_otp' && otpInputRefs[0].current) {
      setTimeout(() => otpInputRefs[0].current?.focus(), 150);
    }
  }, [authSubView]);

  // Password score calculation
  const calculatePasswordScore = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score += 40;
    if (/[A-Z]/.test(pass)) score += 30;
    if (/[0-9]/.test(pass)) score += 30;
    return score;
  };
  const passwordScore = calculatePasswordScore(newPassword);

  // --- Handlers: Login ---
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim() || !loginEmail.includes('@')) {
      setLoginError('Veuillez renseigner une adresse email professionnelle valide.');
      return;
    }
    if (!loginPassword.trim()) {
      setLoginError('Veuillez saisir votre mot de passe.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess({
        email: loginEmail.trim(),
        password: loginPassword
      });
    }, 400);
  };

  // --- Handlers: Forgot Password Steps ---
  const handleForgotEmailSubmit = (e) => {
    e.preventDefault();
    setForgotError('');

    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      setForgotError('Veuillez renseigner une adresse email professionnelle valide.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setAuthSubView('forgot_otp');
      setOtpDigits(['', '', '', '']);
    }, 350);
  };

  // OTP inputs handling
  const handleOtpChange = (index, value) => {
    const char = value.slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = char;
    setOtpDigits(newDigits);

    if (char && index < 3) {
      otpInputRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs[index - 1].current?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (!pasted) return;

    const newDigits = ['', '', '', ''];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setOtpDigits(newDigits);

    const nextIndex = Math.min(pasted.length, 3);
    otpInputRefs[nextIndex].current?.focus();
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setForgotError('');
    const fullCode = otpDigits.join('');

    if (fullCode.length < 4) {
      setForgotError('Veuillez saisir le code complet à 4 chiffres.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setAuthSubView('forgot_password');
    }, 350);
  };

  const handleResendOtp = () => {
    setResendNotification(true);
    setTimeout(() => setResendNotification(false), 3000);
  };

  const handleNewPasswordSubmit = (e) => {
    e.preventDefault();
    setForgotError('');

    if (newPassword.length < 8) {
      setForgotError('Le nouveau mot de passe doit comporter au moins 8 caractères.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setForgotError('Les deux mots de passe ne correspondent pas.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setAuthSubView('forgot_success');
    }, 400);
  };

  const handleReturnToLogin = () => {
    setLoginEmail(forgotEmail || loginEmail);
    setAuthSubView('login');
    setForgotError('');
    setLoginError('');
  };

  return (
    <div className="habitoo-reg-auth-gate">
      <div className="habitoo-auth-gate-card habitoo-auth-card-pro">

        {/* Bouton Retour tout en haut */}
        {authSubView === 'forgot_email' && (
          <button
            type="button"
            className="habitoo-auth-back-link"
            onClick={() => setAuthSubView('login')}
          >
            <ArrowLeft size={14} />
            <span>Retour à la connexion</span>
          </button>
        )}

        {authSubView === 'forgot_otp' && (
          <button
            type="button"
            className="habitoo-auth-back-link"
            onClick={() => setAuthSubView('forgot_email')}
          >
            <ArrowLeft size={14} />
            <span>Modifier l'adresse email</span>
          </button>
        )}

        {authSubView === 'forgot_password' && (
          <button
            type="button"
            className="habitoo-auth-back-link"
            onClick={() => setAuthSubView('forgot_otp')}
          >
            <ArrowLeft size={14} />
            <span>Retour à la vérification</span>
          </button>
        )}

        {/* Brand Icon & Tag */}
        <div className="habitoo-auth-gate-icon">
          {authSubView === 'forgot_success' ? (
            <CheckCircle2 size={22} strokeWidth={2} style={{ color: 'var(--verified-green)' }} />
          ) : authSubView.startsWith('forgot') ? (
            <KeyRound size={22} strokeWidth={1.8} />
          ) : (
            <Shield size={22} strokeWidth={1.8} />
          )}
        </div>

        <span className="habitoo-auth-gate-tag">Espace Professionnel</span>

        {/* -------------------------------------------------------------
            1. VUE : CONNEXION (PAR DÉFAUT)
           ------------------------------------------------------------- */}
        {authSubView === 'login' && (
          <>
            <h1 className="habitoo-auth-gate-title">
              Connexion
            </h1>

            {loginError && (
              <div className="habitoo-auth-alert habitoo-auth-alert--error" role="alert">
                <AlertCircle size={15} />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="habitoo-auth-form" noValidate>
              {/* Email */}
              <div className="habitoo-auth-field-group">
                <label className="habitoo-auth-label" htmlFor="pro-login-email">
                  Adresse email professionnelle
                </label>
                <div className="habitoo-auth-input-wrap">
                  <Mail size={16} className="habitoo-auth-input-icon" />
                  <input
                    id="pro-login-email"
                    type="email"
                    className="habitoo-auth-input"
                    placeholder="contact@agence-immo.ci"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div className="habitoo-auth-field-group">
                <div className="habitoo-auth-label-row">
                  <label className="habitoo-auth-label" htmlFor="pro-login-password">
                    Mot de passe
                  </label>
                  <button
                    type="button"
                    className="habitoo-auth-inline-link"
                    onClick={() => {
                      setForgotEmail(loginEmail);
                      setAuthSubView('forgot_email');
                      setForgotError('');
                    }}
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
                <div className="habitoo-auth-input-wrap">
                  <Lock size={16} className="habitoo-auth-input-icon" />
                  <input
                    id="pro-login-password"
                    type={showLoginPassword ? 'text' : 'password'}
                    className="habitoo-auth-input habitoo-auth-input--with-action"
                    placeholder="••••••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="habitoo-auth-pw-toggle"
                    onClick={() => setShowLoginPassword(p => !p)}
                    aria-label={showLoginPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    tabIndex={-1}
                  >
                    {showLoginPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="habitoo-reg-btn-primary habitoo-auth-submit-btn"
                disabled={isSubmitting}
              >
                <span>{isSubmitting ? 'Connexion en cours...' : 'Se connecter'}</span>
                {!isSubmitting && <ArrowRight size={16} />}
              </button>
            </form>

            {/* Separator & Registration CTA */}
            <div className="habitoo-auth-divider">
              <span className="habitoo-auth-divider-text">ou</span>
            </div>

            <div className="habitoo-auth-switch-box">
              <span className="habitoo-auth-switch-text">
                Nouveau sur Habitoo ?
              </span>
              <button
                type="button"
                onClick={onStartRegistration}
                className="habitoo-auth-register-cta-btn"
              >
                <span>Créer mon compte professionnel</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </>
        )}

        {/* -------------------------------------------------------------
            2. VUE : MOT DE PASSE OUBLIÉ - ÉTAPE 1 (EMAIL)
           ------------------------------------------------------------- */}
        {authSubView === 'forgot_email' && (
          <>
            <h1 className="habitoo-auth-gate-title">
              Mot de passe oublié
            </h1>
            <p className="habitoo-auth-gate-lead">
              Renseignez votre email professionnel pour recevoir votre code de vérification instantané.
            </p>

            {forgotError && (
              <div className="habitoo-auth-alert habitoo-auth-alert--error" role="alert">
                <AlertCircle size={15} />
                <span>{forgotError}</span>
              </div>
            )}

            <form onSubmit={handleForgotEmailSubmit} className="habitoo-auth-form" noValidate>
              <div className="habitoo-auth-field-group">
                <label className="habitoo-auth-label" htmlFor="pro-forgot-email">
                  Adresse email professionnelle
                </label>
                <div className="habitoo-auth-input-wrap">
                  <Mail size={16} className="habitoo-auth-input-icon" />
                  <input
                    id="pro-forgot-email"
                    type="email"
                    className="habitoo-auth-input"
                    placeholder="contact@agence-immo.ci"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                className="habitoo-reg-btn-primary habitoo-auth-submit-btn"
                disabled={isSubmitting}
              >
                <span>{isSubmitting ? 'Envoi en cours...' : 'Recevoir le code de vérification'}</span>
                {!isSubmitting && <ArrowRight size={16} />}
              </button>
            </form>
          </>
        )}

        {/* -------------------------------------------------------------
            3. VUE : MOT DE PASSE OUBLIÉ - ÉTAPE 2 (CODE OTP 4 CHIFFRES)
           ------------------------------------------------------------- */}
        {authSubView === 'forgot_otp' && (
          <>
            <h1 className="habitoo-auth-gate-title">
              Code de vérification
            </h1>
            <p className="habitoo-auth-gate-lead">
              Saisissez le code à 4 chiffres envoyé à <strong>{forgotEmail}</strong>.
            </p>

            {forgotError && (
              <div className="habitoo-auth-alert habitoo-auth-alert--error" role="alert">
                <AlertCircle size={15} />
                <span>{forgotError}</span>
              </div>
            )}

            {resendNotification && (
              <div className="habitoo-auth-alert habitoo-auth-alert--success" role="status">
                <CheckCircle2 size={15} />
                <span>Nouveau code envoyé avec succès (Code démo : 1111).</span>
              </div>
            )}

            <form onSubmit={handleOtpSubmit} className="habitoo-auth-form">
              <div className="habitoo-auth-otp-row" onPaste={handleOtpPaste}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={otpInputRefs[idx]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className={`habitoo-auth-otp-box ${digit ? 'habitoo-auth-otp-box--filled' : ''}`}
                    aria-label={`Chiffre ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                type="submit"
                className="habitoo-reg-btn-primary habitoo-auth-submit-btn"
                disabled={isSubmitting}
              >
                <span>{isSubmitting ? 'Validation...' : 'Vérifier le code'}</span>
                {!isSubmitting && <ArrowRight size={16} />}
              </button>

              <div className="habitoo-auth-resend-wrap">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="habitoo-auth-resend-btn"
                >
                  <RotateCw size={13} />
                  <span>Renvoyer un nouveau code</span>
                </button>
              </div>
            </form>
          </>
        )}

        {/* -------------------------------------------------------------
            4. VUE : MOT DE PASSE OUBLIÉ - ÉTAPE 3 (NOUVEAU MOT DE PASSE)
           ------------------------------------------------------------- */}
        {authSubView === 'forgot_password' && (
          <>
            <h1 className="habitoo-auth-gate-title">
              Nouveau mot de passe
            </h1>
            <p className="habitoo-auth-gate-lead">
              Définissez un mot de passe sécurisé pour réactiver votre accès professionnel.
            </p>

            {forgotError && (
              <div className="habitoo-auth-alert habitoo-auth-alert--error" role="alert">
                <AlertCircle size={15} />
                <span>{forgotError}</span>
              </div>
            )}

            <form onSubmit={handleNewPasswordSubmit} className="habitoo-auth-form" noValidate>
              {/* Nouveau mot de passe */}
              <div className="habitoo-auth-field-group">
                <label className="habitoo-auth-label" htmlFor="pro-new-password">
                  Nouveau mot de passe (min. 8 caractères)
                </label>
                <div className="habitoo-auth-input-wrap">
                  <Lock size={16} className="habitoo-auth-input-icon" />
                  <input
                    id="pro-new-password"
                    type={showNewPassword ? 'text' : 'password'}
                    className="habitoo-auth-input habitoo-auth-input--with-action"
                    placeholder="••••••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoFocus
                  />
                  <button
                    type="button"
                    className="habitoo-auth-pw-toggle"
                    onClick={() => setShowNewPassword(p => !p)}
                    tabIndex={-1}
                  >
                    {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {/* Robustesse sobre */}
                {newPassword && (
                  <div className="habitoo-auth-strength-wrap">
                    <div className="habitoo-auth-strength-bar">
                      <div
                        className={`habitoo-auth-strength-fill ${
                          passwordScore > 66
                            ? 'habitoo-auth-strength-fill--strong'
                            : passwordScore > 33
                            ? 'habitoo-auth-strength-fill--medium'
                            : 'habitoo-auth-strength-fill--weak'
                        }`}
                        style={{ width: `${passwordScore}%` }}
                      />
                    </div>
                    <span className="habitoo-auth-strength-text">
                      {passwordScore > 66 ? 'Mot de passe robuste' : (passwordScore > 33 ? 'Moyen (ajoutez majuscule et chiffre)' : 'Trop court')}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirmation */}
              <div className="habitoo-auth-field-group">
                <label className="habitoo-auth-label" htmlFor="pro-confirm-password">
                  Confirmer le mot de passe
                </label>
                <div className="habitoo-auth-input-wrap">
                  <Lock size={16} className="habitoo-auth-input-icon" />
                  <input
                    id="pro-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="habitoo-auth-input habitoo-auth-input--with-action"
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="habitoo-auth-pw-toggle"
                    onClick={() => setShowConfirmPassword(p => !p)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="habitoo-reg-btn-primary habitoo-auth-submit-btn"
                disabled={isSubmitting}
              >
                <span>{isSubmitting ? 'Enregistrement...' : 'Enregistrer le nouveau mot de passe'}</span>
                {!isSubmitting && <ArrowRight size={16} />}
              </button>
            </form>
          </>
        )}

        {/* -------------------------------------------------------------
            5. VUE : MOT DE PASSE RÉINITIALISÉ (CONFIRMATION SUCCÈS)
           ------------------------------------------------------------- */}
        {authSubView === 'forgot_success' && (
          <>
            <h1 className="habitoo-auth-gate-title">
              Mot de passe réinitialisé
            </h1>
            <p className="habitoo-auth-gate-lead">
              Votre mot de passe a été mis à jour avec succès. Vous pouvez maintenant vous connecter à votre console professionnelle.
            </p>

            <button
              type="button"
              className="habitoo-reg-btn-primary habitoo-auth-submit-btn"
              onClick={handleReturnToLogin}
            >
              <span>Se connecter</span>
              <ArrowRight size={16} />
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default StepProAuth;
