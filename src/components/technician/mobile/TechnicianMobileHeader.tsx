
import React from 'react';
import { TechnicianTaskSelector } from '../TechnicianTaskSelector';
import { TechnicianMobileSummary } from '../TechnicianMobileSummary';

interface TechnicianMobileHeaderProps {
  taskData: any;
  selectedTaskId: string;
  handleTaskSelect: (taskId: string) => void;
  formatDate: (date: Date) => string;
  formatTime: (date: Date) => string;
  setShowMobileTools: (show: boolean) => void;
  showMobileTools: boolean;
}

export const TechnicianMobileHeader: React.FC<TechnicianMobileHeaderProps> = ({
  taskData,
  selectedTaskId,
  handleTaskSelect,
  formatDate,
  formatTime,
  setShowMobileTools,
  showMobileTools
}) => {
  return (
    <>
      <div className="p-2 bg-background">
        <TechnicianTaskSelector 
          currentTaskId={selectedTaskId}
          onTaskSelect={handleTaskSelect}
        />
      </div>
      
      <TechnicianMobileSummary
        taskData={taskData}
        formatDate={formatDate}
        formatTime={formatTime}
        setShowMobileTools={setShowMobileTools}
        showMobileTools={showMobileTools}
      />
    </>
  );
};
