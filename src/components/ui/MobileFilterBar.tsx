
import React, { useState } from 'react';
import { Filter, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DateRangeFilter } from './filters/DateRangeFilter';
import { GroupByFilter } from './filters/GroupByFilter';
import { ProjectFilter } from './filters/ProjectFilter';
import { TeamMemberFilter } from './filters/TeamMemberFilter';
import { BillingCodeFilter } from './filters/BillingCodeFilter';
import { ExportButton } from './filters/ExportButton';

interface MobileFilterBarProps {
  technicianView?: boolean;
}

export const MobileFilterBar: React.FC<MobileFilterBarProps> = ({ 
  technicianView = false 
}) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const renderFilterContent = () => {
    switch (activeFilter) {
      case 'date':
        return <DateRangeFilter />;
      case 'group':
        return <GroupByFilter />;
      case 'project':
        return <ProjectFilter />;
      case 'team':
        return <TeamMemberFilter technicianView={technicianView} />;
      case 'billing':
        return <BillingCodeFilter />;
      default:
        return null;
    }
  };

  const closeFilter = () => setActiveFilter(null);

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle mb-4 p-3">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center text-xs font-medium text-muted-foreground">
          <Filter size={12} className="mr-1" />
          <span>Filters:</span>
        </div>
        
        <ExportButton />
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="secondary" 
              size="sm" 
              className="w-full flex items-center justify-between px-3 py-1 text-xs"
              onClick={() => setActiveFilter('date')}
            >
              <span>Date Range</span>
              <ChevronDown size={12} />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-72">
            <div className="py-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Date Range</h3>
                <Button variant="ghost" size="sm" onClick={closeFilter}>
                  <X size={18} />
                </Button>
              </div>
              <DateRangeFilter />
            </div>
          </SheetContent>
        </Sheet>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="secondary" 
              size="sm" 
              className="w-full flex items-center justify-between px-3 py-1 text-xs"
              onClick={() => setActiveFilter('group')}
            >
              <span>Group By</span>
              <ChevronDown size={12} />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-72">
            <div className="py-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Group By</h3>
                <Button variant="ghost" size="sm" onClick={closeFilter}>
                  <X size={18} />
                </Button>
              </div>
              <GroupByFilter />
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="secondary" 
              size="sm" 
              className="w-full flex items-center justify-between px-3 py-1 text-xs"
              onClick={() => setActiveFilter('project')}
            >
              <span>Project</span>
              <ChevronDown size={12} />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-72">
            <div className="py-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Project</h3>
                <Button variant="ghost" size="sm" onClick={closeFilter}>
                  <X size={18} />
                </Button>
              </div>
              <ProjectFilter />
            </div>
          </SheetContent>
        </Sheet>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="secondary" 
              size="sm" 
              className="w-full flex items-center justify-between px-3 py-1 text-xs"
              onClick={() => setActiveFilter('team')}
            >
              <span>Team</span>
              <ChevronDown size={12} />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-72">
            <div className="py-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Team Member</h3>
                <Button variant="ghost" size="sm" onClick={closeFilter}>
                  <X size={18} />
                </Button>
              </div>
              <TeamMemberFilter technicianView={technicianView} />
            </div>
          </SheetContent>
        </Sheet>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="secondary" 
              size="sm" 
              className="w-full flex items-center justify-between px-3 py-1 text-xs"
              onClick={() => setActiveFilter('billing')}
            >
              <span>Billing</span>
              <ChevronDown size={12} />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-72">
            <div className="py-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Billing Code</h3>
                <Button variant="ghost" size="sm" onClick={closeFilter}>
                  <X size={18} />
                </Button>
              </div>
              <BillingCodeFilter />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
