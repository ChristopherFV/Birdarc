
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { 
  AppContextType,
  Project,
  Task,
  User,
  Team,
  TeamMember,
  BillingCode,
  WorkEntry,
  Company,
  DateRangeType,
  GroupByType,
  BillingUnitType,
  InvoiceStatus
} from '@/types/app-types';

// Create the context with the imported type
const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>(() => {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
  });
  const [users, setUsers] = useState<User[]>([
    { id: 'user-1', name: 'John Davis', email: 'john.davis@example.com', teamId: 'team-1' },
    { id: 'user-2', name: 'Alice Smith', email: 'alice.smith@example.com', teamId: 'team-2' },
    { id: 'user-3', name: 'Bob Williams', email: 'bob.williams@example.com', teamId: 'team-1' },
  ]);
  const [teams, setTeams] = useState<Team[]>([
    { id: 'team-1', name: 'Fiber Optics Team' },
    { id: 'team-2', name: 'Underground Cabling Team' },
  ]);
  const [projects, setProjects] = useState<Project[]>([
    { id: 'project-1', name: 'Cedar Heights Fiber', client: 'Cedar Heights HOA', status: 'active', progress: 60, location: 'Cedar Heights' },
    { id: 'project-2', name: 'Oakridge Expansion', client: 'Oakridge Properties', status: 'planning', progress: 10, location: 'Oakridge' },
    { id: 'project-3', name: 'Downtown Connection', client: 'City of Metropolis', status: 'active', progress: 35, location: 'Downtown' },
    { id: 'project-4', name: 'Westside Network', client: 'Westside Communities', status: 'completed', progress: 100, location: 'Westside' },
  ]);
  
  // Mock data for the extended app context
  const [workEntries, setWorkEntries] = useState<WorkEntry[]>([]);
  const [billingCodes, setBillingCodes] = useState<BillingCode[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [companies, setCompanies] = useState<Company[]>([
    { id: 'company-1', name: 'FieldVision Networks' }
  ]);
  const [selectedCompany, setSelectedCompany] = useState<Company>(companies[0]);
  const [dateRange, setDateRange] = useState<DateRangeType>('week');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [groupBy, setGroupBy] = useState<GroupByType>('day');
  const [selectedTeamMember, setSelectedTeamMember] = useState<string | null>(null);
  const [billingUnit, setBillingUnit] = useState<BillingUnitType>('foot');
  const [selectedBillingCodeId, setSelectedBillingCodeId] = useState<string | null>(null);
  
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = { id: uuidv4(), ...task };
    setTasks([...tasks, newTask]);
    toast({
      title: 'Task Created',
      description: 'Your task has been successfully created.',
    });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      )
    );
    toast({
      title: 'Task Updated',
      description: 'Your task has been successfully updated.',
    });
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
    toast({
      title: 'Task Deleted',
      description: 'Your task has been successfully deleted.',
    });
  };

  // Extended functionality for the app context
  const addWorkEntry = (entry: Omit<WorkEntry, 'id'>) => {
    const newEntry: WorkEntry = { id: uuidv4(), ...entry };
    setWorkEntries([...workEntries, newEntry]);
    toast({
      title: 'Work Entry Added',
      description: 'Your work entry has been successfully added.',
    });
  };
  
  const updateWorkEntry = (entry: WorkEntry) => {
    setWorkEntries(
      workEntries.map((e) => (e.id === entry.id ? entry : e))
    );
    toast({
      title: 'Work Entry Updated',
      description: 'Your work entry has been successfully updated.',
    });
  };
  
  const deleteWorkEntry = (id: string) => {
    setWorkEntries(workEntries.filter((entry) => entry.id !== id));
    toast({
      title: 'Work Entry Deleted',
      description: 'Your work entry has been successfully deleted.',
    });
  };
  
  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject: Project = { id: uuidv4(), ...project };
    setProjects([...projects, newProject]);
    toast({
      title: 'Project Added',
      description: 'Your project has been successfully added.',
    });
  };
  
  const addTeamMember = (member: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = { id: uuidv4(), ...member };
    setTeamMembers([...teamMembers, newMember]);
    toast({
      title: 'Team Member Added',
      description: 'The team member has been successfully added.',
    });
  };
  
  const updateTeamMember = (member: TeamMember) => {
    setTeamMembers(
      teamMembers.map((m) => (m.id === member.id ? member : m))
    );
    toast({
      title: 'Team Member Updated',
      description: 'The team member has been successfully updated.',
    });
  };
  
  const deleteTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter((member) => member.id !== id));
    toast({
      title: 'Team Member Deleted',
      description: 'The team member has been successfully deleted.',
    });
  };
  
  const setCustomDateRange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };
  
  const getFilteredEntries = () => {
    // Implement filtering logic based on selected filters
    return workEntries;
  };
  
  const calculateRevenue = (entry: WorkEntry, codes: BillingCode[]) => {
    const billingCode = codes.find(code => code.id === entry.billingCodeId);
    return billingCode ? entry.feetCompleted * billingCode.ratePerFoot : 0;
  };
  
  const calculateContractorCost = (entry: WorkEntry, codes: BillingCode[], projs: Project[]) => {
    // Placeholder implementation
    return 0;
  };

  const exportData = (type: 'raw' | 'summary' | 'files-by-project') => {
    // Dummy data for demonstration
    const data = [
      { name: 'John', age: 30, city: 'New York' },
      { name: 'Jane', age: 28, city: 'Los Angeles' },
    ];

    // Convert data to CSV format
    const csv = convertToCSV(data);

    // Create a Blob from the CSV data
    const blob = new Blob([csv], { type: 'text/csv' });

    // Create a temporary link element
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data.${type}.csv`;
    document.body.appendChild(a);
    a.click();

    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: 'Exported',
      description: `Data exported as ${type}.csv`,
    });
  };

  // Function to convert data to CSV format
  const convertToCSV = (data: any[]) => {
    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));

    for (const row of data) {
      const values = headers.map((header) => {
        const escaped = ('' + row[header]).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  };

  return (
    <AppContext.Provider
      value={{
        // Original context values
        tasks,
        addTask,
        updateTask,
        deleteTask,
        users,
        teams,
        projects,
        selectedProject,
        setSelectedProject,
        exportData,
        
        // Extended context values
        workEntries,
        billingCodes,
        teamMembers,
        companies,
        selectedCompany,
        dateRange,
        startDate,
        endDate,
        groupBy,
        selectedTeamMember,
        billingUnit,
        selectedBillingCodeId,
        
        // Extended functions
        addWorkEntry,
        updateWorkEntry,
        deleteWorkEntry,
        addProject,
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,
        setDateRange,
        setCustomDateRange,
        setGroupBy,
        setSelectedTeamMember,
        setSelectedCompany,
        setBillingUnit,
        setSelectedBillingCodeId,
        getFilteredEntries,
        calculateRevenue,
        calculateContractorCost
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Export all the types so they can be imported from this file
export type {
  Project,
  Task,
  User,
  Team,
  TeamMember,
  BillingCode,
  WorkEntry,
  Company,
  DateRangeType,
  GroupByType,
  BillingUnitType,
  InvoiceStatus,
  AppContextType
};
