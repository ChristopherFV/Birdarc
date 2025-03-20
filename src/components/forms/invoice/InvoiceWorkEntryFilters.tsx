
import React from 'react';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { DateRangeOption, useInvoiceFilters } from '@/hooks/useInvoiceFilters';
import { Project } from '@/context/AppContext';

interface InvoiceWorkEntryFiltersProps {
  projects: Project[];
  filters: ReturnType<typeof useInvoiceFilters>;
}

export const InvoiceWorkEntryFilters: React.FC<InvoiceWorkEntryFiltersProps> = ({
  projects,
  filters
}) => {
  const { 
    filters: { projectId, dateRangeOption, startDate, endDate }, 
    updateProjectFilter, 
    updateDateRangeOption,
    updateCustomDateRange,
    formatDateRange
  } = filters;

  return (
    <div className="space-y-4 border rounded-md p-4 bg-muted/30">
      <h3 className="text-sm font-medium mb-3">Filter Work Entries</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Project</label>
          <Select 
            value={projectId} 
            onValueChange={updateProjectFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Projects</SelectItem>
              {projects.map(project => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Date Range</label>
          <div className="flex space-x-2">
            <Select 
              value={dateRangeOption} 
              onValueChange={(value) => updateDateRangeOption(value as DateRangeOption)}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current-week">Current Week</SelectItem>
                <SelectItem value="last-week">Last Week</SelectItem>
                <SelectItem value="last-two-weeks">Last Two Weeks</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            
            {dateRangeOption === 'custom' && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-1 justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDateRange()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={{
                      from: startDate,
                      to: endDate
                    }}
                    onSelect={(range) => {
                      if (range?.from && range?.to) {
                        updateCustomDateRange(range.from, range.to);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
