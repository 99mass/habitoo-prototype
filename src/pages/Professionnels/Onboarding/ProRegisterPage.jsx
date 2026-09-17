import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useHabitoo } from '../../../context/HabitooContext';
import './ProOnboarding.css';

import { ProRegisterStepper } from './components/ProRegisterStepper';
import { StepPersona } from './components/StepPersona';
import { StepKyc } from './components/StepKyc';
import { StepPlans } from './components/StepPlans';
import { StepCheckout } from './components/StepCheckout';

import { Shield, Lock, UserCheck } from 'lucide-react';

export const ProRegisterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser, setIsAuthModalOpen } = useHabitoo();

  // Query params
  const queryPlan = searchParams.get('forfait');
  const queryCycle = searchParams.get('cycle');
  const queryStep = parseInt(searchParams.get('step') || '1', 10);
  const queryPersona = searchParams.get('persona');

  // Central State for KYC & Registration
  const [formData, setFormData] = useState({
    persona: (queryPersona === 'agence' || queryPersona === 'demarcheur') ? queryPersona : 'demarcheur',
    entityName: currentUser?.name || '',
    managerName: '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    city: '',
    neighborhood: '',
    rccmNumber: '',
    idCardFile: null,
    idCardFileName: '',
    idCardFileSize: '',
    idCardUploaded: false,
    rccmFile: null,
    rccmFileName: '',
    rccmFileSize: '',
    rccmUploaded: false,
    selectedPlan: (queryPlan === 'starter' || queryPlan === 'pro' || queryPlan === 'premium') ? queryPlan : 'pro',
    billingCycle: queryCycle === 'annual' ? 'annual' : 'monthly',
    paymentMethod: 'mobile_money',
    mobileOperator: 'Wave',
    mobilePhone: currentUser?.phone || '',
    dossierRef: `HAB-PRO-${Math.floor(1000 + Math.random() * 9000)}`
  });

  const [currentStep, setCurrentStep] = useState(queryStep >= 1 && queryStep <= 4 ? queryStep : 1);

  // Synchronize user credentials
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        entityName: prev.entityName || currentUser.name || '',
        email: prev.email || currentUser.email || '',
        phone: prev.phone || currentUser.phone || '',
        mobilePhone: prev.mobilePhone || currentUser.phone || ''
      }));
    }
  }, [currentUser]);

  const updateFormData = (fields) => {
    setFormData(prev => ({ ...prev, ...fields }));
  };

  // Handler for Starter 0 FCFA direct submission
  const handleCompleteStarter = () => {
    const finalData = {
      ...formData,
      isStarter: true,
      submittedAt: new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    navigate('/pro/en-attente', { state: { applicationData: finalData } });
  };

  // Handler for Démarcheur (Free direct accreditation without subscription)
  const handleCompleteDemarcheur = () => {
    const finalData = {
      ...formData,
      isStarter: true,
      isDemarcheur: true,
      selectedPlan: 'demarcheur_free',
      submittedAt: new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    navigate('/pro/en-attente', { state: { applicationData: finalData } });
  };

  // Handler for Paid Plans after successful payment
  const handleCompletePayment = (receipt) => {
    const finalData = {
      ...formData,
      paymentReceipt: receipt,
      isStarter: false,
      submittedAt: new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    navigate('/pro/en-attente', { state: { applicationData: finalData } });
  };

  // Prior Authentication Gate
  if (!currentUser) {
    return (
      <div className="habitoo-reg-auth-gate">
        <div className="habitoo-auth-gate-card">
          <div className="habitoo-auth-gate-icon">
            <Shield size={28} strokeWidth={1.8} />
          </div>
          <span className="habitoo-auth-gate-tag">Espace Professionnel</span>
          <h1 className="habitoo-auth-gate-title">
            Authentification requise
          </h1>
          <p className="habitoo-auth-gate-lead">
            Pour rattacher votre matricule et garantir la conformité de vos annonces, veuillez vous connecter.
          </p>
          
          <button 
            type="button" 
            onClick={() => setIsAuthModalOpen(true)}
            className="habitoo-reg-btn-primary habitoo-auth-gate-btn"
          >
            <UserCheck size={16} />
            <span>Se connecter / S'inscrire</span>
          </button>

          <div className="habitoo-auth-gate-hint">
            <Lock size={13} />
            <span>Connexion instantanée par Google ou code SMS/Email</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="habitoo-reg-layout habitoo-reg-layout--centered">
      <main className="habitoo-reg-workspace">
        
        {/* Stepper Timeline */}
        <ProRegisterStepper 
          currentStep={currentStep} 
          onStepClick={(stepId) => setCurrentStep(stepId)} 
          persona={formData.persona}
        />

        {/* Dynamic Active Step */}
        <div className="habitoo-reg-step-container">
          {currentStep === 1 && (
            <StepPersona 
              formData={formData} 
              updateFormData={updateFormData} 
              onNext={() => setCurrentStep(2)} 
            />
          )}

          {currentStep === 2 && (
            <StepKyc 
              formData={formData} 
              updateFormData={updateFormData} 
              onNext={() => {
                if (formData.persona === 'demarcheur') {
                  handleCompleteDemarcheur();
                } else {
                  setCurrentStep(3);
                }
              }} 
              onPrev={() => setCurrentStep(1)} 
            />
          )}

          {currentStep === 3 && (
            <StepPlans 
              formData={formData} 
              updateFormData={updateFormData} 
              onNext={() => setCurrentStep(4)} 
              onPrev={() => setCurrentStep(2)} 
              onCompleteStarter={handleCompleteStarter} 
            />
          )}

          {currentStep === 4 && (
            <StepCheckout 
              formData={formData} 
              updateFormData={updateFormData} 
              onPrev={() => setCurrentStep(3)} 
              onCompletePayment={handleCompletePayment} 
            />
          )}
        </div>

      </main>
    </div>
  );
};

export default ProRegisterPage;
