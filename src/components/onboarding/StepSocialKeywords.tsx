import React, { useState } from 'react';
import { Search, Sparkles, Loader2, Plus, X, AlertCircle } from 'lucide-react';
import type { ProjectOnboardingState } from './types';
import { generateKeywords } from './aiServices';

interface StepSocialKeywordsProps {
  data: ProjectOnboardingState;
  onChange: (data: Partial<ProjectOnboardingState>) => void;
  showErrors?: boolean;
}

export const StepSocialKeywords: React.FC<StepSocialKeywordsProps> = ({
  data,
  onChange,
  showErrors = false
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customKeyword, setCustomKeyword] = useState('');

  const isKeywordsInvalid = showErrors && data.keywords.length === 0;

  // AI Generation
  const handleGenerateKeywords = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const suggestions = await generateKeywords(
        data.productDescription || data.name,
        data.icps,
        data.valueProps,
        data.keywords
      );
      const merged = Array.from(new Set([...data.keywords, ...suggestions]));
      onChange({ keywords: merged });
    } catch (e) {
      setError('Could not generate keyword suggestions. You can add them manually below.');
    } finally {
      setIsGenerating(false);
    }
  };

  const addKeyword = () => {
    const trimmed = customKeyword.trim();
    if (!trimmed) return;
    if (!data.keywords.includes(trimmed)) {
      onChange({ keywords: [...data.keywords, trimmed] });
    }
    setCustomKeyword('');
  };

  const removeKeyword = (kwToRemove: string) => {
    onChange({ keywords: data.keywords.filter(k => k !== kwToRemove) });
  };

  return (
    <div className="onboarding-step-card-content">
      <div className="onboarding-step-header">
        <h2 className="onboarding-step-title">Social Search Keywords</h2>
        <p className="onboarding-step-subtitle">
          Choose keywords Rixly should use to identify relevant conversations and posts across LinkedIn and Reddit.
        </p>
      </div>

      <div className="onboarding-form-fields-stack">
        
        <div className={`onboarding-sub-section-box ${isKeywordsInvalid ? 'has-error' : ''}`}>
          <div className="onboarding-section-title-row">
            <div>
              <h3 className="onboarding-section-inner-title">Unified Social Monitoring Keywords</h3>
              <p className="onboarding-section-inner-subtitle">
                Used to scan active discussions, complaints, and tool requests across both LinkedIn & Reddit.
              </p>
            </div>
            <button
              type="button"
              className="onboarding-ai-action-btn"
              onClick={handleGenerateKeywords}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 size={12} className="spin-loader" />
                  <span>Generating Keywords...</span>
                </>
              ) : (
                <>
                  <Sparkles size={12} className="ai-btn-sparkle-icon" />
                  <span>Generate with AI</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="onboarding-inline-alert">
              <AlertCircle size={12} />
              <span>{error}</span>
            </div>
          )}

          {/* Active Keywords Cloud */}
          <div className="onboarding-tags-cloud-container keywords-cloud">
            {data.keywords.map(kw => (
              <span key={kw} className="onboarding-active-tag-chip keyword">
                <Search size={11} className="tag-chip-icon" />
                <span>{kw}</span>
                <button
                  type="button"
                  className="tag-chip-remove-btn"
                  onClick={() => removeKeyword(kw)}
                  title={`Remove ${kw}`}
                >
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>

          {/* Add custom keyword */}
          <div className="onboarding-inline-add-row">
            <input 
              type="text" 
              value={customKeyword}
              onChange={(e) => setCustomKeyword(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addKeyword(); }}}
              placeholder="Type keyword or intent phrase (e.g. looking for outbound tool) and press Enter..."
              className="onboarding-inline-add-input"
            />
            <button 
              type="button" 
              className="onboarding-inline-add-btn"
              onClick={addKeyword}
              disabled={!customKeyword.trim()}
            >
              <Plus size={13} />
              <span>Add Keyword</span>
            </button>
          </div>

          {isKeywordsInvalid && (
            <span className="onboarding-inline-error">Please provide at least one search keyword.</span>
          )}
        </div>

      </div>
    </div>
  );
};
