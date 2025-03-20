
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
    handleSubmit(e);
    toast({
      title: "Work entry submitted",
      description: "Your work entry has been submitted for approval.",
    });
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
          
          {/* Attachment Button */}
          <AttachmentButton 
            attachments={formData.attachments || []} 
            onAttach={handleFileAttachment}
            error={formErrors.attachments}
          />
          
          <DialogFooter className="gap-2 mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
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
