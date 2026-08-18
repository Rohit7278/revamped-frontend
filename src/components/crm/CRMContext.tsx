import React, { createContext, useContext, useState, useEffect } from 'react';

export type CRMPipelineStageKey = 
  | 'new-leads' 
  | 'contacted' 
  | 'appointment-booked' 
  | 'demo-completed' 
  | 'closed-won' 
  | 'closed-lost'
  | string;

export interface StageConfig {
  key: string;
  label: string;
  color: string;
}

export const DEFAULT_CRM_STAGES: StageConfig[] = [
  { key: 'new-leads', label: 'New leads', color: '#64748b' },
  { key: 'contacted', label: 'Contacted', color: '#3b82f6' },
  { key: 'appointment-booked', label: 'Appointment booked', color: '#f59e0b' },
  { key: 'demo-completed', label: 'Demo completed', color: '#10b981' },
  { key: 'closed-won', label: 'Closed Won', color: '#22c55e' },
  { key: 'closed-lost', label: 'Closed Lost', color: '#ef4444' }
];

export interface CRMLead {
  id: string;
  name: string;
  avatarText: string;
  avatarColor: string;
  timeLabel: string;
  category: 'owner' | 'seeker' | 'match' | 'aware';
  categoryLabel: string;
  postQuote: string;
  flameSignal: string;
  position: 'vp' | 'director' | 'founder' | 'manager';
  positionLabel: string;
  location: 'ny' | 'sf' | 'london' | 'chicago' | 'toronto';
  locationLabel: string;
  platform: 'linkedin' | 'reddit';
  fitScore: number;
  profilePic?: string;
  timestamp: number;
  status: 'contacted';
  pipelineStage: CRMPipelineStageKey;
  priority: 'low' | 'medium' | 'high';
  lastActivity: string;
  nextFollowUp: string;
  tags?: string[];
  addedDate: string;
  aiInsights?: {
    intent: string;
    painPoints: string;
    suggestedOutreach: string;
    objections: string;
    nextStep: string;
  };
}

export interface CRMNote {
  id: string;
  leadId: string;
  content: string;
  timestamp: string;
  pinned: boolean;
}

export interface CRMTask {
  id: string;
  leadId: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignedTo: string;
}

export interface CRMMeeting {
  id: string;
  leadId: string;
  title: string;
  time: string;
  date: string;
  duration: string;
  platform: 'meet' | 'zoom' | 'teams' | 'offline';
  notes?: string;
}

export interface CRMReminder {
  id: string;
  leadId: string;
  title: string;
  date: string;
  time: string;
  priority: 'low' | 'medium' | 'high';
  repeat: 'none' | 'daily' | 'weekly' | 'monthly';
  completed: boolean;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface CRMContextType {
  crmLeads: CRMLead[];
  activeLeadId: string | null;
  setActiveLeadId: (id: string | null) => void;
  moveLeadStage: (leadId: string, stage: CRMPipelineStageKey) => void;
  updateLeadPriority: (leadId: string, priority: CRMLead['priority']) => void;
  deleteLead: (leadId: string) => void;
  addLeadToCRM: (lead: any) => void;

  // Stages configuration & reordering
  stages: StageConfig[];
  setStages: React.Dispatch<React.SetStateAction<StageConfig[]>>;
  reorderStages: (fromIndex: number, toIndex: number) => void;
  moveStageDirection: (stageKey: string, direction: 'left' | 'right') => void;
  resetStages: () => void;
  
  notes: CRMNote[];
  addNote: (leadId: string, content: string) => void;
  togglePinNote: (noteId: string) => void;
  deleteNote: (noteId: string) => void;
  
  tasks: CRMTask[];
  addTask: (leadId: string, title: string, priority: CRMTask['priority'], dueDate: string, assignedTo: string) => void;
  toggleTaskCompleted: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  
  meetings: CRMMeeting[];
  addMeeting: (leadId: string, title: string, date: string, time: string, duration: string, platform: CRMMeeting['platform'], notes?: string) => void;
  deleteMeeting: (meetingId: string) => void;
  
  reminders: CRMReminder[];
  addReminder: (leadId: string, title: string, date: string, time: string, priority: CRMReminder['priority'], repeat: CRMReminder['repeat']) => void;
  toggleReminderCompleted: (reminderId: string) => void;
  deleteReminder: (reminderId: string) => void;
  
  toasts: ToastMessage[];
  addToast: (message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: {
    status: string;
    fitScore: string;
    source: string;
    priority: string;
    stage: string;
    meetingScheduled: boolean;
    reminderPending: boolean;
  };
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

// Normalizes legacy stage keys to the 6 defined stages
const normalizeStage = (stageKey?: string): string => {
  if (!stageKey) return 'new-leads';
  const key = stageKey.toLowerCase();
  if (key === 'new-contact' || key === 'new-leads' || key === 'new') return 'new-leads';
  if (key === 'first-outreach' || key === 'outreach' || key === 'follow-up' || key === 'contacted') return 'contacted';
  if (key === 'meeting-scheduled' || key === 'appointment-booked' || key === 'appointment') return 'appointment-booked';
  if (key === 'demo-completed' || key === 'demo' || key === 'proposal-sent' || key === 'proposal' || key === 'negotiation') return 'demo-completed';
  if (key === 'won' || key === 'closed-won') return 'closed-won';
  if (key === 'lost' || key === 'closed-lost') return 'closed-lost';
  return stageKey;
};

const INITIAL_CRM_LEADS: CRMLead[] = [];

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Stages state with local persistence
  const [stages, setStages] = useState<StageConfig[]>(() => {
    const saved = localStorage.getItem('rixly_crm_stages');
    if (saved) {
      try {
        const parsed: StageConfig[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const filtered = parsed.filter(s => s.key !== 'negotiation');
          if (filtered.length > 0) return filtered;
        }
      } catch (e) {}
    }
    return DEFAULT_CRM_STAGES;
  });

  const [crmLeads, setCrmLeads] = useState<CRMLead[]>(() => {
    const saved = localStorage.getItem('rixly_crm_leads');
    if (saved) {
      try {
        const parsed: CRMLead[] = JSON.parse(saved);
        // Filter out default mock profiles so CRM starts completely clean
        const filtered = parsed.filter(l => !l.id.startsWith('crm-default-'));
        return filtered.map(lead => ({
          ...lead,
          pipelineStage: normalizeStage(lead.pipelineStage)
        }));
      } catch (e) {}
    }
    return INITIAL_CRM_LEADS;
  });

  const [notes, setNotes] = useState<CRMNote[]>(() => {
    const saved = localStorage.getItem('rixly_crm_notes');
    if (saved) {
      try {
        const parsed: CRMNote[] = JSON.parse(saved);
        return parsed.filter(n => !n.leadId.startsWith('crm-default-'));
      } catch (e) {}
    }
    return [];
  });

  const [tasks, setTasks] = useState<CRMTask[]>(() => {
    const saved = localStorage.getItem('rixly_crm_tasks');
    if (saved) {
      try {
        const parsed: CRMTask[] = JSON.parse(saved);
        return parsed.filter(t => !t.leadId.startsWith('crm-default-'));
      } catch (e) {}
    }
    return [];
  });

  const [meetings, setMeetings] = useState<CRMMeeting[]>(() => {
    const saved = localStorage.getItem('rixly_crm_meetings');
    if (saved) {
      try {
        const parsed: CRMMeeting[] = JSON.parse(saved);
        return parsed.filter(m => !m.leadId.startsWith('crm-default-'));
      } catch (e) {}
    }
    return [];
  });

  const [reminders, setReminders] = useState<CRMReminder[]>(() => {
    const saved = localStorage.getItem('rixly_crm_reminders');
    if (saved) {
      try {
        const parsed: CRMReminder[] = JSON.parse(saved);
        return parsed.filter(r => !r.leadId.startsWith('crm-default-'));
      } catch (e) {}
    }
    return [];
  });

  const [activeLeadId, setActiveLeadId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filters, setFilters] = useState({
    status: 'all',
    fitScore: 'all',
    source: 'all',
    priority: 'all',
    stage: 'all',
    meetingScheduled: false,
    reminderPending: false
  });

  useEffect(() => {
    localStorage.setItem('rixly_crm_stages', JSON.stringify(stages));
  }, [stages]);

  useEffect(() => {
    localStorage.setItem('rixly_crm_leads', JSON.stringify(crmLeads));
  }, [crmLeads]);

  useEffect(() => {
    localStorage.setItem('rixly_crm_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('rixly_crm_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('rixly_crm_meetings', JSON.stringify(meetings));
  }, [meetings]);

  useEffect(() => {
    localStorage.setItem('rixly_crm_reminders', JSON.stringify(reminders));
  }, [reminders]);

  const addToast = (message: string, type: ToastMessage['type'] = 'success') => {
    const newToast = { id: Date.now().toString(), message, type };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Reordering stages methods
  const reorderStages = (fromIndex: number, toIndex: number) => {
    if (fromIndex < 0 || fromIndex >= stages.length || toIndex < 0 || toIndex >= stages.length || fromIndex === toIndex) return;
    setStages(prev => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
    addToast('Pipeline stage order updated', 'info');
  };

  const moveStageDirection = (stageKey: string, direction: 'left' | 'right') => {
    const idx = stages.findIndex(s => s.key === stageKey);
    if (idx === -1) return;
    const targetIdx = direction === 'left' ? idx - 1 : idx + 1;
    if (targetIdx >= 0 && targetIdx < stages.length) {
      reorderStages(idx, targetIdx);
    }
  };

  const resetStages = () => {
    setStages(DEFAULT_CRM_STAGES);
    addToast('Stage sequence reset to default', 'info');
  };

  const moveLeadStage = (leadId: string, stage: CRMPipelineStageKey) => {
    const normalized = normalizeStage(stage);
    const stageObj = stages.find(s => s.key === normalized);
    const stageLabel = stageObj ? stageObj.label : normalized.replace('-', ' ');

    setCrmLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        return { 
          ...lead, 
          pipelineStage: normalized,
          lastActivity: `Moved to ${stageLabel}`
        };
      }
      return lead;
    }));
    addToast(`Lead stage updated to ${stageLabel}`);
  };

  const updateLeadPriority = (leadId: string, priority: CRMLead['priority']) => {
    setCrmLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, priority } : lead
    ));
    addToast(`Priority changed to ${priority.toUpperCase()}`);
  };

  const deleteLead = (leadId: string) => {
    setCrmLeads(prev => prev.filter(l => l.id !== leadId));
    if (activeLeadId === leadId) setActiveLeadId(null);
    addToast('Lead successfully removed from CRM', 'warning');
  };

  const addLeadToCRM = (lead: any) => {
    if (!lead) return;
    const newLead: CRMLead = {
      ...lead,
      id: lead.id || `crm-${Date.now()}`,
      name: lead.name || 'Qualified Lead',
      avatarText: lead.avatarText || (lead.name ? lead.name.slice(0, 2).toUpperCase() : 'QL'),
      avatarColor: lead.avatarColor || '#3b82f6',
      timeLabel: lead.timeLabel || 'Just now',
      category: lead.category || 'seeker',
      categoryLabel: lead.categoryLabel || 'Solution Seeker',
      postQuote: lead.postQuote || '',
      flameSignal: lead.flameSignal || 'High Intent',
      position: lead.position || 'vp',
      positionLabel: lead.positionLabel || lead.title || 'Decision Maker',
      location: lead.location || 'ny',
      locationLabel: lead.locationLabel || lead.company || 'United States',
      platform: lead.platform || 'linkedin',
      fitScore: lead.fitScore || 90,
      profilePic: lead.profilePic,
      timestamp: lead.timestamp || Date.now(),
      status: 'contacted',
      pipelineStage: 'contacted',
      priority: lead.priority || 'medium',
      lastActivity: 'Marked Contacted & added to CRM',
      nextFollowUp: 'Tomorrow',
      addedDate: new Date().toISOString().split('T')[0],
      aiInsights: lead.aiInsights || {
        intent: lead.flameSignal || lead.intent || 'Evaluating campaign tools.',
        painPoints: 'Inefficient outbound manual lookup pipelines.',
        suggestedOutreach: 'Pitch personalized triggers built directly from public post.',
        objections: 'Implementation timeline constraints.',
        nextStep: 'Schedule 15 mins discovery review.'
      }
    };
    
    setCrmLeads(prev => {
      const filtered = prev.filter(l => l.id !== newLead.id);
      const updated = [newLead, ...filtered];
      localStorage.setItem('rixly_crm_leads', JSON.stringify(updated));
      return updated;
    });

    addToast(`${newLead.name} marked contacted & added to CRM!`, 'success');
  };

  const addNote = (leadId: string, content: string) => {
    const newNote = {
      id: Date.now().toString(),
      leadId,
      content,
      timestamp: new Date().toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      pinned: false
    };
    setNotes(prev => [newNote, ...prev]);
    addToast('Note created successfully');
  };

  const togglePinNote = (noteId: string) => {
    setNotes(prev => prev.map(n => n.id === noteId ? { ...n, pinned: !n.pinned } : n));
  };

  const deleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(n => n.id !== noteId));
    addToast('Note deleted', 'info');
  };

  const addTask = (leadId: string, title: string, priority: CRMTask['priority'], dueDate: string, assignedTo: string) => {
    const newTask = {
      id: Date.now().toString(),
      leadId,
      title,
      completed: false,
      priority,
      dueDate,
      assignedTo
    };
    setTasks(prev => [newTask, ...prev]);
    addToast('Task added to checklist');
  };

  const toggleTaskCompleted = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextState = !t.completed;
        addToast(nextState ? 'Task completed' : 'Task reopened', 'info');
        return { ...t, completed: nextState };
      }
      return t;
    }));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    addToast('Task removed', 'warning');
  };

  const addMeeting = (leadId: string, title: string, date: string, time: string, duration: string, platform: CRMMeeting['platform'], notes?: string) => {
    const newMeeting = {
      id: Date.now().toString(),
      leadId,
      title,
      date,
      time,
      duration,
      platform,
      notes
    };
    setMeetings(prev => [newMeeting, ...prev]);
    
    // Update lead's next follow up and last activity & stage
    setCrmLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const currentStage = l.pipelineStage;
        const nextStage = (currentStage === 'new-leads' || currentStage === 'contacted')
          ? 'appointment-booked' 
          : currentStage;

        return {
          ...l,
          lastActivity: `Meeting scheduled: ${title}`,
          nextFollowUp: `Meeting on ${date} at ${time}`,
          pipelineStage: nextStage
        };
      }
      return l;
    }));
    
    addToast('Meeting scheduled successfully');
  };

  const deleteMeeting = (meetingId: string) => {
    setMeetings(prev => prev.filter(m => m.id !== meetingId));
    addToast('Meeting cancelled', 'warning');
  };

  const addReminder = (leadId: string, title: string, date: string, time: string, priority: CRMReminder['priority'], repeat: CRMReminder['repeat']) => {
    const newReminder = {
      id: Date.now().toString(),
      leadId,
      title,
      date,
      time,
      priority,
      repeat,
      completed: false
    };
    setReminders(prev => [newReminder, ...prev]);
    addToast('Reminder created');
  };

  const toggleReminderCompleted = (reminderId: string) => {
    setReminders(prev => prev.map(r => r.id === reminderId ? { ...r, completed: !r.completed } : r));
    addToast('Reminder toggled', 'info');
  };

  const deleteReminder = (reminderId: string) => {
    setReminders(prev => prev.filter(r => r.id !== reminderId));
    addToast('Reminder removed', 'warning');
  };

  return (
    <CRMContext.Provider value={{
      crmLeads,
      activeLeadId,
      setActiveLeadId,
      moveLeadStage,
      updateLeadPriority,
      deleteLead,
      addLeadToCRM,

      stages,
      setStages,
      reorderStages,
      moveStageDirection,
      resetStages,
      
      notes,
      addNote,
      togglePinNote,
      deleteNote,
      
      tasks,
      addTask,
      toggleTaskCompleted,
      deleteTask,
      
      meetings,
      addMeeting,
      deleteMeeting,
      
      reminders,
      addReminder,
      toggleReminderCompleted,
      deleteReminder,
      
      toasts,
      addToast,
      removeToast,

      searchQuery,
      setSearchQuery,
      filters,
      setFilters,
      sortBy,
      setSortBy
    }}>
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) throw new Error('useCRM must be used within a CRMProvider');
  return context;
};