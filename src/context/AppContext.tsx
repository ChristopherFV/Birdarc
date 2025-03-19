
import React, { createContext, useContext, useState, useEffect } from 'react';
import { format, subDays, subMonths } from 'date-fns';
import { mockProjects, mockBillingCodes, mockTeamMembers, mockWorkEntries, mockCompanies } from '@/utils/mockData';

// Define types
export type DateRangeType = 'day' | 'week' | 'month' | 'custom';
export type GroupByType = 'week' | 'month' | 'year';

export type Project = {
  id: string;
  name: string;
  client: string;
};

export type BillingCode = {
  id: string;
  code: string;
  description: string;
  ratePerFoot: number;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
};

export type InvoiceStatus = 'not_invoiced' | 'invoiced' | 'paid';

export type WorkEntry = {
  id: string;
  date: string;
  projectId: string;
  billingCodeId: string;
  feetCompleted: number;
  teamMemberId: string;
  companyId: string;
  invoiceStatus: InvoiceStatus;
};

export type Company = {
  id: string;
  name: string;
  logo?: string;
};

// Calculate revenue for a work entry
export const calculateRevenue = (entry: WorkEntry, billingCodes: BillingCode[]): number => {
  const billingCode = billingCodes.find(code => code.id === entry.billingCodeId);
  if (!billingCode) return 0;
  return entry.feetCompleted * billingCode.ratePerFoot;
};

// Context type
type AppContextType = {
  // Data
  workEntries: WorkEntry[];
  projects: Project[];
  billingCodes: BillingCode[];
  teamMembers: TeamMember[];
  companies: Company[];
  selectedCompany: Company;
  
  // Filters
  dateRange: DateRangeType;
  startDate: Date;
  endDate: Date;
  groupBy: GroupByType;
  selectedProject: string | null;
  selectedTeamMember: string | null;
  
  // CRUD operations
  addWorkEntry: (entry: Omit<WorkEntry, 'id'>) => void;
  updateWorkEntry: (entry: WorkEntry) => void;
  deleteWorkEntry: (id: string) => void;
  
  // Filter setters
  setDateRange: (range: DateRangeType) => void;
  setCustomDateRange: (start: Date, end: Date) => void;
  setGroupBy: (groupBy: GroupByType) => void;
  setSelectedProject: (projectId: string | null) => void;
  setSelectedTeamMember: (teamMemberId: string | null) => void;
  setSelectedCompany: (company: Company) => void;
  
  // Utilities
  getFilteredEntries: () => WorkEntry[];
  exportData: (type: 'raw' | 'summary') => void;
  
  // Added calculateRevenue to the context type
  calculateRevenue: (entry: WorkEntry, billingCodes: BillingCode[]) => number;
};

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for data
  const [workEntries, setWorkEntries] = useState<WorkEntry[]>(mockWorkEntries);
  const [projects] = useState<Project[]>(mockProjects);
  const [billingCodes] = useState<BillingCode[]>(mockBillingCodes);
  const [teamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [companies] = useState<Company[]>(mockCompanies);
  const [selectedCompany, setSelectedCompany] = useState<Company>(mockCompanies[0]);
  
  // State for filters
  const [dateRange, setDateRange] = useState<DateRangeType>('month');
  const [startDate, setStartDate] = useState<Date>(subMonths(new Date(), 1));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [groupBy, setGroupBy] = useState<GroupByType>('week');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedTeamMember, setSelectedTeamMember] = useState<string | null>(null);
  
  // Update date range when the dateRange type changes
  useEffect(() => {
    const now = new Date();
    switch (dateRange) {
      case 'day':
        setStartDate(new Date(now.setHours(0, 0, 0, 0)));
        setEndDate(new Date(now.setHours(23, 59, 59, 999)));
        break;
      case 'week':
        setStartDate(subDays(now, 7));
        setEndDate(now);
        break;
      case 'month':
        setStartDate(subMonths(now, 1));
        setEndDate(now);
        break;
      // For 'custom', don't change dates as they are set manually
    }
  }, [dateRange]);
  
  // CRUD operations
  const addWorkEntry = (entry: Omit<WorkEntry, 'id'>) => {
    const newEntry: WorkEntry = {
      ...entry,
      id: crypto.randomUUID(),
      companyId: selectedCompany.id,
    };
    setWorkEntries([...workEntries, newEntry]);
  };
  
  const updateWorkEntry = (updatedEntry: WorkEntry) => {
    setWorkEntries(workEntries.map(entry => 
      entry.id === updatedEntry.id ? updatedEntry : entry
    ));
  };
  
  const deleteWorkEntry = (id: string) => {
    setWorkEntries(workEntries.filter(entry => entry.id !== id));
  };
  
  // Filter entries based on current filters
  const getFilteredEntries = (): WorkEntry[] => {
    return workEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      const inDateRange = entryDate >= startDate && entryDate <= endDate;
      const matchesProject = selectedProject ? entry.projectId === selectedProject : true;
      const matchesTeamMember = selectedTeamMember ? entry.teamMemberId === selectedTeamMember : true;
      const matchesCompany = entry.companyId === selectedCompany.id;
      
      return inDateRange && matchesProject && matchesTeamMember && matchesCompany;
    });
  };
  
  // Custom date range setter
  const setCustomDateRange = (start: Date, end: Date) => {
    setDateRange('custom');
    setStartDate(start);
    setEndDate(end);
  };
  
  // Export data functionality
  const exportData = (type: 'raw' | 'summary') => {
    const filteredEntries = getFilteredEntries();
    
    if (type === 'raw') {
      // CSV with all details
      const csvData = [
        ['Date', 'Project', 'Billing Code', 'Feet Completed', 'Revenue', 'Team Member'],
        ...filteredEntries.map(entry => {
          const project = projects.find(p => p.id === entry.projectId);
          const billingCode = billingCodes.find(b => b.id === entry.billingCodeId);
          const teamMember = teamMembers.find(t => t.id === entry.teamMemberId);
          const revenue = calculateRevenue(entry, billingCodes);
          
          return [
            entry.date,
            project?.name,
            billingCode?.code,
            entry.feetCompleted,
            revenue.toFixed(2),
            teamMember?.name
          ];
        })
      ];
      
      const csvContent = csvData.map(row => row.join(',')).join('\n');
      downloadFile(csvContent, 'fieldvision_raw_data.csv', 'text/csv');
    } else {
      // Summary data by project per month
      const summaryData: Record<string, Record<string, { feet: number, revenue: number }>> = {};
      
      filteredEntries.forEach(entry => {
        const project = projects.find(p => p.id === entry.projectId);
        const billingCode = billingCodes.find(b => b.id === entry.billingCodeId);
        if (!project || !billingCode) return;
        
        const monthYear = format(new Date(entry.date), 'MMM yyyy');
        const revenue = entry.feetCompleted * billingCode.ratePerFoot;
        
        if (!summaryData[project.name]) {
          summaryData[project.name] = {};
        }
        
        if (!summaryData[project.name][monthYear]) {
          summaryData[project.name][monthYear] = { feet: 0, revenue: 0 };
        }
        
        summaryData[project.name][monthYear].feet += entry.feetCompleted;
        summaryData[project.name][monthYear].revenue += revenue;
      });
      
      // Convert summary to CSV
      const months = Array.from(new Set(
        filteredEntries.map(entry => format(new Date(entry.date), 'MMM yyyy'))
      )).sort();
      
      const csvData = [
        ['Project', ...months.map(m => `${m} Feet`), ...months.map(m => `${m} Revenue`)],
        ...Object.entries(summaryData).map(([project, data]) => {
          return [
            project,
            ...months.map(month => data[month]?.feet.toString() || '0'),
            ...months.map(month => data[month]?.revenue.toFixed(2) || '0.00')
          ];
        })
      ];
      
      const csvContent = csvData.map(row => row.join(',')).join('\n');
      downloadFile(csvContent, 'fieldvision_summary.csv', 'text/csv');
    }
  };
  
  // Helper to download files
  const downloadFile = (content: string, fileName: string, contentType: string) => {
    const a = document.createElement('a');
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  };
  
  // Provide all values
  const value: AppContextType = {
    workEntries,
    projects,
    billingCodes,
    teamMembers,
    companies,
    selectedCompany,
    
    dateRange,
    startDate,
    endDate,
    groupBy,
    selectedProject,
    selectedTeamMember,
    
    addWorkEntry,
    updateWorkEntry,
    deleteWorkEntry,
    
    setDateRange,
    setCustomDateRange,
    setGroupBy,
    setSelectedProject,
    setSelectedTeamMember,
    setSelectedCompany,
    
    getFilteredEntries,
    exportData,
    calculateRevenue,
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Hook for using the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
