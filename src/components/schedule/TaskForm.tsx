
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useSchedule, TaskPriority } from '@/context/ScheduleContext';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { AttachmentButton } from '@/components/forms/work-entry/AttachmentButton';
import { BasicTaskInfo } from './task-form/BasicTaskInfo';
import { ProjectTeamSelector } from './task-form/ProjectTeamSelector';
import { DateSelector } from './task-form/DateSelector';
import { LocationInput } from './task-form/LocationInput';
import { PriorityBillingSelector } from './task-form/PriorityBillingSelector';
import { QuantityEstimate } from './task-form/QuantityEstimate';
import { TaskFormData, TaskFormErrors, validateTaskForm, createTaskFromFormData } from './task-form/validation';

interface TaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ open, onOpenChange }) => {
  const { addTask } = useSchedule();
  const { projects, teamMembers, billingCodes } = useApp();
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'medium',
    projectId: '',
    teamMemberId: '',
    startDate: new Date(),
    endDate: new Date(),
    address: '',
    billingCodeId: '',
    quantityEstimate: 0,
    attachments: []
  });
  
  const [formErrors, setFormErrors] = useState<TaskFormErrors>({});

  // Form field update handlers
  const updateField = <K extends keyof TaskFormData>(field: K, value: TaskFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      const newErrors = { ...formErrors };
      delete newErrors[field];
      setFormErrors(newErrors);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateTaskForm(formData);
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast({
        title: "Error",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Create and add task
    const newTask = createTaskFromFormData(formData);
    addTask(newTask);
    
    toast({
      title: "Success",
      description: "Task created successfully",
    });
    handleClose();
  };
  
  const handleFileAttachment = (files: File[]) => {
    updateField('attachments', files);
  };
  
  const handleClose = () => {
    // Reset form
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      projectId: '',
      teamMemberId: '',
      startDate: new Date(),
      endDate: new Date(),
      address: '',
      billingCodeId: '',
      quantityEstimate: 0,
      attachments: []
    });
    setFormErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <BasicTaskInfo
            title={formData.title}
            description={formData.description}
            errors={formErrors}
            onTitleChange={(value) => updateField('title', value)}
            onDescriptionChange={(value) => updateField('description', value)}
          />
          
          <ProjectTeamSelector
            projectId={formData.projectId}
            teamMemberId={formData.teamMemberId}
            projects={projects}
            teamMembers={teamMembers}
            errors={formErrors}
            onProjectChange={(value) => updateField('projectId', value)}
            onTeamMemberChange={(value) => updateField('teamMemberId', value)}
          />
          
          <DateSelector
            startDate={formData.startDate}
            endDate={formData.endDate}
            onStartDateChange={(date) => updateField('startDate', date)}
            onEndDateChange={(date) => updateField('endDate', date)}
          />
          
          <LocationInput
            address={formData.address}
            errors={formErrors}
            onAddressChange={(value) => updateField('address', value)}
          />
          
          <PriorityBillingSelector
            priority={formData.priority}
            billingCodeId={formData.billingCodeId}
            billingCodes={billingCodes}
            errors={formErrors}
            onPriorityChange={(value) => updateField('priority', value)}
            onBillingCodeChange={(value) => updateField('billingCodeId', value)}
          />
          
          <QuantityEstimate
            quantityEstimate={formData.quantityEstimate}
            onQuantityChange={(value) => updateField('quantityEstimate', value)}
          />
          
          <AttachmentButton
            attachments={formData.attachments}
            onAttach={handleFileAttachment}
            error={formErrors.attachments}
          />
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Create Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
