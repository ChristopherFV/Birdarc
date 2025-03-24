
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { ClipboardList } from 'lucide-react';
import { useSchedule, Task } from '@/context/ScheduleContext';
import { format } from 'date-fns';

interface TechnicianTaskSelectorProps {
  currentTaskId: string;
  onTaskSelect: (taskId: string) => void;
}

export const TechnicianTaskSelector: React.FC<TechnicianTaskSelectorProps> = ({
  currentTaskId,
  onTaskSelect
}) => {
  const { tasks } = useSchedule();
  
  // Filter to show only in_progress or pending tasks
  const activeTasks = tasks.filter(task => 
    task.status === 'in_progress' || task.status === 'pending'
  );
  
  // Format date for display
  const formatTaskDate = (date: Date) => {
    return format(date, 'MMM d, yyyy');
  };
  
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-1">
        <ClipboardList className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Select Task</span>
      </div>
      <Select 
        value={currentTaskId} 
        onValueChange={onTaskSelect}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a task" />
        </SelectTrigger>
        <SelectContent>
          {activeTasks.length === 0 ? (
            <SelectItem value="no-tasks" disabled>
              No active tasks available
            </SelectItem>
          ) : (
            activeTasks.map((task) => (
              <SelectItem key={task.id} value={task.id}>
                <div className="truncate">
                  <span className="font-medium">{task.title}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    ID: {task.id.slice(0, 8)}... | {formatTaskDate(task.startDate)}
                  </span>
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};
