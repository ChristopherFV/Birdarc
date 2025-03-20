
import React from 'react';
import { useSchedule } from '@/context/ScheduleContext';
import { useApp } from '@/context/AppContext';
import { Check, Clock, Calendar, ArrowRight, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, isToday, isTomorrow, addDays, isSameDay } from 'date-fns';

export const TaskList: React.FC = () => {
  const { tasks } = useSchedule();
  const { billingCodes, projects } = useApp();
  
  // Sort tasks by start date (soonest first)
  const sortedTasks = [...tasks].sort((a, b) => 
    a.startDate.getTime() - b.startDate.getTime()
  );
  
  // Only show the first 5 upcoming tasks
  const upcomingTasks = sortedTasks.filter(task => 
    task.startDate >= new Date()
  ).slice(0, 5);
  
  // Helper function to format the date in a user-friendly way
  const formatTaskDate = (date: Date) => {
    if (isToday(date)) {
      return 'Today';
    } else if (isTomorrow(date)) {
      return 'Tomorrow';
    } else {
      return format(date, 'MMM d');
    }
  };
  
  // Helper to get billing code details
  const getBillingCode = (codeId: string | null) => {
    if (!codeId) return null;
    return billingCodes.find(code => code.id === codeId);
  };
  
  // Helper to get project name
  const getProjectName = (projectId: string | null) => {
    if (!projectId) return "No Project";
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : "Unknown Project";
  };
  
  return (
    <div className="space-y-4">
      {upcomingTasks.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No upcoming tasks</p>
      ) : (
        upcomingTasks.map((task) => {
          const billingCode = getBillingCode(task.billingCodeId);
          
          return (
            <div key={task.id} className="border-b pb-3 last:border-0">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-medium text-sm">{task.title}</h3>
                <Badge variant={
                  task.priority === 'high' ? 'destructive' : 
                  task.priority === 'medium' ? 'default' : 'outline'
                } className="text-xs">
                  {task.priority}
                </Badge>
              </div>
              
              <div className="text-xs text-muted-foreground mb-1">
                {getProjectName(task.projectId)}
              </div>
              
              <div className="flex items-center text-xs text-muted-foreground mb-2">
                <Clock className="h-3 w-3 mr-1" />
                <span>{formatTaskDate(task.startDate)}</span>
                
                {!isSameDay(task.startDate, task.endDate) && (
                  <>
                    <ArrowRight className="h-3 w-3 mx-1" />
                    <span>{formatTaskDate(task.endDate)}</span>
                  </>
                )}
              </div>
              
              {billingCode && (
                <div className="text-xs flex items-start mb-1">
                  <DollarSign className="h-3 w-3 mr-1 mt-0.5" />
                  <span>
                    {billingCode.code} ({task.quantityEstimate} units at ${billingCode.ratePerFoot.toFixed(2)}/unit)
                  </span>
                </div>
              )}
              
              <div className="text-xs flex items-start">
                <Calendar className="h-3 w-3 mr-1 mt-0.5" />
                <span className="line-clamp-1">{task.location.address}</span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
