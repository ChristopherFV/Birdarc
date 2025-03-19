
import React, { useState } from 'react';
import { useApp, WorkEntry } from '@/context/AppContext';
import { format } from 'date-fns';
import { FileText, Calendar, ArrowRight, List, Pen, Trash, CircleCheck, Circle, Mail } from 'lucide-react';
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

export const RecentWorkEntries: React.FC = () => {
  const { getFilteredEntries, projects, billingCodes, teamMembers, calculateRevenue, deleteWorkEntry } = useApp();
  const { toast } = useToast();
  
  // State for tracking which entry is being edited
  const [editingEntry, setEditingEntry] = useState<null | WorkEntry>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 25;
  
  // Get all entries, sort by date (newest first)
  const allEntries = getFilteredEntries()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
  // Calculate pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = allEntries.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(allEntries.length / entriesPerPage);
  
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
          <Badge variant="default" className="bg-green-500 hover:bg-green-600 flex items-center gap-1">
            <CircleCheck size={14} />
            <span>Paid</span>
          </Badge>
        );
      case 'invoiced':
        return (
          <Badge variant="secondary" className="bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-1">
            <Mail size={14} />
            <span>Invoiced</span>
          </Badge>
        );
      case 'not_invoiced':
      default:
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Circle size={14} />
            <span>Not Invoiced</span>
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
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Work Entries</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-28">Status</TableHead>
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
              
              return (
                <TableRow key={entry.id} className="hover:bg-muted/40">
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
