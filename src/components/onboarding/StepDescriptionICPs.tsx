import React, { useState } from 'react';
import { Globe, Sparkles, Loader2, Users, Plus, X, AlertCircle } from 'lucide-react';
import type { ProjectOnboardingState } from './types';
import { generateProductDescription, generateICPs, generateValueProps } from './aiServices';

interface StepDescriptionICPsProps {
  data: ProjectOnboardingState;
  onChange: (data: Partial<ProjectOnboardingState>) => void;
  showErrors?: boolean;
}

export const StepDescriptionICPs: React.FC<StepDescriptionICPsProps> = ({
  data,
  onChange,
  showErrors = false
}) => {
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [isGeneratingICPs, setIsGeneratingICPs] = useState(false);
  const [isGeneratingProps, setIsGeneratingProps] = useState(false);
  
  const [descError, setDescError] = useState<string | null>(null);
  const [icpError, setIcpError] = useState<string | null>(null);
  const [propsError, setPropsError] = useState<string | null>(null);

  const [customIcp, setCustomIcp] = useState('');
  const [customValueProp, setCustomValueProp] = useState('');

  const isDescInvalid = showErrors && !data.productDescription.trim();
  const isIcpsInvalid = showErrors && data.icps.length === 0;
  const isPropsInvalid = showErrors && data.valueProps.length === 0;

  // Generate Product Description
  const handleGenerateDesc = async () => {
    if (!data.productUrl.trim()) return;
    setIsGeneratingDesc(true);
    setDescError(null);
    try {
      const generated = await generateProductDescription(data.productUrl, data.industries);
      onChange({ productDescription: generated });
    } catch (e) {
      setDescError('Could not generate description. You can write it manually below.');
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  // Generate ICPs (Non-destructive: existing + AI suggestions)
  const handleGenerateICPs = async () => {
    setIsGeneratingICPs(true);
    setIcpError(null);
    try {
      const suggestions = await generateICPs(data.productDescription || data.name, data.icps);
      const merged = Array.from(new Set([...data.icps, ...suggestions]));
      onChange({ icps: merged });
    } catch (e) {
      setIcpError('Could not generate ICP suggestions. Try adding custom profiles below.');
    } finally {
      setIsGeneratingICPs(false);
    }
  };

  // Generate Value Props (Non-destructive: existing + AI suggestions)
  const handleGenerateValueProps = async () => {
    setIsGeneratingProps(true);
    setPropsError(null);
    try {
      const suggestions = await generateValueProps(data.productDescription || data.name, data.icps, data.valueProps);
      const merged = Array.from(new Set([...data.valueProps, ...suggestions]));
      onChange({ valueProps: merged });
    } catch (e) {
      setPropsError('Could not generate value propositions. Try adding custom value props below.');
    } finally {
      setIsGeneratingProps(false);
    }
  };

  // ICP helpers
  const addIcp = () => {
    const trimmed = customIcp.trim();
    if (!trimmed) return;
    if (!data.icps.includes(trimmed)) {
      onChange({ icps: [...data.icps, trimmed] });
    }
    setCustomIcp('');
  };

  const removeIcp = (icpToRemove: string) => {
    onChange({ icps: data.icps.filter(item => item !== icpToRemove) });
  };

  // Value Prop helpers
  const addValueProp = () => {
    const trimmed = customValueProp.trim();
    if (!trimmed) return;
    if (!data.valueProps.includes(trimmed)) {
      onChange({ valueProps: [...data.valueProps, trimmed] });
    }
    setCustomValueProp('');
  };

  const removeValueProp = (propToRemove: string) => {
    onChange({ valueProps: data.valueProps.filter(item => item !== propToRemove) });
  };

  return (
    <div className="onboarding-step-card-content">
      <div className="onboarding-step-header">
        <h2 className="onboarding-step-title">AI Description & ICPs</h2>
        <p className="onboarding-step-subtitle">
          Describe your product and define the customers you want to reach.
        </p>
      </div>

      <div className="onboarding-form-fields-stack">
        
        {/* SECTION A: Product URL & Description */}
        <div className="onboarding-sub-section-box">
          <div className="onboarding-field-group">
            <div className="onboarding-field-label-row">
              <label className="onboarding-field-label">
                <span>App / Product URL</span>
                <span className="optional-tag">(Optional)</span>
              </label>
              {data.productUrl.trim() && (
                <button
                  type="button"
                  className="onboarding-ai-action-btn"
                  onClick={handleGenerateDesc}
                  disabled={isGeneratingDesc}
                >
                  {isGeneratingDesc ? (
                    <>
                      <Loader2 size={12} className="spin-loader" />
                      <span>Generating with AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={12} className="ai-btn-sparkle-icon" />
                      <span>Generate with AI</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="onboarding-input-with-prefix">
              <Globe size={15} className="input-prefix-icon" />
              <input 
                type="url"
                value={data.productUrl}
                onChange={(e) => onChange({ productUrl: e.target.value })}
                placeholder="https://yourproduct.com"
                className="onboarding-primary-input"
              />
            </div>
            {descError && (
              <div className="onboarding-inline-alert">
                <AlertCircle size={12} />
                <span>{descError}</span>
              </div>
            )}
          </div>

          {/* Product Description */}
          <div className={`onboarding-field-group ${isDescInvalid ? 'has-error' : ''}`}>
            <label className="onboarding-field-label">
              <span>Product Description</span>
              <span className="required-star">*</span>
            </label>
            <textarea
              rows={3}
              value={data.productDescription}
              onChange={(e) => onChange({ productDescription: e.target.value })}
              placeholder="Describe what your product does, who it helps, and the problem it solves..."
              className="onboarding-primary-textarea"
            />
            {isDescInvalid && (
              <span className="onboarding-inline-error">Please enter a product description before proceeding.</span>
            )}
          </div>
        </div>

        {/* SECTION B: Ideal Customer Profiles (ICPs) */}
        <div className={`onboarding-sub-section-box ${isIcpsInvalid ? 'has-error' : ''}`}>
          <div className="onboarding-section-title-row">
            <div>
              <h3 className="onboarding-section-inner-title">Ideal Customer Profiles (ICPs)</h3>
              <p className="onboarding-section-inner-subtitle">
                Who is most likely to benefit from your product?
              </p>
            </div>
            <button
              type="button"
              className="onboarding-ai-action-btn"
              onClick={handleGenerateICPs}
              disabled={isGeneratingICPs}
            >
              {isGeneratingICPs ? (
                <>
                  <Loader2 size={12} className="spin-loader" />
                  <span>Generating ICPs...</span>
                </>
              ) : (
                <>
                  <Sparkles size={12} className="ai-btn-sparkle-icon" />
                  <span>Generate with AI</span>
                </>
              )}
            </button>
          </div>

          {icpError && (
            <div className="onboarding-inline-alert">
              <AlertCircle size={12} />
              <span>{icpError}</span>
            </div>
          )}

          {/* Active ICP Tags */}
          <div className="onboarding-tags-cloud-container">
            {data.icps.map(icp => (
              <span key={icp} className="onboarding-active-tag-chip icp">
                <Users size={11} className="tag-chip-icon" />
                <span>{icp}</span>
                <button
                  type="button"
                  className="tag-chip-remove-btn"
                  onClick={() => removeIcp(icp)}
                  title={`Remove ${icp}`}
                >
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>

          {/* Add custom ICP */}
          <div className="onboarding-inline-add-row">
            <input 
              type="text" 
              value={customIcp}
              onChange={(e) => setCustomIcp(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addIcp(); }}}
              placeholder="Add custom ICP (e.g. B2B Marketing Leaders, Agency Owners)..."
              className="onboarding-inline-add-input"
            />
            <button 
              type="button" 
              className="onboarding-inline-add-btn"
              onClick={addIcp}
              disabled={!customIcp.trim()}
            >
              <Plus size={13} />
              <span>Add ICP</span>
            </button>
          </div>

          {isIcpsInvalid && (
            <span className="onboarding-inline-error">Please provide at least one Ideal Customer Profile.</span>
          )}
        </div>

        {/* SECTION C: Value Propositions */}
        <div className={`onboarding-sub-section-box ${isPropsInvalid ? 'has-error' : ''}`}>
          <div className="onboarding-section-title-row">
            <div>
              <h3 className="onboarding-section-inner-title">Value Propositions</h3>
              <p className="onboarding-section-inner-subtitle">
                What makes your product valuable to these customers?
              </p>
            </div>
            <button
              type="button"
              className="onboarding-ai-action-btn"
              onClick={handleGenerateValueProps}
              disabled={isGeneratingProps}
            >
              {isGeneratingProps ? (
                <>
                  <Loader2 size={12} className="spin-loader" />
                  <span>Generating Value Props...</span>
                </>
              ) : (
                <>
                  <Sparkles size={12} className="ai-btn-sparkle-icon" />
                  <span>Generate with AI</span>
                </>
              )}
            </button>
          </div>

          {propsError && (
            <div className="onboarding-inline-alert">
              <AlertCircle size={12} />
              <span>{propsError}</span>
            </div>
          )}

          {/* Active Value Prop Tags */}
          <div className="onboarding-tags-cloud-container">
            {data.valueProps.map(prop => (
              <span key={prop} className="onboarding-active-tag-chip prop">
                <Sparkles size={11} className="tag-chip-icon gold" />
                <span>{prop}</span>
                <button
                  type="button"
                  className="tag-chip-remove-btn"
                  onClick={() => removeValueProp(prop)}
                  title={`Remove ${prop}`}
                >
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>

          {/* Add custom Value Prop */}
          <div className="onboarding-inline-add-row">
            <input 
              type="text" 
              value={customValueProp}
              onChange={(e) => setCustomValueProp(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addValueProp(); }}}
              placeholder="Add custom value proposition..."
              className="onboarding-inline-add-input"
            />
            <button 
              type="button" 
              className="onboarding-inline-add-btn"
              onClick={addValueProp}
              disabled={!customValueProp.trim()}
            >
              <Plus size={13} />
              <span>Add Value Prop</span>
            </button>
          </div>

          {isPropsInvalid && (
            <span className="onboarding-inline-error">Please provide at least one Value Proposition.</span>
          )}
        </div>

      </div>
    </div>
  );
};
