
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TaskForm } from './TaskForm';
import { useSchedule } from '@/context/ScheduleContext';

// Import the TaskPriority from ScheduleContext
import { TaskPriority } from '@/context/ScheduleContext';

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddTaskDialog: React.FC<AddTaskDialogProps> = ({
  open,
  onOpenChange
}) => {
  const { addTask } = useSchedule();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (formData: {
    title: string;
    description: string;
    location: {
      address: string;
      lat: number;
      lng: number;
    };
    startDate: Date;
    endDate: Date;
    projectId: string;
    teamMemberId: string;
    billingCodeId: string;
    quantityEstimate: number;
    priority: TaskPriority;
    attachments?: File[];
  }) => {
    setIsSubmitting(true);
    
    try {
      addTask({
        title: formData.title,
        description: formData.description,
        location: formData.location,
        startDate: formData.startDate,
        endDate: formData.endDate,
        projectId: formData.projectId,
        teamMemberId: formData.teamMemberId,
        billingCodeId: formData.billingCodeId,
        quantityEstimate: formData.quantityEstimate,
        priority: formData.priority,
        status: "pending",
        attachments: formData.attachments
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <TaskForm 
          handleSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </DialogContent>
    </Dialog>
  );
};
