import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Bell } from 'lucide-react';
import { useCRM } from './CRMContext';

interface ModalProps {
  leadId: string;
  onClose: () => void;
}

export const AppointmentModal: React.FC<ModalProps> = ({ leadId, onClose }) => {
  const { addMeeting } = useCRM();
  
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('14:00');
  const [duration, setDuration] = useState('30 mins');
  const [platform, setPlatform] = useState<'meet' | 'zoom' | 'teams' | 'offline'>('zoom');
  const [notes, setNotes] = useState('');
  const [reminder, setReminder] = useState(true);

  // Close on Escape, save on Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addMeeting(leadId, title, date, time, duration, platform, notes);
    onClose();
  };

  return (
    <div className="crm-modal-overlay" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="crm-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="crm-modal-header">
          <div style={{ display: 'flex', alignContent: 'center', gap: 8, alignItems: 'center' }}>
            <Calendar size={16} className="crm-modal-title-icon-blue" />
            <h3 style={{ margin: 0 }}>Schedule Appointment</h3>
          </div>
          <button className="crm-modal-close-icon-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </header>

        <form onSubmit={handleSave} className="crm-modal-form">
          <div className="crm-form-group">
            <label>Meeting Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="e.g. Platform Demo & Sequence Strategy" 
              required
              autoFocus
            />
          </div>

          <div className="crm-form-row">
            <div className="crm-form-group" style={{ flex: 1 }}>
              <label>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="crm-form-group" style={{ flex: 1 }}>
              <label>Time</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
            </div>
          </div>

          <div className="crm-form-row">
            <div className="crm-form-group" style={{ flex: 1 }}>
              <label>Duration</label>
              <select value={duration} onChange={(e) => setDuration(e.target.value)}>
                <option value="15 mins">15 mins</option>
                <option value="30 mins">30 mins</option>
                <option value="45 mins">45 mins</option>
                <option value="1 hour">1 hour</option>
              </select>
            </div>
            <div className="crm-form-group" style={{ flex: 1 }}>
              <label>Platform</label>
              <select value={platform} onChange={(e) => setPlatform(e.target.value as any)}>
                <option value="zoom">Zoom Video</option>
                <option value="meet">Google Meet</option>
                <option value="teams">Microsoft Teams</option>
                <option value="offline">Offline / In-person</option>
              </select>
            </div>
          </div>

          <div className="crm-form-group">
            <label>Notes (Optional)</label>
            <textarea 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              placeholder="Agenda outline, core topics, objections to resolve..."
              rows={3}
            />
          </div>

          <div className="crm-form-checkbox-row">
            <input 
              type="checkbox" 
              id="reminder-toggle" 
              checked={reminder} 
              onChange={(e) => setReminder(e.target.checked)} 
            />
            <label htmlFor="reminder-toggle">Set automated follow-up reminder 15m before</label>
          </div>

          <footer className="crm-modal-footer">
            <button type="button" className="crm-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="crm-btn-primary">
              Schedule Meeting
            </button>
          </footer>
        </form>
      </motion.div>
    </div>
  );
};

export const ReminderModal: React.FC<ModalProps> = ({ leadId, onClose }) => {
  const { addReminder } = useCRM();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('09:00');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [repeat, setRepeat] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addReminder(leadId, title, date, time, priority, repeat);
    onClose();
  };

  return (
    <div className="crm-modal-overlay" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="crm-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="crm-modal-header">
          <div style={{ display: 'flex', alignContent: 'center', gap: 8, alignItems: 'center' }}>
            <Bell size={16} className="crm-modal-title-icon-amber" />
            <h3 style={{ margin: 0 }}>Add Reminder</h3>
          </div>
          <button className="crm-modal-close-icon-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </header>

        <form onSubmit={handleSave} className="crm-modal-form">
          <div className="crm-form-group">
            <label>Reminder Text</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="e.g. Email Sofia Lopez regarding proposal feedback" 
              required
              autoFocus
            />
          </div>

          <div className="crm-form-row">
            <div className="crm-form-group" style={{ flex: 1 }}>
              <label>Due Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="crm-form-group" style={{ flex: 1 }}>
              <label>Time</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
            </div>
          </div>

          <div className="crm-form-row">
            <div className="crm-form-group" style={{ flex: 1 }}>
              <label>Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as any)}>
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
            <div className="crm-form-group" style={{ flex: 1 }}>
              <label>Repeat Cycle</label>
              <select value={repeat} onChange={(e) => setRepeat(e.target.value as any)}>
                <option value="none">No Repeat</option>
                <option value="daily">Every Day</option>
                <option value="weekly">Every Week</option>
                <option value="monthly">Every Month</option>
              </select>
            </div>
          </div>

          <footer className="crm-modal-footer" style={{ marginTop: 24 }}>
            <button type="button" className="crm-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="crm-btn-primary" style={{ background: '#f59e0b', color: '#000000' }}>
              Set Reminder
            </button>
          </footer>
        </form>
      </motion.div>
    </div>
  );
};