import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useApp, WorkEntry } from '@/context/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useWorkEntries } from '@/hooks/use-work-entries';

export const RecentWorkEntries = () => {
  const { workEntries, billingCodes, projects, teamMembers, calculateRevenue } = useApp();
  const { showEditDialog, setShowEditDialog, selectedEntry, setSelectedEntry } = useWorkEntries();
  const isMobile = useIsMobile();
  
  // Get most recent 5 entries
  const recentEntries = [...workEntries]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };
  
  const getTeamMemberName = (teamMemberId: string) => {
    const member = teamMembers.find(m => m.id === teamMemberId);
    return member ? member.name : 'Unknown';
  };
  
  const getBillingCodeName = (billingCodeId: string) => {
    const code = billingCodes.find(c => c.id === billingCodeId);
    return code ? code.code : 'Unknown';
  };
  
  const handleEditEntry = (entry: WorkEntry) => {
    setSelectedEntry(entry);
    setShowEditDialog(true);
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg md:text-xl">Recent Work Entries</CardTitle>
          <Button variant="link" size="sm" asChild>
            <Link to="/work-entries">View All</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {recentEntries.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>No recent work entries found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {isMobile ? (
              // Mobile view with cards
              <div className="space-y-4">
                {recentEntries.map((entry) => (
                  <div key={entry.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="font-medium">{getProjectName(entry.projectId)}</div>
                      <Badge variant={
                        entry.invoiceStatus === 'paid' ? 'default' :
                        entry.invoiceStatus === 'invoiced' ? 'secondary' : 'outline'
                      }>
                        {entry.invoiceStatus === 'not_invoiced' ? 'Not Invoiced' : 
                         entry.invoiceStatus === 'invoiced' ? 'Invoiced' : 'Paid'}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(entry.date), 'MMM d, yyyy')}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Team:</span> {getTeamMemberName(entry.teamMemberId)}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Code:</span> {getBillingCodeName(entry.billingCodeId)}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Footage:</span> {entry.feetCompleted}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Revenue:</span> ${calculateRevenue(entry, billingCodes).toFixed(2)}
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-2" 
                      onClick={() => handleEditEntry(entry)}
                    >
                      Edit Entry
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              // Desktop view with table
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Team Member</TableHead>
                    <TableHead>Billing Code</TableHead>
                    <TableHead className="text-right">Footage</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{format(new Date(entry.date), 'MMM d, yyyy')}</TableCell>
                      <TableCell>{getProjectName(entry.projectId)}</TableCell>
                      <TableCell>{getTeamMemberName(entry.teamMemberId)}</TableCell>
                      <TableCell>{getBillingCodeName(entry.billingCodeId)}</TableCell>
                      <TableCell className="text-right">{entry.feetCompleted}</TableCell>
                      <TableCell className="text-right">${calculateRevenue(entry, billingCodes).toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={
                          entry.invoiceStatus === 'paid' ? 'default' :
                          entry.invoiceStatus === 'invoiced' ? 'secondary' : 'outline'
                        }>
                          {entry.invoiceStatus === 'not_invoiced' ? 'Not Invoiced' : 
                           entry.invoiceStatus === 'invoiced' ? 'Invoiced' : 'Paid'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEditEntry(entry)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
