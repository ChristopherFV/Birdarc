
import React from 'react';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DateSelectorProps {
  date: Date;
  onDateSelect: (date: Date | undefined) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  error?: string;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  date,
  onDateSelect,
  open,
  setOpen,
  error
}) => {
  return (
    <div>
      <label htmlFor="date" className="block text-sm font-medium mb-1">
        Date
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            id="date"
            className={`
              w-full flex items-center justify-between px-3 py-2 bg-background 
              border rounded-md text-left text-sm focus:outline-none focus:ring-2 
              focus:ring-primary/20 focus:border-primary transition-colors
              ${error ? 'border-destructive' : 'border-input'}
            `}
          >
            {format(date, 'MMMM d, yyyy')}
            <Calendar size={16} className="text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={onDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-destructive text-xs mt-1">{error}</p>
      )}
    </div>
  );
};
