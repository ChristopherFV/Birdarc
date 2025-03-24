
import React from 'react';
import { Task } from '@/context/ScheduleContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartGantt, Clock } from 'lucide-react';
import { addDays, format, startOfToday, differenceInDays } from 'date-fns';
import { SectionHeader } from './SectionHeader';

interface GanttChartProps {
  tasks: Task[];
  handleOpenWorkEntry: (projectId: string | null) => void;
  getProjectName: (projectId: string | null) => string;
  selectedTaskId?: string;
  onTaskSelect?: (task: Task) => void;
}

export const GanttChart: React.FC<GanttChartProps> = ({
  tasks,
  handleOpenWorkEntry,
  getProjectName,
  selectedTaskId,
  onTaskSelect
}) => {
  // Sort tasks by start date
  const sortedTasks = [...tasks]
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
    .filter(task => task.status !== 'completed' && task.status !== 'cancelled');

  // Display tasks for the next 14 days
  const today = startOfToday();
  const daysToShow = 14;
  
  // Generate array of dates for the next 14 days (for header)
  const dateRange = Array.from({ length: daysToShow }, (_, i) => 
    addDays(today, i)
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          <SectionHeader icon={<ChartGantt className="h-5 w-5" />} title="Upcoming Schedule" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedTasks.length === 0 ? (
          <p className="text-muted-foreground text-sm">No scheduled tasks</p>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[700px]">
              {/* Chart Header - Days */}
              <div className="flex border-b">
                <div className="w-1/4 p-2 font-medium text-sm">Task</div>
                <div className="w-3/4 flex">
                  {dateRange.map((date, i) => (
                    <div 
                      key={i} 
                      className={`flex-1 p-1 text-xs text-center ${i % 2 === 0 ? 'bg-muted/30' : ''}`}
                    >
                      {format(date, 'MMM d')}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Tasks */}
              <div className="max-h-[208px] overflow-y-auto">
                {sortedTasks.map(task => {
                  const startDay = Math.max(0, differenceInDays(task.startDate, today));
                  const endDay = Math.min(daysToShow - 1, differenceInDays(task.endDate, today));
                  const duration = endDay - startDay + 1;
                  
                  return (
                    <div 
                      key={task.id} 
                      className={`flex border-b last:border-b-0 hover:bg-muted/20 cursor-pointer ${selectedTaskId === task.id ? 'bg-muted/30' : ''}`}
                      onClick={() => onTaskSelect && onTaskSelect(task)}
                    >
                      <div className="w-1/4 p-2">
                        <div className="font-medium text-sm">{task.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {getProjectName(task.projectId)}
                        </div>
                      </div>
                      <div className="w-3/4 flex relative py-2">
                        {startDay >= 0 && startDay < daysToShow && (
                          <div 
                            className="absolute h-6 rounded-md bg-fieldvision-orange hover:bg-fieldvision-orange/90 text-white text-xs flex items-center justify-center cursor-pointer"
                            style={{
                              left: `${(startDay / daysToShow) * 100}%`,
                              width: `${(duration / daysToShow) * 100}%`,
                              minWidth: '20px'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenWorkEntry(task.projectId);
                            }}
                          >
                            {duration <= 1 ? '' : `${duration}d`}
                          </div>
                        )}
                        {dateRange.map((_, i) => (
                          <div 
                            key={i} 
                            className={`flex-1 ${i % 2 === 0 ? 'bg-muted/30' : ''}`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
