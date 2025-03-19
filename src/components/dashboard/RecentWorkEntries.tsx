
import React, { useState } from 'react';
import { useApp, WorkEntry } from '@/context/AppContext';
import { format } from 'date-fns';
import { FileText, Calendar, ArrowRight, List, Pen, Trash, CircleCheck, Circle, Mail, CheckCircle2, FileCheck } from 'lucide-react';
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

export const RecentWorkEntries: React.FC = () => {
  const { getFilteredEntries, projects, billingCodes, teamMembers, calculateRevenue, deleteWorkEntry, updateWorkEntry } = useApp();
  const { toast } = useToast();
  
  // State for tracking which entry is being edited
  const [editingEntry, setEditingEntry] = useState<null | WorkEntry>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 25;
  
  // Selected entries state
  const [selectedEntries, setSelectedEntries] = useState<Record<string, boolean>>({});
  
  // Get all entries, sort by date (newest first)
  const allEntries = getFilteredEntries()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
  // Calculate pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = allEntries.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(allEntries.length / entriesPerPage);
  
  // Get selected entries count
  const selectedCount = Object.values(selectedEntries).filter(Boolean).length;
  
  // Selection handlers
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
    // Get the IDs of all selected entries
    const selectedEntryIds = Object.entries(selectedEntries)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => id);
    
    // Mark selected entries as invoiced
    selectedEntryIds.forEach(id => {
      const entry = allEntries.find(e => e.id === id);
      if (entry) {
        updateWorkEntry({
          ...entry,
          invoiceStatus: 'invoiced'
        });
      }
    });
    
    // Clear selections
    setSelectedEntries({});
    
    // Show success toast
    toast({
      title: 'Invoice created',
      description: `Successfully created invoice with ${selectedEntryIds.length} work entries`,
    });
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
          <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white px-2.5 py-1 flex items-center gap-1.5 min-w-[90px] justify-center shadow-sm animate-fade-in">
            <CheckCircle2 size={14} className="text-white" />
            <span>Paid</span>
          </Badge>
        );
      case 'invoiced':
        return (
          <Badge variant="secondary" className="bg-fieldvision-accent-orange hover:bg-fieldvision-accent-orange/90 text-white px-2.5 py-1 flex items-center gap-1.5 min-w-[90px] justify-center shadow-sm animate-fade-in">
            <Mail size={14} className="text-white" />
            <span>Invoiced</span>
          </Badge>
        );
      case 'not_invoiced':
      default:
        return (
          <Badge variant="outline" className="bg-white border-slate-200 text-slate-600 px-2.5 py-1 flex items-center gap-1.5 min-w-[90px] justify-center shadow-sm animate-fade-in">
            <Circle size={14} className="text-slate-400" />
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
    // Clear selections when changing pages
    setSelectedEntries({});
  };
  
  // Calculate total revenue for selected entries
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
        {selectedCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedCount} entries selected (${calculateTotalSelectedRevenue().toFixed(2)})
            </span>
            <Button 
              size="sm" 
              onClick={handleCreateInvoice}
              className="flex items-center gap-1.5"
            >
              <FileCheck size={16} />
              Create Invoice
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10 pr-0">
                <Checkbox 
                  id="select-all" 
                  onCheckedChange={(checked) => handleSelectAll(checked === true)}
                  className="ml-1"
                />
              </TableHead>
              <TableHead className="w-32">Invoice Status</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Team Member</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
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
                      {/* Edit Button */}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => setEditingEntry(entry)}
                      >
                        <Pen size={15} />
                        <span className="sr-only">Edit</span>
                      </Button>
                      
                      {/* Delete Button */}
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
        
        {/* Pagination */}
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
      
      {/* Edit Work Entry Dialog */}
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
