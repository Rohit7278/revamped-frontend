import React from 'react';
import { useCRM } from './CRMContext';
import { FilterBar } from './FilterBar';
import { PipelineBoard } from './PipelineBoard';
import { LeadDetailPanel } from './LeadDetailPanel';
import { Toast } from './Toast';
import { motion, AnimatePresence } from 'framer-motion';

export const CRMLayout: React.FC = () => {
  const { activeLeadId } = useCRM();

  return (
    <div className="crm-workspace-layout-root">
      
      {/* Toast Alert Drawer */}
      <Toast />

      {/* Top Filter and Search bar */}
      <FilterBar />

      {/* Split Workspace Board */}
      <div className="crm-workspace-canvas-split">
        
        {/* Left Side: Pipeline Kanban Columns */}
        <motion.div 
          layout
          className="crm-pipeline-pane-wrapper"
          style={{ flex: 1, minWidth: 0 }}
        >
          <PipelineBoard />
        </motion.div>

        {/* Right Side: Lead detailed tab info */}
        <AnimatePresence mode="popLayout">
          {activeLeadId && (
            <motion.div
              initial={{ x: 380, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 380, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="crm-detail-pane-wrapper"
              style={{ width: 380, maxWidth: '100%', flexShrink: 0 }}
            >
              <LeadDetailPanel />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};