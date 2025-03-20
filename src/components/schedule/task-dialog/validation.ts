
import { TaskPriority } from '@/context/ScheduleContext';

export interface AddTaskFormData {
  title: string;
  description: string;
  address: string;
  projectId: string;
  teamMemberId: string;
  priority: TaskPriority;
  startDate: Date;
  endDate: Date;
  billingCodeId: string;
  quantityEstimate: number;
}

export type AddTaskFormErrors = Partial<Record<keyof AddTaskFormData, string>>;

export const validateAddTaskForm = (data: AddTaskFormData): AddTaskFormErrors => {
  const errors: AddTaskFormErrors = {};
  
  if (!data.title) errors.title = "Title is required";
  if (!data.address) errors.address = "Location is required";
  
  return errors;
};

export const createTaskFromDialogData = (data: AddTaskFormData) => {
  // In a real app, you would geocode the address to get lat/lng
  // For this example, we'll use a dummy location
  return {
    title: data.title,
    description: data.description,
    location: {
      address: data.address,
      lat: 37.7749 + (Math.random() * 0.03 - 0.015),
      lng: -122.4194 + (Math.random() * 0.03 - 0.015)
    },
    startDate: data.startDate,
    endDate: data.endDate,
    projectId: data.projectId || null,
    teamMemberId: data.teamMemberId || null,
    priority: data.priority,
    status: 'pending' as const,
    billingCodeId: data.billingCodeId || null,
    quantityEstimate: data.quantityEstimate
  };
};
