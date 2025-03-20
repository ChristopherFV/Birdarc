
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useSchedule } from '@/context/ScheduleContext';
import { useApp } from '@/context/AppContext';
import { TaskTitleDescription } from './task-dialog/TaskTitleDescription';
import { TaskLocation } from './task-dialog/TaskLocation';
import { TaskDateRange } from './task-dialog/TaskDateRange';
import { TaskAssignment } from './task-dialog/TaskAssignment';
import { TaskPrioritySelector } from './task-dialog/TaskPriority';
import { QuantityEstimate } from './task-form/QuantityEstimate';
import { AddTaskFormData, AddTaskFormErrors, validateAddTaskForm, createTaskFromDialogData } from './task-dialog/validation';

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddTaskDialog: React.FC<AddTaskDialogProps> = ({ open, onOpenChange }) => {
  const { addTask } = useSchedule();
  const { projects, teamMembers } = useApp();
  
  // Form state
  const [formData, setFormData] = useState<AddTaskFormData>({
    title: '',
    description: '',
    address: '',
    projectId: '',
    teamMemberId: '',
    priority: 'medium',
    startDate: new Date(),
    endDate: new Date(),
    billingCodeId: '',
    quantityEstimate: 0
  });
  
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<AddTaskFormErrors>({});
  
  const updateField = <K extends keyof AddTaskFormData>(field: K, value: AddTaskFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      const newErrors = { ...formErrors };
      delete newErrors[field];
      setFormErrors(newErrors);
    }
  };
  
  const handleDateChange = (range: { from: Date, to?: Date }) => {
    updateField('startDate', range.from);
    updateField('endDate', range.to || range.from);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateAddTaskForm(formData);
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Create and add task
    const newTask = createTaskFromDialogData(formData);
    addTask(newTask);
    resetForm();
    onOpenChange(false);
  };
  
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      address: '',
      projectId: '',
      teamMemberId: '',
      priority: 'medium',
      startDate: new Date(),
      endDate: new Date(),
      billingCodeId: '',
      quantityEstimate: 0
    });
    setFormErrors({});
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <TaskTitleDescription
            title={formData.title}
            description={formData.description}
            errors={formErrors}
            onTitleChange={(value) => updateField('title', value)}
            onDescriptionChange={(value) => updateField('description', value)}
          />
          
          <TaskLocation
            address={formData.address}
            errors={formErrors}
            onAddressChange={(value) => updateField('address', value)}
          />
          
          <TaskDateRange
            startDate={formData.startDate}
            endDate={formData.endDate}
            datePopoverOpen={datePopoverOpen}
            setDatePopoverOpen={setDatePopoverOpen}
            onDateChange={handleDateChange}
          />
          
          <TaskAssignment
            projectId={formData.projectId}
            teamMemberId={formData.teamMemberId}
            projects={projects}
            teamMembers={teamMembers}
            onProjectChange={(value) => updateField('projectId', value)}
            onTeamMemberChange={(value) => updateField('teamMemberId', value)}
          />
          
          <TaskPrioritySelector
            priority={formData.priority}
            onPriorityChange={(value) => updateField('priority', value)}
          />
          
          <QuantityEstimate
            quantityEstimate={formData.quantityEstimate}
            onQuantityChange={(value) => updateField('quantityEstimate', value)}
          />
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-fieldvision-orange hover:bg-fieldvision-orange/90 text-white"
            >
              Save Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
