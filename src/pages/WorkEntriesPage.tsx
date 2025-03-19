
import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { format } from 'date-fns';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Calendar,
  ArrowRight, 
  FileText,
  Filter
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FilterBar } from '@/components/ui/FilterBar';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const WorkEntriesPage: React.FC = () => {
  const { 
    getFilteredEntries, 
    projects, 
    billingCodes, 
    teamMembers, 
    calculateRevenue,
    selectedProject,
    setSelectedProject,
    selectedTeamMember,
    setSelectedTeamMember
  } = useApp();
  
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const entriesPerPage = 10;
  
  // Get filtered entries based on global filters
  const filteredEntries = getFilteredEntries()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Apply additional search filter
  const searchFilteredEntries = filteredEntries.filter(entry => {
    const projectName = projects.find(p => p.id === entry.projectId)?.name || '';
    const teamMemberName = teamMembers.find(t => t.id === entry.teamMemberId)?.name || '';
    const searchTerms = [
      projectName,
      teamMemberName,
      format(new Date(entry.date), 'MMM d, yyyy'),
      entry.feetCompleted.toString()
    ].join(' ').toLowerCase();
    
    return search === '' || searchTerms.includes(search.toLowerCase());
  });
  
  // Paginate the results
  const totalPages = Math.ceil(searchFilteredEntries.length / entriesPerPage);
  const paginatedEntries = searchFilteredEntries.slice(
    (currentPage - 1) * entriesPerPage, 
    currentPage * entriesPerPage
  );
  
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
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Work Entries</h1>
            <p className="text-muted-foreground">View and manage all work entries</p>
          </div>
        </div>
        
        {/* Filters section */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search work entries..."
                  className="pl-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="flex items-center gap-2"
            >
              <Filter size={16} />
              Filters
            </Button>
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
        
        {/* Work entries table */}
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-0">
            {paginatedEntries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <FileText size={32} className="mb-3 opacity-70" />
                <p className="text-lg">No work entries found</p>
                <p className="text-sm max-w-md mt-1">
                  Try adjusting your search or filter criteria to find what you're looking for.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Team Member</TableHead>
                    <TableHead>Billing Code</TableHead>
                    <TableHead className="text-right">Feet Completed</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedEntries.map((entry) => {
                    const billingCode = getBillingCodeInfo(entry.billingCodeId);
                    const revenue = calculateRevenue(entry, billingCodes);
                    
                    return (
                      <TableRow key={entry.id} className="hover:bg-muted/40">
                        <TableCell>{format(new Date(entry.date), 'MMM d, yyyy')}</TableCell>
                        <TableCell>{getProjectName(entry.projectId)}</TableCell>
                        <TableCell>{getTeamMemberName(entry.teamMemberId)}</TableCell>
                        <TableCell>{billingCode?.code}</TableCell>
                        <TableCell className="text-right">{entry.feetCompleted} ft</TableCell>
                        <TableCell className="text-right font-medium">${revenue.toFixed(2)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="py-4 border-t">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
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
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default WorkEntriesPage;
