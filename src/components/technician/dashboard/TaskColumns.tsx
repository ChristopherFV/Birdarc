
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CheckCheck, Check } from 'lucide-react';
import { Task } from '@/context/ScheduleContext';
import { Button } from '@/components/ui/button';
import { SectionHeader } from './SectionHeader';
import { GanttChart } from './GanttChart';
import { useToast } from '@/hooks/use-toast';
import { TaskCompletionDialog } from './TaskCompletionDialog';

interface TaskColumnsProps {
  assignedTasks: Task[];
  completedTasks: Task[];
  handleOpenWorkEntry: (projectId: string | null) => void;
  getProjectName: (projectId: string | null) => string;
  onCompleteTask?: (task: Task) => void;
}

export const TaskColumns: React.FC<TaskColumnsProps> = ({
  assignedTasks,
  completedTasks,
  handleOpenWorkEntry,
  getProjectName,
  onCompleteTask
}) => {
  const { toast } = useToast();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCompleteClick = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent task selection when clicking the complete button
    setSelectedTask(task);
    setCompleteDialogOpen(true);
  };

  const handleConfirmComplete = () => {
    if (selectedTask && onCompleteTask) {
      onCompleteTask(selectedTask);
      toast({
        title: "Task completed",
        description: `"${selectedTask.title}" has been marked as complete.`
      });
    }
    setCompleteDialogOpen(false);
  };

  return (
    <>
      <TaskCompletionDialog 
        open={completeDialogOpen}
        onOpenChange={setCompleteDialogOpen}
        onConfirm={handleConfirmComplete}
        taskTitle={selectedTask?.title || ''}
      />

      {/* My Assigned Tasks */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">
            <SectionHeader icon={<Calendar className="h-5 w-5" />} title="My Assigned Tasks" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[208px] overflow-y-auto">
            {assignedTasks.length === 0 ? (
              <p className="text-muted-foreground text-sm">No active tasks</p>
            ) : (
              assignedTasks.map(task => (
                <div 
                  key={task.id} 
                  className={`block p-3 border rounded-md hover:bg-secondary transition-colors ${selectedTask?.id === task.id ? 'bg-secondary' : ''}`}
                  onClick={() => handleTaskClick(task)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-sm">{task.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Project: {getProjectName(task.projectId)}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-muted-foreground hover:text-primary"
                      onClick={(e) => handleCompleteClick(task, e)}
                      title="Mark as completed"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Gantt Chart */}
      <GanttChart 
        tasks={assignedTasks}
        handleOpenWorkEntry={handleOpenWorkEntry}
        getProjectName={getProjectName}
        selectedTaskId={selectedTask?.id}
        onTaskSelect={handleTaskClick}
      />
      
      {/* Recently Completed */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">
            <SectionHeader icon={<CheckCheck className="h-5 w-5" />} title="Recently Completed" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[208px] overflow-y-auto">
            {completedTasks.length === 0 ? (
              <p className="text-muted-foreground text-sm">No completed tasks</p>
            ) : (
              completedTasks.slice(0, 5).map(task => (
                <div 
                  key={task.id} 
                  className="block p-3 border rounded-md bg-secondary/30"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-sm">{task.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Project: {getProjectName(task.projectId)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};
