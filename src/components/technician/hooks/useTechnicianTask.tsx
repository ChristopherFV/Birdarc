
import { useState, useEffect } from 'react';
import { useSchedule, Task } from '@/context/ScheduleContext';
import { useSearchParams } from 'react-router-dom';

export const useTechnicianTask = () => {
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get('taskId') || "task-123";
  const [selectedTaskId, setSelectedTaskId] = useState<string>(taskId);
  const { tasks } = useSchedule();
  
  // Update selected task ID when URL parameter changes
  useEffect(() => {
    if (taskId) {
      setSelectedTaskId(taskId);
    }
  }, [taskId]);
  
  const defaultTaskData: Task = {
    id: 'task-123',
    title: 'Field Dashboard',
    description: 'Review the construction drawings for the new commercial building project. Check for structural issues and compliance with local building codes.',
    location: {
      address: '123 Construction Ave, Building 3, San Francisco, CA 94103',
      lat: 37.7749,
      lng: -122.4194
    },
    startDate: new Date('2023-10-15T09:00:00'),
    endDate: new Date('2023-10-15T17:00:00'),
    projectId: 'project-1',
    teamMemberId: 'team-1',
    priority: 'high',
    status: 'in_progress',
    billingCodeId: 'billing-1',
    quantityEstimate: 100
  };
  
  const handleTaskSelect = (taskId: string) => {
    setSelectedTaskId(taskId);
    
    // Update URL with the selected task ID for easier sharing/bookmarking
    const url = new URL(window.location.href);
    url.searchParams.set('taskId', taskId);
    window.history.pushState({}, '', url);
  };
  
  const getSelectedTask = (): Task => {
    const foundTask = tasks.find(task => task.id === selectedTaskId);
    return foundTask || defaultTaskData;
  };
  
  const taskData = getSelectedTask();
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return {
    selectedTaskId,
    handleTaskSelect,
    taskData,
    formatDate,
    formatTime
  };
};
