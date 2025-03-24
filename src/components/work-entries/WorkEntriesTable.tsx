import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDistance } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Pencil } from 'lucide-react';
import { Pagination } from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { WorkEntry, SortColumn, SortDirection } from '@/types/app-types';

export interface WorkEntriesTableProps {
  entries: WorkEntry[];
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  handleSort: (column: SortColumn) => void;
  onEditEntry: (entry: WorkEntry) => void;
  selectMode?: boolean;
  selectedEntries?: Set<string>;
  handleSelectEntry?: (id: string) => void;
  handleSelectAll?: () => void;
  renderActions?: (entry: WorkEntry) => React.ReactNode;
}

export const WorkEntriesTable: React.FC<WorkEntriesTableProps> = ({
  entries,
  sortColumn,
  sortDirection,
  currentPage,
  setCurrentPage,
  handleSort,
  onEditEntry,
  selectMode = false,
  selectedEntries = new Set(),
  handleSelectEntry = () => {},
  handleSelectAll = () => {},
  renderActions
}) => {
  // Helper function to show sort direction indicator
  const getSortIndicator = (direction: SortDirection) => {
    return direction === 'asc' ? '↑' : '↓';
  };
  
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            {selectMode && (
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={entries.length > 0 && entries.every(entry => selectedEntries.has(entry.id))}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
            )}
            <TableHead 
              className="w-[180px] cursor-pointer"
              onClick={() => handleSort('date')}
            >
              Date {sortColumn === 'date' && getSortIndicator(sortDirection)}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('project')}
            >
              Project {sortColumn === 'project' && getSortIndicator(sortDirection)}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('teamMember')}
            >
              Team Member {sortColumn === 'teamMember' && getSortIndicator(sortDirection)}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('billingCode')}
            >
              Billing Code {sortColumn === 'billingCode' && getSortIndicator(sortDirection)}
            </TableHead>
            <TableHead 
              className="cursor-pointer text-right"
              onClick={() => handleSort('footage')}
            >
              Footage {sortColumn === 'footage' && getSortIndicator(sortDirection)}
            </TableHead>
            <TableHead 
              className="cursor-pointer text-right"
              onClick={() => handleSort('revenue')}
            >
              Revenue {sortColumn === 'revenue' && getSortIndicator(sortDirection)}
            </TableHead>
            <TableHead className="w-[100px] text-center">Status</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={selectMode ? 9 : 8} className="text-center h-32 text-muted-foreground">
                No work entries found
              </TableCell>
            </TableRow>
          ) : (
            entries.map(entry => (
              <TableRow key={entry.id}>
                {selectMode && (
                  <TableCell>
                    <Checkbox
                      checked={selectedEntries.has(entry.id)}
                      onCheckedChange={() => handleSelectEntry(entry.id)}
                    />
                  </TableCell>
                )}
                <TableCell className="font-medium">
                  {new Date(entry.date).toLocaleDateString()}
                  <div className="text-xs text-muted-foreground">
                    {formatDistance(new Date(entry.date), new Date(), { addSuffix: true })}
                  </div>
                </TableCell>
                <TableCell>{entry.projectId}</TableCell>
                <TableCell>{entry.teamMemberId}</TableCell>
                <TableCell>{entry.billingCodeId}</TableCell>
                <TableCell className="text-right">{entry.footage} ft</TableCell>
                <TableCell className="text-right">${entry.revenue.toFixed(2)}</TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={
                      entry.invoiceStatus === 'uninvoiced' ? 'outline' :
                      entry.invoiceStatus === 'invoiced' ? 'default' :
                      entry.invoiceStatus === 'paid' ? 'success' : 'secondary'
                    }
                  >
                    {entry.invoiceStatus.charAt(0).toUpperCase() + entry.invoiceStatus.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {renderActions ? (
                    renderActions(entry)
                  ) : (
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => onEditEntry(entry)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2">
        <Pagination
          totalItems={entries.length}
          itemsPerPage={10}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

// Helper function to show sort direction indicator
const getSortIndicator = (direction: SortDirection) => {
  return direction === 'asc' ? '↑' : '↓';
};
