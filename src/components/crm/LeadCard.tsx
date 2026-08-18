import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Calendar, 
  Bell, 
  Star, 
  Clock, 
  Sparkles, 
  Building2, 
  CheckCircle2
} from 'lucide-react';
import { useCRM } from './CRMContext';
import type { CRMLead } from './CRMContext';

interface LeadCardProps {
  lead: CRMLead;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead }) => {
  const { 
    setActiveLeadId, 
    activeLeadId,
    notes,
    tasks,
    meetings,
    reminders
  } = useCRM();

  // Calculate counts for this lead
  const leadNotes = notes.filter(n => n.leadId === lead.id).length;
  const leadTasks = tasks.filter(t => t.leadId === lead.id && !t.completed).length;
  const leadMeetings = meetings.filter(m => m.leadId === lead.id).length;
  const leadReminders = reminders.filter(r => r.leadId === lead.id && !r.completed).length;

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    e.dataTransfer.setData('application/rixly-lead', lead.id);
    e.dataTransfer.setData('text/plain', lead.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const getPriorityBadge = () => {
    switch (lead.priority) {
      case 'high':
        return { label: 'High', bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', dot: '#ef4444' };
      case 'medium':
        return { label: 'Medium', bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', dot: '#f59e0b' };
      case 'low':
        return { label: 'Low', bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', dot: '#3b82f6' };
      default:
        return { label: 'Normal', bg: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)', dot: '#94a3b8' };
    }
  };

  const priority = getPriorityBadge();
  const companyName = lead.postQuote.includes('OrbitFlow') ? 'OrbitFlow Inc' : 'Vanguard Cargo Group';

  return (
    <motion.div
      draggable
      onDragStart={handleDragStart as any}
      onClick={() => setActiveLeadId(lead.id)}
      layoutId={lead.id}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      whileTap={{ scale: 0.99 }}
      className={`crm-lead-card-human ${activeLeadId === lead.id ? 'active-selection' : ''}`}
      style={{ cursor: 'grab' }}
    >
      
      {/* Header: Person profile, company, and quick platform pill */}
      <div className="crm-card-top-identity">
        <div className="crm-card-avatar-wrapper">
          {lead.profilePic ? (
            <img 
              src={lead.profilePic} 
              alt={lead.name} 
              className="crm-card-person-avatar" 
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          ) : (
            <div 
              className="crm-card-person-avatar-placeholder" 
              style={{ backgroundColor: `${lead.avatarColor}15`, color: lead.avatarColor }}
            >
              {lead.avatarText}
            </div>
          )}
          <span 
            className="crm-card-priority-indicator-dot" 
            style={{ backgroundColor: priority.dot }} 
            title={`Priority: ${priority.label}`}
          />
        </div>

        <div className="crm-card-header-info">
          <div className="crm-card-name-row">
            <h4 className="crm-person-name">{lead.name}</h4>
            <span className={`crm-platform-badge ${lead.platform}`}>
              {lead.platform === 'linkedin' ? 'LinkedIn' : 'Reddit'}
            </span>
          </div>

          <div className="crm-person-role-company">
            <span className="crm-role-text">{lead.positionLabel}</span>
            <span className="crm-dot-sep">•</span>
            <span className="crm-company-pill">
              <Building2 size={9} style={{ marginRight: 3, opacity: 0.7 }} />
              {companyName}
            </span>
          </div>
        </div>
      </div>

      {/* Social post quote & intent summary bubble */}
      <div className="crm-card-conversation-bubble">
        <p className="crm-quote-snippet">
          "{lead.postQuote.length > 90 ? `${lead.postQuote.slice(0, 90)}...` : lead.postQuote}"
        </p>
        
        {lead.flameSignal && (
          <div className="crm-intent-highlight-chip">
            <Sparkles size={10} className="intent-sparkle-icon" />
            <span className="intent-text">{lead.flameSignal}</span>
          </div>
        )}
      </div>

      {/* Card Footer: Natural Activity Meta & Quick Indicator Icons */}
      <div className="crm-card-human-footer">
        <div className="crm-card-fit-score">
          <Star size={11} fill="var(--rixly-amber)" stroke="var(--rixly-amber)" />
          <span className="fit-score-text">{lead.fitScore}%</span>
        </div>

        <div className="crm-card-activity-timestamp">
          <Clock size={10} className="time-icon" />
          <span>{lead.nextFollowUp ? `Next: ${lead.nextFollowUp}` : 'Active outreach'}</span>
        </div>

        {/* Counter Pills */}
        <div className="crm-card-counters-group">
          {leadNotes > 0 && (
            <span className="crm-meta-pill" title={`${leadNotes} Notes`}>
              <FileText size={10} />
              <span>{leadNotes}</span>
            </span>
          )}
          {leadTasks > 0 && (
            <span className="crm-meta-pill green" title={`${leadTasks} Tasks`}>
              <CheckCircle2 size={10} />
              <span>{leadTasks}</span>
            </span>
          )}
          {leadMeetings > 0 && (
            <span className="crm-meta-pill blue" title={`${leadMeetings} Meetings`}>
              <Calendar size={10} />
              <span>{leadMeetings}</span>
            </span>
          )}
          {leadReminders > 0 && (
            <span className="crm-meta-pill orange" title={`${leadReminders} Reminders`}>
              <Bell size={10} />
              <span>{leadReminders}</span>
            </span>
          )}
        </div>
      </div>

    </motion.div>
  );
};