
import React, { useState } from 'react';
import { Filter, ChevronDown, X, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DateRangeFilter } from './filters/DateRangeFilter';
import { GroupByFilter } from './filters/GroupByFilter';
import { ProjectFilter } from './filters/ProjectFilter';
import { TeamMemberFilter } from './filters/TeamMemberFilter';
import { BillingCodeFilter } from './filters/BillingCodeFilter';
import { ExportButton } from './filters/ExportButton';
import { Card } from './card';

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
    <Card className="shadow-sm mb-4 overflow-hidden">
      <div className="p-3">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-muted-foreground" />
            <span className="text-sm font-medium">Filters</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 text-xs px-2">
              <ArrowUpDown size={12} className="mr-1" />
              Sort
            </Button>
            <ExportButton />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full flex items-center justify-between px-3 py-1 text-sm h-9"
                onClick={() => setActiveFilter('date')}
              >
                <span>Date Range</span>
                <ChevronDown size={14} />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[70vh] rounded-t-xl pt-1">
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
                variant="outline" 
                size="sm" 
                className="w-full flex items-center justify-between px-3 py-1 text-sm h-9"
                onClick={() => setActiveFilter('group')}
              >
                <span>Group By</span>
                <ChevronDown size={14} />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[70vh] rounded-t-xl pt-1">
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
                variant="outline" 
                size="sm" 
                className="w-full flex items-center justify-between px-3 py-1 text-sm h-9"
                onClick={() => setActiveFilter('project')}
              >
                <span>Project</span>
                <ChevronDown size={14} />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[70vh] rounded-t-xl pt-1">
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
                variant="outline" 
                size="sm" 
                className="w-full flex items-center justify-between px-3 py-1 text-sm h-9"
                onClick={() => setActiveFilter('team')}
              >
                <span>Team</span>
                <ChevronDown size={14} />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[70vh] rounded-t-xl pt-1">
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
                variant="outline" 
                size="sm" 
                className="w-full flex items-center justify-between px-3 py-1 text-sm h-9"
                onClick={() => setActiveFilter('billing')}
              >
                <span>Billing</span>
                <ChevronDown size={14} />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[70vh] rounded-t-xl pt-1">
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
    </Card>
  );
};
