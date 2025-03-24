
import React, { useState, useEffect } from 'react';
import { useWorkEntryForm } from '@/hooks/useWorkEntryForm';
import { DateSelector } from '@/components/forms/work-entry/DateSelector';
import { ProjectSelector } from '@/components/forms/work-entry/ProjectSelector';
import { BillingCodeSelector } from '@/components/forms/work-entry/BillingCodeSelector';
import { FeetCompletedInput } from '@/components/forms/work-entry/FeetCompletedInput';
import { RevenuePreview } from '@/components/forms/work-entry/RevenuePreview';
import { TeamMemberSelector } from '@/components/forms/work-entry/TeamMemberSelector';
import { SubmitButton } from '@/components/forms/work-entry/SubmitButton';
import { AttachmentButton } from '@/components/forms/work-entry/AttachmentButton';
import { Checkbox } from "@/components/ui/checkbox";
import { useSchedule, Task } from '@/context/ScheduleContext';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

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
    handleSubmit,
    handleFileAttachment
  } = useWorkEntryForm();
  
  const [isRedlineRevision, setIsRedlineRevision] = useState(false);
  const [relatedTasks, setRelatedTasks] = useState<Task[]>([]);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const { getTasksByProjectId, updateMultipleTasks } = useSchedule();
  const { toast } = useToast();

  // Fetch related tasks when project is selected
  useEffect(() => {
    if (formData.projectId) {
      const projectTasks = getTasksByProjectId(formData.projectId);
      setRelatedTasks(projectTasks);
    } else {
      setRelatedTasks([]);
    }
    // Reset selected tasks when project changes
    setSelectedTaskIds([]);
  }, [formData.projectId, getTasksByProjectId]);

  // Handle task selection
  const handleTaskSelection = (taskId: string, checked: boolean) => {
    if (checked) {
      setSelectedTaskIds(prev => [...prev, taskId]);
    } else {
      setSelectedTaskIds(prev => prev.filter(id => id !== taskId));
    }
  };

  // Enhanced submit handler to also complete selected tasks
  const enhancedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Call the original submit handler
      await handleSubmit(e);
      
      // If tasks were selected, mark them as completed
      if (selectedTaskIds.length > 0) {
        const updatedTasks = relatedTasks
          .filter(task => selectedTaskIds.includes(task.id))
          .map(task => ({
            ...task,
            status: 'completed' as const
          }));
        
        updateMultipleTasks(updatedTasks);
        
        toast({
          title: "Tasks completed",
          description: `${updatedTasks.length} task(s) have been marked as completed.`,
        });
      }
    } catch (error) {
      console.error("Error submitting work entry with tasks:", error);
    }
  };
  
  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Work Entry Form Box */}
      <div className="bg-card rounded-lg border border-border shadow-subtle p-5 animate-in fade-in flex-grow" style={{ animationDelay: '200ms' }}>
        <div className="mb-4">
          <h3 className="text-lg font-medium">Log Work Entry</h3>
          <p className="text-muted-foreground text-sm">
            Record completed work for billing
          </p>
        </div>
        
        <form onSubmit={enhancedSubmit} className="space-y-4">
          {/* Date Field */}
          <DateSelector
            date={formData.date}
            onDateSelect={handleDateSelect}
            open={calendarOpen}
            setOpen={setCalendarOpen}
            error={formErrors.date} // Changed from formData.date to formErrors.date to correctly pass error string
          />
          
          {/* Project Dropdown */}
          <ProjectSelector
            projectId={formData.projectId}
            projects={projects}
            onChange={handleChange}
            error={formErrors.projectId}
          />
          
          {/* Task Completion Section - Only show if project is selected */}
          {formData.projectId && relatedTasks.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Complete Tasks</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Select tasks to mark as completed when submitting this work entry
              </p>
              <Card className="p-3 max-h-48 overflow-y-auto">
                <div className="space-y-2">
                  {relatedTasks.map(task => (
                    <div key={task.id} className="flex items-start space-x-2">
                      <Checkbox 
                        id={`task-${task.id}`}
                        checked={selectedTaskIds.includes(task.id)}
                        onCheckedChange={(checked) => handleTaskSelection(task.id, checked === true)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label 
                          htmlFor={`task-${task.id}`}
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          {task.title}
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">
                          ID: {task.id}
                        </p>
                      </div>
                    </div>
                  ))}
                  {selectedTaskIds.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedTaskIds.length} task(s) selected
                    </p>
                  )}
                </div>
              </Card>
            </div>
          )}
          
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
          
          {/* Submit Button */}
          <div className="pt-2">
            <SubmitButton 
              isSubmitting={isSubmitting} 
              label={selectedTaskIds.length > 0 ? 
                `Submit & Complete ${selectedTaskIds.length} Task(s)` : 
                "Submit Work Entry"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
