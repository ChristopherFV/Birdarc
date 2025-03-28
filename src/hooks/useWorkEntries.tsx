
import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { WorkEntry, SortColumn, SortDirection } from '@/types/app-types';
import { useToast } from '@/hooks/use-toast';
import { useAddInvoiceDialog } from '@/hooks/useAddInvoiceDialog';

export const useWorkEntries = () => {
  const { 
    getFilteredEntries, 
    projects, 
    billingCodes, 
    teamMembers,
    calculateRevenue
  } = useApp();
  
  const { toast } = useToast();
  const { openAddInvoiceDialog } = useAddInvoiceDialog();
  
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<WorkEntry | null>(null);
  const [sortColumn, setSortColumn] = useState<SortColumn>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectMode, setSelectMode] = useState(false);
  const [selectedEntries, setSelectedEntries] = useState<Record<string, boolean>>({});
  
  const filteredEntries = getFilteredEntries();
  
  // Add computed properties to entries for compatibility
  const entriesWithComputedProps = useMemo(() => {
    return filteredEntries.map(entry => ({
      ...entry,
      footage: entry.feetCompleted, // Alias for feetCompleted
      revenue: calculateRevenue(entry, billingCodes) // Compute revenue
    }));
  }, [filteredEntries, calculateRevenue, billingCodes]);
  
  // Filter entries by search term
  const searchFilteredEntries = useMemo(() => {
    return entriesWithComputedProps.filter(entry => {
      const projectName = projects.find(p => p.id === entry.projectId)?.name || '';
      const teamMemberName = teamMembers.find(t => t.id === entry.teamMemberId)?.name || '';
      const searchTerms = [
        projectName,
        teamMemberName,
        new Date(entry.date).toISOString(),
        entry.feetCompleted.toString()
      ].join(' ').toLowerCase();
      
      return search === '' || searchTerms.includes(search.toLowerCase());
    });
  }, [entriesWithComputedProps, search, projects, teamMembers]);
  
  // Sort entries
  const sortedEntries = useMemo(() => {
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
          const codeA = billingCodes.find(b => b.id === a.billingCodeId)?.code || '';
          const codeB = billingCodes.find(b => b.id === a.billingCodeId)?.code || '';
          valueA = codeA;
          valueB = codeB;
          break;
        case 'footage':
          valueA = a.feetCompleted;
          valueB = b.feetCompleted;
          break;
        case 'revenue':
          valueA = a.revenue;
          valueB = b.revenue;
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
  }, [searchFilteredEntries, sortColumn, sortDirection, projects, teamMembers, billingCodes]);
  
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };
  
  const handleEditEntry = (entry: WorkEntry) => {
    setEditingEntry(entry);
  };
  
  const handleSelectEntry = (entryId: string, isChecked: boolean) => {
    setSelectedEntries(prev => ({
      ...prev,
      [entryId]: isChecked
    }));
  };
  
  const handleSelectAll = (isChecked: boolean) => {
    const newSelectedEntries: Record<string, boolean> = {};
    sortedEntries.forEach(entry => {
      if (entry.invoiceStatus === 'not_invoiced') {
        newSelectedEntries[entry.id] = isChecked;
      }
    });
    setSelectedEntries(newSelectedEntries);
  };
  
  const selectedCount = Object.values(selectedEntries).filter(Boolean).length;
  
  const calculateTotalSelectedRevenue = () => {
    return sortedEntries
      .filter(entry => selectedEntries[entry.id])
      .reduce((sum, entry) => sum + (entry.revenue || 0), 0);
  };
  
  const handleCreateInvoice = () => {
    if (!selectMode) {
      setSelectMode(true);
      return;
    }
    
    if (selectedCount === 0) {
      toast({
        title: "No entries selected",
        description: "Please select at least one work entry to create an invoice."
      });
      return;
    }
    
    openAddInvoiceDialog();
  };
  
  const handleCancelInvoice = () => {
    setSelectMode(false);
    setSelectedEntries({});
  };
  
  return {
    search,
    setSearch,
    currentPage,
    setCurrentPage,
    isFiltersOpen,
    setIsFiltersOpen,
    editingEntry,
    setEditingEntry,
    sortColumn,
    sortDirection,
    selectMode,
    selectedEntries,
    sortedEntries,
    selectedCount,
    handleSort,
    handleEditEntry,
    handleSelectEntry,
    handleSelectAll,
    calculateTotalSelectedRevenue,
    handleCreateInvoice,
    handleCancelInvoice
  };
};
