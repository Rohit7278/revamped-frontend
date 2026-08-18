import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Info, AlertTriangle, AlertCircle } from 'lucide-react';
import { useCRM } from './CRMContext';

export const Toast: React.FC = () => {
  const { toasts, removeToast } = useCRM();

  return (
    <div className="crm-toast-container" style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 11000, display: 'flex', flexDirection: 'column', gap: 10, pointerEvents: 'none' }}>
      <AnimatePresence>
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem: React.FC<{ toast: any; onClose: () => void }> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 1800);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return <CheckCircle size={16} style={{ color: '#10b981' }} />;
      case 'info': return <Info size={16} style={{ color: '#3b82f6' }} />;
      case 'warning': return <AlertTriangle size={16} style={{ color: '#f59e0b' }} />;
      case 'error': return <AlertCircle size={16} style={{ color: '#ef4444' }} />;
      default: return <Info size={16} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } }}
      style={{ pointerEvents: 'auto' }}
      className={`crm-toast-card crm-toast-${toast.type}`}
    >
      <div className="crm-toast-body">
        {getIcon()}
        <span className="crm-toast-text">{toast.message}</span>
      </div>
      <button className="crm-toast-close" onClick={onClose}>
        <X size={14} />
      </button>
    </motion.div>
  );
};