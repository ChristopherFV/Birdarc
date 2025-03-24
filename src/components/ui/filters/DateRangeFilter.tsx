
import React from 'react';
import { CalendarDays } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { DateRangeType } from '@/context/AppContext';
import { FilterDropdown, FilterDropdownItem } from './FilterDropdown';

const dateRangeLabels: Record<DateRangeType, string> = {
  day: 'Today',
  week: 'This Week',
  month: 'This Month',
  custom: 'Custom Range'
};

export const DateRangeFilter: React.FC = () => {
  const { dateRange, setDateRange } = useApp();
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  
  const handleDateRangeChange = (range: DateRangeType) => {
    setDateRange(range);
    setShowDatePicker(false);
  };
  
  return (
    <FilterDropdown
      label={
        <>
          <CalendarDays size={10} className="mr-1" />
          <span className="truncate">{dateRangeLabels[dateRange]}</span>
        </>
      }
      isOpen={showDatePicker}
      toggleOpen={() => setShowDatePicker(!showDatePicker)}
      onClose={() => setShowDatePicker(false)}
      width="w-auto"
    >
      <div className="p-2">
        <div className="flex flex-col space-y-1">
          {(['day', 'week', 'month'] as DateRangeType[]).map((range) => (
            <FilterDropdownItem
              key={range}
              onClick={() => handleDateRangeChange(range)}
              isSelected={dateRange === range}
            >
              {dateRangeLabels[range]}
            </FilterDropdownItem>
          ))}
        </div>
        <div className="mt-2">
          <DateRangePicker />
        </div>
      </div>
    </FilterDropdown>
  );
};
