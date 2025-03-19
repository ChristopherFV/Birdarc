
// Define types for the application
export type DateRangeType = 'day' | 'week' | 'month' | 'custom';
export type GroupByType = 'day' | 'week' | 'month' | 'year';

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

// Project creation type
export type NewProject = {
  name: string;
  client: string;
  billingCodes: Omit<BillingCode, 'id'>[];
};

// Context type
export type AppContextType = {
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
  addProject: (project: NewProject) => void;
  
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
  
  calculateRevenue: (entry: WorkEntry, billingCodes: BillingCode[]) => number;
};
