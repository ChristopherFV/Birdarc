
import React from 'react';
import { ProjectFilter } from './filters/ProjectFilter';
import { TeamMemberFilter } from './filters/TeamMemberFilter';
import { DateRangeFilter } from './filters/DateRangeFilter';
import { GroupByFilter } from './filters/GroupByFilter';
import { BillingCodeFilter } from './filters/BillingCodeFilter';
import { ExportButton } from './filters/ExportButton';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileFilterBar } from './MobileFilterBar';

export const FilterBar = () => {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return <MobileFilterBar />;
  }
  
  return (
    <div className="flex flex-wrap gap-2 pb-2">
      <DateRangeFilter />
      <ProjectFilter />
      <TeamMemberFilter />
      <BillingCodeFilter />
      <GroupByFilter />
      <div className="ml-auto">
        <ExportButton />
      </div>
    </div>
  );
};
