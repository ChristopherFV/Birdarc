
import React, { createContext, useContext, useState } from 'react';
import { format } from 'date-fns';

// Types
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface TaskLocation {
  address: string;
  lat: number;
  lng: number;
}

export interface BillingCodeEntry {
  billingCodeId: string;
  percentage: number;
  ratePerUnit: number;
  quantityEstimate: number;
  hideRateFromTeamMember?: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  location: TaskLocation;
  startDate: Date;
  endDate: Date;
  projectId: string | null;
  projectName?: string;
  teamMemberId: string | null;
  teamMemberName?: string;
  priority: TaskPriority;
  status: TaskStatus;
  billingCodeId: string | null;
  quantityEstimate: number;
  attachments?: File[];
  isContractor?: boolean;
  contractorBillingCodes?: BillingCodeEntry[];
  teamMemberBillingCodes?: BillingCodeEntry[];
}

interface ScheduleContextType {
  tasks: Task[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  getTasksForDate: (date: Date) => Task[];
  getTasksByProjectId: (projectId: string | null) => Task[];
  updateMultipleTasks: (tasks: Task[]) => void;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const ScheduleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([
    // Sample tasks
    {
      id: '1',
      title: 'Install Pipe Section',
      description: 'Complete 50ft of irrigation pipe installation',
      location: {
        address: '123 Main St, San Francisco, CA',
        lat: 37.774,
        lng: -122.419
      },
      startDate: new Date('2023-08-15'),
      endDate: new Date('2023-08-15'),
      projectId: '1',
      teamMemberId: '2',
      priority: 'high',
      status: 'pending',
      billingCodeId: '1',
      quantityEstimate: 50
    },
    {
      id: '2',
      title: 'Site Survey',
      description: 'Conduct preliminary site survey for new project',
      location: {
        address: '456 Market St, San Francisco, CA',
        lat: 37.789,
        lng: -122.401
      },
      startDate: new Date('2023-08-18'),
      endDate: new Date('2023-08-19'),
      projectId: '2',
      teamMemberId: '1',
      priority: 'medium',
      status: 'pending',
      billingCodeId: '3',
      quantityEstimate: 1
    }
  ]);
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask = {
      ...task,
      id: crypto.randomUUID()
    };
    setTasks([...tasks, newTask]);
  };
  
  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };
  
  // New method to update multiple tasks at once
  const updateMultipleTasks = (updatedTasks: Task[]) => {
    const taskMap = new Map(updatedTasks.map(task => [task.id, task]));
    
    setTasks(tasks.map(task => {
      const updatedTask = taskMap.get(task.id);
      return updatedTask || task;
    }));
  };
  
  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };
  
  const getTasksForDate = (date: Date): Task[] => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return tasks.filter(task => {
      const taskStartDate = format(task.startDate, 'yyyy-MM-dd');
      const taskEndDate = format(task.endDate, 'yyyy-MM-dd');
      return dateStr >= taskStartDate && dateStr <= taskEndDate;
    });
  };
  
  // New method to get tasks by project ID
  const getTasksByProjectId = (projectId: string | null): Task[] => {
    if (!projectId) return [];
    return tasks.filter(task => 
      task.projectId === projectId && 
      (task.status === 'pending' || task.status === 'in_progress')
    );
  };
  
  return (
    <ScheduleContext.Provider value={{
      tasks,
      selectedDate,
      setSelectedDate,
      addTask,
      updateTask,
      deleteTask,
      getTasksForDate,
      getTasksByProjectId,
      updateMultipleTasks
    }}>
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};
