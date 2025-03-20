
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskDateRangeProps {
  startDate: Date;
  endDate: Date;
  datePopoverOpen: boolean;
  setDatePopoverOpen: (open: boolean) => void;
  onDateChange: (range: { from: Date; to?: Date }) => void;
}

export const TaskDateRange: React.FC<TaskDateRangeProps> = ({
  startDate,
  endDate,
  datePopoverOpen,
  setDatePopoverOpen,
  onDateChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="date" className="flex items-center">
        <CalendarIcon className="h-4 w-4 mr-1" />
        Date Range
      </Label>
      <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !startDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {startDate ? (
              format(startDate, "MMM dd, yyyy") + 
              (format(startDate, "yyyy-MM-dd") !== format(endDate, "yyyy-MM-dd") 
                ? ` - ${format(endDate, "MMM dd, yyyy")}` 
                : "")
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={{
              from: startDate,
              to: endDate,
            }}
            onSelect={(range) => {
              if (range?.from) {
                onDateChange({
                  from: range.from,
                  to: range.to
                });
              }
            }}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
