import React from 'react';
import { Check } from 'lucide-react';

const AGENCY_STEPS = [
  { id: 1, number: '01', label: 'Profil', sub: 'Activité' },
  { id: 2, number: '02', label: 'Justificatifs', sub: 'Identité et Ville' },
  { id: 3, number: '03', label: 'Forfait', sub: 'Formule' },
  { id: 4, number: '04', label: 'Règlement', sub: 'Validation' }
];

const DEMARCHEUR_STEPS = [
  { id: 1, number: '01', label: 'Profil', sub: 'Activité' },
  { id: 2, number: '02', label: 'Justificatifs', sub: 'Identité & Ville' }
];

export const ProRegisterStepper = ({ currentStep, onStepClick, persona = 'demarcheur' }) => {
  const steps = persona === 'agence' ? AGENCY_STEPS : DEMARCHEUR_STEPS;
  return (
    <div className="habitoo-reg-stepper" aria-label="Progression de l'inscription">
      <div className="habitoo-reg-stepper-inner">
        {steps.map((step, idx) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const isPending = currentStep < step.id;

          return (
            <React.Fragment key={step.id}>
              <div 
                className={`habitoo-reg-step-item ${isActive ? 'habitoo-reg-step-item--active' : ''} ${isCompleted ? 'habitoo-reg-step-item--completed' : ''} ${isPending ? 'habitoo-reg-step-item--pending' : ''}`}
                onClick={() => {
                  // Only permit navigation back to previously completed steps
                  if (isCompleted && onStepClick) {
                    onStepClick(step.id);
                  }
                }}
                role="button"
                tabIndex={isCompleted ? 0 : -1}
                aria-current={isActive ? 'step' : undefined}
                style={{ cursor: isCompleted ? 'pointer' : 'default' }}
              >
                <div className="habitoo-reg-step-badge">
                  {isCompleted ? (
                    <Check size={14} strokeWidth={2.5} />
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>
                <div className="habitoo-reg-step-info">
                  <span className="habitoo-reg-step-label">{step.label}</span>
                  <span className="habitoo-reg-step-sub">{step.sub}</span>
                </div>
              </div>

              {idx < steps.length - 1 && (
                <div 
                  className={`habitoo-reg-step-line ${currentStep > step.id ? 'habitoo-reg-step-line--completed' : ''}`}
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProRegisterStepper;
