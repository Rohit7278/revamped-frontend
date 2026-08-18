import React, { useState } from 'react';
import { Search, Filter, ArrowUpDown, X, Check, Calendar, Bell } from 'lucide-react';
import { useCRM } from './CRMContext';

export const FilterBar: React.FC = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    filters, 
    setFilters, 
    sortBy, 
    setSortBy,
    stages
  } = useCRM();

  const [showDropdown, setShowDropdown] = useState(false);

  const activeFilterCount = Object.keys(filters).reduce((acc, key) => {
    const val = (filters as any)[key];
    if (key === 'meetingScheduled' || key === 'reminderPending') {
      return val ? acc + 1 : acc;
    }
    return val !== 'all' ? acc + 1 : acc;
  }, 0);

  const resetFilters = () => {
    setFilters({
      status: 'all',
      fitScore: 'all',
      source: 'all',
      priority: 'all',
      stage: 'all',
      meetingScheduled: false,
      reminderPending: false
    });
  };

  return (
    <div className="crm-filter-bar">
      
      {/* Search Input Box */}
      <div className="crm-search-box-wrapper">
        <Search size={14} className="crm-search-icon-gray" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, company, role, source, tags..."
          className="crm-search-input-box"
        />
        {searchQuery && (
          <button className="crm-search-clear-btn" onClick={() => setSearchQuery('')}>
            <X size={12} />
          </button>
        )}
      </div>

      <div className="crm-controls-row">
        {/* Filter Toggle Button */}
        <div style={{ position: 'relative' }}>
          <button 
            className={`crm-filter-toggle-btn ${activeFilterCount > 0 ? 'active-filtering' : ''}`}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <Filter size={14} />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="crm-filter-badge-number">{activeFilterCount}</span>
            )}
          </button>

          {/* Notion-style Filter Popover */}
          {showDropdown && (
            <div className="crm-filter-dropdown-card">
              <div className="crm-filter-dropdown-header">
                <h4>Filter Leads</h4>
                {activeFilterCount > 0 && (
                  <button className="crm-filter-reset-text-btn" onClick={resetFilters}>
                    Clear all
                  </button>
                )}
              </div>
              
              <div className="crm-filters-selectors-grid">
                
                {/* Source Filter */}
                <div className="crm-filter-select-group">
                  <label>LEAD SOURCE</label>
                  <select 
                    value={filters.source}
                    onChange={(e) => setFilters((prev: any) => ({ ...prev, source: e.target.value }))}
                  >
                    <option value="all">All Sources</option>
                    <option value="linkedin">LinkedIn Only</option>
                    <option value="reddit">Reddit Only</option>
                  </select>
                </div>

                {/* Priority Filter */}
                <div className="crm-filter-select-group">
                  <label>PRIORITY</label>
                  <select 
                    value={filters.priority}
                    onChange={(e) => setFilters((prev: any) => ({ ...prev, priority: e.target.value }))}
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                {/* Score Filter */}
                <div className="crm-filter-select-group">
                  <label>FIT SCORE</label>
                  <select 
                    value={filters.fitScore}
                    onChange={(e) => setFilters((prev: any) => ({ ...prev, fitScore: e.target.value }))}
                  >
                    <option value="all">All Scores</option>
                    <option value="90+">90+ Excellent</option>
                    <option value="80-89">80-89 High</option>
                  </select>
                </div>

                {/* Stage Filter */}
                <div className="crm-filter-select-group">
                  <label>PIPELINE STAGE</label>
                  <select 
                    value={filters.stage}
                    onChange={(e) => setFilters((prev: any) => ({ ...prev, stage: e.target.value }))}
                  >
                    <option value="all">All Stages</option>
                    {stages.map((stage) => (
                      <option key={stage.key} value={stage.key}>
                        {stage.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status toggles */}
              <div className="crm-checkbox-filters-row">
                <button 
                  className={`crm-filter-pill-toggle ${filters.meetingScheduled ? 'active' : ''}`}
                  onClick={() => setFilters((prev: any) => ({ ...prev, meetingScheduled: !prev.meetingScheduled }))}
                >
                  <Calendar size={12} />
                  <span>Meeting Booked</span>
                  {filters.meetingScheduled && <Check size={10} style={{ marginLeft: 4 }} />}
                </button>
                
                <button 
                  className={`crm-filter-pill-toggle ${filters.reminderPending ? 'active' : ''}`}
                  onClick={() => setFilters((prev: any) => ({ ...prev, reminderPending: !prev.reminderPending }))}
                >
                  <Bell size={12} />
                  <span>Reminder Pending</span>
                  {filters.reminderPending && <Check size={10} style={{ marginLeft: 4 }} />}
                </button>
              </div>

              <button className="crm-filters-done-btn" onClick={() => setShowDropdown(false)}>
                Done
              </button>
            </div>
          )}
        </div>

        {/* Sort selector dropdown */}
        <div className="crm-sort-selector-wrapper">
          <ArrowUpDown size={13} className="crm-sort-icon" />
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="crm-sort-select-element"
          >
            <option value="newest">Newest Added</option>
            <option value="oldest">Oldest Added</option>
            <option value="highest-score">Highest Score</option>
            <option value="next-follow-up">Next Follow Up</option>
            <option value="recently-active">Recently Active</option>
          </select>
        </div>

      </div>
    </div>
  );
};