import { useState } from 'react';
import { startOfWeek, endOfWeek, subWeeks, format } from 'date-fns';

export type DateRangeOption = 'current-week' | 'last-week' | 'last-two-weeks' | 'last-month' | 'custom';

interface InvoiceFilters {
  projectId: string;
  dateRangeOption: DateRangeOption;
  startDate: Date;
  endDate: Date;
}

export const useInvoiceFilters = () => {
  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const currentWeekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
  
  const [filters, setFilters] = useState<InvoiceFilters>({
    projectId: '',
    dateRangeOption: 'current-week',
    startDate: currentWeekStart,
    endDate: currentWeekEnd,
  });

  const updateProjectFilter = (projectId: string) => {
    setFilters(prev => ({ ...prev, projectId }));
  };

  const updateDateRangeOption = (option: DateRangeOption) => {
    let startDate = filters.startDate;
    let endDate = filters.endDate;

    switch (option) {
      case 'current-week':
        startDate = currentWeekStart;
        endDate = currentWeekEnd;
        break;
      case 'last-week':
        startDate = startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 });
        endDate = endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 });
        break;
      case 'last-two-weeks':
        startDate = startOfWeek(subWeeks(new Date(), 2), { weekStartsOn: 1 });
        endDate = currentWeekEnd;
        break;
      case 'last-month':
        // Go back approximately 4 weeks
        startDate = startOfWeek(subWeeks(new Date(), 4), { weekStartsOn: 1 });
        endDate = currentWeekEnd;
        break;
      case 'custom':
        // Keep existing dates for custom option
        break;
    }

    setFilters(prev => ({
      ...prev,
      dateRangeOption: option,
      startDate,
      endDate
    }));
  };

  const updateCustomDateRange = (startDate: Date, endDate: Date) => {
    setFilters(prev => ({
      ...prev,
      dateRangeOption: 'custom',
      startDate,
      endDate
    }));
  };

  const formatDateRange = () => {
    return `${format(filters.startDate, 'MMM d, yyyy')} - ${format(filters.endDate, 'MMM d, yyyy')}`;
  };

  return {
    filters,
    updateProjectFilter,
    updateDateRangeOption,
    updateCustomDateRange,
    formatDateRange,
  };
};
