import React from 'react';
import { Edit2, Building2, Globe, Users, Sparkles, Briefcase, Search, CheckCircle2 } from 'lucide-react';
import type { ProjectOnboardingState } from './types';

interface StepPreviewProps {
  data: ProjectOnboardingState;
  onEditStep: (stepNumber: number) => void;
}

export const StepPreview: React.FC<StepPreviewProps> = ({
  data,
  onEditStep
}) => {
  return (
    <div className="onboarding-step-card-content">
      <div className="onboarding-step-header">
        <h2 className="onboarding-step-title">Preview & Finalize</h2>
        <p className="onboarding-step-subtitle">
          Review your project targeting configuration before launching autonomous intent discovery.
        </p>
      </div>

      <div className="onboarding-preview-tiles-grid">
        
        {/* 1. Product & Markets */}
        <div className="onboarding-preview-tile">
          <div className="preview-tile-top-row">
            <div className="preview-tile-header-left">
              <Building2 size={14} className="preview-tile-icon" />
              <span className="preview-tile-label">PRODUCT & MARKETS</span>
            </div>
            <button
              type="button"
              className="preview-tile-edit-btn"
              onClick={() => onEditStep(1)}
              title="Edit Product & Markets"
            >
              <Edit2 size={11} />
              <span>Edit</span>
            </button>
          </div>

          <h3 className="preview-tile-project-name">{data.name || 'Untitled Project'}</h3>
          {data.productUrl && (
            <div className="preview-tile-url-row">
              <Globe size={11} />
              <span>{data.productUrl}</span>
            </div>
          )}

          <div className="preview-tile-tags-group">
            <span className="preview-tile-group-caption">Locations ({data.locations.length})</span>
            <div className="preview-tile-mini-tags">
              {data.locations.map(loc => (
                <span key={loc} className="preview-mini-pill">{loc}</span>
              ))}
            </div>
          </div>

          {data.industries.length > 0 && (
            <div className="preview-tile-tags-group" style={{ marginTop: 6 }}>
              <span className="preview-tile-group-caption">Industries ({data.industries.length})</span>
              <div className="preview-tile-mini-tags">
                {data.industries.map(ind => (
                  <span key={ind} className="preview-mini-pill industry">{ind}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2. Product Description */}
        <div className="onboarding-preview-tile">
          <div className="preview-tile-top-row">
            <div className="preview-tile-header-left">
              <Sparkles size={14} className="preview-tile-icon gold" />
              <span className="preview-tile-label">PRODUCT DESCRIPTION</span>
            </div>
            <button
              type="button"
              className="preview-tile-edit-btn"
              onClick={() => onEditStep(2)}
              title="Edit Description"
            >
              <Edit2 size={11} />
              <span>Edit</span>
            </button>
          </div>

          <p className="preview-tile-desc-quote">
            "{data.productDescription || 'No description provided.'}"
          </p>
        </div>

        {/* 3. Ideal Customer Profiles (ICPs) */}
        <div className="onboarding-preview-tile">
          <div className="preview-tile-top-row">
            <div className="preview-tile-header-left">
              <Users size={14} className="preview-tile-icon" />
              <span className="preview-tile-label">IDEAL CUSTOMER PROFILES ({data.icps.length})</span>
            </div>
            <button
              type="button"
              className="preview-tile-edit-btn"
              onClick={() => onEditStep(2)}
              title="Edit ICPs"
            >
              <Edit2 size={11} />
              <span>Edit</span>
            </button>
          </div>

          <div className="preview-tile-mini-tags">
            {data.icps.map(icp => (
              <span key={icp} className="preview-mini-pill icp">{icp}</span>
            ))}
          </div>
        </div>

        {/* 4. Value Propositions */}
        <div className="onboarding-preview-tile">
          <div className="preview-tile-top-row">
            <div className="preview-tile-header-left">
              <CheckCircle2 size={14} className="preview-tile-icon green" />
              <span className="preview-tile-label">VALUE PROPOSITIONS ({data.valueProps.length})</span>
            </div>
            <button
              type="button"
              className="preview-tile-edit-btn"
              onClick={() => onEditStep(2)}
              title="Edit Value Props"
            >
              <Edit2 size={11} />
              <span>Edit</span>
            </button>
          </div>

          <div className="preview-tile-mini-tags">
            {data.valueProps.map(prop => (
              <span key={prop} className="preview-mini-pill prop">{prop}</span>
            ))}
          </div>
        </div>

        {/* 5. LinkedIn Targeting */}
        <div className="onboarding-preview-tile">
          <div className="preview-tile-top-row">
            <div className="preview-tile-header-left">
              <Briefcase size={14} className="preview-tile-icon" />
              <span className="preview-tile-label">LINKEDIN TARGETING</span>
            </div>
            <button
              type="button"
              className="preview-tile-edit-btn"
              onClick={() => onEditStep(3)}
              title="Edit LinkedIn Targeting"
            >
              <Edit2 size={11} />
              <span>Edit</span>
            </button>
          </div>

          <div className="preview-tile-tags-group">
            <span className="preview-tile-group-caption">Job Titles ({data.linkedin.jobTitles.length})</span>
            <div className="preview-tile-mini-tags">
              {data.linkedin.jobTitles.map(t => (
                <span key={t} className="preview-mini-pill linkedin">{t}</span>
              ))}
            </div>
          </div>

          <div className="preview-tile-meta-row" style={{ marginTop: 8 }}>
            <span className="preview-tile-meta-label">Company Size:</span>
            <span className="preview-tile-meta-val">{data.linkedin.companySize} employees</span>
          </div>
        </div>

        {/* 6. Social Search Keywords */}
        <div className="onboarding-preview-tile">
          <div className="preview-tile-top-row">
            <div className="preview-tile-header-left">
              <Search size={14} className="preview-tile-icon" />
              <span className="preview-tile-label">SOCIAL SEARCH KEYWORDS ({data.keywords.length})</span>
            </div>
            <button
              type="button"
              className="preview-tile-edit-btn"
              onClick={() => onEditStep(4)}
              title="Edit Search Keywords"
            >
              <Edit2 size={11} />
              <span>Edit</span>
            </button>
          </div>

          <div className="preview-tile-mini-tags">
            {data.keywords.map(kw => (
              <span key={kw} className="preview-mini-pill kw">{kw}</span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
