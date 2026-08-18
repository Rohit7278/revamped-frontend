import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Globe, 
  Building2, 
  MapPin, 
  Briefcase, 
  Plus, 
  CheckCircle2, 
  Loader2,
  Layers,
  Search
} from 'lucide-react';
import './OnboardingModal.css';

export interface OnboardingProfile {
  name: string;
  locations: string[];
  industries: string[];
  appUrl: string;
  productDescription: string;
  icps: string[];
  valueProps: string[];
  jobTitles: string[];
  companySize: string;
  keywords: string[];
  completed: boolean;
}

const DEFAULT_ONBOARDING_PROFILE: OnboardingProfile = {
  name: 'Rixly',
  locations: ['United States', 'United Kingdom', 'Canada'],
  industries: ['Logistics & Supply Chain', 'SaaS & Cloud Software'],
  appUrl: 'https://rixly.app',
  productDescription: 'AI-powered social intent listening platform that identifies high-intent B2B leads from LinkedIn posts and Reddit discussions.',
  icps: [
    'Supply Chain Vice Presidents',
    'Logistics Directors',
    'Demand Gen Leaders',
    'B2B Founders'
  ],
  valueProps: [
    'Real-time social intent crawling',
    'Automated port & freight triggers',
    '4x higher response rates',
    'Unified CRM pipeline'
  ],
  jobTitles: [
    'VP of Supply Chain',
    'Director of Logistics',
    'IT Director',
    'Head of Outbound',
    'Co-Founder'
  ],
  companySize: '51-200 employees (Mid-Market)',
  keywords: [
    'seeking supply chain tool',
    'port congestion manifest automation',
    'b2b linkedin lead finder',
    'dispatch tracking software recommendations'
  ],
  completed: false
};

export const sanitizeProfile = (raw: any): OnboardingProfile => {
  if (!raw || typeof raw !== 'object') return DEFAULT_ONBOARDING_PROFILE;
  return {
    name: raw.name || raw.projectName || DEFAULT_ONBOARDING_PROFILE.name,
    locations: Array.isArray(raw.locations) ? raw.locations : (Array.isArray(raw.targetLocations) ? raw.targetLocations : DEFAULT_ONBOARDING_PROFILE.locations),
    industries: Array.isArray(raw.industries) ? raw.industries : (Array.isArray(raw.targetIndustries) ? raw.targetIndustries : DEFAULT_ONBOARDING_PROFILE.industries),
    appUrl: raw.appUrl || raw.productUrl || DEFAULT_ONBOARDING_PROFILE.appUrl,
    productDescription: raw.productDescription || raw.description || DEFAULT_ONBOARDING_PROFILE.productDescription,
    icps: Array.isArray(raw.icps) ? raw.icps : DEFAULT_ONBOARDING_PROFILE.icps,
    valueProps: Array.isArray(raw.valueProps) ? raw.valueProps : (Array.isArray(raw.valuePropositions) ? raw.valuePropositions : DEFAULT_ONBOARDING_PROFILE.valueProps),
    jobTitles: Array.isArray(raw.jobTitles) ? raw.jobTitles : (Array.isArray(raw.targetJobTitles) ? raw.targetJobTitles : DEFAULT_ONBOARDING_PROFILE.jobTitles),
    companySize: raw.companySize || raw.targetCompanySize || DEFAULT_ONBOARDING_PROFILE.companySize,
    keywords: Array.isArray(raw.keywords) ? raw.keywords : (Array.isArray(raw.socialKeywords) ? raw.socialKeywords : DEFAULT_ONBOARDING_PROFILE.keywords),
    completed: Boolean(raw.completed)
  };
};

const SUGGESTED_LOCATIONS = [
  'United States', 'United Kingdom', 'Canada', 'Germany', 
  'India', 'Australia', 'Singapore', 'France'
];

const SUGGESTED_INDUSTRIES = [
  'Logistics & Supply Chain', 'SaaS & Cloud Software', 'E-Commerce', 
  'Fintech', 'Healthcare & Biotech', 'Manufacturing'
];

const SUGGESTED_JOB_TITLES = [
  'VP of Supply Chain', 'Director of Logistics', 'Head of Growth', 
  'Founder / CEO', 'Operations Manager', 'IT Director'
];

const COMPANY_SIZE_OPTIONS = [
  '1-10 employees (Startup)',
  '11-50 employees (Growth)',
  '51-200 employees (Mid-Market)',
  '201-500 employees (Scale-up)',
  '500+ employees (Enterprise)'
];

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (profile: OnboardingProfile) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ 
  isOpen, 
  onClose, 
  onComplete 
}) => {
  const [step, setStep] = useState<number>(1);
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [customLocationInput, setCustomLocationInput] = useState<string>('');
  const [customIndustryInput, setCustomIndustryInput] = useState<string>('');
  const [customIcpInput, setCustomIcpInput] = useState<string>('');
  const [customValuePropInput, setCustomValuePropInput] = useState<string>('');
  const [customJobTitleInput, setCustomJobTitleInput] = useState<string>('');
  const [customKeywordInput, setCustomKeywordInput] = useState<string>('');

  const [profile, setProfile] = useState<OnboardingProfile>(() => {
    const saved = localStorage.getItem('rixly_onboarding_profile');
    if (saved) {
      try {
        return sanitizeProfile(JSON.parse(saved));
      } catch (e) {}
    }
    return DEFAULT_ONBOARDING_PROFILE;
  });

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      const saved = localStorage.getItem('rixly_onboarding_profile');
      if (saved) {
        try {
          setProfile(sanitizeProfile(JSON.parse(saved)));
        } catch (e) {}
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (profile) {
      localStorage.setItem('rixly_onboarding_profile', JSON.stringify(profile));
    }
  }, [profile]);

  if (!isOpen) return null;

  // AI Generation Handlers
  const handleGenerateDescription = () => {
    if (!profile.appUrl) return;
    setIsGeneratingAI(true);
    setTimeout(() => {
      let generatedDesc = 'AI-driven social intent discovery platform that scans Reddit conversations and LinkedIn discussions to find active B2B buyers.';
      const indList = profile.industries || [];
      if (profile.appUrl.includes('cargo') || profile.appUrl.includes('logistic') || indList.includes('Logistics & Supply Chain')) {
        generatedDesc = 'Autonomous supply chain intelligence platform that captures real-time shipping congestion signals and converts port dispatcher posts into qualified leads.';
      }
      setProfile(prev => ({ ...prev, productDescription: generatedDesc }));
      setIsGeneratingAI(false);
    }, 800);
  };

  const handleGenerateICPsAndValueProps = () => {
    setIsGeneratingAI(true);
    setTimeout(() => {
      const generatedIcps = [
        'VP of Supply Chain & Operations',
        'Global Freight & Logistics Directors',
        'B2B Demand Generation Managers'
      ];
      const generatedProps = [
        'Real-time intent detection across LinkedIn and Reddit',
        'Replaces cold outreach with warm social trigger signals',
        'Automatic ICP scoring with instant CRM sync'
      ];
      setProfile(prev => ({
        ...prev,
        icps: Array.from(new Set([...(prev.icps || []), ...generatedIcps])),
        valueProps: Array.from(new Set([...(prev.valueProps || []), ...generatedProps]))
      }));
      setIsGeneratingAI(false);
    }, 900);
  };

  const handleGenerateKeywords = () => {
    setIsGeneratingAI(true);
    setTimeout(() => {
      const generatedKeywords = [
        'looking for freight dispatcher tool',
        'shipping manifest routing delay solution',
        'best linkedin outreach tool for logistics',
        'alternative to manual cold prospecting'
      ];
      setProfile(prev => ({
        ...prev,
        keywords: Array.from(new Set([...(prev.keywords || []), ...generatedKeywords]))
      }));
      setIsGeneratingAI(false);
    }, 800);
  };

  // Helper toggle functions
  const toggleLocation = (loc: string) => {
    setProfile(prev => {
      const current = prev.locations || [];
      return {
        ...prev,
        locations: current.includes(loc)
          ? current.filter(l => l !== loc)
          : [...current, loc]
      };
    });
  };

  const addCustomLocation = () => {
    const val = customLocationInput.trim();
    if (!val) return;
    setProfile(prev => {
      const current = prev.locations || [];
      return current.includes(val) ? prev : { ...prev, locations: [...current, val] };
    });
    setCustomLocationInput('');
  };

  const toggleIndustry = (ind: string) => {
    setProfile(prev => {
      const current = prev.industries || [];
      return {
        ...prev,
        industries: current.includes(ind)
          ? current.filter(i => i !== ind)
          : [...current, ind]
      };
    });
  };

  const addCustomIndustry = () => {
    const val = customIndustryInput.trim();
    if (!val) return;
    setProfile(prev => {
      const current = prev.industries || [];
      return current.includes(val) ? prev : { ...prev, industries: [...current, val] };
    });
    setCustomIndustryInput('');
  };

  const addIcp = () => {
    const val = customIcpInput.trim();
    if (!val) return;
    setProfile(prev => {
      const current = prev.icps || [];
      return current.includes(val) ? prev : { ...prev, icps: [...current, val] };
    });
    setCustomIcpInput('');
  };

  const removeIcp = (icp: string) => {
    setProfile(prev => ({ ...prev, icps: (prev.icps || []).filter(item => item !== icp) }));
  };

  const addValueProp = () => {
    const val = customValuePropInput.trim();
    if (!val) return;
    setProfile(prev => {
      const current = prev.valueProps || [];
      return current.includes(val) ? prev : { ...prev, valueProps: [...current, val] };
    });
    setCustomValuePropInput('');
  };

  const removeValueProp = (prop: string) => {
    setProfile(prev => ({ ...prev, valueProps: (prev.valueProps || []).filter(item => item !== prop) }));
  };

  const toggleJobTitle = (title: string) => {
    setProfile(prev => {
      const current = prev.jobTitles || [];
      return {
        ...prev,
        jobTitles: current.includes(title)
          ? current.filter(t => t !== title)
          : [...current, title]
      };
    });
  };

  const addCustomJobTitle = () => {
    const val = customJobTitleInput.trim();
    if (!val) return;
    setProfile(prev => {
      const current = prev.jobTitles || [];
      return current.includes(val) ? prev : { ...prev, jobTitles: [...current, val] };
    });
    setCustomJobTitleInput('');
  };

  const addKeyword = () => {
    const val = customKeywordInput.trim();
    if (!val) return;
    setProfile(prev => {
      const current = prev.keywords || [];
      return current.includes(val) ? prev : { ...prev, keywords: [...current, val] };
    });
    setCustomKeywordInput('');
  };

  const removeKeyword = (kw: string) => {
    setProfile(prev => ({ ...prev, keywords: (prev.keywords || []).filter(k => k !== kw) }));
  };

  const handleFinish = () => {
    const updated = { ...profile, completed: true };
    setProfile(updated);
    localStorage.setItem('rixly_onboarding_profile', JSON.stringify(updated));
    localStorage.setItem('rixly_onboarding_completed', 'true');
    onComplete(updated);
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="onboarding-modal-overlay" onClick={handleOverlayClick}>
      <div className="onboarding-modal-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Top Header */}
        <header className="onboarding-modal-header">
          <div className="onboarding-brand-pill">
            <Sparkles size={12} className="sparkle-gold" />
            <span>PROJECT SETUP</span>
          </div>

          {/* Stepper Progress Indicator */}
          <div className="onboarding-step-indicator-row">
            {[1, 2, 3, 4, 5].map((s) => (
              <button 
                key={s}
                type="button"
                className={`step-bubble ${step === s ? 'active' : step > s ? 'completed' : ''}`}
                onClick={() => setStep(s)}
                title={`Step ${s}`}
              >
                {step > s ? <Check size={10} /> : s}
              </button>
            ))}
          </div>

          <button type="button" className="onboarding-close-btn" onClick={onClose} title="Close">
            <X size={15} />
          </button>
        </header>

        {/* Modal Scrollable Body */}
        <div className="onboarding-modal-body">

          {/* ================= STEP 1 ================= */}
          {step === 1 && (
            <div className="onboarding-step-view">
              <div className="step-heading-group">
                <span className="step-count-badge">STEP 1 / 5</span>
                <h2>Product & Target Markets</h2>
              </div>

              {/* Product Name */}
              <div className="onboarding-form-group">
                <label>PRODUCT / BRAND NAME</label>
                <div className="input-with-icon">
                  <Building2 size={13} className="input-prefix-icon" />
                  <input 
                    type="text" 
                    value={profile.name || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Rixly"
                    className="onboarding-text-input"
                  />
                </div>
              </div>

              {/* Target Locations */}
              <div className="onboarding-form-group">
                <label>TARGET LOCATIONS</label>
                <div className="onboarding-chips-cloud">
                  {SUGGESTED_LOCATIONS.map(loc => {
                    const isSelected = (profile.locations || []).includes(loc);
                    return (
                      <button 
                        key={loc}
                        type="button"
                        className={`onboarding-chip ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleLocation(loc)}
                      >
                        <MapPin size={10} style={{ marginRight: 3 }} />
                        {loc}
                        {isSelected && <Check size={10} style={{ marginLeft: 3 }} />}
                      </button>
                    );
                  })}
                </div>

                <div className="chip-add-inline-row">
                  <input 
                    type="text"
                    value={customLocationInput}
                    onChange={(e) => setCustomLocationInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomLocation(); }}}
                    placeholder="Add location..."
                    className="chip-add-input"
                  />
                  <button type="button" className="chip-add-btn" onClick={addCustomLocation}>
                    <Plus size={12} />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Target Industries */}
              <div className="onboarding-form-group">
                <label>TARGET INDUSTRIES</label>
                <div className="onboarding-chips-cloud">
                  {SUGGESTED_INDUSTRIES.map(ind => {
                    const isSelected = (profile.industries || []).includes(ind);
                    return (
                      <button 
                        key={ind}
                        type="button"
                        className={`onboarding-chip ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleIndustry(ind)}
                      >
                        <Layers size={10} style={{ marginRight: 3 }} />
                        {ind}
                        {isSelected && <Check size={10} style={{ marginLeft: 3 }} />}
                      </button>
                    );
                  })}
                </div>

                <div className="chip-add-inline-row">
                  <input 
                    type="text"
                    value={customIndustryInput}
                    onChange={(e) => setCustomIndustryInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomIndustry(); }}}
                    placeholder="Add industry..."
                    className="chip-add-input"
                  />
                  <button type="button" className="chip-add-btn" onClick={addCustomIndustry}>
                    <Plus size={12} />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 2 ================= */}
          {step === 2 && (
            <div className="onboarding-step-view">
              <div className="step-heading-group">
                <span className="step-count-badge">STEP 2 / 5</span>
                <h2>Product & ICP Profiles</h2>
              </div>

              {/* App URL Field */}
              <div className="onboarding-form-group">
                <label>WEBSITE / LANDING PAGE URL</label>
                <div className="input-with-action-row">
                  <div className="input-with-icon" style={{ flex: 1 }}>
                    <Globe size={13} className="input-prefix-icon" />
                    <input 
                      type="url" 
                      value={profile.appUrl || ''}
                      onChange={(e) => setProfile(prev => ({ ...prev, appUrl: e.target.value }))}
                      placeholder="https://rixly.app"
                      className="onboarding-text-input"
                    />
                  </div>
                  {profile.appUrl && (
                    <button 
                      type="button" 
                      className="ai-magic-action-btn"
                      onClick={handleGenerateDescription}
                      disabled={isGeneratingAI}
                    >
                      {isGeneratingAI ? (
                        <>
                          <Loader2 size={11} className="spin-loader" />
                          <span>AI Scanning...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={11} />
                          <span>AI Fill</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Product Description */}
              <div className="onboarding-form-group">
                <div className="label-with-count">
                  <label>PRODUCT DESCRIPTION</label>
                  {profile.productDescription && (
                    <button 
                      type="button"
                      className="ai-inline-trigger-link"
                      onClick={handleGenerateICPsAndValueProps}
                      disabled={isGeneratingAI}
                    >
                      <Sparkles size={10} style={{ marginRight: 3 }} />
                      {isGeneratingAI ? 'Deriving...' : 'Derive ICPs with AI'}
                    </button>
                  )}
                </div>
                <textarea 
                  rows={2}
                  value={profile.productDescription || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, productDescription: e.target.value }))}
                  placeholder="Describe what your product does..."
                  className="onboarding-textarea"
                />
              </div>

              {/* Target ICPs */}
              <div className="onboarding-form-group">
                <label>TARGET ICPS</label>
                <div className="keywords-cloud-container">
                  {(profile.icps || []).map((icp, i) => (
                    <div key={i} className="keyword-chip-item">
                      <span>{icp}</span>
                      <button type="button" className="kw-remove-btn" onClick={() => removeIcp(icp)}>
                        <X size={9} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="chip-add-inline-row">
                  <input 
                    type="text"
                    value={customIcpInput}
                    onChange={(e) => setCustomIcpInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addIcp(); }}}
                    placeholder="Add target ICP..."
                    className="chip-add-input"
                  />
                  <button type="button" className="chip-add-btn" onClick={addIcp}>
                    <Plus size={12} />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Value Propositions */}
              <div className="onboarding-form-group">
                <label>VALUE PROPOSITIONS</label>
                <div className="keywords-cloud-container">
                  {(profile.valueProps || []).map((prop, i) => (
                    <div key={i} className="keyword-chip-item prop">
                      <span>{prop}</span>
                      <button type="button" className="kw-remove-btn" onClick={() => removeValueProp(prop)}>
                        <X size={9} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="chip-add-inline-row">
                  <input 
                    type="text"
                    value={customValuePropInput}
                    onChange={(e) => setCustomValuePropInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addValueProp(); }}}
                    placeholder="Add value proposition..."
                    className="chip-add-input"
                  />
                  <button type="button" className="chip-add-btn" onClick={addValueProp}>
                    <Plus size={12} />
                    <span>Add</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ================= STEP 3 ================= */}
          {step === 3 && (
            <div className="onboarding-step-view">
              <div className="step-heading-group">
                <span className="step-count-badge">STEP 3 / 5</span>
                <h2>LinkedIn Criteria</h2>
              </div>

              {/* Target Job Titles */}
              <div className="onboarding-form-group">
                <label>TARGET JOB TITLES</label>
                <div className="onboarding-chips-cloud">
                  {SUGGESTED_JOB_TITLES.map(title => {
                    const isSelected = (profile.jobTitles || []).includes(title);
                    return (
                      <button 
                        key={title}
                        type="button"
                        className={`onboarding-chip ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleJobTitle(title)}
                      >
                        <Briefcase size={10} style={{ marginRight: 3 }} />
                        {title}
                        {isSelected && <Check size={10} style={{ marginLeft: 3 }} />}
                      </button>
                    );
                  })}
                </div>

                <div className="chip-add-inline-row">
                  <input 
                    type="text"
                    value={customJobTitleInput}
                    onChange={(e) => setCustomJobTitleInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomJobTitle(); }}}
                    placeholder="Add job title..."
                    className="chip-add-input"
                  />
                  <button type="button" className="chip-add-btn" onClick={addCustomJobTitle}>
                    <Plus size={12} />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Company Size Range */}
              <div className="onboarding-form-group">
                <label>TARGET COMPANY SIZE</label>
                <select 
                  value={profile.companySize || COMPANY_SIZE_OPTIONS[2]}
                  onChange={(e) => setProfile(prev => ({ ...prev, companySize: e.target.value }))}
                  className="onboarding-select-dropdown"
                >
                  {COMPANY_SIZE_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

            </div>
          )}

          {/* ================= STEP 4 ================= */}
          {step === 4 && (
            <div className="onboarding-step-view">
              <div className="step-heading-group">
                <span className="step-count-badge">STEP 4 / 5</span>
                <h2>Search Keywords</h2>
              </div>

              {/* Keywords List */}
              <div className="onboarding-form-group">
                <div className="label-with-count">
                  <label>SOCIAL MONITORING KEYWORDS</label>
                  <button 
                    type="button"
                    className="ai-inline-trigger-link"
                    onClick={handleGenerateKeywords}
                    disabled={isGeneratingAI}
                  >
                    <Sparkles size={10} style={{ marginRight: 3 }} />
                    {isGeneratingAI ? 'Deriving...' : 'Auto-derive with AI'}
                  </button>
                </div>

                <div className="keywords-cloud-container">
                  {(profile.keywords || []).map((kw, i) => (
                    <div key={i} className="keyword-chip-item">
                      <Search size={10} className="kw-icon" />
                      <span className="kw-text">{kw}</span>
                      <button type="button" className="kw-remove-btn" onClick={() => removeKeyword(kw)}>
                        <X size={9} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="chip-add-inline-row">
                  <input 
                    type="text"
                    value={customKeywordInput}
                    onChange={(e) => setCustomKeywordInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addKeyword(); }}}
                    placeholder="Add search keyword..."
                    className="chip-add-input"
                  />
                  <button type="button" className="chip-add-btn" onClick={addKeyword}>
                    <Plus size={12} />
                    <span>Add</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ================= STEP 5 ================= */}
          {step === 5 && (
            <div className="onboarding-step-view">
              <div className="step-heading-group">
                <span className="step-count-badge">STEP 5 / 5</span>
                <h2>Review Setup Summary</h2>
              </div>

              <div className="onboarding-preview-grid">
                
                {/* Product & Locations Box */}
                <div className="preview-card-item">
                  <span className="preview-item-label">PRODUCT & LOCATIONS</span>
                  <div className="preview-item-val-title">{profile.name || 'Rixly'}</div>
                  <div className="preview-tag-row">
                    {(profile.locations || []).slice(0, 3).map((loc, idx) => (
                      <span key={idx} className="preview-mini-pill">{loc}</span>
                    ))}
                    {(profile.locations || []).length > 3 && (
                      <span className="preview-mini-pill">+{(profile.locations || []).length - 3}</span>
                    )}
                  </div>
                </div>

                {/* Description & Value Props Box */}
                <div className="preview-card-item">
                  <span className="preview-item-label">DESCRIPTION & PROPS</span>
                  <p className="preview-desc-text">"{profile.productDescription || ''}"</p>
                  <span className="preview-count-meta">{(profile.valueProps || []).length} Value Props • {(profile.icps || []).length} ICPs</span>
                </div>

                {/* LinkedIn Targeting Box */}
                <div className="preview-card-item">
                  <span className="preview-item-label">LINKEDIN TARGETING</span>
                  <div className="preview-tag-row">
                    {(profile.jobTitles || []).slice(0, 3).map((t, idx) => (
                      <span key={idx} className="preview-mini-pill">{t}</span>
                    ))}
                  </div>
                  <span className="preview-count-meta" style={{ marginTop: 4 }}>
                    {profile.companySize || COMPANY_SIZE_OPTIONS[2]}
                  </span>
                </div>

                {/* Keywords Box */}
                <div className="preview-card-item">
                  <span className="preview-item-label">KEYWORDS ({(profile.keywords || []).length})</span>
                  <div className="preview-tag-row">
                    {(profile.keywords || []).slice(0, 3).map((kw, idx) => (
                      <span key={idx} className="preview-mini-pill kw">{kw}</span>
                    ))}
                    {(profile.keywords || []).length > 3 && (
                      <span className="preview-mini-pill kw">+{(profile.keywords || []).length - 3}</span>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Actions Footer */}
        <footer className="onboarding-modal-footer">
          <div>
            {step > 1 && (
              <button 
                type="button" 
                className="onboarding-nav-btn back"
                onClick={() => setStep(prev => Math.max(1, prev - 1))}
              >
                <ArrowLeft size={12} style={{ marginRight: 5 }} />
                Back
              </button>
            )}
          </div>

          <div className="footer-right-actions">
            {step < 5 ? (
              <button 
                type="button" 
                className="onboarding-nav-btn next"
                onClick={() => setStep(prev => Math.min(5, prev + 1))}
              >
                Next
                <ArrowRight size={12} style={{ marginLeft: 5 }} />
              </button>
            ) : (
              <button 
                type="button" 
                className="onboarding-nav-btn finish"
                onClick={handleFinish}
              >
                <CheckCircle2 size={13} style={{ marginRight: 5 }} />
                Save & Apply Settings
              </button>
            )}
          </div>
        </footer>

      </div>
    </div>
  );
};
