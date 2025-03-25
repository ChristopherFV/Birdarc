
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useSchedule, TaskPriority } from '@/context/ScheduleContext';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { AttachmentButton } from '@/components/forms/work-entry/AttachmentButton';

// Import refactored components
import { TaskDetailsSection } from './task-form/TaskDetailsSection';
import { ProjectTeamSection } from './task-form/ProjectTeamSection';
import { DateRangeSection } from './task-form/DateRangeSection';
import { LocationInput } from './task-form/LocationInput';
import { PriorityQuantitySection } from './task-form/PriorityQuantitySection';
import { BillingCodesSection } from './task-form/BillingCodesSection';
import { BillingCodeEntry } from './task-form/BillingCodeItem';

interface TaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ open, onOpenChange }) => {
  const { addTask } = useSchedule();
  const { projects, teamMembers, billingCodes } = useApp();
  const { toast } = useToast();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [projectId, setProjectId] = useState('');
  const [teamMemberId, setTeamMemberId] = useState('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [address, setAddress] = useState('');
  const [quantityEstimate, setQuantityEstimate] = useState<number>(0);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Multiple billing codes state
  const [selectedBillingCodes, setSelectedBillingCodes] = useState<BillingCodeEntry[]>([]);
  
  // Contractor specific state
  const [isContractor, setIsContractor] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const errors: Record<string, string> = {};
    if (!title) errors.title = "Title is required";
    if (!projectId) errors.projectId = "Project is required";
    if (!address) errors.address = "Location is required";
    
    if (selectedBillingCodes.length === 0) {
      errors.billingCodes = "At least one billing code is required";
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast({
        title: "Error",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }
    
    const newTask = {
      title,
      description,
      location: {
        address,
        lat: 37.7749, // Default to San Francisco coordinates for now
        lng: -122.4194,
      },
      startDate,
      endDate,
      projectId,
      teamMemberId: teamMemberId || null,
      priority,
      status: 'pending' as const,
      billingCodeId: null, // Since we're using the array of billing codes now
      quantityEstimate,
      attachments,
      isContractor,
      contractorBillingCodes: isContractor ? selectedBillingCodes : [],
      teamMemberBillingCodes: !isContractor ? selectedBillingCodes : [],
    };
    
    addTask(newTask);
    toast({
      title: "Success",
      description: "Task created successfully",
    });
    handleClose();
  };
  
  const handleFileAttachment = (files: File[]) => {
    setAttachments(files);
    if (formErrors.attachments) {
      const newErrors = { ...formErrors };
      delete newErrors.attachments;
      setFormErrors(newErrors);
    }
  };
  
  const handleAddBillingCode = () => {
    setSelectedBillingCodes([
      ...selectedBillingCodes, 
      { 
        billingCodeId: '', 
        percentage: 100, // Default to 100%
        ratePerUnit: 0,
        hideRateFromTeamMember: false
      }
    ]);
  };
  
  const handleRemoveBillingCode = (index: number) => {
    const updatedCodes = [...selectedBillingCodes];
    updatedCodes.splice(index, 1);
    setSelectedBillingCodes(updatedCodes);
  };
  
  const handleBillingCodeChange = (index: number, field: keyof BillingCodeEntry, value: string | number | boolean) => {
    const updatedCodes = [...selectedBillingCodes];
    
    if (field === 'billingCodeId') {
      updatedCodes[index].billingCodeId = value as string;
      
      // Calculate rate based on selected billing code and percentage
      const selectedCode = billingCodes.find(code => code.id === value);
      if (selectedCode) {
        const percentage = updatedCodes[index].percentage;
        updatedCodes[index].ratePerUnit = (selectedCode.ratePerFoot * percentage) / 100;
      }
    } else if (field === 'percentage') {
      const percentage = Number(value);
      updatedCodes[index].percentage = percentage;
      
      // Recalculate rate based on new percentage
      const selectedCode = billingCodes.find(code => code.id === updatedCodes[index].billingCodeId);
      if (selectedCode) {
        updatedCodes[index].ratePerUnit = (selectedCode.ratePerFoot * percentage) / 100;
      }
    } else if (field === 'hideRateFromTeamMember') {
      updatedCodes[index].hideRateFromTeamMember = value as boolean;
    }
    
    setSelectedBillingCodes(updatedCodes);
  };
  
  const handleClose = () => {
    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setProjectId('');
    setTeamMemberId('');
    setStartDate(new Date());
    setEndDate(new Date());
    setAddress('');
    setQuantityEstimate(0);
    setAttachments([]);
    setFormErrors({});
    setIsContractor(false);
    setSelectedBillingCodes([]);
    onOpenChange(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TaskDetailsSection
        title={title}
        description={description}
        titleError={formErrors.title}
        onTitleChange={setTitle}
        onDescriptionChange={setDescription}
      />
      
      <ProjectTeamSection
        projectId={projectId}
        teamMemberId={teamMemberId}
        isContractor={isContractor}
        projects={projects}
        teamMembers={teamMembers}
        projectError={formErrors.projectId}
        onProjectChange={setProjectId}
        onTeamMemberChange={setTeamMemberId}
        onContractorToggle={setIsContractor}
      />
      
      <DateRangeSection
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />
      
      <LocationInput
        address={address}
        error={formErrors.address}
        onChange={setAddress}
      />
      
      <PriorityQuantitySection
        priority={priority}
        quantityEstimate={quantityEstimate}
        onPriorityChange={setPriority}
        onQuantityChange={setQuantityEstimate}
      />
      
      <BillingCodesSection
        selectedBillingCodes={selectedBillingCodes}
        isContractor={isContractor}
        billingCodes={billingCodes}
        error={formErrors.billingCodes}
        onAddCode={handleAddBillingCode}
        onRemoveCode={handleRemoveBillingCode}
        onBillingCodeChange={handleBillingCodeChange}
      />
      
      <AttachmentButton
        attachments={attachments}
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
  );
};
