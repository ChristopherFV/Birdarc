import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useWorkEntryForm } from '@/hooks/useWorkEntryForm';
import { DateSelector } from '@/components/forms/work-entry/DateSelector';
import { ProjectSelector } from '@/components/forms/work-entry/ProjectSelector';
import { BillingCodeSelector } from '@/components/forms/work-entry/BillingCodeSelector';
import { FeetCompletedInput } from '@/components/forms/work-entry/FeetCompletedInput';
import { RevenuePreview } from '@/components/forms/work-entry/RevenuePreview';
import { TeamMemberSelector } from '@/components/forms/work-entry/TeamMemberSelector';
import { AttachmentButton } from '@/components/forms/work-entry/AttachmentButton';
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { CircleX, Send, Clock, Plus, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useApp } from '@/context/AppContext';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useSchedule } from '@/context/ScheduleContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TechnicianWorkEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string;
}

interface TaskEntry {
  taskId: string;
  workType: 'unit' | 'hourly';
  hoursWorked: string;
  feetCompleted: string;
  billingCodeId: string;
}

export const TechnicianWorkEntryDialog: React.FC<TechnicianWorkEntryDialogProps> = ({
  open,
  onOpenChange,
  projectId
}) => {
  const { toast } = useToast();
  const { teamMembers } = useApp();
  const { tasks } = useSchedule();
  const {
    formData,
    calendarOpen,
    setCalendarOpen,
    formErrors,
    isSubmitting,
    previewRevenue,
    projects,
    billingCodes,
    teamMembers: formTeamMembers,
    handleChange,
    handleDateSelect,
    handleSubmit,
    handleFileAttachment
  } = useWorkEntryForm();

  const [cancelNotes, setCancelNotes] = useState('');
  const [isRedlineRevision, setIsRedlineRevision] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [notifyTaskIssuer, setNotifyTaskIssuer] = useState(true);
  const [workType, setWorkType] = useState<'unit' | 'hourly'>('unit');
  const [hoursWorked, setHoursWorked] = useState('');
  const [multipleTasksEnabled, setMultipleTasksEnabled] = useState(false);
  const [taskEntries, setTaskEntries] = useState<TaskEntry[]>([]);
  const [projectTasks, setProjectTasks] = useState<{ id: string, title: string }[]>([]);

  useEffect(() => {
    if (projectId && open) {
      const syntheticEvent = {
        target: { name: 'projectId', value: projectId }
      } as React.ChangeEvent<HTMLSelectElement>;
      handleChange(syntheticEvent);

      const relatedTasks = tasks.filter(task => task.projectId === projectId)
        .map(task => ({ id: task.id, title: task.title }));
      setProjectTasks(relatedTasks);

      if (relatedTasks.length > 0 && taskEntries.length === 0) {
        setTaskEntries([
          {
            taskId: relatedTasks[0].id,
            workType: 'unit',
            hoursWorked: '',
            feetCompleted: '',
            billingCodeId: ''
          }
        ]);
      }
    }
  }, [projectId, open, handleChange, tasks]);

  const handleWorkTypeChange = (value: 'unit' | 'hourly') => {
    setWorkType(value);
  };

  const handleHoursWorkedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHoursWorked(e.target.value);
  };

  const handleTaskEntryChange = (index: number, field: keyof TaskEntry, value: string) => {
    const updatedEntries = [...taskEntries];
    updatedEntries[index] = { ...updatedEntries[index], [field]: value };
    
    if (field === 'workType') {
      if (value === 'unit') {
        updatedEntries[index].hoursWorked = '';
      } else {
        updatedEntries[index].feetCompleted = '';
        updatedEntries[index].billingCodeId = '';
      }
    }
    
    setTaskEntries(updatedEntries);
  };

  const addTaskEntry = () => {
    if (projectTasks.length === 0) {
      toast({
        title: "No tasks available",
        description: "There are no tasks available for this project.",
        variant: "destructive"
      });
      return;
    }

    const usedTaskIds = taskEntries.map(entry => entry.taskId);
    const availableTask = projectTasks.find(task => !usedTaskIds.includes(task.id));

    if (availableTask) {
      setTaskEntries([
        ...taskEntries,
        {
          taskId: availableTask.id,
          workType: 'unit',
          hoursWorked: '',
          feetCompleted: '',
          billingCodeId: ''
        }
      ]);
    } else {
      toast({
        title: "All tasks included",
        description: "All available tasks for this project have been added.",
      });
    }
  };

  const removeTaskEntry = (index: number) => {
    const updatedEntries = taskEntries.filter((_, i) => i !== index);
    setTaskEntries(updatedEntries);
  };

  const validateTaskEntries = () => {
    let isValid = true;
    for (const entry of taskEntries) {
      if (!entry.taskId) {
        toast({
          title: "Error",
          description: "Please select a task for each entry.",
          variant: "destructive"
        });
        isValid = false;
        break;
      }

      if (entry.workType === 'unit') {
        if (!entry.billingCodeId) {
          toast({
            title: "Error",
            description: "Please select a billing code for each unit-based entry.",
            variant: "destructive"
          });
          isValid = false;
          break;
        }
        if (!entry.feetCompleted || Number(entry.feetCompleted) <= 0) {
          toast({
            title: "Error",
            description: "Please enter valid units completed for each unit-based entry.",
            variant: "destructive"
          });
          isValid = false;
          break;
        }
      } else {
        if (!entry.hoursWorked || Number(entry.hoursWorked) <= 0) {
          toast({
            title: "Error",
            description: "Please enter valid hours worked for each hourly entry.",
            variant: "destructive"
          });
          isValid = false;
          break;
        }
      }
    }
    return isValid;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (multipleTasksEnabled) {
      if (!validateTaskEntries()) {
        return;
      }

      for (const entry of taskEntries) {
        const taskInfo = projectTasks.find(t => t.id === entry.taskId);
        
        toast({
          title: "Work logged for multiple tasks",
          description: `Logged work for task: ${taskInfo?.title || entry.taskId}`,
        });
      }
    } else {
      if (workType === 'hourly' && (!hoursWorked || Number(hoursWorked) <= 0)) {
        toast({
          title: "Error",
          description: "Please enter a valid number of hours worked.",
          variant: "destructive"
        });
        return;
      }
      
      const updatedFormData = {
        ...formData,
        isRedlineRevision,
        isTechnicianSubmission: true,
        workType,
        hoursWorked: workType === 'hourly' ? parseFloat(hoursWorked) : undefined
      };
      
      handleSubmit(e);
    }
    
    if (notifyTaskIssuer) {
      const taskIssuer = teamMembers.find(member => member.role.toLowerCase().includes('manager'));
      
      toast({
        title: "Notification sent",
        description: `Work entry has been submitted and ${taskIssuer ? taskIssuer.name : 'the task issuer'} has been notified for approval.`,
      });
    }
    
    toast({
      title: "Work entry submitted",
      description: multipleTasksEnabled ? 
        "Multiple task work entries have been saved and submitted for approval." :
        "Your work entry has been saved to your dashboard and submitted for approval.",
    });
    
    onOpenChange(false);
  };

  const handleCancelTicket = () => {
    if (!cancelNotes.trim()) {
      toast({
        title: "Error",
        description: "Please provide notes explaining why this ticket is being cancelled.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Ticket cancelled",
      description: "The ticket has been cancelled with notes.",
    });
    
    setIsCancelDialogOpen(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Log Work Entry for Completed Review</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={onSubmit} className="space-y-4 mt-4">
          <DateSelector
            date={formData.date}
            onDateSelect={handleDateSelect}
            open={calendarOpen}
            setOpen={setCalendarOpen}
            error={formErrors.date}
          />
          
          <ProjectSelector
            projectId={formData.projectId}
            projects={projects}
            onChange={handleChange}
            error={formErrors.projectId}
          />
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="multipleTasksEnabled" 
              checked={multipleTasksEnabled} 
              onCheckedChange={(checked) => setMultipleTasksEnabled(checked === true)}
            />
            <label 
              htmlFor="multipleTasksEnabled" 
              className="text-sm font-medium leading-none cursor-pointer"
            >
              Log work for multiple tasks in this project
            </label>
          </div>
          
          {multipleTasksEnabled ? (
            <div className="space-y-4">
              {taskEntries.map((entry, index) => (
                <div key={index} className="p-4 border rounded-md space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">Task {index + 1}</h4>
                    {taskEntries.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeTaskEntry(index)}
                        className="h-6 w-6 p-0 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Task
                    </label>
                    <Select 
                      value={entry.taskId}
                      onValueChange={(value) => handleTaskEntryChange(index, 'taskId', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a task" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectTasks.map(task => (
                          <SelectItem key={task.id} value={task.id}>
                            {task.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium mb-1">
                      Work Type
                    </label>
                    <RadioGroup 
                      value={entry.workType} 
                      onValueChange={(value) => handleTaskEntryChange(index, 'workType', value)}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="unit" id={`unit-${index}`} />
                        <Label htmlFor={`unit-${index}`}>Unit-Based Work</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hourly" id={`hourly-${index}`} />
                        <Label htmlFor={`hourly-${index}`}>Hourly Work</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {entry.workType === 'unit' ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Billing Code
                        </label>
                        <Select 
                          value={entry.billingCodeId}
                          onValueChange={(value) => handleTaskEntryChange(index, 'billingCodeId', value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a billing code" />
                          </SelectTrigger>
                          <SelectContent>
                            {billingCodes.map(code => (
                              <SelectItem key={code.id} value={code.id}>
                                {code.code} - {code.description} (${code.ratePerFoot.toFixed(2)}/unit)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label htmlFor={`feetCompleted-${index}`} className="block text-sm font-medium mb-1">
                          Units Completed
                        </label>
                        <Input
                          id={`feetCompleted-${index}`}
                          type="number"
                          value={entry.feetCompleted}
                          onChange={(e) => handleTaskEntryChange(index, 'feetCompleted', e.target.value)}
                          placeholder="Enter units completed"
                          min="0"
                          className="w-full"
                        />
                      </div>
                    </>
                  ) : (
                    <div>
                      <label htmlFor={`hoursWorked-${index}`} className="block text-sm font-medium mb-1">
                        Hours Worked
                      </label>
                      <div className="relative">
                        <Input
                          id={`hoursWorked-${index}`}
                          type="number"
                          value={entry.hoursWorked}
                          onChange={(e) => handleTaskEntryChange(index, 'hoursWorked', e.target.value)}
                          placeholder="Enter hours worked"
                          min="0"
                          step="0.5"
                          className="w-full"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          hrs
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTaskEntry}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Task
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-medium mb-1">
                  Work Type
                </label>
                <RadioGroup 
                  value={workType} 
                  onValueChange={(value) => handleWorkTypeChange(value as 'unit' | 'hourly')}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unit" id="unit" />
                    <Label htmlFor="unit">Unit-Based Work</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hourly" id="hourly" />
                    <Label htmlFor="hourly">Hourly Work</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {workType === 'unit' ? (
                <>
                  <BillingCodeSelector
                    billingCodeId={formData.billingCodeId}
                    billingCodes={billingCodes}
                    onChange={handleChange}
                    error={formErrors.billingCodeId}
                  />
                  
                  <FeetCompletedInput
                    value={formData.feetCompleted}
                    onChange={handleChange}
                    error={formErrors.feetCompleted}
                  />
                  
                  {previewRevenue !== null && (
                    <RevenuePreview previewAmount={previewRevenue} />
                  )}
                </>
              ) : (
                <div>
                  <label htmlFor="hoursWorked" className="block text-sm font-medium mb-1">
                    Hours Worked
                  </label>
                  <div className="relative">
                    <Input
                      type="number"
                      id="hoursWorked"
                      value={hoursWorked}
                      onChange={handleHoursWorkedChange}
                      placeholder="Enter hours worked"
                      min="0"
                      step="0.5"
                      className="w-full"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      hrs
                    </div>
                  </div>
                </div>
              )}
              
              <TeamMemberSelector
                teamMemberId={formData.teamMemberId}
                teamMembers={formTeamMembers}
                onChange={handleChange}
                error={formErrors.teamMemberId}
              />
            </>
          )}
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="redlineRevision" 
              checked={isRedlineRevision} 
              onCheckedChange={(checked) => setIsRedlineRevision(checked === true)}
            />
            <label 
              htmlFor="redlineRevision" 
              className="text-sm font-medium leading-none cursor-pointer"
            >
              Redline Revision Made
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="notifyTaskIssuer" 
              checked={notifyTaskIssuer} 
              onCheckedChange={(checked) => setNotifyTaskIssuer(checked === true)}
            />
            <label 
              htmlFor="notifyTaskIssuer" 
              className="text-sm font-medium leading-none cursor-pointer"
            >
              Notify task issuer for approval
            </label>
          </div>
          
          <AttachmentButton 
            attachments={formData.attachments || []} 
            onAttach={handleFileAttachment}
            error={formErrors.attachments}
          />
          
          <DialogFooter className="mt-4">
            <div className="flex justify-between w-full">
              <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10">
                    <CircleX className="size-4 mr-1" />
                    Cancel Ticket
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel Ticket</AlertDialogTitle>
                    <AlertDialogDescription>
                      Please provide a reason for cancelling this ticket. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  
                  <Textarea
                    value={cancelNotes}
                    onChange={(e) => setCancelNotes(e.target.value)}
                    placeholder="Enter reason for cancellation..."
                    className="mt-2"
                    rows={4}
                  />
                  
                  <AlertDialogFooter className="mt-4">
                    <AlertDialogCancel>Go Back</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCancelTicket} className="bg-destructive hover:bg-destructive/90">
                      Confirm Cancel
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="bg-fieldvision-orange hover:bg-fieldvision-orange/90 flex items-center gap-2"
              >
                <Send className="size-4" />
                {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
