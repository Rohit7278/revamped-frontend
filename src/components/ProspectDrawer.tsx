import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Award, Star, Compass, PenSquare } from 'lucide-react';
import type { Lead } from './ActionQueue';
import './ProspectDrawer.css';

interface ProspectDrawerProps {
  lead: Lead | null;
  onClose: () => void;
  onStatusUpdate: (leadId: string, status: 'contacted' | 'replied' | 'converted') => void;
}

export const ProspectDrawer: React.FC<ProspectDrawerProps> = ({ 
  lead, 
  onClose, 
  onStatusUpdate 
}) => {
  const [copied, setCopied] = useState(false);
  const [activeMessageTab, setActiveMessageTab] = useState<'icebreaker' | 'formal'>('icebreaker');
  const [customText, setCustomText] = useState('');

  // Intent-based copywriting templates
  const templates = {
    seeking: {
      icebreaker: `Hi ${lead?.name},\n\nNoticed ${lead?.company} is exploring new workflow alternatives right now. Given your capacity as ${lead?.title}, I thought you'd want a quick look at how Rixly automates VP pipeline scans to discover intent.\n\nAre you open to a brief 3-minute demo this week?`,
      formal: `Dear ${lead?.name},\n\nI hope this message finds you well. signals indicate that ${lead?.company} is currently evaluating operations optimization in the logistics sector. In your role as ${lead?.title}, you might find our automation benchmarks highly relevant.\n\nWould you be open to an introductory discussion?`
    },
    aware: {
      icebreaker: `Hey ${lead?.name},\n\nScaling supply chains at ${lead?.company} often introduces bottleneck issues. We compiled a short, action-focused playbook specifically on preventing dispatch latency for teams like yours.\n\nThought I'd share. Let me know what you think!`,
      formal: `Dear ${lead?.name},\n\nCongratulations on the recent growth indicators at ${lead?.company}. As ${lead?.title}, managing operational throughput is likely a top priority. We have helped organizations streamline dispatch workflows. I'd love to share our optimization deck.\n\nBest regards.`
    },
    browsing: {
      icebreaker: `Hi ${lead?.name},\n\nSaw you in the LinkedIn logistics threads. Always great networking with fellow sector professionals. I run Rixly, an intent monitoring platform. Just wanted to connect and say hello!`,
      formal: `Dear ${lead?.name},\n\nI am extending a connection request to network with senior logistics leaders. I follow your team's updates at ${lead?.company} with interest.\n\nSincerely.`
    },
    match: {
      icebreaker: `Hey ${lead?.name},\n\nYour profile popped up in our logistics network filter as a great match. Love what ${lead?.company} is doing. Let's connect!`,
      formal: `Dear ${lead?.name},\n\nI am connecting with senior leaders in the industry. Your experience as ${lead?.title} is highly impressive. I look forward to following your professional updates.\n\nKind regards.`
    }
  };

  useEffect(() => {
    if (lead) {
      setCustomText(templates[lead.category][activeMessageTab]);
      setCopied(false);
    }
  }, [lead, activeMessageTab]);

  if (!lead) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(customText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="prospect-drawer-overlay" onClick={onClose}>
      <div className="prospect-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header-block">
          <div className="prospect-identity-header-block">
            <div className="drawer-prospect-avatar" style={{ backgroundColor: lead.avatarColor, color: '#030712' }}>
              {lead.avatarText}
            </div>
            <div className="drawer-prospect-meta">
              <h2 className="drawer-fullname">{lead.name}</h2>
              <p className="drawer-subdetails">{lead.title} at <span className="highlight-text">{lead.company}</span></p>
            </div>
          </div>
          <button className="close-drawer-trigger" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body Scroll */}
        <div className="prospect-drawer-body">
          {/* Section 1: Details & Analytics */}
          <div className="drawer-detail-section">
            <h4 className="drawer-section-title">Prospect Diagnostics</h4>
            <div className="diagnostics-summary-grid">
              <div className="diagnostic-box">
                <Award size={16} className="diag-icon cyan" />
                <div className="diag-data">
                  <span className="diag-val">{lead.fitScore}%</span>
                  <span className="diag-lbl">Fit Index</span>
                </div>
              </div>
              <div className="diagnostic-box">
                <Star size={16} className="diag-icon purple" />
                <div className="diag-data">
                  <span className="diag-val">{lead.sharedConnections}</span>
                  <span className="diag-lbl">Contacts</span>
                </div>
              </div>
              <div className="diagnostic-box">
                <Compass size={16} className="diag-icon slate" />
                <div className="diag-data">
                  <span className="diag-val text-capitalize">{lead.categoryLabel}</span>
                  <span className="diag-lbl">Intent State</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: AI outreach text templates */}
          <div className="drawer-detail-section">
            <div className="ai-agent-header">
              <h4 className="drawer-section-title">AI Copywriting Assistant</h4>
              <span className="ai-agent-sparkle-pill">AI Drafted</span>
            </div>

            <div className="agent-tabs-row">
              <button 
                className={`agent-tab-trigger-btn ${activeMessageTab === 'icebreaker' ? 'active' : ''}`}
                onClick={() => setActiveMessageTab('icebreaker')}
              >
                Icebreaker Draft
              </button>
              <button 
                className={`agent-tab-trigger-btn ${activeMessageTab === 'formal' ? 'active' : ''}`}
                onClick={() => setActiveMessageTab('formal')}
              >
                Formal Outreach
              </button>
            </div>

            <div className="agent-editor-wrapper">
              <div className="editor-actions-header">
                <span className="editor-status"><PenSquare size={11} /> Edit template text directly</span>
              </div>
              <textarea 
                className="agent-editor-textarea"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                rows={7}
              />
              <button className="agent-copy-btn" onClick={handleCopy}>
                {copied ? (
                  <>
                    <Check size={13} className="copied-success" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Copy Draft</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Section 3: Status logging */}
          <div className="drawer-detail-section">
            <h4 className="drawer-section-title">Log Outreach Actions</h4>
            <p className="drawer-section-tip">Logging outreach updates the dashboard pipeline metrics in real-time.</p>
            
            <div className="outreach-log-buttons-grid">
              <button 
                className="outreach-log-btn tag-seeking"
                onClick={() => {
                  onStatusUpdate(lead.id, 'contacted');
                  onClose();
                }}
              >
                Log Contacted
              </button>
              <button 
                className="outreach-log-btn tag-aware"
                onClick={() => {
                  onStatusUpdate(lead.id, 'replied');
                  onClose();
                }}
              >
                Log Replied
              </button>
              <button 
                className="outreach-log-btn tag-match"
                onClick={() => {
                  onStatusUpdate(lead.id, 'converted');
                  onClose();
                }}
              >
                Log Converted
              </button>
            </div>

            <a 
              href={lead.linkedinUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="drawer-primary-linkedin-btn"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="none" style={{ marginRight: '6px' }}>
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
              <span>Engage on LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
