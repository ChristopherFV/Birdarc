
import React from 'react';
import { useWorkEntryForm } from '@/hooks/useWorkEntryForm';
import { QuickBooksSyncIndicator } from '@/components/indicators/QuickBooksSyncIndicator';
import { DateSelector } from '@/components/forms/work-entry/DateSelector';
import { ProjectSelector } from '@/components/forms/work-entry/ProjectSelector';
import { BillingCodeSelector } from '@/components/forms/work-entry/BillingCodeSelector';
import { FeetCompletedInput } from '@/components/forms/work-entry/FeetCompletedInput';
import { RevenuePreview } from '@/components/forms/work-entry/RevenuePreview';
import { TeamMemberSelector } from '@/components/forms/work-entry/TeamMemberSelector';
import { SubmitButton } from '@/components/forms/work-entry/SubmitButton';
import { RecentInvoices } from '@/components/dashboard/RecentInvoices';

export const WorkEntryForm: React.FC = () => {
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
    handleSubmit
  } = useWorkEntryForm();
  
  return (
    <div className="space-y-4">
      {/* QuickBooks Sync Box */}
      <QuickBooksSyncIndicator />
      
      {/* Recent Invoices */}
      <RecentInvoices />
      
      {/* Work Entry Form Box */}
      <div className="bg-card rounded-lg border border-border shadow-subtle p-5 animate-in fade-in" style={{ animationDelay: '200ms' }}>
        <div className="mb-4">
          <h3 className="text-lg font-medium">Log Work Entry</h3>
          <p className="text-muted-foreground text-sm">
            Record completed work for billing
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
          
          {/* Submit Button */}
          <div className="pt-2">
            <SubmitButton isSubmitting={isSubmitting} />
          </div>
        </form>
      </div>
    </div>
  );
};
