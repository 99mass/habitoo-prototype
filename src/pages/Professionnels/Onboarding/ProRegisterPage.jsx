import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useHabitoo } from '../../../context/HabitooContext';
import './ProOnboarding.css';

import { ProRegisterStepper } from './components/ProRegisterStepper';
import { StepPersona } from './components/StepPersona';
import { StepKyc } from './components/StepKyc';
import { StepPlans } from './components/StepPlans';
import { StepCheckout } from './components/StepCheckout';
import { StepProAuth } from './components/StepProAuth';

export const ProRegisterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser, setCurrentUser } = useHabitoo();

  // Query params
  const queryPlan = searchParams.get('forfait');
  const queryCycle = searchParams.get('cycle');
  const queryStep = parseInt(searchParams.get('step') || '1', 10);
  const queryPersona = searchParams.get('persona');

  // Registration gate: shows login by default unless pricing plan chosen or registration clicked
  const [isRegistering, setIsRegistering] = useState(() => Boolean(queryPlan || queryPersona));

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

  // Helper to ensure authenticated session upon registration completion
  const ensureProUser = (finalData) => {
    if (!currentUser) {
      const newProUser = {
        id: `usr-pro-${Date.now().toString().slice(-4)}`,
        name: finalData.entityName || finalData.managerName || 'Professionnel Habitoo',
        email: finalData.email || 'pro@habitoo.ci',
        phone: finalData.phone || '+225 07 00 00 00 00',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        authMethod: 'onboarding',
        isVerified: true,
        memberId: finalData.dossierRef || `PRO-${Math.floor(10000 + Math.random() * 90000)}`,
        role: finalData.persona === 'agence' ? 'Agence Immobilière' : 'Démarcheur Indépendant',
        joinedDate: "À l'instant"
      };
      localStorage.removeItem('habitoo_logged_out');
      setCurrentUser(newProUser);
    }
  };

  // Handler for direct pro login
  const handleLoginSuccess = ({ email }) => {
    const prefix = email.split('@')[0];
    const formattedName = prefix
      .replace(/[._-]/g, ' ')
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    const proUser = {
      id: `usr-pro-${Date.now().toString().slice(-4)}`,
      name: formattedName || 'Professionnel Habitoo',
      email: email,
      phone: '+225 07 00 00 00 00',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      authMethod: 'password',
      isVerified: true,
      memberId: `PRO-${Math.floor(10000 + Math.random() * 90000)}`,
      role: 'Professionnel Certifié',
      joinedDate: 'Membre actif'
    };

    localStorage.removeItem('habitoo_logged_out');
    setCurrentUser(proUser);
    navigate('/pro/app/dashboard');
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
    ensureProUser(finalData);
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
    ensureProUser(finalData);
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
    ensureProUser(finalData);
    navigate('/pro/en-attente', { state: { applicationData: finalData } });
  };

  // Prior Authentication & Account Gate (Embed complete login & forgot pw flow)
  // Shows login by default, unless explicitly registering or selected a specific pricing plan
  if (!isRegistering) {
    return (
      <StepProAuth
        onLoginSuccess={handleLoginSuccess}
        onStartRegistration={() => setIsRegistering(true)}
      />
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
              onBackToLogin={() => setIsRegistering(false)}
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
