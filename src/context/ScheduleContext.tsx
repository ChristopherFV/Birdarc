
import React, { createContext, useContext, useState } from 'react';
import { format, addDays } from 'date-fns';

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export type Task = {
  id: string;
  title: string;
  description: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  startDate: Date;
  endDate: Date;
  projectId: string | null;
  teamMemberId: string | null;
  priority: TaskPriority;
  status: TaskStatus;
};

// Mock data
const generateMockTasks = (): Task[] => {
  const today = new Date();
  
  return [
    {
      id: '1',
      title: 'Site Survey - Downtown Project',
      description: 'Complete initial site survey for downtown fiber installation',
      location: {
        address: '123 Main St, City Center',
        lat: 37.7749,
        lng: -122.4194
      },
      startDate: today,
      endDate: addDays(today, 1),
      projectId: 'project1',
      teamMemberId: 'team1',
      priority: 'high',
      status: 'pending'
    },
    {
      id: '2',
      title: 'Conduit Installation - North Side',
      description: 'Install underground conduit along northern route',
      location: {
        address: '456 North Ave, North District',
        lat: 37.7850,
        lng: -122.4300
      },
      startDate: addDays(today, 1),
      endDate: addDays(today, 3),
      projectId: 'project2',
      teamMemberId: 'team2',
      priority: 'medium',
      status: 'pending'
    },
    {
      id: '3',
      title: 'Fiber Splicing - East Campus',
      description: 'Complete fiber splicing at junction boxes in east campus area',
      location: {
        address: '789 East Blvd, Campus Area',
        lat: 37.7650,
        lng: -122.4050
      },
      startDate: addDays(today, 2),
      endDate: addDays(today, 2),
      projectId: 'project3',
      teamMemberId: 'team3',
      priority: 'medium',
      status: 'pending'
    },
    {
      id: '4',
      title: 'Equipment Delivery - South Site',
      description: 'Coordinate equipment delivery to south construction site',
      location: {
        address: '1010 South St, Industrial Park',
        lat: 37.7550,
        lng: -122.4250
      },
      startDate: addDays(today, 3),
      endDate: addDays(today, 3),
      projectId: 'project1',
      teamMemberId: 'team1',
      priority: 'low',
      status: 'pending'
    },
    {
      id: '5',
      title: 'Final Testing - West Zone',
      description: 'Perform final signal testing on newly installed lines in west zone',
      location: {
        address: '555 West Ave, Commercial District',
        lat: 37.7700,
        lng: -122.4350
      },
      startDate: addDays(today, 4),
      endDate: addDays(today, 5),
      projectId: 'project2',
      teamMemberId: 'team2',
      priority: 'high',
      status: 'pending'
    }
  ];
};

type ScheduleContextType = {
  tasks: Task[];
  selectedDate: Date;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  setSelectedDate: (date: Date) => void;
  getTasksForDate: (date: Date) => Task[];
  getTasksForDateRange: (startDate: Date, endDate: Date) => Task[];
};

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const ScheduleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(generateMockTasks());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID()
    };
    setTasks([...tasks, newTask]);
  };
  
  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };
  
  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };
  
  const getTasksForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return tasks.filter(task => {
      const taskStartDate = format(task.startDate, 'yyyy-MM-dd');
      const taskEndDate = format(task.endDate, 'yyyy-MM-dd');
      
      return (
        dateStr >= taskStartDate && 
        dateStr <= taskEndDate
      );
    });
  };
  
  const getTasksForDateRange = (startDate: Date, endDate: Date) => {
    const startStr = format(startDate, 'yyyy-MM-dd');
    const endStr = format(endDate, 'yyyy-MM-dd');
    
    return tasks.filter(task => {
      const taskStartDate = format(task.startDate, 'yyyy-MM-dd');
      const taskEndDate = format(task.endDate, 'yyyy-MM-dd');
      
      // Task overlaps with the given date range
      return (
        (taskStartDate <= endStr && taskEndDate >= startStr)
      );
    });
  };
  
  const value: ScheduleContextType = {
    tasks,
    selectedDate,
    addTask,
    updateTask,
    deleteTask,
    setSelectedDate,
    getTasksForDate,
    getTasksForDateRange
  };
  
  return <ScheduleContext.Provider value={value}>{children}</ScheduleContext.Provider>;
};

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};
