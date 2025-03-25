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
import { calculateRevenue, calculateContractorCost } from '@/utils/app-utils';

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
  
  const [workEntries, setWorkEntries] = useState<WorkEntry[]>(() => {
    const storedEntries = localStorage.getItem('work_entries');
    if (storedEntries) {
      return JSON.parse(storedEntries);
    }
    
    return [
      { 
        id: 'entry-1', 
        projectId: 'project-1', 
        teamMemberId: 'team-member-1',
        date: new Date().toISOString(),
        billingCodeId: 'billing-1',
        feetCompleted: 120,
        notes: 'Installed fiber lines along Main Street'
      },
      { 
        id: 'entry-2', 
        projectId: 'project-2', 
        teamMemberId: 'team-member-2',
        date: new Date(Date.now() - 86400000).toISOString(),
        billingCodeId: 'billing-2',
        feetCompleted: 85,
        notes: 'Conducted site survey for new installation'
      },
      { 
        id: 'entry-3', 
        projectId: 'project-3', 
        teamMemberId: 'team-member-1',
        date: new Date(Date.now() - 172800000).toISOString(),
        billingCodeId: 'billing-1',
        feetCompleted: 200,
        notes: 'Completed downtown section of fiber network'
      }
    ];
  });
  
  const [billingCodes, setBillingCodes] = useState<BillingCode[]>(() => {
    const storedCodes = localStorage.getItem('billing_codes');
    if (storedCodes) {
      return JSON.parse(storedCodes);
    }
    
    return [
      { 
        id: 'billing-1', 
        code: 'FO-INSTALL', 
        description: 'Fiber Optic Installation',
        ratePerFoot: 15.75,
        contractorRatePerFoot: 12.50,
        type: 'installation'
      },
      { 
        id: 'billing-2', 
        code: 'SURVEY', 
        description: 'Site Survey',
        ratePerFoot: 8.50,
        contractorRatePerFoot: 6.75,
        type: 'survey'
      }
    ];
  });
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const storedMembers = localStorage.getItem('team_members');
    if (storedMembers) {
      return JSON.parse(storedMembers);
    }
    
    return [
      { 
        id: 'team-member-1', 
        name: 'John Smith', 
        email: 'john.smith@example.com',
        role: 'technician',
        teamId: 'team-1'
      },
      { 
        id: 'team-member-2', 
        name: 'Sarah Johnson', 
        email: 'sarah.johnson@example.com',
        role: 'engineer',
        teamId: 'team-2'
      }
    ];
  });
  
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
    localStorage.setItem('work_entries', JSON.stringify(workEntries));
    localStorage.setItem('billing_codes', JSON.stringify(billingCodes));
    localStorage.setItem('team_members', JSON.stringify(teamMembers));
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    console.log('AppContext Data Updated:', {
      workEntriesCount: workEntries.length,
      billingCodesCount: billingCodes.length,
      teamMembersCount: teamMembers.length,
      tasksCount: tasks.length
    });
  }, [workEntries, billingCodes, teamMembers, tasks]);

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
    return workEntries;
  };
  
  const exportData = (type: 'raw' | 'summary' | 'files-by-project') => {
    const data = [
      { name: 'John', age: 30, city: 'New York' },
      { name: 'Jane', age: 28, city: 'Los Angeles' },
    ];

    const csv = convertToCSV(data);

    const blob = new Blob([csv], { type: 'text/csv' });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data.${type}.csv`;
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: 'Exported',
      description: `Data exported as ${type}.csv`,
    });
  };

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
