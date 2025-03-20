
import { Task, TaskPriority } from '@/context/ScheduleContext';

export interface TaskFormData {
  title: string;
  description: string;
  priority: TaskPriority;
  projectId: string;
  teamMemberId: string;
  startDate: Date;
  endDate: Date;
  address: string;
  billingCodeId: string;
  quantityEstimate: number;
  attachments: File[];
}

export type TaskFormErrors = Partial<Record<keyof TaskFormData, string>>;

export const validateTaskForm = (data: TaskFormData): TaskFormErrors => {
  const errors: TaskFormErrors = {};
  
  if (!data.title) errors.title = "Title is required";
  if (!data.projectId) errors.projectId = "Project is required";
  if (!data.address) errors.address = "Location is required";
  if (!data.billingCodeId) errors.billingCodeId = "Billing code is required";
  
  return errors;
};

export const createTaskFromFormData = (data: TaskFormData): Omit<Task, 'id'> => {
  return {
    title: data.title,
    description: data.description,
    location: {
      address: data.address,
      lat: 37.7749, // Default to San Francisco coordinates for now
      lng: -122.4194,
    },
    startDate: data.startDate,
    endDate: data.endDate,
    projectId: data.projectId,
    teamMemberId: data.teamMemberId || null,
    priority: data.priority,
    status: 'pending',
    billingCodeId: data.billingCodeId || null,
    quantityEstimate: data.quantityEstimate,
    attachments: data.attachments
  };
};
