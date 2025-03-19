
import React, { useState } from 'react';
import { useApp, WorkEntry } from '@/context/AppContext';
import { format } from 'date-fns';
import { FileText, Calendar, ArrowUp, ArrowDown, List, Pen, Trash, CheckCircle2, Circle, Mail, FileCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { EditWorkEntryDialog } from '@/components/forms/EditWorkEntryDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Checkbox } from '@/components/ui/checkbox';

type SortColumn = 'date' | 'project' | 'teamMember' | 'revenue' | 'status' | null;
type SortDirection = 'asc' | 'desc';

export const RecentWorkEntries: React.FC = () => {
  const { getFilteredEntries, projects, billingCodes, teamMembers, calculateRevenue, deleteWorkEntry, updateWorkEntry } = useApp();
  const { toast } = useToast();
  
  const [editingEntry, setEditingEntry] = useState<null | WorkEntry>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 25;
  const [selectedEntries, setSelectedEntries] = useState<Record<string, boolean>>({});
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectMode, setSelectMode] = useState(false);
  
  const allEntries = getFilteredEntries();
  
  // Apply sorting
  const sortedEntries = React.useMemo(() => {
    if (!sortColumn) {
      // Default sort by date descending if no column is selected
      return [...allEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    
    return [...allEntries].sort((a, b) => {
      let valueA: any;
      let valueB: any;
      
      switch(sortColumn) {
        case 'date':
          valueA = new Date(a.date).getTime();
          valueB = new Date(b.date).getTime();
          break;
        case 'project':
          const projectA = projects.find(p => p.id === a.projectId)?.name || '';
          const projectB = projects.find(p => p.id === b.projectId)?.name || '';
          valueA = projectA.toLowerCase();
          valueB = projectB.toLowerCase();
          break;
        case 'teamMember':
          const memberA = teamMembers.find(t => t.id === a.teamMemberId)?.name || '';
          const memberB = teamMembers.find(t => t.id === b.teamMemberId)?.name || '';
          valueA = memberA.toLowerCase();
          valueB = memberB.toLowerCase();
          break;
        case 'revenue':
          valueA = calculateRevenue(a, billingCodes);
          valueB = calculateRevenue(b, billingCodes);
          break;
        case 'status':
          valueA = a.invoiceStatus;
          valueB = b.invoiceStatus;
          break;
        default:
          valueA = 0;
          valueB = 0;
      }
      
      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      }
    });
  }, [allEntries, sortColumn, sortDirection, projects, teamMembers, calculateRevenue, billingCodes]);
    
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = sortedEntries.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(sortedEntries.length / entriesPerPage);
  
  const selectedCount = Object.values(selectedEntries).filter(Boolean).length;
  const hasSelectedEntries = selectedCount > 0;
  
  const handleSelectEntry = (entryId: string, isChecked: boolean) => {
    setSelectedEntries(prev => ({
      ...prev,
      [entryId]: isChecked
    }));
  };
  
  const handleSelectAll = (isChecked: boolean) => {
    const newSelectedEntries: Record<string, boolean> = {};
    currentEntries.forEach(entry => {
      if (entry.invoiceStatus === 'not_invoiced') {
        newSelectedEntries[entry.id] = isChecked;
      }
    });
    setSelectedEntries(newSelectedEntries);
  };
  
  const handleCreateInvoice = () => {
    if (!selectMode) {
      setSelectMode(true);
      return;
    }
    
    if (selectedCount === 0) {
      toast({
        title: "No entries selected",
        description: "Please select at least one work entry to create an invoice.",
        variant: "destructive"
      });
      return;
    }
    
    const selectedEntryIds = Object.entries(selectedEntries)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => id);
    
    selectedEntryIds.forEach(id => {
      const entry = allEntries.find(e => e.id === id);
      if (entry) {
        updateWorkEntry({
          ...entry,
          invoiceStatus: 'invoiced'
        });
      }
    });
    
    setSelectedEntries({});
    setSelectMode(false);
    
    toast({
      title: 'Invoice created',
      description: `Successfully created invoice with ${selectedEntryIds.length} work entries`,
    });
  };
  
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      // Toggle direction if same column clicked
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new column with default desc direction
      setSortColumn(column);
      setSortDirection('desc');
    }
  };
  
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
          <Badge 
            variant="soft-green" 
            className="shadow-sm px-2.5 py-1 flex items-center gap-1.5 min-w-[90px] justify-center animate-fade-in"
          >
            <CheckCircle2 size={14} className="text-green-600" />
            <span>Paid</span>
          </Badge>
        );
      case 'invoiced':
        return (
          <Badge 
            variant="soft-orange" 
            className="shadow-sm px-2.5 py-1 flex items-center gap-1.5 min-w-[90px] justify-center animate-fade-in"
          >
            <Mail size={14} className="text-orange-600" />
            <span>Invoiced</span>
          </Badge>
        );
      case 'not_invoiced':
      default:
        return (
          <Badge 
            variant="soft-gray" 
            className="shadow-sm px-2.5 py-1 flex items-center gap-1.5 min-w-[90px] justify-center animate-fade-in"
          >
            <Circle size={14} className="text-slate-500" />
            <span>Pending</span>
          </Badge>
        );
    }
  };
  
  const handleDelete = (entryId: string) => {
    deleteWorkEntry(entryId);
    toast({
      title: "Work entry deleted",
      description: "The work entry has been successfully removed.",
    });
  };
  
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    setSelectedEntries({});
  };
  
  const calculateTotalSelectedRevenue = () => {
    return allEntries
      .filter(entry => selectedEntries[entry.id])
      .reduce((sum, entry) => sum + calculateRevenue(entry, billingCodes), 0);
  };
  
  if (allEntries.length === 0) {
    return (
      <Card className="bg-card border-border shadow-sm mb-4 w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Work Entries</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
            <FileText size={24} className="mb-2 opacity-70" />
            <p>No work entries found</p>
            <p className="text-sm">Add your first work entry below</p>
          </div>
        </CardContent>
        <CardFooter className="pt-2 pb-4">
          <Button asChild variant="outline" className="w-full">
            <Link to="/work-entries">
              <List className="mr-2" size={16} />
              View all work entries
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className="bg-card border-border shadow-sm mb-4 w-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium">Work Entries</CardTitle>
        <div className="flex items-center gap-2">
          {selectMode && hasSelectedEntries && (
            <span className="text-sm text-muted-foreground">
              {selectedCount} entries selected (${calculateTotalSelectedRevenue().toFixed(2)})
            </span>
          )}
          <Button 
            size="sm" 
            onClick={handleCreateInvoice}
            className="flex items-center gap-1.5"
            variant={selectMode && !hasSelectedEntries ? "secondary" : "default"}
          >
            <FileCheck size={16} />
            {selectMode ? (
              selectedCount > 0 ? `Create Invoice (${selectedCount})` : "Create Invoice"
            ) : "Create Invoice"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
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
                className="w-32 cursor-pointer"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center">
                  Invoice Status
                  {renderSortIcon('status')}
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
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center">
                  Date
                  {renderSortIcon('date')}
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
            {currentEntries.map((entry) => {
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
                  <TableCell className="p-2">
                    {getInvoiceStatusBadge(entry.invoiceStatus)}
                  </TableCell>
                  <TableCell className="p-2">
                    <div className="font-medium">{getProjectName(entry.projectId)}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {billingCode?.code} - {entry.feetCompleted} ft
                    </div>
                  </TableCell>
                  <TableCell className="p-2">
                    {format(new Date(entry.date), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="p-2">
                    {getTeamMemberName(entry.teamMemberId)}
                  </TableCell>
                  <TableCell className="p-2 text-right whitespace-nowrap">
                    <p className="font-medium">${revenue.toFixed(2)}</p>
                  </TableCell>
                  <TableCell className="p-2 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => setEditingEntry(entry)}
                      >
                        <Pen size={15} />
                        <span className="sr-only">Edit</span>
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash size={15} />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the work entry for {getProjectName(entry.projectId)} 
                              on {format(new Date(entry.date), 'MMMM d, yyyy')}. 
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => handleDelete(entry.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        {totalPages > 1 && (
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink 
                      isActive={currentPage === page}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 pb-4">
        <Button asChild variant="outline" className="w-full">
          <Link to="/work-entries">
            <List className="mr-2" size={16} />
            View all work entries
          </Link>
        </Button>
      </CardFooter>
      
      {editingEntry && (
        <EditWorkEntryDialog
          entry={editingEntry}
          open={!!editingEntry}
          onOpenChange={(open) => {
            if (!open) setEditingEntry(null);
          }}
        />
      )}
    </Card>
  );
};
