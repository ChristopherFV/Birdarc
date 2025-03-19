
import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { format } from 'date-fns';
import { 
  Search, 
  Calendar,
  ArrowUp, 
  ArrowDown, 
  FileText,
  Filter,
  Pencil,
  CircleCheck,
  Circle,
  Mail,
  CheckCircle2
} from 'lucide-react';
import { SimplePageLayout } from '@/components/layout/SimplePageLayout';
import { Card, CardContent } from '@/components/ui/card';
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
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FilterBar } from '@/components/ui/FilterBar';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { EditWorkEntryDialog } from '@/components/forms/EditWorkEntryDialog';
import { WorkEntry } from '@/context/AppContext';

type SortColumn = 'date' | 'project' | 'teamMember' | 'billingCode' | 'status' | 'feetCompleted' | 'revenue' | null;
type SortDirection = 'asc' | 'desc';

const WorkEntriesPage: React.FC = () => {
  const { 
    getFilteredEntries, 
    projects, 
    billingCodes, 
    teamMembers, 
    calculateRevenue
  } = useApp();
  
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<WorkEntry | null>(null);
  const [sortColumn, setSortColumn] = useState<SortColumn>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const entriesPerPage = 10;
  
  // Get filtered entries based on global filters
  const filteredEntries = getFilteredEntries();
  
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
  
  // Apply sorting
  const sortedEntries = React.useMemo(() => {
    return [...searchFilteredEntries].sort((a, b) => {
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
        case 'billingCode':
          valueA = billingCodes.find(b => b.id === a.billingCodeId)?.code || '';
          valueB = billingCodes.find(b => b.id === b.billingCodeId)?.code || '';
          break;
        case 'status':
          valueA = a.invoiceStatus;
          valueB = b.invoiceStatus;
          break;
        case 'feetCompleted':
          valueA = a.feetCompleted;
          valueB = b.feetCompleted;
          break;
        case 'revenue':
          valueA = calculateRevenue(a, billingCodes);
          valueB = calculateRevenue(b, billingCodes);
          break;
        default:
          valueA = new Date(a.date).getTime();
          valueB = new Date(b.date).getTime();
      }
      
      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      }
    });
  }, [searchFilteredEntries, sortColumn, sortDirection, projects, teamMembers, billingCodes, calculateRevenue]);
  
  // Paginate the results
  const totalPages = Math.ceil(sortedEntries.length / entriesPerPage);
  const paginatedEntries = sortedEntries.slice(
    (currentPage - 1) * entriesPerPage, 
    currentPage * entriesPerPage
  );
  
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
  
  const handleEditEntry = (entry: WorkEntry) => {
    setEditingEntry(entry);
  };
  
  return (
    <SimplePageLayout 
      title="Work Entries" 
      subtitle="View and manage all work entries"
    >
      <div className="space-y-6">
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
                    
                    return (
                      <TableRow key={entry.id} className="hover:bg-muted/40">
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
                            onClick={() => handleEditEntry(entry)}
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
    </SimplePageLayout>
  );
};

export default WorkEntriesPage;
