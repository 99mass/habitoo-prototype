import React, { useState } from 'react';
import { 
  Lock, 
  Bell, 
  ShieldCheck, 
  Smartphone, 
  Laptop, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  KeyRound, 
  LogOut, 
  Save 
} from 'lucide-react';

export const ProSettingsView = () => {
  // Changement de mot de passe
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState({ type: '', msg: '' });

  // Notifications
  const [notifications, setNotifications] = useState({
    smsVisits: true,
    emailWeekly: true,
    boostAlerts: true,
    visitReminders: true
  });
  const [notificationsSaved, setNotificationsSaved] = useState(false);

  // Sessions actives
  const [sessions, setSessions] = useState([
    {
      id: 'sess-1',
      device: 'Ordinateur de bureau (Linux Chrome)',
      location: 'Abidjan, Côte d\'Ivoire',
      ip: '102.164.x.x',
      current: true,
      lastActive: 'En ligne actuellement'
    },
    {
      id: 'sess-2',
      device: 'Smartphone (iPhone 15 Pro / Safari)',
      location: 'Abidjan, Côte d\'Ivoire',
      ip: '102.164.x.y',
      current: false,
      lastActive: 'Il y a 2 heures'
    }
  ]);
  const [sessionsMessage, setSessionsMessage] = useState('');

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    setNotificationsSaved(true);
    setTimeout(() => setNotificationsSaved(false), 3000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (!currentPassword) {
      setPasswordFeedback({ type: 'error', msg: 'Veuillez saisir votre mot de passe actuel.' });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordFeedback({ type: 'error', msg: 'Le nouveau mot de passe doit comporter au moins 8 caractères.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ type: 'error', msg: 'Les mots de passe ne correspondent pas.' });
      return;
    }

    setPasswordFeedback({ type: 'success', msg: 'Votre mot de passe a été mis à jour avec succès.' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordFeedback({ type: '', msg: '' }), 5000);
  };

  const handleRevokeOtherSessions = () => {
    setSessions(prev => prev.filter(s => s.current));
    setSessionsMessage('Toutes les autres sessions ont été révoquées avec succès.');
    setTimeout(() => setSessionsMessage(''), 4000);
  };

  // Calcul force du mot de passe
  const getPasswordStrength = () => {
    if (!newPassword) return 0;
    let score = 0;
    if (newPassword.length >= 8) score += 33;
    if (/[A-Z]/.test(newPassword)) score += 33;
    if (/[0-9]/.test(newPassword) || /[^A-Za-z0-9]/.test(newPassword)) score += 34;
    return score;
  };

  const passwordScore = getPasswordStrength();

  return (
    <div className="habitoo-dash-section">
      
      {/* En-tête de la page Paramètres */}
      <div className="habitoo-dash-page-header-row">
        <div>
          <h2 className="habitoo-dash-page-title">Paramètres du Compte PRO</h2>
          <p className="habitoo-dash-page-subtitle">
            Configurez la sécurité de votre accès, vos canaux d'alertes et la gestion de vos sessions actives.
          </p>
        </div>
      </div>

      <div className="habitoo-dash-settings-layout">
        
        {/* 1. SÉCURITÉ & CHANGEMENT DE MOT DE PASSE */}
        <div className="habitoo-dash-card">
          <div className="habitoo-dash-settings-card-header">
            <div className="habitoo-dash-settings-icon-wrap">
              <KeyRound size={18} />
            </div>
            <div>
              <h3 className="habitoo-dash-card__title">Sécurité et Mot de Passe</h3>
              <p className="habitoo-dash-card__subtitle">Protégez l'accès à votre portefeuille d'annonces et à vos honoraires.</p>
            </div>
          </div>

          {passwordFeedback.msg && (
            <div className={passwordFeedback.type === 'success' ? 'habitoo-dash-toast-success' : 'habitoo-dash-alert-error'} style={{ marginBottom: '16px' }}>
              {passwordFeedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{passwordFeedback.msg}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="habitoo-dash-settings-form">
            <div className="habitoo-dash-form-group">
              <label className="habitoo-dash-label" htmlFor="current-pw">Mot de passe actuel</label>
              <div className="habitoo-dash-input-password-wrap">
                <input
                  id="current-pw"
                  type={showPassword ? 'text' : 'password'}
                  className="habitoo-dash-input"
                  placeholder="••••••••••••"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="habitoo-dash-pw-toggle-btn"
                  onClick={() => setShowPassword(p => !p)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="habitoo-dash-form-row">
              <div className="habitoo-dash-form-group">
                <label className="habitoo-dash-label" htmlFor="new-pw">Nouveau mot de passe</label>
                <input
                  id="new-pw"
                  type={showPassword ? 'text' : 'password'}
                  className="habitoo-dash-input"
                  placeholder="Min. 8 caractères"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
              </div>

              <div className="habitoo-dash-form-group">
                <label className="habitoo-dash-label" htmlFor="confirm-pw">Confirmer le nouveau mot de passe</label>
                <input
                  id="confirm-pw"
                  type={showPassword ? 'text' : 'password'}
                  className="habitoo-dash-input"
                  placeholder="Répétez le mot de passe"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Jauge de robustesse du mot de passe */}
            {newPassword && (
              <div className="habitoo-dash-pw-strength-wrap">
                <div className="habitoo-dash-pw-strength-bar">
                  <div 
                    className={`habitoo-dash-pw-strength-fill ${passwordScore > 66 ? 'habitoo-dash-pw-strength-fill--strong' : (passwordScore > 33 ? 'habitoo-dash-pw-strength-fill--medium' : 'habitoo-dash-pw-strength-fill--weak')}`}
                    style={{ width: `${passwordScore}%` }}
                  />
                </div>
                <span className="habitoo-dash-pw-strength-label">
                  {passwordScore > 66 ? 'Mot de passe robuste' : (passwordScore > 33 ? 'Moyen (ajoutez une majuscule et un chiffre)' : 'Trop court')}
                </span>
              </div>
            )}

            <div style={{ marginTop: '16px' }}>
              <button type="submit" className="habitoo-dash-btn-primary">
                Mettre à jour le mot de passe
              </button>
            </div>
          </form>
        </div>

        {/* 2. NOTIFICATIONS & CANAUX DE CONTACT */}
        <div className="habitoo-dash-card">
          <div className="habitoo-dash-settings-card-header">
            <div className="habitoo-dash-settings-icon-wrap">
              <Bell size={18} />
            </div>
            <div>
              <h3 className="habitoo-dash-card__title">Notifications et Alertes</h3>
              <p className="habitoo-dash-card__subtitle">Choisissez les événements prioritaires nécessitant une alerte.</p>
            </div>
          </div>

          {notificationsSaved && (
            <div className="habitoo-dash-toast-success" style={{ marginBottom: '16px' }}>
              <CheckCircle2 size={15} />
              <span>Préférences de notifications enregistrées.</span>
            </div>
          )}

          <div className="habitoo-dash-toggle-list">
            
            <div className="habitoo-dash-toggle-item">
              <div className="habitoo-dash-toggle-meta">
                <strong>Alertes SMS immédiates pour les visites</strong>
                <span>Recevez un SMS instantané dès qu'un acquéreur réserve un créneau de visite.</span>
              </div>
              <label className="habitoo-dash-switch">
                <input
                  type="checkbox"
                  checked={notifications.smsVisits}
                  onChange={() => toggleNotification('smsVisits')}
                />
                <span className="habitoo-dash-switch-slider" />
              </label>
            </div>

            <div className="habitoo-dash-toggle-item">
              <div className="habitoo-dash-toggle-meta">
                <strong>Rappels d'agenda avant chaque visite</strong>
                <span>Rappel automatique par notification 1 heure avant le rendez-vous physique.</span>
              </div>
              <label className="habitoo-dash-switch">
                <input
                  type="checkbox"
                  checked={notifications.visitReminders}
                  onChange={() => toggleNotification('visitReminders')}
                />
                <span className="habitoo-dash-switch-slider" />
              </label>
            </div>

            <div className="habitoo-dash-toggle-item">
              <div className="habitoo-dash-toggle-meta">
                <strong>Alertes d'expiration de Boost</strong>
                <span>Soyez notifié 24h avant la fin de visibilité prioritaire d'une annonce.</span>
              </div>
              <label className="habitoo-dash-switch">
                <input
                  type="checkbox"
                  checked={notifications.boostAlerts}
                  onChange={() => toggleNotification('boostAlerts')}
                />
                <span className="habitoo-dash-switch-slider" />
              </label>
            </div>

            <div className="habitoo-dash-toggle-item">
              <div className="habitoo-dash-toggle-meta">
                <strong>Bilan hebdomadaire d'audience par email</strong>
                <span>Un récapitulatif condensé des vues et des contacts générés chaque lundi matin.</span>
              </div>
              <label className="habitoo-dash-switch">
                <input
                  type="checkbox"
                  checked={notifications.emailWeekly}
                  onChange={() => toggleNotification('emailWeekly')}
                />
                <span className="habitoo-dash-switch-slider" />
              </label>
            </div>

          </div>
        </div>

        {/* 3. SESSIONS ACTIVES & ACCÈS SÉCURISÉS */}
        <div className="habitoo-dash-card">
          <div className="habitoo-dash-settings-card-header">
            <div className="habitoo-dash-settings-icon-wrap">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 className="habitoo-dash-card__title">Sessions Actives et Connexions</h3>
              <p className="habitoo-dash-card__subtitle">Appareils et navigateurs actuellement autorisés sur votre compte.</p>
            </div>
          </div>

          {sessionsMessage && (
            <div className="habitoo-dash-toast-success" style={{ marginBottom: '16px' }}>
              <CheckCircle2 size={15} />
              <span>{sessionsMessage}</span>
            </div>
          )}

          <div className="habitoo-dash-sessions-list">
            {sessions.map(sess => (
              <div key={sess.id} className="habitoo-dash-session-item">
                <div className="habitoo-dash-session-icon">
                  {sess.device.includes('Smartphone') ? <Smartphone size={16} /> : <Laptop size={16} />}
                </div>
                <div className="habitoo-dash-session-info">
                  <div className="habitoo-dash-session-title-row">
                    <strong>{sess.device}</strong>
                    {sess.current && (
                      <span className="habitoo-dash-session-current-badge">Cet appareil</span>
                    )}
                  </div>
                  <span className="habitoo-dash-session-meta">
                    {sess.location} • IP: {sess.ip} • {sess.lastActive}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {sessions.length > 1 && (
            <div style={{ marginTop: '16px' }}>
              <button
                type="button"
                onClick={handleRevokeOtherSessions}
                className="habitoo-dash-btn-ghost"
              >
                <LogOut size={13} />
                <span>Déconnecter toutes les autres sessions</span>
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
