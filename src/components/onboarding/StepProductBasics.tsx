import React, { useState } from 'react';
import { Building2, MapPin, Layers, Plus, Check, X, Search } from 'lucide-react';
import { SUGGESTED_LOCATIONS, SUGGESTED_INDUSTRIES, type ProjectOnboardingState } from './types';

interface StepProductBasicsProps {
  data: ProjectOnboardingState;
  onChange: (data: Partial<ProjectOnboardingState>) => void;
  showErrors?: boolean;
}

export const StepProductBasics: React.FC<StepProductBasicsProps> = ({
  data,
  onChange,
  showErrors = false
}) => {
  const [customLocation, setCustomLocation] = useState('');
  const [customIndustry, setCustomIndustry] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [industrySearch, setIndustrySearch] = useState('');

  const isNameInvalid = showErrors && !data.name.trim();
  const isLocationsInvalid = showErrors && data.locations.length === 0;

  // Toggle Location
  const toggleLocation = (loc: string) => {
    const updated = data.locations.includes(loc)
      ? data.locations.filter(l => l !== loc)
      : [...data.locations, loc];
    onChange({ locations: updated });
  };

  const addCustomLocation = () => {
    const trimmed = customLocation.trim();
    if (!trimmed) return;
    if (!data.locations.includes(trimmed)) {
      onChange({ locations: [...data.locations, trimmed] });
    }
    setCustomLocation('');
  };

  const removeLocation = (loc: string) => {
    onChange({ locations: data.locations.filter(l => l !== loc) });
  };

  // Toggle Industry
  const toggleIndustry = (ind: string) => {
    const updated = data.industries.includes(ind)
      ? data.industries.filter(i => i !== ind)
      : [...data.industries, ind];
    onChange({ industries: updated });
  };

  const addCustomIndustry = () => {
    const trimmed = customIndustry.trim();
    if (!trimmed) return;
    if (!data.industries.includes(trimmed)) {
      onChange({ industries: [...data.industries, trimmed] });
    }
    setCustomIndustry('');
  };

  const removeIndustry = (ind: string) => {
    onChange({ industries: data.industries.filter(i => i !== ind) });
  };

  const filteredLocations = SUGGESTED_LOCATIONS.filter(loc =>
    loc.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const filteredIndustries = SUGGESTED_INDUSTRIES.filter(ind =>
    ind.toLowerCase().includes(industrySearch.toLowerCase())
  );

  return (
    <div className="onboarding-step-card-content">
      <div className="onboarding-step-header">
        <h2 className="onboarding-step-title">Product & Market Basics</h2>
        <p className="onboarding-step-subtitle">
          Tell us about your product and the market you're targeting.
        </p>
      </div>

      <div className="onboarding-form-fields-stack">
        
        {/* 1. Project / Product Name */}
        <div className={`onboarding-field-group ${isNameInvalid ? 'has-error' : ''}`}>
          <label className="onboarding-field-label">
            <span>Project / Product Name</span>
            <span className="required-star">*</span>
          </label>
          <div className="onboarding-input-with-prefix">
            <Building2 size={15} className="input-prefix-icon" />
            <input 
              type="text"
              value={data.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="e.g. Acme AI"
              className="onboarding-primary-input"
              autoFocus
            />
          </div>
          {isNameInvalid && (
            <span className="onboarding-inline-error">Please enter a project or product name.</span>
          )}
        </div>

        {/* 2. Target Locations */}
        <div className={`onboarding-field-group ${isLocationsInvalid ? 'has-error' : ''}`}>
          <div className="onboarding-field-label-row">
            <label className="onboarding-field-label">
              <span>Target Locations</span>
              <span className="required-star">*</span>
            </label>
            <span className="onboarding-field-counter">
              {data.locations.length} selected
            </span>
          </div>

          {/* Selected locations chips */}
          {data.locations.length > 0 && (
            <div className="onboarding-selected-chips-row">
              {data.locations.map(loc => (
                <span key={loc} className="onboarding-active-tag-chip">
                  <MapPin size={11} className="tag-chip-icon" />
                  <span>{loc}</span>
                  <button 
                    type="button" 
                    className="tag-chip-remove-btn"
                    onClick={() => removeLocation(loc)}
                    title={`Remove ${loc}`}
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
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                placeholder="Search suggested locations..."
                className="chips-selector-search-input"
              />
            </div>

            <div className="onboarding-available-chips-cloud">
              {filteredLocations.map(loc => {
                const isSelected = data.locations.includes(loc);
                return (
                  <button
                    key={loc}
                    type="button"
                    className={`onboarding-select-chip-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleLocation(loc)}
                  >
                    <MapPin size={11} />
                    <span>{loc}</span>
                    {isSelected && <Check size={11} className="chip-check-icon" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add custom location */}
          <div className="onboarding-inline-add-row">
            <input 
              type="text" 
              value={customLocation}
              onChange={(e) => setCustomLocation(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomLocation(); }}}
              placeholder="Add another location (e.g. Japan, Brazil)..."
              className="onboarding-inline-add-input"
            />
            <button 
              type="button" 
              className="onboarding-inline-add-btn"
              onClick={addCustomLocation}
              disabled={!customLocation.trim()}
            >
              <Plus size={13} />
              <span>Add Location</span>
            </button>
          </div>

          {isLocationsInvalid && (
            <span className="onboarding-inline-error">Please select or add at least one location.</span>
          )}
        </div>

        {/* 3. Target Industries (Documentation Only) */}
        <div className="onboarding-field-group">
          <div className="onboarding-field-label-row">
            <label className="onboarding-field-label">
              <span>Target Industries</span>
              <span className="onboarding-field-doc-tag">Stored for project config</span>
            </label>
            <span className="onboarding-field-counter">
              {data.industries.length} selected
            </span>
          </div>

          {/* Selected industries chips */}
          {data.industries.length > 0 && (
            <div className="onboarding-selected-chips-row">
              {data.industries.map(ind => (
                <span key={ind} className="onboarding-active-tag-chip industry">
                  <Layers size={11} className="tag-chip-icon" />
                  <span>{ind}</span>
                  <button 
                    type="button" 
                    className="tag-chip-remove-btn"
                    onClick={() => removeIndustry(ind)}
                    title={`Remove ${ind}`}
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Suggested Industries cloud */}
          <div className="onboarding-chips-selector-box">
            <div className="chips-selector-search-bar">
              <Search size={12} className="search-bar-icon" />
              <input 
                type="text" 
                value={industrySearch}
                onChange={(e) => setIndustrySearch(e.target.value)}
                placeholder="Search suggested industries..."
                className="chips-selector-search-input"
              />
            </div>

            <div className="onboarding-available-chips-cloud">
              {filteredIndustries.map(ind => {
                const isSelected = data.industries.includes(ind);
                return (
                  <button
                    key={ind}
                    type="button"
                    className={`onboarding-select-chip-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleIndustry(ind)}
                  >
                    <Layers size={11} />
                    <span>{ind}</span>
                    {isSelected && <Check size={11} className="chip-check-icon" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add custom industry */}
          <div className="onboarding-inline-add-row">
            <input 
              type="text" 
              value={customIndustry}
              onChange={(e) => setCustomIndustry(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomIndustry(); }}}
              placeholder="Add custom industry..."
              className="onboarding-inline-add-input"
            />
            <button 
              type="button" 
              className="onboarding-inline-add-btn"
              onClick={addCustomIndustry}
              disabled={!customIndustry.trim()}
            >
              <Plus size={13} />
              <span>Add Industry</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
