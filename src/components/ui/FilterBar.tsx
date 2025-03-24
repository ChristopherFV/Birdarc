
import React from 'react';
import { Filter } from 'lucide-react';
import { DateRangeFilter } from './filters/DateRangeFilter';
import { GroupByFilter } from './filters/GroupByFilter';
import { ProjectFilter } from './filters/ProjectFilter';
import { TeamMemberFilter } from './filters/TeamMemberFilter';
import { BillingCodeFilter } from './filters/BillingCodeFilter';
import { ExportButton } from './filters/ExportButton';

interface FilterBarProps {
  technicianView?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({ 
  technicianView = false 
}) => {
  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle mb-6 p-3">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center text-xs font-medium text-muted-foreground">
          <Filter size={12} className="mr-1" />
          <span>Filters:</span>
        </div>
        
        <ExportButton />
      </div>
      
      <div className="grid grid-cols-5 gap-2 w-full">
        <DateRangeFilter />
        <GroupByFilter />
        <ProjectFilter />
        <TeamMemberFilter technicianView={technicianView} />
        <BillingCodeFilter />
      </div>
    </div>
  );
};
