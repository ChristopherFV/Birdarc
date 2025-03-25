import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface Project {
  id: string;
  name: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'in progress' | 'completed' | 'on hold';
  projectId: string | null;
  assignedTo: string | null;
  location: {
    latitude: number | null;
    longitude: number | null;
  };
  visibility: {
    type: 'all' | 'team' | 'specific';
    teamId?: string;
    userId?: string;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  teamId: string;
}

interface Team {
  id: string;
  name: string;
}

// Make sure the context includes the projects array
export interface AppContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  users: User[];
  teams: Team[];
  projects: { id: string; name: string }[];
  selectedProject: string | null;
  setSelectedProject: (projectId: string | null) => void;
  exportData: (type: 'raw' | 'summary' | 'files-by-project') => void;
}

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
    { id: 'project-1', name: 'Cedar Heights Fiber' },
    { id: 'project-2', name: 'Oakridge Expansion' },
    { id: 'project-3', name: 'Downtown Connection' },
    { id: 'project-4', name: 'Westside Network' },
  ]);
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
