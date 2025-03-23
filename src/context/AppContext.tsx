import React, { createContext, useContext, useState, useEffect } from 'react';
import { format, subDays, subMonths } from 'date-fns';
import { mockProjects, mockBillingCodes, mockTeamMembers, mockWorkEntries, mockCompanies } from '@/utils/mockData';
import { calculateRevenue, calculateContractorCost, exportDataToCSV } from '@/utils/app-utils';

// Import the types
import {
  DateRangeType,
  GroupByType,
  Project,
  BillingCode,
  TeamMember,
  InvoiceStatus,
  WorkEntry,
  Company,
  AppContextType,
  NewProject
} from '@/types/app-types';

// Re-export the types for backward compatibility
export type {
  DateRangeType,
  GroupByType,
  Project,
  BillingCode,
  TeamMember,
  InvoiceStatus,
  WorkEntry,
  Company
};

// Re-export the utility functions for backward compatibility
export { calculateRevenue, calculateContractorCost };

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for data
  const [workEntries, setWorkEntries] = useState<WorkEntry[]>(mockWorkEntries);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [billingCodes, setBillingCodes] = useState<BillingCode[]>(mockBillingCodes);
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
  
  // Add a new project with billing codes
  const addProject = (newProject: NewProject) => {
    // Create new project
    const projectId = crypto.randomUUID();
    const project: Project = {
      id: projectId,
      name: newProject.name,
      client: newProject.client
    };
    
    // Create new billing codes for the project
    const newBillingCodes: BillingCode[] = newProject.billingCodes.map(code => ({
      id: crypto.randomUUID(),
      code: code.code,
      description: code.description,
      ratePerFoot: code.ratePerFoot
    }));
    
    // Update state
    setProjects([...projects, project]);
    setBillingCodes([...billingCodes, ...newBillingCodes]);
    
    return projectId;
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
    exportDataToCSV(filteredEntries, type, projects, billingCodes, teamMembers);
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
    addProject,
    
    setDateRange,
    setCustomDateRange,
    setGroupBy,
    setSelectedProject,
    setSelectedTeamMember,
    setSelectedCompany,
    
    getFilteredEntries,
    exportData,
    calculateRevenue,
    calculateContractorCost,
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
