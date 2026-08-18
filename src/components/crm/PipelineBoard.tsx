import React, { useState } from 'react';
import { useCRM } from './CRMContext';
import type { CRMLead, StageConfig } from './CRMContext';
import { LeadCard } from './LeadCard';
import { 
  Users, 
  GripVertical, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal, 
  RotateCcw, 
  X, 
  ArrowUp, 
  ArrowDown, 
  Check 
} from 'lucide-react';
import { motion } from 'framer-motion';

export const PipelineBoard: React.FC = () => {
  const { 
    crmLeads, 
    moveLeadStage, 
    searchQuery, 
    filters, 
    sortBy, 
    stages, 
    reorderStages,
    moveStageDirection,
    resetStages
  } = useCRM();

  const [showReorderModal, setShowReorderModal] = useState(false);
  const [draggedStageKey, setDraggedStageKey] = useState<string | null>(null);
  const [dropTargetKey, setDropTargetKey] = useState<string | null>(null);

  // Apply search query, filters, and sorting to the leads
  const getFilteredLeads = () => {
    return crmLeads
      .filter(lead => {
        // Search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const match = lead.name.toLowerCase().includes(query) ||
                        lead.positionLabel.toLowerCase().includes(query) ||
                        lead.postQuote.toLowerCase().includes(query) ||
                        (lead.tags && lead.tags.some(t => t.toLowerCase().includes(query)));
          if (!match) return false;
        }

        // Source platform
        if (filters.source !== 'all' && lead.platform !== filters.source) return false;
        
        // Priority
        if (filters.priority !== 'all' && lead.priority !== filters.priority) return false;

        // Stage
        if (filters.stage !== 'all' && lead.pipelineStage !== filters.stage) return false;

        // Score range
        if (filters.fitScore === '90+') {
          if (lead.fitScore < 90) return false;
        } else if (filters.fitScore === '80-89') {
          if (lead.fitScore < 80 || lead.fitScore >= 90) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return b.timestamp - a.timestamp;
        if (sortBy === 'oldest') return a.timestamp - b.timestamp;
        if (sortBy === 'highest-score') return b.fitScore - a.fitScore;
        return b.fitScore - a.fitScore;
      });
  };

  const filteredLeads = getFilteredLeads();

  return (
    <div className="crm-pipeline-board-container">
      
      {/* Board Top Action Row */}
      <div className="crm-pipeline-toolbar">
        <div className="pipeline-toolbar-left">
          <span className="pipeline-stages-counter-lbl">
            <strong>{stages.length}</strong> Active Pipeline Stages
          </span>
          <span className="pipeline-reorder-hint">
            (Drag column headers to rearrange sequences)
          </span>
        </div>

        <button 
          className="crm-manage-stages-btn"
          onClick={() => setShowReorderModal(true)}
          title="Customize & Reorder Stages Sequence"
        >
          <SlidersHorizontal size={13} />
          <span>Reorder Stages</span>
        </button>
      </div>

      {/* Horizontal Pipeline Kanban Columns */}
      <div className="crm-pipeline-board">
        {stages.map((stage, index) => {
          const stageLeads = filteredLeads.filter(l => l.pipelineStage === stage.key);
          
          return (
            <PipelineColumn 
              key={stage.key}
              stage={stage}
              leads={stageLeads}
              index={index}
              totalStages={stages.length}
              isBeingDragged={draggedStageKey === stage.key}
              isDropTarget={dropTargetKey === stage.key}
              onStageDragStart={(e) => {
                e.dataTransfer.setData('application/rixly-stage', stage.key);
                e.dataTransfer.setData('text/plain', `stage:${stage.key}`);
                e.dataTransfer.effectAllowed = 'move';
                setDraggedStageKey(stage.key);
              }}
              onStageDragEnd={() => {
                setDraggedStageKey(null);
                setDropTargetKey(null);
              }}
              onStageDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                if (draggedStageKey && draggedStageKey !== stage.key && dropTargetKey !== stage.key) {
                  setDropTargetKey(stage.key);
                }
              }}
              onStageDragLeave={(e) => {
                if (e.currentTarget.contains(e.relatedTarget as Node)) return;
                if (dropTargetKey === stage.key) {
                  setDropTargetKey(null);
                }
              }}
              onStageDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();

                const draggedStage = e.dataTransfer.getData('application/rixly-stage');
                const leadId = e.dataTransfer.getData('application/rixly-lead');
                const plain = e.dataTransfer.getData('text/plain');

                // Check if dropping a column/stage
                const effectiveStageKey = draggedStage || draggedStageKey || (plain && plain.startsWith('stage:') ? plain.replace('stage:', '') : null);
                
                if (effectiveStageKey && effectiveStageKey !== stage.key) {
                  const fromIdx = stages.findIndex(s => s.key === effectiveStageKey);
                  const toIdx = stages.findIndex(s => s.key === stage.key);
                  if (fromIdx !== -1 && toIdx !== -1) {
                    reorderStages(fromIdx, toIdx);
                  }
                  setDraggedStageKey(null);
                  setDropTargetKey(null);
                  return;
                }

                // Otherwise it's a lead card drop
                const effectiveLeadId = leadId || (plain && !plain.startsWith('stage:') ? plain : null);
                if (effectiveLeadId) {
                  moveLeadStage(effectiveLeadId, stage.key);
                }

                setDraggedStageKey(null);
                setDropTargetKey(null);
              }}
              onMoveLeft={() => moveStageDirection(stage.key, 'left')}
              onMoveRight={() => moveStageDirection(stage.key, 'right')}
              onDropCard={(leadId) => moveLeadStage(leadId, stage.key)}
            />
          );
        })}
      </div>

      {/* Reorder Stages Modal */}
      {showReorderModal && (
        <StageReorderModal 
          stages={stages}
          onReorder={reorderStages}
          onReset={resetStages}
          onClose={() => setShowReorderModal(false)}
        />
      )}

    </div>
  );
};

interface ColumnProps {
  stage: StageConfig;
  leads: CRMLead[];
  index: number;
  totalStages: number;
  isBeingDragged: boolean;
  isDropTarget: boolean;
  onStageDragStart: (e: React.DragEvent) => void;
  onStageDragEnd: () => void;
  onStageDragOver: (e: React.DragEvent) => void;
  onStageDragLeave: (e: React.DragEvent) => void;
  onStageDrop: (e: React.DragEvent) => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onDropCard: (leadId: string) => void;
}

const PipelineColumn: React.FC<ColumnProps> = ({ 
  stage, 
  leads, 
  index,
  totalStages,
  isBeingDragged,
  isDropTarget,
  onStageDragStart,
  onStageDragEnd,
  onStageDragOver,
  onStageDragLeave,
  onStageDrop,
  onMoveLeft,
  onMoveRight,
  onDropCard 
}) => {
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);

  return (
    <motion.div 
      layout
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={`crm-pipeline-column ${isBeingDragged ? 'dragging-column' : ''} ${isDropTarget ? 'drop-target-column' : ''}`}
      onDragOver={onStageDragOver}
      onDragLeave={onStageDragLeave}
      onDrop={onStageDrop}
    >
      {/* Column Header - Drag Handle */}
      <header 
        className="crm-column-header"
        draggable
        onDragStart={onStageDragStart}
        onDragEnd={onStageDragEnd}
        onMouseEnter={() => setIsHeaderHovered(true)}
        onMouseLeave={() => setIsHeaderHovered(false)}
        title="Drag header to move stage sequence"
      >
        <div className="crm-column-title-box">
          <div className="column-drag-handle" title="Drag to reorder column">
            <GripVertical size={13} className="drag-handle-icon" />
          </div>
          <span className="column-indicator-dot" style={{ backgroundColor: stage.color }} />
          <h3 className="column-stage-title">{stage.label}</h3>
          <span className="column-card-count">{leads.length}</span>
        </div>

        {/* Column sequence movement buttons */}
        <div className={`column-shift-controls ${isHeaderHovered ? 'visible' : ''}`}>
          <button 
            type="button"
            className="column-shift-btn"
            disabled={index === 0}
            onClick={(e) => { e.stopPropagation(); onMoveLeft(); }}
            title="Move stage left"
          >
            <ChevronLeft size={12} />
          </button>
          <button 
            type="button"
            className="column-shift-btn"
            disabled={index === totalStages - 1}
            onClick={(e) => { e.stopPropagation(); onMoveRight(); }}
            title="Move stage right"
          >
            <ChevronRight size={12} />
          </button>
        </div>
      </header>

      {/* Card list container */}
      <div 
        className="crm-column-cards-list"
        onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const leadId = e.dataTransfer.getData('application/rixly-lead') || e.dataTransfer.getData('text/plain');
          if (leadId && !leadId.startsWith('stage:')) {
            onDropCard(leadId);
          }
        }}
      >
        {leads.length > 0 ? (
          leads.map(lead => (
            <LeadCard key={lead.id} lead={lead} />
          ))
        ) : (
          <div className="crm-column-empty-dropzone">
            <Users size={16} className="dropzone-icon" />
            <p>Drag leads here</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

/* ==================== STAGE REORDER MODAL ==================== */
interface StageReorderModalProps {
  stages: StageConfig[];
  onReorder: (fromIndex: number, toIndex: number) => void;
  onReset: () => void;
  onClose: () => void;
}

const StageReorderModal: React.FC<StageReorderModalProps> = ({ 
  stages, 
  onReorder, 
  onReset, 
  onClose 
}) => {
  const [modalDragIdx, setModalDragIdx] = useState<number | null>(null);
  const [modalOverIdx, setModalOverIdx] = useState<number | null>(null);

  return (
    <div className="crm-modal-overlay" onClick={onClose}>
      <div className="crm-modal-card stage-reorder-modal-card" onClick={(e) => e.stopPropagation()}>
        
        <div className="crm-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SlidersHorizontal size={16} className="crm-modal-title-icon-blue" />
            <h3>Customize Stage Sequences</h3>
          </div>
          <button className="crm-modal-close-icon-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="stage-reorder-modal-body">
          <p className="stage-reorder-modal-desc">
            Drag any stage row or use the up and down arrow buttons to reorder your pipeline sequence. Changes are saved automatically.
          </p>

          <div className="stage-reorder-list">
            {stages.map((stage, idx) => (
              <div 
                key={stage.key}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', idx.toString());
                  e.dataTransfer.effectAllowed = 'move';
                  setModalDragIdx(idx);
                }}
                onDragEnd={() => {
                  setModalDragIdx(null);
                  setModalOverIdx(null);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                  if (modalOverIdx !== idx) setModalOverIdx(idx);
                }}
                onDragLeave={() => {
                  if (modalOverIdx === idx) setModalOverIdx(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const fromStr = e.dataTransfer.getData('text/plain');
                  const from = fromStr !== '' ? parseInt(fromStr, 10) : modalDragIdx;
                  if (from !== null && !isNaN(from) && from !== idx) {
                    onReorder(from, idx);
                  }
                  setModalDragIdx(null);
                  setModalOverIdx(null);
                }}
                className={`stage-reorder-row ${modalDragIdx === idx ? 'is-dragging' : ''} ${modalOverIdx === idx ? 'is-drag-over' : ''}`}
              >
                <div className="stage-reorder-left">
                  <GripVertical size={14} className="reorder-grip-icon" />
                  <span className="stage-reorder-number">{idx + 1}</span>
                  <span className="stage-reorder-color-dot" style={{ backgroundColor: stage.color }} />
                  <span className="stage-reorder-name">{stage.label}</span>
                </div>

                <div className="stage-reorder-actions">
                  <button 
                    type="button"
                    className="stage-move-btn"
                    disabled={idx === 0}
                    onClick={() => onReorder(idx, idx - 1)}
                    title="Move Up"
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button 
                    type="button"
                    className="stage-move-btn"
                    disabled={idx === stages.length - 1}
                    onClick={() => onReorder(idx, idx + 1)}
                    title="Move Down"
                  >
                    <ArrowDown size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="crm-modal-footer" style={{ justifyContent: 'space-between' }}>
          <button 
            type="button" 
            className="stage-reset-btn"
            onClick={onReset}
          >
            <RotateCcw size={12} style={{ marginRight: 6 }} />
            Reset to Default
          </button>
          
          <button 
            type="button" 
            className="crm-btn-primary"
            onClick={onClose}
          >
            <Check size={13} style={{ marginRight: 6 }} />
            Done
          </button>
        </div>

      </div>
    </div>
  );
};