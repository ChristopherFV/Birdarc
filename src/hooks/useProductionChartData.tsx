import { useMemo } from 'react';
import { Task } from '@/context/ScheduleContext';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval, addDays } from 'date-fns';
import { sampleCompletedTasks } from '@/utils/sampleTaskGenerator';

interface ProcessedChartData {
  name: string;
  units: number;
  tasks: number;
  cumulativeUnits: number;
}

export const useProductionChartData = (
  completedTasks: Task[] = [],
  selectedProject: string | null,
  selectedTeamMember: string | null,
  selectedBillingCodeId: string | null = null
) => {
  // Process data for the chart based on filters
  const chartData = useMemo(() => {
    // Use sample data if no tasks provided
    const tasksToProcess = completedTasks.length > 0 ? completedTasks : sampleCompletedTasks;
    
    if (tasksToProcess.length === 0) return [];

    // Filter tasks based on project if selected
    let filteredTasks = tasksToProcess;
    if (selectedProject) {
      filteredTasks = filteredTasks.filter(task => task.projectId === selectedProject);
    }

    // Filter by team member if selected
    if (selectedTeamMember) {
      filteredTasks = filteredTasks.filter(task => task.teamMemberId === selectedTeamMember);
    }
    
    // Filter by billing code if selected
    if (selectedBillingCodeId) {
      filteredTasks = filteredTasks.filter(task => {
        // If task has a billingCodeId property, filter by it
        if (task.billingCodeId) {
          return task.billingCodeId === selectedBillingCodeId;
        }
        // Otherwise, just include tasks without billing code info
        return true;
      });
    }

    // Get the current date and the date 12 months ago
    const today = new Date();
    const twelveMonthsAgo = subMonths(today, 11); // 11 months ago to include current month (total 12)
    
    // Create an array of all months in the 12-month period
    const months = Array.from({ length: 12 }, (_, i) => {
      const monthDate = subMonths(today, i);
      return {
        date: monthDate,
        name: format(monthDate, 'MMM yyyy')
      };
    }).reverse(); // To get chronological order
    
    // Initialize data structure with all months (ensures we have all 12 months even if some have no data)
    const groupedData = months.reduce((acc, month) => {
      acc[month.name] = { units: 0, tasks: 0 };
      return acc;
    }, {} as Record<string, { units: number, tasks: number }>);
    
    // Group tasks by month
    filteredTasks.forEach(task => {
      // Only include tasks that were completed within the last 12 months
      const monthStart = startOfMonth(task.endDate);
      const monthEnd = endOfMonth(task.endDate);
      
      if (isWithinInterval(task.endDate, { 
        start: startOfMonth(twelveMonthsAgo), 
        end: endOfMonth(today) 
      })) {
        const key = format(task.endDate, 'MMM yyyy');
        
        if (groupedData[key]) {
          groupedData[key].units += task.quantityEstimate || 0;
          groupedData[key].tasks += 1;
        }
      }
    });
    
    // Convert to array and add cumulative values
    const dataArray = months.map(month => {
      const monthData = groupedData[month.name];
      return {
        name: month.name,
        units: monthData.units,
        tasks: monthData.tasks
      };
    });
    
    // Add cumulative values
    let cumulativeUnits = 0;
    return dataArray.map(item => {
      cumulativeUnits += item.units;
      return {
        ...item,
        cumulativeUnits
      };
    });
  }, [completedTasks, selectedProject, selectedTeamMember, selectedBillingCodeId]);

  // Calculate max values for scaling
  const maxUnits = Math.max(...chartData.map(item => item.units || 0), 1);
  const maxCumulative = Math.max(...chartData.map(item => item.cumulativeUnits || 0), 1);
  const dataScale = maxCumulative > maxUnits * 5 ? 1.2 : 2;

  return { chartData, maxUnits, maxCumulative, dataScale };
};
