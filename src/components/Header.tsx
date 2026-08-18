import React, { useState, useEffect, useRef } from 'react';
import { 
  Sun, 
  Moon, 
  ChevronDown, 
  User, 
  LogOut, 
  Plus, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Sliders, 
  Layers, 
  Check
} from 'lucide-react';
import './Header.css';

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  timeRange: string;
  setTimeRange: (range: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenProfile?: () => void;
  onOpenProjectSettings?: () => void;
  onOpenCreateProject?: () => void;
}

export const getLoggedInUserProfile = () => {
  // Check rixly_user_profile
  try {
    const p = localStorage.getItem('rixly_user_profile');
    if (p) {
      const parsed = JSON.parse(p);
      if (parsed.firstName || parsed.lastName || parsed.name) {
        return {
          firstName: parsed.firstName || parsed.name?.split(' ')[0] || 'Alia',
          lastName: parsed.lastName || parsed.name?.split(' ').slice(1).join(' ') || 'Bhatt',
          email: parsed.email || 'alia.bhatt@rixly.app',
          avatarText: parsed.avatarText || `${(parsed.firstName || 'A')[0]}${(parsed.lastName || 'B')[0]}`,
          avatarColor: parsed.avatarColor || '#78350f',
          avatarImage: parsed.avatarImage
        };
      }
    }
  } catch (e) {}

  // Check fallback user / currentUser
  try {
    const rawUser = localStorage.getItem('currentUser') || localStorage.getItem('user') || localStorage.getItem('rixly_user');
    if (rawUser) {
      const parsed = JSON.parse(rawUser);
      const fullName = parsed.name || parsed.displayName || parsed.fullName || '';
      const parts = fullName.trim().split(' ');
      const fName = parsed.firstName || parts[0] || 'Alia';
      const lName = parsed.lastName || parts.slice(1).join(' ') || 'Bhatt';
      return {
        firstName: fName,
        lastName: lName,
        email: parsed.email || `${fName.toLowerCase()}@rixly.app`,
        avatarText: `${fName[0] || 'A'}${lName[0] || 'B'}`,
        avatarColor: parsed.avatarColor || '#78350f',
        avatarImage: parsed.avatarImage || parsed.photoURL || parsed.avatar
      };
    }
  } catch (e) {}

  return {
    firstName: 'Alia',
    lastName: 'Bhatt',
    email: 'alia.bhatt@rixly.app',
    avatarText: 'AB',
    avatarColor: '#78350f',
    avatarImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200'
  };
};

export const Header: React.FC<HeaderProps> = ({ 
  theme,
  toggleTheme,
  timeRange,
  setTimeRange,
  setActiveTab,
  onOpenProfile,
  onOpenProjectSettings,
  onOpenCreateProject
}) => {
  const [selectedAccount, setSelectedAccount] = useState('Black Buck V2');
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Click outside refs
  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const settingsDropdownRef = useRef<HTMLDivElement>(null);
  
  const [accountList, setAccountList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('rixly_projects');
      if (saved) {
        const parsed = JSON.parse(saved);
        const names = parsed.map((p: any) => p.name).filter(Boolean);
        if (names.length > 0) {
          return Array.from(new Set([...names, 'Black Buck V2', 'Startup Alpha', 'Enterprise Test']));
        }
      }
    } catch (e) {}
    return ['Black Buck V2', 'Startup Alpha', 'Enterprise Test'];
  });
  
  // User Profile state for dynamic header avatar and greeting
  const [userProfile, setUserProfile] = useState(getLoggedInUserProfile);

  // Global click outside listener to close dropdowns anywhere
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(target)) {
        setShowAccountDropdown(false);
      }
      if (datePickerRef.current && !datePickerRef.current.contains(target)) {
        setShowDatePicker(false);
      }
      if (settingsDropdownRef.current && !settingsDropdownRef.current.contains(target)) {
        setShowSettingsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleProfileUpdate = (e: any) => {
      if (e.detail) {
        setUserProfile(prev => ({
          ...prev,
          ...e.detail
        }));
      } else {
        setUserProfile(getLoggedInUserProfile());
      }
    };

    const handleProjectCreated = (e: any) => {
      if (e.detail && e.detail.name) {
        setAccountList(prev => Array.from(new Set([e.detail.name, ...prev])));
        setSelectedAccount(e.detail.name);
      }
    };

    window.addEventListener('rixly_profile_updated', handleProfileUpdate);
    window.addEventListener('rixly_project_created', handleProjectCreated);
    window.addEventListener('storage', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('rixly_profile_updated', handleProfileUpdate);
      window.removeEventListener('rixly_project_created', handleProjectCreated);
      window.removeEventListener('storage', handleProfileUpdate);
    };
  }, []);
  
  // Custom Date Range Picker states
  const [calendarYear, setCalendarYear] = useState(2026);
  const [calendarMonth, setCalendarMonth] = useState(7); // August (0-indexed)
  const [rangeStart, setRangeStart] = useState<Date | null>(new Date(2026, 7, 1));
  const [rangeEnd, setRangeEnd] = useState<Date | null>(new Date(2026, 7, 31));
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const formatDateString = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const handleDayClick = (dayDate: Date) => {
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(dayDate);
      setRangeEnd(null);
    } else if (rangeStart && !rangeEnd) {
      if (dayDate < rangeStart) {
        setRangeStart(dayDate);
      } else {
        setRangeEnd(dayDate);
      }
    }
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (calendarMonth === 0) {
        setCalendarMonth(11);
        setCalendarYear(prev => prev - 1);
      } else {
        setCalendarMonth(prev => prev - 1);
      }
    } else {
      if (calendarMonth === 11) {
        setCalendarMonth(0);
        setCalendarYear(prev => prev + 1);
      } else {
        setCalendarMonth(prev => prev + 1);
      }
    }
  };

  // Calendar Grid builder
  const calendarDays: (Date | null)[] = [];
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDayIndex = new Date(calendarYear, calendarMonth, 1).getDay();

  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(new Date(calendarYear, calendarMonth, i));
  }

  const hasCreatedProjects = (() => {
    try {
      const saved = localStorage.getItem('rixly_projects');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) && parsed.length > 0;
      }
    } catch (e) {}
    return false;
  })();

  const handleCreateProject = () => {
    setShowAccountDropdown(false);
    if (onOpenCreateProject) {
      onOpenCreateProject();
    } else {
      window.history.pushState({}, '', '/create-project');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <header className="lifestats-header modern-navbar">
      
      {/* Left: Dynamic User Welcome */}
      <div className="header-title-block">
        <div className="header-welcome-row-inline">
          <h1 className="lifestats-main-title">
            Welcome, {userProfile.firstName} {userProfile.lastName}!
          </h1>
        </div>
      </div>

      {/* Right Controls: Project Switcher or Create Project CTA, Time Filter, Theme, User Profile */}
      <div className="header-right-actions">
        
        {/* If newly signed in and has no projects yet, show prominent Create Project CTA button */}
        {!hasCreatedProjects ? (
          <button 
            type="button"
            className="navbar-create-project-primary-btn" 
            onClick={handleCreateProject}
            title="Create your first project"
          >
            <Plus size={13} />
            <span>Create Project</span>
          </button>
        ) : (
          /* Project Selector Dropdown for existing projects */
          <div className="lifestats-account-switcher" ref={accountDropdownRef}>
            <button 
              className={`lifestats-switcher-btn ${showAccountDropdown ? 'active' : ''}`} 
              onClick={() => setShowAccountDropdown(!showAccountDropdown)}
              title="Switch Active Project"
            >
              <Layers size={13} className="switcher-prefix-icon" />
              <span className="switcher-project-name">{selectedAccount}</span>
              <ChevronDown size={12} className={`chevron-icon ${showAccountDropdown ? 'rotated' : ''}`} />
            </button>

            {showAccountDropdown && (
              <div className="lifestats-switcher-dropdown">
                <div className="dropdown-section-caption">PROJECTS</div>
                <ul className="dropdown-scrollable-list">
                  {accountList.map((acc) => (
                    <li key={acc}>
                      <button 
                        className={`dropdown-item-btn ${acc === selectedAccount ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedAccount(acc);
                          setShowAccountDropdown(false);
                        }}
                      >
                        <span className="dropdown-item-name">{acc}</span>
                        {acc === selectedAccount && <Check size={12} className="dropdown-check-icon" />}
                      </button>
                    </li>
                  ))}
                </ul>
                
                <div className="dropdown-create-project-divider" />
                
                <div className="dropdown-fixed-bottom-action">
                  <button 
                    className="dropdown-create-project-btn" 
                    onClick={handleCreateProject}
                  >
                    <Plus size={12} />
                    <span>Create new project</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Time Filters */}
        <div className="gojiberry-time-filters-container" ref={datePickerRef}>
          <div className="gojiberry-time-filters">
            {['7 days', '30 days'].map((range) => (
              <button 
                key={range} 
                className={`time-filter-pill-btn ${timeRange === range ? 'active' : ''}`}
                onClick={() => {
                  setTimeRange(range);
                  setShowDatePicker(false);
                }}
              >
                {range}
              </button>
            ))}
            
            <button 
              className={`time-filter-pill-btn custom-pill-btn ${timeRange.includes('to') || showDatePicker ? 'active' : ''}`}
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              <Calendar size={12} style={{ marginRight: 4 }} />
              {timeRange.includes('to') ? timeRange : 'Custom'}
            </button>
          </div>

          {showDatePicker && (
            <div className="custom-datepicker-popover">
              <div className="datepicker-calendar-container">
                {/* Month switch header */}
                <div className="calendar-month-header">
                  <button className="month-nav-btn" onClick={() => changeMonth('prev')}>
                    <ChevronLeft size={14} />
                  </button>
                  <span className="month-header-label">
                    {MONTH_NAMES[calendarMonth]} {calendarYear}
                  </span>
                  <button className="month-nav-btn" onClick={() => changeMonth('next')}>
                    <ChevronRight size={14} />
                  </button>
                </div>

                {/* Weekdays header */}
                <div className="calendar-weekdays-row">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                    <span key={d} className="weekday-label">{d}</span>
                  ))}
                </div>

                {/* Days grid */}
                <div className="calendar-days-grid">
                  {calendarDays.map((dayDate, idx) => {
                    if (!dayDate) {
                      return <div key={`empty-${idx}`} className="calendar-day empty"></div>;
                    }

                    const isSelectedStart = rangeStart && dayDate.toDateString() === rangeStart.toDateString();
                    const isSelectedEnd = rangeEnd && dayDate.toDateString() === rangeEnd.toDateString();
                    const isInRange = rangeStart && rangeEnd && dayDate > rangeStart && dayDate < rangeEnd;
                    const isHoverRange = rangeStart && !rangeEnd && hoverDate && dayDate > rangeStart && dayDate <= hoverDate;

                    const dayClassNames = [
                      'calendar-day',
                      isSelectedStart ? 'selected-start' : '',
                      isSelectedEnd ? 'selected-end' : '',
                      isInRange ? 'in-range' : '',
                      isHoverRange ? 'in-hover-range' : ''
                    ].filter(Boolean).join(' ');

                    return (
                      <button 
                        key={dayDate.toISOString()}
                        className={dayClassNames}
                        onClick={() => handleDayClick(dayDate)}
                        onMouseEnter={() => rangeStart && !rangeEnd && setHoverDate(dayDate)}
                      >
                        {dayDate.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date details indicators */}
              <div className="datepicker-range-info-row">
                <div className="info-date-col">
                  <span className="info-lbl">START</span>
                  <span className="info-val">{rangeStart ? formatDateString(rangeStart) : 'Select Start'}</span>
                </div>
                <div className="info-date-col">
                  <span className="info-lbl">END</span>
                  <span className="info-val">{rangeEnd ? formatDateString(rangeEnd) : 'Select End'}</span>
                </div>
              </div>

              <button 
                className="datepicker-apply-btn"
                disabled={!rangeStart || !rangeEnd}
                onClick={() => {
                  if (rangeStart && rangeEnd) {
                    setTimeRange(`${formatDateString(rangeStart)} to ${formatDateString(rangeEnd)}`);
                    setShowDatePicker(false);
                  }
                }}
              >
                Apply Range
              </button>
            </div>
          )}
        </div>

        {/* Theme Toggler */}
        <button 
          className="lifestats-action-circle theme-toggler-btn" 
          onClick={toggleTheme} 
          title="Toggle theme mode"
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* User Profile Action Circle Menu */}
        <div className="settings-dropdown-wrapper" ref={settingsDropdownRef}>
          <button 
            className={`lifestats-action-circle ${showSettingsDropdown ? 'active' : ''}`} 
            onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
            title="User Account"
          >
            <User size={16} />
          </button>

          {showSettingsDropdown && (
            <div className="header-settings-dropdown">
              <div 
                className="settings-user-info" 
                onClick={() => {
                  if (onOpenProfile) onOpenProfile();
                  else setActiveTab('profile');
                  setShowSettingsDropdown(false);
                }}
                style={{ cursor: 'pointer' }}
                title="View My Profile"
              >
                {userProfile.avatarImage ? (
                  <img src={userProfile.avatarImage} alt="User DP" className="settings-avatar-img" />
                ) : (
                  <div className="settings-avatar-circle" style={{ backgroundColor: userProfile.avatarColor }}>
                    {userProfile.avatarText}
                  </div>
                )}
                <div className="settings-meta-info">
                  <span className="settings-user-name">{userProfile.firstName} {userProfile.lastName}</span>
                  <span className="settings-user-email">{userProfile.email}</span>
                </div>
              </div>
              
              <div className="settings-divider" />
              
              <ul className="settings-menu-list">
                <li>
                  <button className="settings-menu-item" onClick={() => {
                    if (onOpenProfile) onOpenProfile();
                    else setActiveTab('profile');
                    setShowSettingsDropdown(false);
                  }}>
                    <User size={13} style={{ marginRight: 8 }} />
                    <span>My Profile</span>
                  </button>
                </li>
                <li>
                  <button className="settings-menu-item" onClick={() => {
                    if (onOpenProjectSettings) onOpenProjectSettings();
                    setShowSettingsDropdown(false);
                  }}>
                    <Sliders size={13} style={{ marginRight: 8 }} />
                    <span>Project setting</span>
                  </button>
                </li>
              </ul>
              
              <div className="settings-divider" />
              
              <div className="settings-logout-section">
                <button className="settings-logout-btn" onClick={() => alert('Logging Out...')}>
                  <LogOut size={13} style={{ marginRight: 8 }} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
