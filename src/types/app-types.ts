// Define types for the application
export type DateRangeType = 'day' | 'week' | 'month' | 'custom';
export type GroupByType = 'day' | 'week' | 'month' | 'year';
export type BillingUnitType = 'foot' | 'meter' | 'each';

export type Project = {
  id: string;
  name: string;
  client: string;
  billingType?: 'hourly' | 'unit';
  hourlyRate?: number;
  serviceName?: string;
  useContractor?: boolean;
  contractorHourlyRate?: number;
};

export type BillingCode = {
  id: string;
  code: string;
  description: string;
  ratePerFoot: number;
  unitType?: BillingUnitType; // Default is 'foot' if not specified
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
  geoJsonId?: string; // Reference to a GeoJSON feature
  locationData?: {
    lat: number;
    lng: number;
    address?: string;
  };
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
  billingType?: 'hourly' | 'unit';
  hourlyRate?: number;
  serviceName?: string;
  useContractor?: boolean;
  contractorHourlyRate?: number;
};

// GeoJSON Feature properties
export type GeoJsonFeatureProperties = {
  id: string;
  name: string;
  description?: string;
  billingCodeId?: string;
  projectId?: string;
  ratePerUnit?: number;
  unitType?: 'foot' | 'meter' | 'each';
  completed?: boolean;
  completedDate?: string;
  completedBy?: string;
  teamMemberId?: string;
  workEntryId?: string;
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
  billingUnit: BillingUnitType;
  selectedBillingCodeId: string | null;
  
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
  setBillingUnit: (unit: BillingUnitType) => void;
  setSelectedBillingCodeId: (billingCodeId: string | null) => void;
  
  // Utilities
  getFilteredEntries: () => WorkEntry[];
  exportData: (type: 'raw' | 'summary') => void;
  
  calculateRevenue: (entry: WorkEntry, billingCodes: BillingCode[]) => number;
  calculateContractorCost: (entry: WorkEntry, billingCodes: BillingCode[], projects: Project[]) => number;
};
