import React from 'react';
import { Check } from 'lucide-react';

interface OnboardingProgressProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

const STEPS = [
  { id: 1, number: '01', title: 'Product & Market Basics' },
  { id: 2, number: '02', title: 'AI Description & ICPs' },
  { id: 3, number: '03', title: 'LinkedIn Targeting' },
  { id: 4, number: '04', title: 'Social Search Keywords' },
  { id: 5, number: '05', title: 'Preview' }
];

export const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  currentStep,
  onStepClick
}) => {
  return (
    <div className="onboarding-progress-bar-container">
      <div className="onboarding-progress-stepper">
        {STEPS.map((s, index) => {
          const isCurrent = s.id === currentStep;
          const isCompleted = s.id < currentStep;
          const isFuture = s.id > currentStep;

          return (
            <React.Fragment key={s.id}>
              {index > 0 && (
                <div 
                  className={`stepper-connector-line ${isCompleted || isCurrent ? 'filled' : ''}`} 
                />
              )}

              <button
                type="button"
                className={`stepper-step-item ${isCurrent ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isFuture ? 'disabled' : ''}`}
                onClick={() => {
                  if (isCompleted || isCurrent) {
                    onStepClick(s.id);
                  }
                }}
                disabled={isFuture}
                title={s.title}
              >
                <div className="stepper-badge-circle">
                  {isCompleted ? (
                    <Check size={12} className="stepper-check-icon" />
                  ) : (
                    <span>{s.number}</span>
                  )}
                </div>
                <div className="stepper-title-box">
                  <span className="stepper-step-num-label">STEP {s.id}</span>
                  <span className="stepper-step-title">{s.title}</span>
                </div>
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
