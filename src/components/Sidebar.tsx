import { 
  LayoutDashboard, 
  Inbox, 
  Archive, 
  BookOpen,
  Menu,
  ChevronLeft,
  Layers
} from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  crmCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  crmCount = 0
}) => {
  return (
    <aside className={`lifestats-sidebar-capsule ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      
      {/* Top Section: Brand Logo & Toggle Button */}
      <div className="sidebar-brand-row">
        <div className="sidebar-logo-group">
          <img src="/logo.png" alt="Rixly Logo" className="sidebar-logo-img" />
          {!isCollapsed && <span className="brand-text">RIXLY</span>}
        </div>
        
        {!isCollapsed && (
          <button 
            className="sidebar-brand-toggle-btn"
            onClick={() => setIsCollapsed(true)}
            title="Collapse Sidebar"
          >
            <ChevronLeft size={14} />
          </button>
        )}
      </div>

      {/* Collapse Menu Trigger (Only when collapsed) */}
      {isCollapsed && (
        <button 
          className="sidebar-collapsed-trigger-btn"
          onClick={() => setIsCollapsed(false)}
          title="Expand Sidebar"
        >
          <Menu size={16} />
        </button>
      )}

      {/* Navigation Buttons List */}
      <div className="sidebar-icons-col">
        <button 
          className={`sidebar-icon-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
          title="Dashboard"
        >
          <LayoutDashboard size={18} className="icon-shrink" />
          {!isCollapsed && <span className="sidebar-btn-label">Dashboard</span>}
        </button>

        {/* Header Tab Group: Leads */}
        <div className="sidebar-section-header">
          {!isCollapsed ? <span>Leads</span> : <div className="sidebar-header-divider" />}
        </div>

        <button 
          className={`sidebar-icon-btn ${activeTab === 'leads' ? 'active' : ''}`}
          onClick={() => setActiveTab('leads')}
          title="Leads Responses"
        >
          <Inbox size={18} className="icon-shrink" />
          {!isCollapsed && <span className="sidebar-btn-label">Leads Feed</span>}
        </button>

        <button 
          className={`sidebar-icon-btn ${activeTab === 'crm' ? 'active' : ''}`}
          onClick={() => setActiveTab('crm')}
          title="CRM Workspace"
          style={{ position: 'relative' }}
        >
          <Layers size={18} className="icon-shrink" />
          {!isCollapsed && <span className="sidebar-btn-label">CRM</span>}
          {crmCount > 0 && (
            <span style={{
              position: 'absolute',
              right: isCollapsed ? 6 : 14,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'var(--rixly-blue)',
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: 'bold',
              minWidth: '16px',
              height: '16px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
            }}>
              {crmCount}
            </span>
          )}
        </button>

        <button 
          className={`sidebar-icon-btn ${activeTab === 'archived' ? 'active' : ''}`}
          onClick={() => setActiveTab('archived')}
          title="Archived Logs"
        >
          <Archive size={18} className="icon-shrink" />
          {!isCollapsed && <span className="sidebar-btn-label">Archived</span>}
        </button>

        {/* Header Tab Group: Resources */}
        <div className="sidebar-section-header">
          {!isCollapsed ? <span>Resources</span> : <div className="sidebar-header-divider" />}
        </div>

        <button 
          className={`sidebar-icon-btn ${activeTab === 'playbook' ? 'active' : ''}`}
          onClick={() => setActiveTab('playbook')}
          title="Playbooks"
        >
          <BookOpen size={18} className="icon-shrink" />
          {!isCollapsed && <span className="sidebar-btn-label">Playbook</span>}
        </button>
      </div>

      {/* Spacer or Middle Progress Widget */}
      <div className="sidebar-middle-widget">
        {!isCollapsed && (
          <div className="sidebar-progress-widget">
            <div className="progress-labels">
              <span className="progress-title">Daily Scans</span>
              <span className="progress-count">86/100</span>
            </div>
            <div className="progress-track-rail">
              <div className="progress-track-fill" style={{ width: '86%' }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Section: Profile Avatar & Account details */}
      <div className="sidebar-profile-section">
        <div className="sidebar-profile-card">
          <div className="profile-avatar-circle">
            <span>AB</span>
            <span className="avatar-active-indicator"></span>
          </div>
          
          {!isCollapsed && (
            <div className="profile-details-labels">
              <span className="profile-name">Alia Bhatt</span>
              <span className="profile-role">Premium Outbound</span>
            </div>
          )}
        </div>
      </div>

    </aside>
  );
};
