import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, User, Calendar, FileText, Bell, Sparkles, CheckSquare, Trash2, 
  Plus, Pin, MapPin, ExternalLink, Check
} from 'lucide-react';
import { useCRM } from './CRMContext';
import type { CRMLead, CRMNote, CRMTask, CRMMeeting, CRMReminder, StageConfig } from './CRMContext';
import { EmptyState } from './EmptyState';
import { AppointmentModal, ReminderModal } from './Modals';

export const LeadDetailPanel: React.FC = () => {
  const { 
    activeLeadId, 
    setActiveLeadId, 
    crmLeads, 
    updateLeadPriority, 
    deleteLead,
    notes,
    tasks,
    meetings,
    reminders,
    addMeeting,
    moveLeadStage,
    stages
  } = useCRM();

  const [activeTab, setActiveTab] = useState<'profile' | 'timeline' | 'notes' | 'tasks' | 'meetings' | 'followups'>('profile');
  
  // Modals visibility states
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);

  const lead = crmLeads.find(l => l.id === activeLeadId);

  if (!lead) {
    return (
      <div className="crm-details-placeholder-pane">
        <div className="placeholder-icon-circle">
          <User size={32} />
        </div>
        <h3>No Lead Selected</h3>
        <p>Select a prospect from the Sales Pipeline columns to review timeline data, tasks, notes, and activity files.</p>
      </div>
    );
  }

  // Get data filtered for this lead
  const leadNotes = notes.filter(n => n.leadId === lead.id);
  const leadTasks = tasks.filter(t => t.leadId === lead.id);
  const leadMeetings = meetings.filter(m => m.leadId === lead.id);
  const leadReminders = reminders.filter(r => r.leadId === lead.id);

  return (
    <div className="crm-lead-details-pane">
      
      {/* Pane Header */}
      <header className="crm-details-header">
        <div className="crm-details-avatar-row">
          {lead.profilePic ? (
            <img src={lead.profilePic} alt={lead.name} className="crm-details-avatar-img" />
          ) : (
            <div className="crm-details-avatar-placeholder" style={{ backgroundColor: `${lead.avatarColor}15`, color: lead.avatarColor }}>
              {lead.avatarText}
            </div>
          )}
          
          <div className="crm-details-name-meta">
            <h3>{lead.name}</h3>
            <p>{lead.positionLabel} @ {lead.postQuote.includes('OrbitFlow') ? 'OrbitFlow' : 'Vanguard Cargo'}</p>
          </div>
        </div>

        <div className="crm-details-header-controls">
          {/* Priority dropdown */}
          <select 
            value={lead.priority} 
            onChange={(e) => updateLeadPriority(lead.id, e.target.value as any)}
            className={`crm-details-priority-select priority-${lead.priority}`}
          >
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          {/* Delete lead */}
          <button 
            className="crm-details-delete-btn" 
            onClick={() => { if(confirm("Are you sure you want to delete this lead?")) deleteLead(lead.id); }}
            title="Remove Lead from CRM"
          >
            <Trash2 size={14} />
          </button>

          {/* Close Details panel */}
          <button className="crm-details-close-btn" onClick={() => setActiveLeadId(null)}>
            <X size={16} />
          </button>
        </div>
      </header>

      {/* Details Navigation Tabs */}
      <nav className="crm-details-tabs-nav">
        {[
          { key: 'profile', label: 'Profile', icon: User },
          { key: 'timeline', label: 'Timeline', icon: Sparkles },
          { key: 'notes', label: 'Notes', icon: FileText, count: leadNotes.length },
          { key: 'tasks', label: 'Tasks', icon: CheckSquare, count: leadTasks.filter(t => !t.completed).length },
          { key: 'meetings', label: 'Meetings', icon: Calendar, count: leadMeetings.length },
          { key: 'followups', label: 'Follow Ups', icon: Bell, count: leadReminders.filter(r => !r.completed).length }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              className={`crm-details-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key as any)}
            >
              <Icon size={12} />
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className="tab-count-badge">{tab.count}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Tabs Content Viewport */}
      <div className="crm-details-tab-content-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="crm-tab-scrollable-content"
          >
            {activeTab === 'profile' && (
              <ProfileTab 
                lead={lead} 
                addMeeting={addMeeting} 
                stages={stages} 
                moveLeadStage={moveLeadStage} 
              />
            )}
            {activeTab === 'timeline' && <TimelineTab lead={lead} meetings={leadMeetings} reminders={leadReminders} />}
            {activeTab === 'notes' && <NotesTab leadId={lead.id} notes={leadNotes} />}
            {activeTab === 'tasks' && <TasksTab leadId={lead.id} tasks={leadTasks} />}
            {activeTab === 'meetings' && (
              <MeetingsTab 
                meetings={leadMeetings} 
                onOpenSchedule={() => setShowMeetingModal(true)} 
              />
            )}
            {activeTab === 'followups' && (
              <FollowupsTab 
                reminders={leadReminders} 
                onOpenSchedule={() => setShowReminderModal(true)} 
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Appointment scheduling modal */}
      {showMeetingModal && (
        <AppointmentModal leadId={lead.id} onClose={() => setShowMeetingModal(false)} />
      )}

      {/* Reminder creation modal */}
      {showReminderModal && (
        <ReminderModal leadId={lead.id} onClose={() => setShowReminderModal(false)} />
      )}

    </div>
  );
};

/* ==================== PROFILE TAB ==================== */
const ProfileTab: React.FC<{ 
  lead: CRMLead; 
  addMeeting: any;
  stages: StageConfig[];
  moveLeadStage: (leadId: string, stage: any) => void;
}> = ({ lead, addMeeting, stages, moveLeadStage }) => {
  const currentStage = stages.find(s => s.key === lead.pipelineStage);

  return (
    <div className="crm-tab-profile">
      
      {/* AI Insight Header Card */}
      <div className="crm-ai-insight-card">
        <header className="ai-insight-header">
          <Sparkles size={14} className="sparkle-icon" />
          <span>Rixly AI Summary Insights</span>
        </header>
        
        <div className="ai-insight-body">
          <div className="insight-section">
            <h5>Buying Intent & Challenge</h5>
            <p>{lead.aiInsights?.intent || 'Lead matched problem statements regarding shipping congestions.'}</p>
          </div>
          <div className="insight-section">
            <h5>Pain Points Identified</h5>
            <p>{lead.aiInsights?.painPoints || 'Manual dispatcher dispatch tracking errors and lead loss.'}</p>
          </div>
          <div className="insight-section">
            <h5>Objections to Resolve</h5>
            <p>{lead.aiInsights?.objections || 'Concerns regarding platform sequence trigger delays.'}</p>
          </div>
          <div className="insight-section-highlight">
            <h5>Recommended Next Step</h5>
            <p>{lead.aiInsights?.nextStep || 'Present automated routing sequences proposal tier.'}</p>
            <button 
              className="crm-book-demo-btn"
              onClick={() => {
                addMeeting(
                  lead.id,
                  'Rixly Platform Live Demo Call',
                  new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  '02:00 PM',
                  '30 mins',
                  'meet',
                  'Live demonstration of automated Reddit & LinkedIn intent triggers.'
                );
              }}
            >
              <Calendar size={13} style={{ marginRight: 6 }} />
              Book Demo Call
            </button>
          </div>
        </div>
      </div>

      {/* Personal Info Grid */}
      <div className="crm-profile-info-grid">
        <div className="info-item">
          <label>Company</label>
          <span>{lead.postQuote.includes('OrbitFlow') ? 'OrbitFlow Inc' : 'Vanguard Cargo Group'}</span>
        </div>
        <div className="info-item">
          <label>Location</label>
          <div className="info-span-row">
            <MapPin size={11} />
            <span>{lead.locationLabel}</span>
          </div>
        </div>
        <div className="info-item">
          <label>Social Profile</label>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="info-link">
            <span>View {lead.platform === 'linkedin' ? 'LinkedIn' : 'Reddit'}</span>
            <ExternalLink size={11} />
          </a>
        </div>
        <div className="info-item">
          <label>Fit Score</label>
          <span style={{ color: 'var(--rixly-amber)', fontWeight: 'bold' }}>{lead.fitScore}% Score</span>
        </div>
        <div className="info-item">
          <label>CRM Stage</label>
          <select 
            value={lead.pipelineStage}
            onChange={(e) => moveLeadStage(lead.id, e.target.value)}
            className="crm-inline-stage-select"
            style={{ 
              color: currentStage?.color || '#3b82f6',
              borderColor: `${currentStage?.color || '#3b82f6'}40`
            }}
          >
            {stages.map(stage => (
              <option key={stage.key} value={stage.key}>
                {stage.label}
              </option>
            ))}
          </select>
        </div>
        <div className="info-item">
          <label>Date Added</label>
          <span>{lead.addedDate || 'Just Now'}</span>
        </div>
      </div>

      {/* Social post quote block */}
      <div className="crm-profile-quote-block">
        <label>DETECTED SOCIAL SIGNAL</label>
        <blockquote>"{lead.postQuote}"</blockquote>
        <span className="quote-source">Detected via Rixly {lead.platform === 'linkedin' ? 'LinkedIn' : 'Reddit'} Feed Monitor</span>
      </div>

    </div>
  );
};

/* ==================== TIMELINE TAB ==================== */
interface TimelineTabProps {
  lead: CRMLead;
  meetings: CRMMeeting[];
  reminders: CRMReminder[];
}

const TimelineTab: React.FC<TimelineTabProps> = ({ lead, meetings, reminders }) => {
  // Let's build a timeline of events
  const events = [
    { label: 'Lead Discovered', date: '12 days ago', desc: 'Rixly identified high-intent signal matching campaigns.', type: 'discovery' },
    { label: 'Added to CRM Pipeline', date: lead.addedDate || 'Just now', desc: 'User marked lead as contacted.', type: 'sync' }
  ];

  meetings.forEach(m => {
    events.push({
      label: `Meeting Booked: ${m.title}`,
      date: `${m.date} at ${m.time}`,
      desc: `Scheduled on ${m.platform.toUpperCase()}. Duration: ${m.duration}`,
      type: 'meeting'
    });
  });

  reminders.forEach(r => {
    events.push({
      label: `Reminder Configured: ${r.title}`,
      date: `${r.date} at ${r.time}`,
      desc: `Alert level: ${r.priority.toUpperCase()}`,
      type: 'reminder'
    });
  });

  return (
    <div className="crm-tab-timeline">
      <div className="timeline-trail-line" />
      
      {events.map((ev, i) => (
        <div className="timeline-event-card" key={i}>
          <div className="timeline-node-dot" />
          <div className="timeline-event-card-body-node">
            <div className="timeline-card-header-row">
              <h4>{ev.label}</h4>
              <span>{ev.date}</span>
            </div>
            <p>{ev.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ==================== NOTES TAB ==================== */
interface NotesTabProps {
  leadId: string;
  notes: CRMNote[];
}

const NotesTab: React.FC<NotesTabProps> = ({ leadId, notes }) => {
  const { addNote, togglePinNote, deleteNote } = useCRM();
  const [content, setContent] = useState('');
  const [search, setSearch] = useState('');

  const filteredNotes = notes.filter(n => n.content.toLowerCase().includes(search.toLowerCase()));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    addNote(leadId, content);
    setContent('');
  };

  return (
    <div className="crm-tab-notes">
      
      {/* Search and add block */}
      <form onSubmit={handleSave} className="crm-notes-input-form">
        <textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a new update note... (Objections resolved, proposal changes...)"
          required
          rows={2}
        />
        <div className="notes-actions-footer">
          <input 
            type="text" 
            placeholder="Search notes..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="notes-inline-search-input"
          />
          <button type="submit" className="crm-btn-primary notes-submit-btn">
            <Plus size={12} />
            <span>Add Note</span>
          </button>
        </div>
      </form>

      {/* Notes checklist */}
      <div className="crm-notes-list">
        {filteredNotes.length > 0 ? (
          filteredNotes.map(n => (
            <div className={`crm-note-item-card ${n.pinned ? 'pinned' : ''}`} key={n.id}>
              <div className="note-card-meta-row">
                <span>{n.timestamp}</span>
                <div className="note-card-actions">
                  <button onClick={() => togglePinNote(n.id)} className="note-icon-btn pin" title="Pin Note">
                    <Pin size={11} fill={n.pinned ? 'currentColor' : 'none'} />
                  </button>
                  <button onClick={() => deleteNote(n.id)} className="note-icon-btn delete" title="Delete Note">
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
              <p className="note-card-content">{n.content}</p>
            </div>
          ))
        ) : (
          <EmptyState icon={FileText} title="No Notes" description="Add notes to keep track of this prospect's sales details." />
        )}
      </div>

    </div>
  );
};

/* ==================== TASKS TAB ==================== */
interface TasksTabProps {
  leadId: string;
  tasks: CRMTask[];
}

const TasksTab: React.FC<TasksTabProps> = ({ leadId, tasks }) => {
  const { addTask, toggleTaskCompleted, deleteTask } = useCRM();
  
  const [taskTitle, setTaskTitle] = useState('');
  const [priority, setPriority] = useState<CRMTask['priority']>('medium');
  const [dueDate, setDueDate] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addTask(
      leadId,
      taskTitle,
      priority,
      dueDate || new Date().toISOString().split('T')[0],
      'Alia Bhatt'
    );
    setTaskTitle('');
    setDueDate('');
  };

  return (
    <div className="crm-tab-tasks">
      
      {/* Quick Add Form */}
      <form onSubmit={handleAddTask} className="crm-tasks-input-form">
        <input 
          type="text" 
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="New checklist item..."
          required
          className="tasks-inline-input"
        />
        <div className="tasks-inline-meta-row">
          <select value={priority} onChange={(e) => setPriority(e.target.value as any)}>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          <button type="submit" className="tasks-add-btn">
            <Plus size={13} />
          </button>
        </div>
      </form>

      {/* Task Checklist */}
      <div className="crm-tasks-checklist">
        {tasks.length > 0 ? (
          tasks.map(t => (
            <div className={`crm-task-item-row ${t.completed ? 'completed' : ''}`} key={t.id}>
              <div style={{ display: 'flex', alignContent: 'center', gap: 10, alignItems: 'center' }}>
                <button 
                  type="button" 
                  className={`task-checkbox-custom ${t.completed ? 'ticked' : ''}`}
                  onClick={() => toggleTaskCompleted(t.id)}
                >
                  {t.completed && <Check size={10} />}
                </button>
                <span className="task-title-lbl">{t.title}</span>
              </div>

              <div className="task-meta-right">
                <span className={`task-priority-pill p-${t.priority}`}>{t.priority}</span>
                <span className="task-due-lbl">{t.dueDate}</span>
                <button className="task-delete-icon-btn" onClick={() => deleteTask(t.id)}>
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <EmptyState icon={CheckSquare} title="All Caught Up" description="Create action items to keep your outbound progress on track." />
        )}
      </div>

    </div>
  );
};

/* ==================== MEETINGS TAB ==================== */
interface MeetingsTabProps {
  meetings: CRMMeeting[];
  onOpenSchedule: () => void;
}

const MeetingsTab: React.FC<MeetingsTabProps> = ({ meetings, onOpenSchedule }) => {
  const { deleteMeeting } = useCRM();

  return (
    <div className="crm-tab-meetings">
      <header className="tab-actions-header">
        <h4>Meetings Calendar</h4>
        <button className="crm-btn-primary" onClick={onOpenSchedule}>
          <Plus size={12} style={{ marginRight: 4 }} />
          <span>Book Call</span>
        </button>
      </header>

      <div className="crm-meetings-list">
        {meetings.length > 0 ? (
          meetings.map(m => (
            <div className="crm-meeting-card-item" key={m.id}>
              <div className="meeting-card-top-row">
                <div style={{ display: 'flex', alignContent: 'center', gap: 8, alignItems: 'center' }}>
                  <Calendar size={14} className="meeting-calendar-icon" />
                  <h5>{m.title}</h5>
                </div>
                <button className="meeting-delete-btn" onClick={() => deleteMeeting(m.id)}>
                  Cancel Call
                </button>
              </div>
              <div className="meeting-time-row">
                <span>{m.date}</span>
                <span className="time-separator">•</span>
                <span>{m.time}</span>
                <span className="time-separator">•</span>
                <span>{m.duration}</span>
              </div>
              <div className="meeting-platform-badge font-blue">
                <span>Platform: {m.platform.toUpperCase()} Video Call</span>
              </div>
              {m.notes && <p className="meeting-notes-text"><strong>Agenda:</strong> {m.notes}</p>}
            </div>
          ))
        ) : (
          <EmptyState icon={Calendar} title="No Meetings Booked" description="Schedule platforms meetings (Zoom, Meet, Teams) with this prospect." />
        )}
      </div>
    </div>
  );
};

/* ==================== FOLLOW UPS TAB ==================== */
interface FollowupsTabProps {
  reminders: CRMReminder[];
  onOpenSchedule: () => void;
}

const FollowupsTab: React.FC<FollowupsTabProps> = ({ reminders, onOpenSchedule }) => {
  const { toggleReminderCompleted, deleteReminder } = useCRM();

  const getPriorityClass = (priority: CRMReminder['priority']) => {
    switch (priority) {
      case 'high': return 'priority-high-bg';
      case 'medium': return 'priority-med-bg';
      case 'low': return 'priority-low-bg';
      default: return '';
    }
  };

  return (
    <div className="crm-tab-followups">
      <header className="tab-actions-header">
        <h4>Follow-up Reminders</h4>
        <button className="crm-btn-primary" onClick={onOpenSchedule} style={{ background: '#f59e0b', color: '#000000' }}>
          <Plus size={12} style={{ marginRight: 4 }} />
          <span>Add Reminder</span>
        </button>
      </header>

      <div className="crm-reminders-list">
        {reminders.length > 0 ? (
          reminders.map(r => (
            <div className={`crm-reminder-item-card ${r.completed ? 'completed' : ''}`} key={r.id}>
              <div className="reminder-header-row">
                <div style={{ display: 'flex', alignContent: 'center', gap: 10, alignItems: 'center' }}>
                  <button 
                    type="button" 
                    className={`task-checkbox-custom ${r.completed ? 'ticked' : ''}`}
                    onClick={() => toggleReminderCompleted(r.id)}
                  >
                    {r.completed && <Check size={10} />}
                  </button>
                  <h5 className="reminder-title-label">{r.title}</h5>
                </div>
                <span className={`reminder-priority-dot ${getPriorityClass(r.priority)}`} />
              </div>
              <div className="reminder-details-footer">
                <div className="reminder-time-box">
                  <Calendar size={10} />
                  <span>{r.date} at {r.time}</span>
                </div>
                <button className="reminder-delete-btn" onClick={() => deleteReminder(r.id)}>
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <EmptyState icon={Bell} title="No Reminders Set" description="Create action alerts to make sure you never miss follow-ups." />
        )}
      </div>
    </div>
  );
};