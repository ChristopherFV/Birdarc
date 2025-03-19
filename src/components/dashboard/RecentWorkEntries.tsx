
import React from 'react';
import { useApp } from '@/context/AppContext';
import { format } from 'date-fns';
import { FileText, Calendar, ArrowRight, List } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const RecentWorkEntries: React.FC = () => {
  const { getFilteredEntries, projects, billingCodes, teamMembers, calculateRevenue } = useApp();
  
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
                    <TableCell className="p-2 text-right whitespace-nowrap">
                      <p className="font-medium">${revenue.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {entry.feetCompleted} ft ({billingCode?.code})
                      </p>
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
    </Card>
  );
};
