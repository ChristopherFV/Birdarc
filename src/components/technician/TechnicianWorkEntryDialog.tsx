
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
import { CircleX, Send, Clock } from "lucide-react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useApp } from '@/context/AppContext';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TechnicianWorkEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string;
}

export const TechnicianWorkEntryDialog: React.FC<TechnicianWorkEntryDialogProps> = ({
  open,
  onOpenChange,
  projectId
}) => {
  const { toast } = useToast();
  const { teamMembers } = useApp();
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

  // Set project ID if provided
  useEffect(() => {
    if (projectId && open) {
      const syntheticEvent = {
        target: { name: 'projectId', value: projectId }
      } as React.ChangeEvent<HTMLSelectElement>;
      handleChange(syntheticEvent);
    }
  }, [projectId, open, handleChange]);

  const handleWorkTypeChange = (value: 'unit' | 'hourly') => {
    setWorkType(value);
  };

  const handleHoursWorkedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHoursWorked(e.target.value);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate hours worked if hourly work is selected
    if (workType === 'hourly' && (!hoursWorked || Number(hoursWorked) <= 0)) {
      toast({
        title: "Error",
        description: "Please enter a valid number of hours worked.",
        variant: "destructive"
      });
      return;
    }
    
    // Include the redline revision status and work type in the form data
    const updatedFormData = {
      ...formData,
      isRedlineRevision,
      isTechnicianSubmission: true, // Flag to identify technician submissions
      workType,
      hoursWorked: workType === 'hourly' ? parseFloat(hoursWorked) : undefined
    };
    
    handleSubmit(e);
    
    // Notification to task issuer
    if (notifyTaskIssuer) {
      // Find task issuer (for demo purposes, we'll use the first manager role)
      const taskIssuer = teamMembers.find(member => member.role.toLowerCase().includes('manager'));
      
      toast({
        title: "Notification sent",
        description: `Work entry has been submitted and ${taskIssuer ? taskIssuer.name : 'the task issuer'} has been notified for approval.`,
      });
    }
    
    toast({
      title: "Work entry submitted",
      description: "Your work entry has been saved to your dashboard and submitted for approval.",
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

    // Here you would handle the ticket cancellation
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
          {/* Date Field */}
          <DateSelector
            date={formData.date}
            onDateSelect={handleDateSelect}
            open={calendarOpen}
            setOpen={setCalendarOpen}
            error={formErrors.date}
          />
          
          {/* Project Dropdown */}
          <ProjectSelector
            projectId={formData.projectId}
            projects={projects}
            onChange={handleChange}
            error={formErrors.projectId}
          />
          
          {/* Work Type Selection */}
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
              {/* Billing Code Dropdown - Only show for unit-based work */}
              <BillingCodeSelector
                billingCodeId={formData.billingCodeId}
                billingCodes={billingCodes}
                onChange={handleChange}
                error={formErrors.billingCodeId}
              />
              
              {/* Feet Completed Input - Only show for unit-based work */}
              <FeetCompletedInput
                value={formData.feetCompleted}
                onChange={handleChange}
                error={formErrors.feetCompleted}
              />
              
              {/* Revenue Preview - Only show for unit-based work */}
              {previewRevenue !== null && (
                <RevenuePreview previewAmount={previewRevenue} />
              )}
            </>
          ) : (
            /* Hours Worked Input - Only show for hourly work */
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
          
          {/* Team Member Dropdown */}
          <TeamMemberSelector
            teamMemberId={formData.teamMemberId}
            teamMembers={formTeamMembers}
            onChange={handleChange}
            error={formErrors.teamMemberId}
          />
          
          {/* Redline Revision Checkbox */}
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

          {/* Notify Task Issuer Checkbox */}
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
          
          {/* Attachment Button */}
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
