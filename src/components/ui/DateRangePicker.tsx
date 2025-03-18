
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { useApp } from '@/context/AppContext';
import { format } from 'date-fns';

export const DateRangePicker: React.FC = () => {
  const { startDate, endDate, setCustomDateRange } = useApp();
  const [selectedRange, setSelectedRange] = useState<{ from: Date; to: Date }>({
    from: startDate,
    to: endDate,
  });
  
  // Update local state when context dates change
  React.useEffect(() => {
    setSelectedRange({
      from: startDate,
      to: endDate,
    });
  }, [startDate, endDate]);
  
  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return;
    
    // If no date is selected or both dates are selected, start a new selection
    if (!selectedRange.from || (selectedRange.from && selectedRange.to)) {
      setSelectedRange({
        from: date,
        to: date,
      });
    } 
    // If only the from date is selected, select the to date
    else if (selectedRange.from && !selectedRange.to) {
      // Ensure from date is before to date
      const from = selectedRange.from;
      const to = date;
      
      if (from.getTime() > to.getTime()) {
        setSelectedRange({
          from: to,
          to: from,
        });
      } else {
        setSelectedRange({
          from,
          to,
        });
      }
    }
  };
  
  const handleApply = () => {
    if (selectedRange.from && selectedRange.to) {
      setCustomDateRange(selectedRange.from, selectedRange.to);
    }
  };
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs">
        <div className="space-y-1">
          <div className="text-muted-foreground">Start Date</div>
          <div className="font-medium">
            {selectedRange.from ? format(selectedRange.from, 'MMM dd, yyyy') : '-'}
          </div>
        </div>
        <span className="text-muted-foreground">→</span>
        <div className="space-y-1 text-right">
          <div className="text-muted-foreground">End Date</div>
          <div className="font-medium">
            {selectedRange.to ? format(selectedRange.to, 'MMM dd, yyyy') : '-'}
          </div>
        </div>
      </div>
      
      <Calendar
        mode="range"
        selected={{
          from: selectedRange.from,
          to: selectedRange.to,
        }}
        onSelect={(range) => {
          if (range?.from && range?.to) {
            setSelectedRange({
              from: range.from,
              to: range.to,
            });
          }
        }}
        className="rounded-md border"
      />
      
      <button
        onClick={handleApply}
        className="w-full py-1.5 bg-fieldvision-blue hover:bg-fieldvision-blue/90 text-white rounded-md text-sm transition-colors"
      >
        Apply Range
      </button>
    </div>
  );
};
