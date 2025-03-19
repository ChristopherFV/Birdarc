
import React from 'react';
import { useSchedule } from '@/context/ScheduleContext';
import { Check, Clock, Calendar, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, isToday, isTomorrow, addDays, isSameDay } from 'date-fns';

export const TaskList: React.FC = () => {
  const { tasks } = useSchedule();
  
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
  
  return (
    <div className="space-y-4">
      {upcomingTasks.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No upcoming tasks</p>
      ) : (
        upcomingTasks.map((task) => (
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
            
            <div className="text-xs flex items-start">
              <Calendar className="h-3 w-3 mr-1 mt-0.5" />
              <span className="line-clamp-1">{task.location.address}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
