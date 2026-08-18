import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description }) => {
  return (
    <div className="crm-empty-state">
      <div className="crm-empty-icon-wrapper">
        <Icon size={24} className="crm-empty-icon" />
      </div>
      <h3 className="crm-empty-title">{title}</h3>
      <p className="crm-empty-desc">{description}</p>
    </div>
  );
};