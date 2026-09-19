import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

export const StepAccount = ({ formData, updateFormData, onNext, onPrev }) => {
  const [email, setEmail] = useState(formData.email || '');
  const [password, setPassword] = useState(formData.password || '');
  const [confirmPassword, setConfirmPassword] = useState(formData.confirmPassword || '');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isAgence = formData.persona === 'agence';

  // Calcul du score de robustesse
  const calculatePasswordScore = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score += 40;
    if (/[A-Z]/.test(pass)) score += 30;
    if (/[0-9]/.test(pass)) score += 30;
    return score;
  };

  const passwordScore = calculatePasswordScore(password);
  const passwordsMatch = Boolean(password && confirmPassword && password === confirmPassword);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation email
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setErrorMessage('Veuillez renseigner une adresse email professionnelle valide.');
      return;
    }

    // Validation mot de passe
    if (!password || password.length < 8) {
      setErrorMessage('Le mot de passe doit comporter au moins 8 caractères.');
      return;
    }

    if (passwordScore < 60) {
      setErrorMessage('Veuillez renforcer votre mot de passe (au moins une majuscule et un chiffre).');
      return;
    }

    // Validation correspondance
    if (password !== confirmPassword) {
      setErrorMessage('Les deux mots de passe ne correspondent pas.');
      return;
    }

    // Sauvegarde dans formData central
    updateFormData({
      email: email.trim(),
      password: password,
      confirmPassword: confirmPassword
    });

    onNext();kw
  };

  return (
    <div className="habitoo-reg-step-content">
      {/* Header */}
      <div className="habitoo-step-header">
        <span className="habitoo-step-counter">
          {isAgence ? 'Étape 02 sur 05' : 'Étape 02 sur 03'}
        </span>
        <h1 className="habitoo-step-title">
          Création de compte
        </h1>
        <p className="habitoo-step-lead">
          Définissez vos identifiants pour administrer votre compte.
        </p>


      </div>

      {/* Message d'erreur éventuel */}
      {errorMessage && (
        <div className="habitoo-auth-alert habitoo-auth-alert--error" role="alert" style={{ marginBottom: '12px' }}>
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="habitoo-kyc-form" noValidate>
        {/* Email professionnel */}
        <div className="habitoo-field-group">
          <label className="habitoo-field-label" htmlFor="pro-account-email">
            Adresse email professionnelle *
          </label>
          <div className="habitoo-auth-input-wrap">
            <Mail size={16} className="habitoo-auth-input-icon" />
            <input
              id="pro-account-email"
              type="email"
              className="habitoo-auth-input"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder={isAgence ? "direction@votre-agence.ci" : "votre.nom@contact.ci"}
              autoComplete="email"
              required
            />
          </div>

        </div>

        {/* Mot de passe & Confirmation */}
        <div className="habitoo-form-row" style={{ marginTop: '4px' }}>
          {/* Mot de passe */}
          <div className="habitoo-field-group">
            <label className="habitoo-field-label" htmlFor="pro-account-password">
              Mot de passe sécurisé *
            </label>
            <div className="habitoo-auth-input-wrap">
              <Lock size={16} className="habitoo-auth-input-icon" />
              <input
                id="pro-account-password"
                type={showPassword ? 'text' : 'password'}
                className="habitoo-auth-input habitoo-auth-input--with-action"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Au moins 8 caractères"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="habitoo-auth-pw-toggle"
                onClick={() => setShowPassword(p => !p)}
                tabIndex={-1}
                aria-label={showPassword ? 'Masquer' : 'Afficher'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {/* Jauge dynamique */}
            {password && (
              <div className="habitoo-auth-strength-wrap" style={{ marginTop: '6px' }}>
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
                  {passwordScore > 66 
                    ? 'Robuste' 
                    : passwordScore > 33 
                      ? 'Moyen (ajoutez majuscule/chiffre)' 
                      : 'Trop court'}
                </span>
              </div>
            )}
          </div>

          {/* Confirmation du mot de passe */}
          <div className="habitoo-field-group">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label className="habitoo-field-label" htmlFor="pro-account-confirm-password">
                Confirmer le mot de passe *
              </label>
              {passwordsMatch && (
                <span style={{ fontSize: '0.68rem', color: 'var(--verified-green)', display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}>
                  <CheckCircle2 size={12} /> Concorde
                </span>
              )}
            </div>
            <div className="habitoo-auth-input-wrap">
              <Lock size={16} className="habitoo-auth-input-icon" />
              <input
                id="pro-account-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                className="habitoo-auth-input habitoo-auth-input--with-action"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Retapez votre mot de passe"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="habitoo-auth-pw-toggle"
                onClick={() => setShowConfirmPassword(p => !p)}
                tabIndex={-1}
                aria-label={showConfirmPassword ? 'Masquer' : 'Afficher'}
              >
                {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--graphite-light)', marginTop: '3px' }}>
              Doit correspondre exactement au mot de passe ci-contre.
            </span>
          </div>
        </div>

        {/* Actions bar */}
        <div className="habitoo-step-actions-row" style={{ marginTop: '12px' }}>
          <button
            type="button"
            className="habitoo-reg-btn-ghost"
            onClick={onPrev}
          >
            <ArrowLeft size={16} />
            <span>Retour</span>
          </button>

          <button
            type="submit"
            className="habitoo-reg-btn-primary"
          >
            <span>Justificatifs</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default StepAccount;
