
import { Task } from '@/context/ScheduleContext';
import { format, subMonths, startOfMonth, addDays } from 'date-fns';

/**
 * Generates a set of sample completed tasks spanning the last 12 months
 * with realistic values for demonstration purposes
 */
export const generateSampleTasks = (): Task[] => {
  const today = new Date();
  const tasks: Task[] = [];
  
  // Generate tasks for the past 12 months
  for (let i = 0; i < 12; i++) {
    const monthDate = subMonths(today, i);
    const monthStart = startOfMonth(monthDate);
    
    // Create 3-6 tasks per month with realistic values
    const tasksPerMonth = Math.floor(Math.random() * 4) + 3; // 3-6 tasks
    
    for (let j = 0; j < tasksPerMonth; j++) {
      // Spread tasks throughout the month
      const taskDate = addDays(monthStart, Math.floor(Math.random() * 28));
      
      // Alternate between projects and billing codes
      const projectId = `${j % 2 + 1}`;
      const projectName = j % 2 === 0 ? 'Downtown Fiber Expansion' : 'Westside Business District';
      
      // Randomize billing codes for variety
      const billingCodeOptions = ['code-1', 'code-3', 'code-6', 'code-5'];
      const billingCodeId = billingCodeOptions[Math.floor(Math.random() * billingCodeOptions.length)];
      
      // Assign realistic quantities based on billing code
      let quantity = 100;
      switch (billingCodeId) {
        case 'code-1': // Underground Standard
          quantity = Math.floor(Math.random() * 300) + 100; // 100-400
          break;
        case 'code-3': // Aerial Standard
          quantity = Math.floor(Math.random() * 500) + 200; // 200-700
          break;
        case 'code-6': // Splicing
          quantity = Math.floor(Math.random() * 40) + 10; // 10-50
          break;
        case 'code-5': // Equipment
          quantity = Math.floor(Math.random() * 5) + 1; // 1-6
          break;
      }
      
      // Task titles based on billing code
      let title = 'Fiber Installation';
      switch (billingCodeId) {
        case 'code-1':
          title = 'Underground Installation';
          break;
        case 'code-3':
          title = 'Aerial Installation';
          break;
        case 'code-6':
          title = 'Fiber Splicing';
          break;
        case 'code-5':
          title = 'Equipment Installation';
          break;
      }
      
      // Add location variation
      const locationOffset = (j * 0.01) + (i * 0.005);
      
      tasks.push({
        id: `task-${i}-${j}`,
        title: `${title} - ${format(taskDate, 'MMM yyyy')}`,
        description: `Complete ${quantity} units of ${title.toLowerCase()}`,
        location: { 
          address: `${100 + j * 100} Main St, Building ${j+1}`, 
          lat: 37.7749 + locationOffset, 
          lng: -122.4194 - locationOffset 
        },
        startDate: taskDate,
        endDate: taskDate,
        projectId,
        projectName,
        teamMemberId: '1',
        teamMemberName: 'Alex Johnson',
        priority: j % 2 === 0 ? 'high' : 'medium',
        status: 'completed',
        billingCodeId,
        quantityEstimate: quantity
      });
    }
  }
  
  return tasks;
};

// Use the generated sample tasks
export const sampleCompletedTasks = generateSampleTasks();
