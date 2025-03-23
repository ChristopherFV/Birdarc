
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useApp, WorkEntry } from '@/context/AppContext';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface EditWorkEntryDialogProps {
  entry: WorkEntry;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditWorkEntryDialog: React.FC<EditWorkEntryDialogProps> = ({
  entry,
  open,
  onOpenChange
}) => {
  const { projects, billingCodes, teamMembers, updateWorkEntry } = useApp();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    date: new Date(entry.date),
    projectId: entry.projectId,
    billingCodeId: entry.billingCodeId,
    feetCompleted: entry.feetCompleted.toString(),
    teamMemberId: entry.teamMemberId,
  });
  
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const selectedBillingCode = billingCodes.find(code => code.id === formData.billingCodeId);
  const unitType = selectedBillingCode?.unitType || 'foot';
  
  const getUnitLabel = () => {
    switch (unitType) {
      case 'foot': return 'ft';
      case 'meter': return 'm';
      case 'each': return 'ea';
      default: return 'unit';
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, date }));
      setCalendarOpen(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const errors: Record<string, string> = {};
    
    if (!formData.projectId) {
      errors.projectId = 'Please select a project';
    }
    
    if (!formData.billingCodeId) {
      errors.billingCodeId = 'Please select a billing code';
    }
    
    if (!formData.feetCompleted) {
      errors.feetCompleted = 'Please enter units completed';
    } else if (isNaN(parseFloat(formData.feetCompleted)) || parseFloat(formData.feetCompleted) <= 0) {
      errors.feetCompleted = 'Please enter a valid positive number';
    }
    
    if (!formData.teamMemberId) {
      errors.teamMemberId = 'Please select a team member';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Submit the form
    setIsSubmitting(true);
    
    try {
      updateWorkEntry({
        id: entry.id,
        date: format(formData.date, 'yyyy-MM-dd'),
        projectId: formData.projectId,
        billingCodeId: formData.billingCodeId,
        feetCompleted: parseFloat(formData.feetCompleted),
        teamMemberId: formData.teamMemberId,
        companyId: entry.companyId,
        invoiceStatus: entry.invoiceStatus
      });
      
      // Show success message
      toast({
        title: "Work entry updated",
        description: "The work entry has been successfully updated.",
      });
      
      // Close the dialog
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating work entry:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update work entry. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Work Entry</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Date Field */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className={`w-full justify-start text-left font-normal ${
                    formErrors.date ? 'border-destructive' : ''
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(formData.date, 'MMMM d, yyyy')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {formErrors.date && (
              <p className="text-destructive text-xs">{formErrors.date}</p>
            )}
          </div>
          
          {/* Project Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="projectId">Project</Label>
            <select
              id="projectId"
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-background border rounded-md text-sm 
                focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors
                ${formErrors.projectId ? 'border-destructive' : 'border-input'}`}
            >
              <option value="">Select Project</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            {formErrors.projectId && (
              <p className="text-destructive text-xs">{formErrors.projectId}</p>
            )}
          </div>
          
          {/* Billing Code Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="billingCodeId">Billing Code</Label>
            <select
              id="billingCodeId"
              name="billingCodeId"
              value={formData.billingCodeId}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-background border rounded-md text-sm 
                focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors
                ${formErrors.billingCodeId ? 'border-destructive' : 'border-input'}`}
            >
              <option value="">Select Billing Code</option>
              {billingCodes.map(code => {
                const codeUnitType = code.unitType || 'foot';
                const unitLabel = codeUnitType === 'foot' ? 'ft' : codeUnitType === 'meter' ? 'm' : 'ea';
                return (
                  <option key={code.id} value={code.id}>
                    {code.code} - {code.description} (${code.ratePerFoot.toFixed(2)}/{unitLabel})
                  </option>
                );
              })}
            </select>
            {formErrors.billingCodeId && (
              <p className="text-destructive text-xs">{formErrors.billingCodeId}</p>
            )}
          </div>
          
          {/* Units Completed Input */}
          <div className="space-y-2">
            <Label htmlFor="feetCompleted">Units Completed</Label>
            <div className="relative">
              <Input
                type="number"
                id="feetCompleted"
                name="feetCompleted"
                value={formData.feetCompleted}
                onChange={handleChange}
                min="0"
                step="1"
                className={formErrors.feetCompleted ? 'border-destructive' : ''}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                {getUnitLabel()}
              </div>
            </div>
            {formErrors.feetCompleted && (
              <p className="text-destructive text-xs">{formErrors.feetCompleted}</p>
            )}
          </div>
          
          {/* Team Member Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="teamMemberId">Team Member</Label>
            <select
              id="teamMemberId"
              name="teamMemberId"
              value={formData.teamMemberId}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-background border rounded-md text-sm 
                focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors
                ${formErrors.teamMemberId ? 'border-destructive' : 'border-input'}`}
            >
              <option value="">Select Team Member</option>
              {teamMembers.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name} - {member.role}
                </option>
              ))}
            </select>
            {formErrors.teamMemberId && (
              <p className="text-destructive text-xs">{formErrors.teamMemberId}</p>
            )}
          </div>
          
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
