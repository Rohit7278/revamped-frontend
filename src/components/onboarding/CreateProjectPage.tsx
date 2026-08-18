import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  X, 
  Loader2, 
  Sun, 
  Moon,
  ChevronLeft
} from 'lucide-react';
import { INITIAL_ONBOARDING_STATE, type ProjectOnboardingState } from './types';
import { OnboardingProgress } from './OnboardingProgress';
import { StepProductBasics } from './StepProductBasics';
import { StepDescriptionICPs } from './StepDescriptionICPs';
import { StepLinkedInTargeting } from './StepLinkedInTargeting';
import { StepSocialKeywords } from './StepSocialKeywords';
import { StepPreview } from './StepPreview';
import './CreateProjectPage.css';

interface CreateProjectPageProps {
  onCancel: () => void;
  onProjectCreated: (newProject: ProjectOnboardingState) => void;
  theme?: 'dark' | 'light';
  toggleTheme?: () => void;
}

export const CreateProjectPage: React.FC<CreateProjectPageProps> = ({
  onCancel,
  onProjectCreated,
  theme = 'dark',
  toggleTheme
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<ProjectOnboardingState>(INITIAL_ONBOARDING_STATE);
  const [showErrors, setShowErrors] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Update partial state
  const handleUpdateFormData = (updates: Partial<ProjectOnboardingState>) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }));
  };

  // Step Validation logic
  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.name.trim().length > 0 && formData.locations.length > 0;
      case 2:
        return (
          formData.productDescription.trim().length > 0 &&
          formData.icps.length > 0 &&
          formData.valueProps.length > 0
        );
      case 3:
        return formData.linkedin.jobTitles.length > 0 && !!formData.linkedin.companySize;
      case 4:
        return formData.keywords.length > 0;
      case 5:
        return (
          formData.name.trim().length > 0 &&
          formData.locations.length > 0 &&
          formData.productDescription.trim().length > 0 &&
          formData.icps.length > 0 &&
          formData.valueProps.length > 0 &&
          formData.linkedin.jobTitles.length > 0 &&
          formData.keywords.length > 0
        );
      default:
        return true;
    }
  };

  // Navigation handlers
  const handleNext = () => {
    if (!isStepValid(currentStep)) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    setCurrentStep(prev => Math.min(prev + 1, 5));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setShowErrors(false);
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStepClick = (targetStep: number) => {
    // Only allow jumping back, or jumping forward if current step is valid
    if (targetStep < currentStep || isStepValid(currentStep)) {
      setShowErrors(false);
      setCurrentStep(targetStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setShowErrors(true);
    }
  };

  // Final Create Project handler
  const handleCreateProject = async () => {
    if (!isStepValid(5)) {
      setShowErrors(true);
      return;
    }

    if (isSubmitting) return; // Prevent duplicate submissions

    setIsSubmitting(true);

    try {
      // Create project object
      const newProject: ProjectOnboardingState = {
        ...formData,
        id: `proj_${Date.now()}`,
        completed: true,
        createdAt: new Date().toISOString()
      };

      // Save to projects list in localStorage
      let existingProjects: ProjectOnboardingState[] = [];
      try {
        const saved = localStorage.getItem('rixly_projects');
        if (saved) existingProjects = JSON.parse(saved);
      } catch (e) {}

      const updatedProjects = [newProject, ...existingProjects.filter(p => p.name !== newProject.name)];
      localStorage.setItem('rixly_projects', JSON.stringify(updatedProjects));
      localStorage.setItem('rixly_active_project_id', newProject.id!);

      // Also sync as active onboarding profile
      localStorage.setItem('rixly_onboarding_profile', JSON.stringify(newProject));
      localStorage.setItem('rixly_onboarding_completed', 'true');

      // Dispatch global event for header and dashboard
      window.dispatchEvent(new CustomEvent('rixly_project_created', { detail: newProject }));

      // Short delay for smooth transition feel
      setTimeout(() => {
        setIsSubmitting(false);
        onProjectCreated(newProject);
      }, 700);
    } catch (e) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`onboarding-page-root ${theme}`}>
      
      {/* Top Navigation Header */}
      <header className="onboarding-page-navbar">
        <div className="onboarding-navbar-left">
          <button 
            type="button" 
            className="onboarding-navbar-back-btn" 
            onClick={onCancel}
            title="Return to Dashboard"
          >
            <ChevronLeft size={15} />
            <span>Dashboard</span>
          </button>
          
          <div className="onboarding-navbar-divider" />
          
          <div className="onboarding-brand-badge">
            <Sparkles size={12} className="brand-badge-sparkle" />
            <span>RIXLY ENGINE</span>
          </div>

          <div className="onboarding-navbar-title-box">
            <h1 className="onboarding-navbar-title">Create New Project</h1>
            <span className="onboarding-navbar-sub">Autonomous Intent Discovery Setup</span>
          </div>
        </div>

        <div className="onboarding-navbar-right">
          <div className="onboarding-step-counter-badge">
            <span className="onboarding-step-dot" />
            <span>Step {currentStep} of 5</span>
          </div>

          {toggleTheme && (
            <button 
              type="button" 
              className="onboarding-theme-toggle-btn"
              onClick={toggleTheme}
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          )}

          <button 
            type="button" 
            className="onboarding-close-page-btn" 
            onClick={onCancel}
            title="Exit Onboarding"
          >
            <X size={16} />
          </button>
        </div>
      </header>

      {/* Main Page Layout Container */}
      <div className="onboarding-page-container">
        
        {/* Top 5-Step Progress Stepper */}
        <OnboardingProgress 
          currentStep={currentStep} 
          onStepClick={handleStepClick} 
        />

        {/* Centered Step Form Card */}
        <div className="onboarding-step-card-surface">
          
          {currentStep === 1 && (
            <StepProductBasics
              data={formData}
              onChange={handleUpdateFormData}
              showErrors={showErrors}
            />
          )}

          {currentStep === 2 && (
            <StepDescriptionICPs
              data={formData}
              onChange={handleUpdateFormData}
              showErrors={showErrors}
            />
          )}

          {currentStep === 3 && (
            <StepLinkedInTargeting
              data={formData}
              onChange={handleUpdateFormData}
              showLinkedInTargeting={true}
              showErrors={showErrors}
            />
          )}

          {currentStep === 4 && (
            <StepSocialKeywords
              data={formData}
              onChange={handleUpdateFormData}
              showErrors={showErrors}
            />
          )}

          {currentStep === 5 && (
            <StepPreview
              data={formData}
              onEditStep={handleStepClick}
            />
          )}

          {/* Bottom Navigation Toolbar */}
          <footer className="onboarding-step-footer-toolbar">
            <div>
              {currentStep > 1 ? (
                <button
                  type="button"
                  className="onboarding-nav-cta-btn secondary"
                  onClick={handleBack}
                >
                  <ArrowLeft size={13} style={{ marginRight: 6 }} />
                  <span>Back</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="onboarding-nav-cta-btn secondary"
                  onClick={onCancel}
                >
                  <span>Cancel</span>
                </button>
              )}
            </div>

            <div className="footer-right-actions-cluster">
              {currentStep < 5 ? (
                <button
                  type="button"
                  className="onboarding-nav-cta-btn primary"
                  onClick={handleNext}
                >
                  <span>Continue</span>
                  <ArrowRight size={13} style={{ marginLeft: 6 }} />
                </button>
              ) : (
                <button
                  type="button"
                  className="onboarding-nav-cta-btn finish"
                  onClick={handleCreateProject}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={13} className="spin-loader" style={{ marginRight: 6 }} />
                      <span>Initializing Project & Radar...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={14} style={{ marginRight: 6 }} />
                      <span>Create Project</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </footer>

        </div>

      </div>

    </div>
  );
};
