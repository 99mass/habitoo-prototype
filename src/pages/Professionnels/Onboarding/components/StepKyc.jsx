import React, { useState, useRef } from 'react';
import { 
  FileText, 
  FileCheck, 
  Upload, 
  Trash2, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle
} from 'lucide-react';

export const StepKyc = ({ formData, updateFormData, onNext, onPrev }) => {
  const cniInputRef = useRef(null);
  const rccmInputRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState('');

  const isAgence = formData.persona === 'agence';

  // File upload handler for CNI
  const handleCniUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('La taille maximale autorisée est de 10 Mo.');
      return;
    }

    setErrorMessage('');
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    updateFormData({
      idCardFile: file,
      idCardFileName: file.name,
      idCardFileSize: `${sizeInMB} Mo`,
      idCardUploaded: true
    });
  };

  const handleRemoveCni = (e) => {
    e.stopPropagation();
    updateFormData({
      idCardFile: null,
      idCardFileName: '',
      idCardFileSize: '',
      idCardUploaded: false
    });
    if (cniInputRef.current) cniInputRef.current.value = '';
  };

  // File upload handler for RCCM
  const handleRccmUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('La taille maximale autorisée est de 10 Mo.');
      return;
    }

    setErrorMessage('');
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    updateFormData({
      rccmFile: file,
      rccmFileName: file.name,
      rccmFileSize: `${sizeInMB} Mo`,
      rccmUploaded: true
    });
  };

  const handleRemoveRccm = (e) => {
    e.stopPropagation();
    updateFormData({
      rccmFile: null,
      rccmFileName: '',
      rccmFileSize: '',
      rccmUploaded: false
    });
    if (rccmInputRef.current) rccmInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.entityName?.trim()) {
      setErrorMessage(isAgence ? "Veuillez renseigner la raison sociale de l'agence." : "Veuillez renseigner votre nom complet.");
      return;
    }

    if (!formData.phone?.trim()) {
      setErrorMessage("Veuillez renseigner votre numéro de téléphone direct.");
      return;
    }

    if (!formData.city?.trim()) {
      setErrorMessage("Veuillez préciser votre ville d'exercice.");
      return;
    }

    if (!formData.idCardUploaded) {
      setErrorMessage(isAgence ? "Veuillez téléverser la CNI ou le passeport du gérant." : "Veuillez téléverser votre pièce d'identité (CNI ou Passeport).");
      return;
    }

    if (isAgence && !formData.rccmUploaded) {
      setErrorMessage("Veuillez téléverser l'extrait RCCM ou le registre de commerce de l'agence.");
      return;
    }

    setErrorMessage('');
    onNext();
  };

  return (
    <div className="habitoo-reg-step-content">
      
      {/* Header */}
      <div className="habitoo-step-header">
        <span className="habitoo-step-counter">Étape 02 sur 04</span>
        <h1 className="habitoo-step-title">
          Identité & Justificatifs
        </h1>
        <p className="habitoo-step-lead">
          Renseignez vos coordonnées et joignez vos documents pour l'audit de conformité.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="habitoo-kyc-form">
        
        {/* Name / Manager Name */}
        <div className="habitoo-form-row">
          <div className="habitoo-field-group">
            <label className="habitoo-field-label">
              {isAgence ? "Raison sociale *" : "Nom et prénom *"}
            </label>
            <input
              type="text"
              className="habitoo-field-input"
              value={formData.entityName || ''}
              onChange={(e) => updateFormData({ entityName: e.target.value })}
              placeholder={isAgence ? "Ex: Ivoire Prestige Immobilier" : "Ex: Marc-Aurèle Kouassi"}
              required
            />
          </div>

          {isAgence ? (
            <div className="habitoo-field-group">
              <label className="habitoo-field-label">
                Nom du gérant légal *
              </label>
              <input
                type="text"
                className="habitoo-field-input"
                value={formData.managerName || ''}
                onChange={(e) => updateFormData({ managerName: e.target.value })}
                placeholder="Ex: Kouamé N'Guessan"
                required
              />
            </div>
          ) : (
            <div className="habitoo-field-group">
              <label className="habitoo-field-label">
                Téléphone direct (WhatsApp) *
              </label>
              <input
                type="tel"
                className="habitoo-field-input"
                value={formData.phone || ''}
                onChange={(e) => updateFormData({ phone: e.target.value })}
                placeholder="+225 07 00 00 00 00"
                required
              />
            </div>
          )}
        </div>

        {/* City & Neighborhood */}
        <div className="habitoo-form-row">
          <div className="habitoo-field-group">
            <label className="habitoo-field-label">
              Ville d'exercice *
            </label>
            <input
              type="text"
              className="habitoo-field-input"
              value={formData.city || ''}
              onChange={(e) => updateFormData({ city: e.target.value })}
              placeholder="Ex: Abidjan, Brazzaville, Kinshasa, Dakar..."
              required
            />
          </div>

          <div className="habitoo-field-group">
            <label className="habitoo-field-label">
              Quartier / Secteur
            </label>
            <input
              type="text"
              className="habitoo-field-input"
              value={formData.neighborhood || ''}
              onChange={(e) => updateFormData({ neighborhood: e.target.value })}
              placeholder="Ex: Cocody, Plateau, Gombe, Almadies..."
            />
          </div>
        </div>

        {/* If Agence: Phone & RCCM Number */}
        {isAgence && (
          <div className="habitoo-form-row">
            <div className="habitoo-field-group">
              <label className="habitoo-field-label">
                Téléphone professionnel *
              </label>
              <input
                type="tel"
                className="habitoo-field-input"
                value={formData.phone || ''}
                onChange={(e) => updateFormData({ phone: e.target.value })}
                placeholder="+225 07 00 00 00 00"
                required
              />
            </div>

            <div className="habitoo-field-group">
              <label className="habitoo-field-label">
                Numéro RCCM
              </label>
              <input
                type="text"
                className="habitoo-field-input"
                value={formData.rccmNumber || ''}
                onChange={(e) => updateFormData({ rccmNumber: e.target.value })}
                placeholder="Ex: CI-ABJ-03-2023-B12-0492"
              />
            </div>
          </div>
        )}

        {/* Compact Document Upload Slots */}
        <div className="habitoo-uploads-section">
          <label className="habitoo-field-label">
            Documents obligatoires pour certification (PDF ou image, max 10 Mo)
          </label>

          {/* Slot 1: Extrait RCCM (Agences uniquement) */}
          {isAgence && (
            <div className={`habitoo-compact-upload-slot ${formData.rccmUploaded ? 'habitoo-compact-upload-slot--uploaded' : ''}`}>
              <input
                ref={rccmInputRef}
                type="file"
                accept=".pdf,image/jpeg,image/png,image/webp"
                style={{ display: 'none' }}
                onChange={handleRccmUpload}
              />
              <div className="habitoo-slot-icon">
                {formData.rccmUploaded ? <FileCheck size={18} /> : <FileText size={18} />}
              </div>
              <div className="habitoo-slot-info">
                <span className="habitoo-slot-title">
                  {formData.rccmUploaded ? formData.rccmFileName : "Extrait RCCM / Registre de commerce de l'agence *"}
                </span>
                <span className="habitoo-slot-meta">
                  {formData.rccmUploaded ? `${formData.rccmFileSize} • Prêt pour audit` : "Document officiel d'immatriculation"}
                </span>
              </div>
              {formData.rccmUploaded ? (
                <button
                  type="button"
                  onClick={handleRemoveRccm}
                  className="habitoo-slot-action-btn habitoo-slot-action-btn--remove"
                  title="Supprimer"
                >
                  <Trash2 size={15} />
                  <span>Remplacer</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => rccmInputRef.current?.click()}
                  className="habitoo-slot-action-btn"
                >
                  <Upload size={14} />
                  <span>Parcourir</span>
                </button>
              )}
            </div>
          )}

          {/* Slot 2: CNI / Passeport (Démarcheur ou Gérant) */}
          <div className={`habitoo-compact-upload-slot ${formData.idCardUploaded ? 'habitoo-compact-upload-slot--uploaded' : ''}`}>
            <input
              ref={cniInputRef}
              type="file"
              accept=".pdf,image/jpeg,image/png,image/webp"
              style={{ display: 'none' }}
              onChange={handleCniUpload}
            />
            <div className="habitoo-slot-icon">
              {formData.idCardUploaded ? <FileCheck size={18} /> : <FileText size={18} />}
            </div>
            <div className="habitoo-slot-info">
              <span className="habitoo-slot-title">
                {formData.idCardUploaded 
                  ? formData.idCardFileName 
                  : (isAgence ? "Pièce d'identité (CNI / Passeport) du gérant *" : "Pièce d'identité (CNI / Passeport) du démarcheur *")}
              </span>
              <span className="habitoo-slot-meta">
                {formData.idCardUploaded ? `${formData.idCardFileSize} • Prêt pour audit` : "Recto-verso lisible"}
              </span>
            </div>
            {formData.idCardUploaded ? (
              <button
                type="button"
                onClick={handleRemoveCni}
                className="habitoo-slot-action-btn habitoo-slot-action-btn--remove"
                title="Supprimer"
              >
                <Trash2 size={15} />
                <span>Remplacer</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => cniInputRef.current?.click()}
                className="habitoo-slot-action-btn"
              >
                <Upload size={14} />
                <span>Parcourir</span>
              </button>
            )}
          </div>
        </div>

        {/* Error message */}
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
          >
            <ArrowLeft size={16} />
            <span>Retour</span>
          </button>

          <button 
            type="submit" 
            className="habitoo-reg-btn-primary"
          >
            <span>Choisir mon forfait</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </form>

    </div>
  );
};

export default StepKyc;
