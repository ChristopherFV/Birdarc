
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Task, TaskStatus } from '@/context/ScheduleContext';

export const useTaskActions = (
  tasks: Task[],
  updateTask: (task: Task) => void
) => {
  const { toast } = useToast();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [isEditTaskDialogOpen, setIsEditTaskDialogOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<'complete' | 'cancel'>('complete');
  const [isWorkEntryDialogOpen, setIsWorkEntryDialogOpen] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  
  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId === selectedTaskId ? null : taskId);
  };
  
  const handleAddTask = () => {
    setIsAddTaskDialogOpen(true);
  };
  
  const handleEditTask = () => {
    if (selectedTaskId) {
      setIsEditTaskDialogOpen(true);
    }
  };
  
  const handleCompleteTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    setConfirmationAction('complete');
    setIsConfirmationDialogOpen(true);
    
    // Set project ID for work entry form
    const task = tasks.find(t => t.id === taskId);
    if (task && task.projectId) {
      setCurrentProjectId(task.projectId);
    }
  };

  const handleCancelTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    setConfirmationAction('cancel');
    setIsConfirmationDialogOpen(true);
  };
  
  const confirmTaskAction = () => {
    if (selectedTaskId) {
      const task = tasks.find(t => t.id === selectedTaskId);
      if (task) {
        const newStatus: TaskStatus = confirmationAction === 'complete' ? 'completed' : 'cancelled';
        const updatedTask = { ...task, status: newStatus };
        
        try {
          // Update the task in the context
          updateTask(updatedTask);
          
          // Show success message
          toast({
            title: confirmationAction === 'complete' ? "Task completed" : "Task cancelled",
            description: `Task "${task.title}" has been ${confirmationAction === 'complete' ? 'marked as completed' : 'cancelled'}.`,
          });
          
          // Close the confirmation dialog
          setIsConfirmationDialogOpen(false);
          
          // If completing a task, open the work entry form
          if (confirmationAction === 'complete') {
            openWorkEntryForm();
          }
        } catch (error) {
          console.error(`Error ${confirmationAction}ing task:`, error);
          toast({
            variant: "destructive",
            title: "Error",
            description: `Failed to ${confirmationAction} task. Please try again.`,
          });
        }
      }
    }
  };
  
  const openWorkEntryForm = () => {
    setIsWorkEntryDialogOpen(true);
  };
  
  return {
    selectedTaskId,
    isAddTaskDialogOpen,
    setIsAddTaskDialogOpen,
    isEditTaskDialogOpen,
    setIsEditTaskDialogOpen,
    isConfirmationDialogOpen,
    setIsConfirmationDialogOpen,
    confirmationAction,
    isWorkEntryDialogOpen,
    setIsWorkEntryDialogOpen,
    currentProjectId,
    handleTaskClick,
    handleAddTask,
    handleEditTask,
    handleCompleteTask,
    handleCancelTask,
    confirmTaskAction,
    openWorkEntryForm
  };
};
