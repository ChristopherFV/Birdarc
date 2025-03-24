
import React from 'react';
import { Task } from '@/context/ScheduleContext';
import { TaskInfoCard } from './InfoCard';

interface TaskInfoSidebarProps {
  selectedTask: Task | undefined;
  projectName: string;
  billingCode: any | null;
  onClose: () => void;
  onEdit: () => void;
  onCompleteTask: (id: string) => void;
  onCancelTask: (id: string) => void;
}

export const TaskInfoSidebar: React.FC<TaskInfoSidebarProps> = ({
  selectedTask,
  projectName,
  billingCode,
  onClose,
  onEdit,
  onCompleteTask,
  onCancelTask
}) => {
  if (!selectedTask) {
    return null;
  }
  
  return (
    <div className="absolute right-4 top-4 w-72 pointer-events-auto z-10">
      <TaskInfoCard 
        task={selectedTask} 
        projectName={projectName}
        billingCode={billingCode}
        onClose={onClose}
        onEdit={onEdit}
        onCloseTask={() => onCompleteTask(selectedTask.id)}
        onCancelTask={() => onCancelTask(selectedTask.id)}
      />
    </div>
  );
};
