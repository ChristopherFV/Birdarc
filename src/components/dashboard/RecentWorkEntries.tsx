
import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { format } from 'date-fns';
import { FileText, Calendar, ArrowRight, List, Pen, Trash, CircleCheck, Circle, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { EditWorkEntryDialog } from '@/components/forms/EditWorkEntryDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export const RecentWorkEntries: React.FC = () => {
  const { getFilteredEntries, projects, billingCodes, teamMembers, calculateRevenue, deleteWorkEntry } = useApp();
  const { toast } = useToast();
  
  // State for tracking which entry is being edited
  const [editingEntry, setEditingEntry] = useState<null | WorkEntry>(null);
  
  // Get all entries, sort by date (newest first), and take the 5 most recent ones
  const recentEntries = getFilteredEntries()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
    
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
  
  if (recentEntries.length === 0) {
    return (
      <Card className="bg-card border-border shadow-sm mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Recent Work Entries</CardTitle>
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
    <Card className="bg-card border-border shadow-sm mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Recent Work Entries</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="max-h-[200px]">
          <Table>
            <TableBody>
              {recentEntries.map((entry) => {
                const billingCode = getBillingCodeInfo(entry.billingCodeId);
                const revenue = calculateRevenue(entry, billingCodes);
                
                return (
                  <TableRow key={entry.id} className="hover:bg-muted/40">
                    <TableCell className="p-2">
                      <div className="flex items-start gap-2">
                        <Calendar size={16} className="mt-0.5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{getProjectName(entry.projectId)}</p>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <span>{format(new Date(entry.date), 'MMM d, yyyy')}</span>
                            <ArrowRight size={10} className="mx-1" />
                            <span>{getTeamMemberName(entry.teamMemberId)}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-2">
                      {getInvoiceStatusBadge(entry.invoiceStatus)}
                    </TableCell>
                    <TableCell className="p-2 text-right whitespace-nowrap">
                      <p className="font-medium">${revenue.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {entry.feetCompleted} ft ({billingCode?.code})
                      </p>
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
        </ScrollArea>
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
