
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { TaskPriority } from '@/context/ScheduleContext';
import { cn } from '@/lib/utils';

interface TaskPriorityProps {
  priority: TaskPriority;
  onPriorityChange: (priority: TaskPriority) => void;
}

export const TaskPrioritySelector: React.FC<TaskPriorityProps> = ({
  priority,
  onPriorityChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="priority">Priority</Label>
      <div className="flex space-x-2">
        {(['low', 'medium', 'high'] as const).map((p) => (
          <Button
            key={p}
            type="button"
            variant={priority === p ? 'default' : 'outline'}
            className={cn(
              "flex-1 capitalize",
              priority === p && p === 'high' && "bg-red-500 hover:bg-red-600",
              priority === p && p === 'medium' && "bg-amber-500 hover:bg-amber-600",
              priority === p && p === 'low' && "bg-blue-500 hover:bg-blue-600"
            )}
            onClick={() => onPriorityChange(p)}
          >
            {p}
          </Button>
        ))}
      </div>
    </div>
  );
};
