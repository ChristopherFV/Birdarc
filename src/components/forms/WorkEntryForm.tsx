
import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { format } from 'date-fns';
import { Calculator, Calendar, CheckCircle } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent } from '@/components/ui/card';
import { RecentWorkEntries } from '@/components/dashboard/RecentWorkEntries';

export const WorkEntryForm: React.FC = () => {
  const { 
    projects, 
    billingCodes, 
    teamMembers, 
    addWorkEntry, 
    calculateRevenue
  } = useApp();
  
  const [formData, setFormData] = useState({
    date: new Date(),
    projectId: '',
    billingCodeId: '',
    feetCompleted: '',
    teamMemberId: ''
  });
  
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewRevenue, setPreviewRevenue] = useState<number | null>(null);
  
  // Handle input changes
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
    
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Update revenue preview if we have both billing code and feet
      if ((name === 'billingCodeId' || name === 'feetCompleted') && 
          newData.billingCodeId && newData.feetCompleted) {
        const feet = parseFloat(newData.feetCompleted);
        if (!isNaN(feet)) {
          const mockEntry = {
            id: '',
            date: '',
            projectId: '',
            billingCodeId: newData.billingCodeId,
            feetCompleted: feet,
            teamMemberId: '',
            companyId: ''
          };
          setPreviewRevenue(calculateRevenue(mockEntry, billingCodes));
        } else {
          setPreviewRevenue(null);
        }
      }
      
      return newData;
    });
  };
  
  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, date }));
      setCalendarOpen(false);
    }
  };
  
  // Handle form submission
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
      errors.feetCompleted = 'Please enter feet completed';
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
      addWorkEntry({
        date: format(formData.date, 'yyyy-MM-dd'),
        projectId: formData.projectId,
        billingCodeId: formData.billingCodeId,
        feetCompleted: parseFloat(formData.feetCompleted),
        teamMemberId: formData.teamMemberId,
        companyId: ''  // This will be set by the context
      });
      
      // Reset form
      setFormData({
        date: new Date(),
        projectId: '',
        billingCodeId: '',
        feetCompleted: '',
        teamMemberId: ''
      });
      
      setPreviewRevenue(null);
      
      // Show success message (could use a toast here)
      console.log('Work entry added successfully');
    } catch (error) {
      console.error('Error adding work entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-4">
      {/* QuickBooks Sync Box */}
      <Card className="bg-card border-border shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-medium">QuickBooks sync'd</span>
            <CheckCircle size={16} className="ml-auto text-green-500" />
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Work Entries */}
      <RecentWorkEntries />
      
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
          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-1">
              Date
            </label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  id="date"
                  className={`
                    w-full flex items-center justify-between px-3 py-2 bg-background 
                    border rounded-md text-left text-sm focus:outline-none focus:ring-2 
                    focus:ring-primary/20 focus:border-primary transition-colors
                    ${formErrors.date ? 'border-destructive' : 'border-input'}
                  `}
                >
                  {format(formData.date, 'MMMM d, yyyy')}
                  <Calendar size={16} className="text-muted-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={formData.date}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {formErrors.date && (
              <p className="text-destructive text-xs mt-1">{formErrors.date}</p>
            )}
          </div>
          
          {/* Project Dropdown */}
          <div>
            <label htmlFor="projectId" className="block text-sm font-medium mb-1">
              Project
            </label>
            <select
              id="projectId"
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              className={`
                w-full px-3 py-2 bg-background border rounded-md text-sm 
                focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary 
                transition-colors
                ${formErrors.projectId ? 'border-destructive' : 'border-input'}
              `}
            >
              <option value="">Select Project</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            {formErrors.projectId && (
              <p className="text-destructive text-xs mt-1">{formErrors.projectId}</p>
            )}
          </div>
          
          {/* Billing Code Dropdown */}
          <div>
            <label htmlFor="billingCodeId" className="block text-sm font-medium mb-1">
              Billing Code
            </label>
            <select
              id="billingCodeId"
              name="billingCodeId"
              value={formData.billingCodeId}
              onChange={handleChange}
              className={`
                w-full px-3 py-2 bg-background border rounded-md text-sm 
                focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary 
                transition-colors
                ${formErrors.billingCodeId ? 'border-destructive' : 'border-input'}
              `}
            >
              <option value="">Select Billing Code</option>
              {billingCodes.map(code => (
                <option key={code.id} value={code.id}>
                  {code.code} - {code.description} (${code.ratePerFoot.toFixed(2)}/ft)
                </option>
              ))}
            </select>
            {formErrors.billingCodeId && (
              <p className="text-destructive text-xs mt-1">{formErrors.billingCodeId}</p>
            )}
          </div>
          
          {/* Feet Completed Input */}
          <div>
            <label htmlFor="feetCompleted" className="block text-sm font-medium mb-1">
              Feet Completed
            </label>
            <div className="relative">
              <input
                type="number"
                id="feetCompleted"
                name="feetCompleted"
                value={formData.feetCompleted}
                onChange={handleChange}
                placeholder="Enter feet"
                min="0"
                step="1"
                className={`
                  w-full px-3 py-2 bg-background border rounded-md text-sm
                  focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary 
                  transition-colors
                  ${formErrors.feetCompleted ? 'border-destructive' : 'border-input'}
                `}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                ft
              </div>
            </div>
            {formErrors.feetCompleted && (
              <p className="text-destructive text-xs mt-1">{formErrors.feetCompleted}</p>
            )}
          </div>
          
          {/* Revenue Preview */}
          {previewRevenue !== null && (
            <div className="flex items-center bg-fieldvision-blue/10 p-3 rounded-md">
              <Calculator size={18} className="text-fieldvision-blue mr-2" />
              <span className="text-sm">
                <span className="text-muted-foreground">Estimated Revenue:</span>{' '}
                <span className="font-medium">${previewRevenue.toFixed(2)}</span>
              </span>
            </div>
          )}
          
          {/* Team Member Dropdown */}
          <div>
            <label htmlFor="teamMemberId" className="block text-sm font-medium mb-1">
              Team Member
            </label>
            <select
              id="teamMemberId"
              name="teamMemberId"
              value={formData.teamMemberId}
              onChange={handleChange}
              className={`
                w-full px-3 py-2 bg-background border rounded-md text-sm 
                focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary 
                transition-colors
                ${formErrors.teamMemberId ? 'border-destructive' : 'border-input'}
              `}
            >
              <option value="">Select Team Member</option>
              {teamMembers.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name} - {member.role}
                </option>
              ))}
            </select>
            {formErrors.teamMemberId && (
              <p className="text-destructive text-xs mt-1">{formErrors.teamMemberId}</p>
            )}
          </div>
          
          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                w-full py-2.5 bg-fieldvision-blue text-white font-medium rounded-md
                hover:bg-fieldvision-blue/90 transition-colors
                ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}
              `}
            >
              {isSubmitting ? 'Saving...' : 'Save Work Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
