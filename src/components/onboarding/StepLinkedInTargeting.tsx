import React, { useState } from 'react';
import { Briefcase, Building, Plus, Check, X, Search } from 'lucide-react';
import { SUGGESTED_JOB_TITLES, COMPANY_SIZE_OPTIONS, type ProjectOnboardingState } from './types';

interface StepLinkedInTargetingProps {
  data: ProjectOnboardingState;
  onChange: (data: Partial<ProjectOnboardingState>) => void;
  showLinkedInTargeting?: boolean; // Modular architecture for payment plan / feature flag gating
  showErrors?: boolean;
}

export const StepLinkedInTargeting: React.FC<StepLinkedInTargetingProps> = ({
  data,
  onChange,
  showLinkedInTargeting = true,
  showErrors = false
}) => {
  const [customJobTitle, setCustomJobTitle] = useState('');
  const [jobTitleSearch, setJobTitleSearch] = useState('');

  const isJobTitlesInvalid = showErrors && data.linkedin.jobTitles.length === 0;

  if (!showLinkedInTargeting) {
    return (
      <div className="onboarding-step-card-content">
        <div className="onboarding-step-header">
          <h2 className="onboarding-step-title">LinkedIn Targeting</h2>
          <p className="onboarding-step-subtitle">
            LinkedIn targeting is not enabled on your current plan.
          </p>
        </div>
      </div>
    );
  }

  // Job Title helpers
  const toggleJobTitle = (title: string) => {
    const currentTitles = data.linkedin.jobTitles;
    const updated = currentTitles.includes(title)
      ? currentTitles.filter(t => t !== title)
      : [...currentTitles, title];
    onChange({
      linkedin: {
        ...data.linkedin,
        jobTitles: updated
      }
    });
  };

  const addCustomJobTitle = () => {
    const trimmed = customJobTitle.trim();
    if (!trimmed) return;
    if (!data.linkedin.jobTitles.includes(trimmed)) {
      onChange({
        linkedin: {
          ...data.linkedin,
          jobTitles: [...data.linkedin.jobTitles, trimmed]
        }
      });
    }
    setCustomJobTitle('');
  };

  const removeJobTitle = (titleToRemove: string) => {
    onChange({
      linkedin: {
        ...data.linkedin,
        jobTitles: data.linkedin.jobTitles.filter(t => t !== titleToRemove)
      }
    });
  };

  const handleCompanySizeChange = (size: string) => {
    onChange({
      linkedin: {
        ...data.linkedin,
        companySize: size
      }
    });
  };

  const filteredJobTitles = SUGGESTED_JOB_TITLES.filter(title =>
    title.toLowerCase().includes(jobTitleSearch.toLowerCase())
  );

  return (
    <div className="onboarding-step-card-content">
      <div className="onboarding-step-header">
        <h2 className="onboarding-step-title">LinkedIn Targeting</h2>
        <p className="onboarding-step-subtitle">
          Define who Rixly should look for on LinkedIn.
        </p>
      </div>

      <div className="onboarding-form-fields-stack">
        
        {/* 1. Job Titles */}
        <div className={`onboarding-field-group ${isJobTitlesInvalid ? 'has-error' : ''}`}>
          <div className="onboarding-field-label-row">
            <label className="onboarding-field-label">
              <span>Target Job Titles</span>
              <span className="required-star">*</span>
            </label>
            <span className="onboarding-field-counter">
              {data.linkedin.jobTitles.length} active
            </span>
          </div>

          {/* Selected Job Title Chips */}
          {data.linkedin.jobTitles.length > 0 && (
            <div className="onboarding-selected-chips-row">
              {data.linkedin.jobTitles.map(title => (
                <span key={title} className="onboarding-active-tag-chip linkedin">
                  <Briefcase size={11} className="tag-chip-icon" />
                  <span>{title}</span>
                  <button
                    type="button"
                    className="tag-chip-remove-btn"
                    onClick={() => removeJobTitle(title)}
                    title={`Remove ${title}`}
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Search suggestions cloud */}
          <div className="onboarding-chips-selector-box">
            <div className="chips-selector-search-bar">
              <Search size={12} className="search-bar-icon" />
              <input 
                type="text" 
                value={jobTitleSearch}
                onChange={(e) => setJobTitleSearch(e.target.value)}
                placeholder="Search suggested job titles..."
                className="chips-selector-search-input"
              />
            </div>

            <div className="onboarding-available-chips-cloud">
              {filteredJobTitles.map(title => {
                const isSelected = data.linkedin.jobTitles.includes(title);
                return (
                  <button
                    key={title}
                    type="button"
                    className={`onboarding-select-chip-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleJobTitle(title)}
                  >
                    <Briefcase size={11} />
                    <span>{title}</span>
                    {isSelected && <Check size={11} className="chip-check-icon" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add custom job title */}
          <div className="onboarding-inline-add-row">
            <input 
              type="text" 
              value={customJobTitle}
              onChange={(e) => setCustomJobTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomJobTitle(); }}}
              placeholder="Type a title and press Enter (e.g. Head of Outbound, CMO)..."
              className="onboarding-inline-add-input"
            />
            <button 
              type="button" 
              className="onboarding-inline-add-btn"
              onClick={addCustomJobTitle}
              disabled={!customJobTitle.trim()}
            >
              <Plus size={13} />
              <span>Add Title</span>
            </button>
          </div>

          {isJobTitlesInvalid && (
            <span className="onboarding-inline-error">Please add or select at least one target job title.</span>
          )}
        </div>

        {/* 2. Company Size */}
        <div className="onboarding-field-group">
          <label className="onboarding-field-label">
            <span>Target Company Size (Employees)</span>
            <span className="required-star">*</span>
          </label>
          <div className="onboarding-input-with-prefix">
            <Building size={15} className="input-prefix-icon" />
            <select
              value={data.linkedin.companySize}
              onChange={(e) => handleCompanySizeChange(e.target.value)}
              className="onboarding-primary-select"
            >
              {COMPANY_SIZE_OPTIONS.map(size => (
                <option key={size} value={size}>
                  {size} employees
                </option>
              ))}
            </select>
          </div>
        </div>

      </div>
    </div>
  );
};
