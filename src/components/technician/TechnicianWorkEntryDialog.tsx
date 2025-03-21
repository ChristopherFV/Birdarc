
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
import { CircleX } from "lucide-react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

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
  const {
    formData,
    calendarOpen,
    setCalendarOpen,
    formErrors,
    isSubmitting,
    previewRevenue,
    projects,
    billingCodes,
    teamMembers,
    handleChange,
    handleDateSelect,
    handleSubmit,
    handleFileAttachment
  } = useWorkEntryForm();

  const [cancelNotes, setCancelNotes] = useState('');
  const [isRedlineRevision, setIsRedlineRevision] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  // Set project ID if provided
  useEffect(() => {
    if (projectId && open) {
      const syntheticEvent = {
        target: { name: 'projectId', value: projectId }
      } as React.ChangeEvent<HTMLSelectElement>;
      handleChange(syntheticEvent);
    }
  }, [projectId, open, handleChange]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Include the redline revision status in the form data
    const updatedFormData = {
      ...formData,
      isRedlineRevision
    };
    handleSubmit(e, updatedFormData);
    toast({
      title: "Work entry submitted",
      description: "Your work entry has been submitted for approval.",
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
          
          {/* Billing Code Dropdown */}
          <BillingCodeSelector
            billingCodeId={formData.billingCodeId}
            billingCodes={billingCodes}
            onChange={handleChange}
            error={formErrors.billingCodeId}
          />
          
          {/* Feet Completed Input */}
          <FeetCompletedInput
            value={formData.feetCompleted}
            onChange={handleChange}
            error={formErrors.feetCompleted}
          />
          
          {/* Revenue Preview */}
          {previewRevenue !== null && (
            <RevenuePreview previewAmount={previewRevenue} />
          )}
          
          {/* Team Member Dropdown */}
          <TeamMemberSelector
            teamMemberId={formData.teamMemberId}
            teamMembers={teamMembers}
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
          
          {/* Attachment Button */}
          <AttachmentButton 
            attachments={formData.attachments || []} 
            onAttach={handleFileAttachment}
            error={formErrors.attachments}
          />
          
          <DialogFooter className="gap-2 mt-4 flex-col sm:flex-row">
            <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive">
                  <CircleX className="mr-1" />
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
            
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="bg-fieldvision-orange hover:bg-fieldvision-orange/90"
            >
              {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
