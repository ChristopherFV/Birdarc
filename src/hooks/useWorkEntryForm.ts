
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { format } from 'date-fns';

interface FormDataType {
  date: Date;
  projectId: string;
  billingCodeId: string;
  feetCompleted: string;
  teamMemberId: string;
}

interface FormErrorsType {
  [key: string]: string;
}

export const useWorkEntryForm = () => {
  const { projects, billingCodes, teamMembers, addWorkEntry, calculateRevenue } = useApp();
  
  const [formData, setFormData] = useState<FormDataType>({
    date: new Date(),
    projectId: '',
    billingCodeId: '',
    feetCompleted: '',
    teamMemberId: ''
  });
  
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrorsType>({});
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
    const errors: FormErrorsType = {};
    
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

  return {
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
  };
};
