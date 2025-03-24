
import React from 'react';
import { TechnicianTaskSelector } from '../TechnicianTaskSelector';

interface TechnicianDesktopHeaderProps {
  selectedTaskId: string;
  handleTaskSelect: (taskId: string) => void;
}

export const TechnicianDesktopHeader: React.FC<TechnicianDesktopHeaderProps> = ({
  selectedTaskId,
  handleTaskSelect
}) => {
  return (
    <div className="p-2 bg-background">
      <TechnicianTaskSelector 
        currentTaskId={selectedTaskId}
        onTaskSelect={handleTaskSelect}
      />
    </div>
  );
};
