
import React from 'react';
import { Search, Filter, FileCheck, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { FilterBar } from '@/components/ui/FilterBar';

interface WorkEntriesHeaderProps {
  search: string;
  setSearch: (search: string) => void;
  isFiltersOpen: boolean;
  setIsFiltersOpen: (isOpen: boolean) => void;
  selectMode: boolean;
  selectedCount: number;
  handleCreateInvoice: () => void;
  handleCancelInvoice: () => void;
}

export const WorkEntriesHeader: React.FC<WorkEntriesHeaderProps> = ({
  search,
  setSearch,
  isFiltersOpen,
  setIsFiltersOpen,
  selectMode,
  selectedCount,
  handleCreateInvoice,
  handleCancelInvoice
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <div className="flex-1 min-w-[200px] max-w-md">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search work entries..."
              className="pl-8 h-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="flex items-center gap-1 h-9 px-3"
          size="sm"
        >
          <Filter size={14} />
          Filters
        </Button>
        <Button 
          variant={selectMode ? "secondary" : "default"}
          className="flex items-center gap-1 h-9 px-3"
          size="sm"
          onClick={handleCreateInvoice}
        >
          <FileCheck size={14} />
          {selectMode ? (
            selectedCount > 0 ? `Create Invoice (${selectedCount})` : "Create Invoice"
          ) : "Create Invoice"}
        </Button>
        
        {selectMode && (
          <Button 
            variant="destructive"
            className="flex items-center gap-1 h-9 px-3"
            size="sm"
            onClick={handleCancelInvoice}
          >
            <X size={14} />
            Cancel
          </Button>
        )}
      </div>
      
      <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        <CollapsibleContent>
          <Card className="bg-card">
            <CardContent className="p-4">
              <FilterBar />
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
