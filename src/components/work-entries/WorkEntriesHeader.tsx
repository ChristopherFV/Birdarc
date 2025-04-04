
import React from 'react';
import { Search, Filter, FileCheck, X, FilePlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';

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
      <div className="flex justify-between items-center">
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
        
        <div className="flex items-center gap-2">
          <Button 
            variant={isFiltersOpen ? "secondary" : "outline"}
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="flex items-center gap-1 h-9 px-3"
            size="sm"
          >
            <Filter size={14} />
            {isFiltersOpen ? "Hide Filters" : "Show Filters"}
          </Button>
          
          {selectMode ? (
            <>
              <Button 
                variant="blue"
                className="flex items-center gap-1 h-9 px-3"
                size="sm"
                onClick={handleCreateInvoice}
                style={{ backgroundColor: "#0EA5E9" }}
              >
                <FileCheck size={14} />
                {selectedCount > 0 ? `Create Invoice (${selectedCount})` : "Create Invoice"}
              </Button>
              
              <Button 
                variant="destructive"
                className="flex items-center gap-1 h-9 px-3"
                size="sm"
                onClick={handleCancelInvoice}
              >
                <X size={14} />
                Cancel
              </Button>
            </>
          ) : (
            <Button 
              variant="blue"
              className="flex items-center gap-1 h-9 px-3"
              size="sm"
              onClick={handleCreateInvoice}
              style={{ backgroundColor: "#0EA5E9" }}
            >
              <FilePlus size={14} />
              Create Invoice
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
