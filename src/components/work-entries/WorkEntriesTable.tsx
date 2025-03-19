
import React from 'react';
import { format } from 'date-fns';
import { useApp } from '@/context/AppContext';
import { Pencil, ArrowUp, ArrowDown } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { WorkEntry } from '@/types/app-types';
import { CheckCircle2, Mail, Circle } from 'lucide-react';

type SortColumn = 'date' | 'project' | 'teamMember' | 'billingCode' | 'status' | 'feetCompleted' | 'revenue' | null;
type SortDirection = 'asc' | 'desc';

interface WorkEntriesTableProps {
  entries: WorkEntry[];
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  handleSort: (column: SortColumn) => void;
  onEditEntry: (entry: WorkEntry) => void;
  selectMode: boolean;
  selectedEntries: Record<string, boolean>;
  handleSelectEntry: (entryId: string, isChecked: boolean) => void;
  handleSelectAll: (isChecked: boolean) => void;
}

export const WorkEntriesTable: React.FC<WorkEntriesTableProps> = ({
  entries,
  sortColumn,
  sortDirection,
  currentPage,
  setCurrentPage,
  handleSort,
  onEditEntry,
  selectMode,
  selectedEntries,
  handleSelectEntry,
  handleSelectAll
}) => {
  const { projects, teamMembers, billingCodes, calculateRevenue } = useApp();
  const entriesPerPage = 10;
  const totalPages = Math.ceil(entries.length / entriesPerPage);
  const paginatedEntries = entries.slice(
    (currentPage - 1) * entriesPerPage, 
    currentPage * entriesPerPage
  );
  
  const renderSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) return null;
    
    return sortDirection === 'asc' 
      ? <ArrowUp size={14} className="ml-1" /> 
      : <ArrowDown size={14} className="ml-1" />;
  };
  
  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'Unknown Project';
  };
  
  const getBillingCodeInfo = (billingCodeId: string) => {
    return billingCodes.find(b => b.id === billingCodeId);
  };
  
  const getTeamMemberName = (teamMemberId: string) => {
    const member = teamMembers.find(m => m.id === teamMemberId);
    return member?.name || 'Unknown';
  };
  
  const getInvoiceStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge variant="soft-green" className="shadow-sm px-2.5 py-1 flex items-center gap-1.5 min-w-[90px] justify-center">
            <CheckCircle2 size={14} className="text-green-600" />
            <span>Paid</span>
          </Badge>
        );
      case 'invoiced':
        return (
          <Badge variant="soft-orange" className="shadow-sm px-2.5 py-1 flex items-center gap-1.5 min-w-[90px] justify-center">
            <Mail size={14} className="text-orange-600" />
            <span>Invoiced</span>
          </Badge>
        );
      case 'not_invoiced':
      default:
        return (
          <Badge variant="soft-gray" className="shadow-sm px-2.5 py-1 flex items-center gap-1.5 min-w-[90px] justify-center">
            <Circle size={14} className="text-slate-500" />
            <span>Not Invoiced</span>
          </Badge>
        );
    }
  };

  if (paginatedEntries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
        <FileText size={32} className="mb-3 opacity-70" />
        <p className="text-lg">No work entries found</p>
        <p className="text-sm max-w-md mt-1">
          Try adjusting your search or filter criteria to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            {selectMode && (
              <TableHead className="w-10 pr-0">
                <Checkbox 
                  id="select-all" 
                  onCheckedChange={(checked) => handleSelectAll(checked === true)}
                  className="ml-1"
                />
              </TableHead>
            )}
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('date')}
            >
              <div className="flex items-center">
                Date
                {renderSortIcon('date')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer" 
              onClick={() => handleSort('project')}
            >
              <div className="flex items-center">
                Project
                {renderSortIcon('project')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer" 
              onClick={() => handleSort('teamMember')}
            >
              <div className="flex items-center">
                Team Member
                {renderSortIcon('teamMember')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer" 
              onClick={() => handleSort('billingCode')}
            >
              <div className="flex items-center">
                Billing Code
                {renderSortIcon('billingCode')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer" 
              onClick={() => handleSort('status')}
            >
              <div className="flex items-center">
                Status
                {renderSortIcon('status')}
              </div>
            </TableHead>
            <TableHead 
              className="text-right cursor-pointer" 
              onClick={() => handleSort('feetCompleted')}
            >
              <div className="flex items-center justify-end">
                Feet Completed
                {renderSortIcon('feetCompleted')}
              </div>
            </TableHead>
            <TableHead 
              className="text-right cursor-pointer" 
              onClick={() => handleSort('revenue')}
            >
              <div className="flex items-center justify-end">
                Revenue
                {renderSortIcon('revenue')}
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedEntries.map((entry) => {
            const billingCode = getBillingCodeInfo(entry.billingCodeId);
            const revenue = calculateRevenue(entry, billingCodes);
            const isSelectable = entry.invoiceStatus === 'not_invoiced';
            
            return (
              <TableRow key={entry.id} className="hover:bg-muted/40">
                {selectMode && (
                  <TableCell className="pr-0">
                    {isSelectable ? (
                      <Checkbox 
                        id={`select-${entry.id}`}
                        checked={selectedEntries[entry.id] || false}
                        onCheckedChange={(checked) => handleSelectEntry(entry.id, checked === true)}
                        className="ml-1"
                      />
                    ) : (
                      <div className="w-4 h-4 ml-1"></div>
                    )}
                  </TableCell>
                )}
                <TableCell>{format(new Date(entry.date), 'MMM d, yyyy')}</TableCell>
                <TableCell>{getProjectName(entry.projectId)}</TableCell>
                <TableCell>{getTeamMemberName(entry.teamMemberId)}</TableCell>
                <TableCell>{billingCode?.code}</TableCell>
                <TableCell>{getInvoiceStatusBadge(entry.invoiceStatus)}</TableCell>
                <TableCell className="text-right">{entry.feetCompleted} ft</TableCell>
                <TableCell className="text-right font-medium">${revenue.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onEditEntry(entry)}
                    title="Edit work entry"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      
      {totalPages > 1 && (
        <div className="py-4 border-t">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink 
                    isActive={currentPage === i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
};

import { FileText } from 'lucide-react';
