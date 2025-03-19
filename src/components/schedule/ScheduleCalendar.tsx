
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { useSchedule } from '@/context/ScheduleContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export const ScheduleCalendar: React.FC = () => {
  const { tasks, selectedDate, setSelectedDate, getTasksForDate } = useSchedule();
  const [month, setMonth] = useState<Date>(new Date());
  
  // Function to highlight dates with tasks
  const isDayWithTask = (day: Date): boolean => {
    const dayStr = format(day, 'yyyy-MM-dd');
    return tasks.some(task => {
      const taskStartDate = format(task.startDate, 'yyyy-MM-dd');
      const taskEndDate = format(task.endDate, 'yyyy-MM-dd');
      return dayStr >= taskStartDate && dayStr <= taskEndDate;
    });
  };
  
  // Get tasks for the selected date
  const tasksForSelectedDate = getTasksForDate(selectedDate);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
      <div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          month={month}
          onMonthChange={setMonth}
          className="p-3 pointer-events-auto border rounded-md bg-card"
          classNames={{
            day_today: "bg-fieldvision-cream text-fieldvision-brown font-bold",
          }}
          modifiers={{
            hasTask: (date) => isDayWithTask(date),
          }}
          modifiersClassNames={{
            hasTask: "border-b-2 border-fieldvision-orange",
          }}
        />
      </div>
      
      <div className="overflow-auto max-h-[450px]">
        <h3 className="font-medium mb-3 text-center">
          Tasks for {format(selectedDate, 'MMMM d, yyyy')}
        </h3>
        
        {tasksForSelectedDate.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm">No tasks scheduled for this day</p>
        ) : (
          <div className="space-y-3">
            {tasksForSelectedDate.map(task => (
              <Card key={task.id} className="p-3 text-sm">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{task.title}</h4>
                  <Badge variant={
                    task.priority === 'high' ? 'destructive' : 
                    task.priority === 'medium' ? 'default' : 'outline'
                  }>
                    {task.priority}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{task.description}</p>
                <div className="text-xs">
                  <span className="font-medium">Location: </span> 
                  {task.location.address}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
