
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ProjectFilter } from '@/components/ui/filters/ProjectFilter';
import { TeamMemberFilter } from '@/components/ui/filters/TeamMemberFilter';
import { DateRangeFilter } from '@/components/ui/filters/DateRangeFilter';
import { GroupByFilter } from '@/components/ui/filters/GroupByFilter';
import { BillingCodeFilter } from '@/components/ui/filters/BillingCodeFilter';
import { ExportButton } from '@/components/ui/filters/ExportButton';

interface MobileFilterBarProps {
  technicianView?: boolean;
}

export const MobileFilterBar: React.FC<MobileFilterBarProps> = ({ technicianView = false }) => {
  const [open, setOpen] = useState(false);
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-2">
          <Filter className="h-4 w-4" />
          <span>Filters & Options</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] py-6">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-xl flex items-center justify-between">
            <span>Filters & Options</span>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </SheetTitle>
        </SheetHeader>
        
        <div className="space-y-4 overflow-y-auto max-h-[calc(85vh-80px)] pb-4">
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Date Range</h3>
            <DateRangeFilter />
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Project</h3>
            <ProjectFilter />
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Team Member</h3>
            <TeamMemberFilter technicianView={technicianView} />
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Billing Code</h3>
            <BillingCodeFilter />
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Group By</h3>
            <GroupByFilter />
          </div>
          
          <div className="mt-6">
            <ExportButton className="w-full" />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
