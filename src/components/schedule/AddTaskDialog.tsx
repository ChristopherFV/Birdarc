
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TaskForm } from './TaskForm';
import { useSchedule } from '@/context/ScheduleContext';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddTaskDialog: React.FC<AddTaskDialogProps> = ({
  open,
  onOpenChange
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <TaskForm 
            open={open} 
            onOpenChange={onOpenChange} 
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
