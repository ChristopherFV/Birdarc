
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CheckCheck, Clock } from 'lucide-react';
import { Task } from '@/context/ScheduleContext';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface TasksOverviewProps {
  assignedTasks: Task[];
  completedTasks: Task[];
  onOpenWorkEntry: (projectId: string | null) => void;
  getProjectName: (projectId: string | null) => string;
}

export const TasksOverview: React.FC<TasksOverviewProps> = ({
  assignedTasks,
  completedTasks,
  onOpenWorkEntry,
  getProjectName
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            My Assigned Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {assignedTasks.length === 0 ? (
              <p className="text-muted-foreground text-sm">No active tasks</p>
            ) : (
              assignedTasks.map(task => (
                <Link 
                  key={task.id} 
                  to={`/technician?taskId=${task.id}`}
                  className="block p-3 border rounded-md hover:bg-secondary transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-sm">{task.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(task.startDate, 'MMM d, yyyy')}
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {task.location.address}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCheck className="h-5 w-5" />
            Recently Completed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {completedTasks.length === 0 ? (
              <p className="text-muted-foreground text-sm">No completed tasks</p>
            ) : (
              completedTasks.slice(0, 5).map(task => (
                <div 
                  key={task.id} 
                  className="block p-3 border rounded-md bg-secondary/30"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-sm">{task.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Completed: {format(task.endDate, 'MMM d, yyyy')}
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                        Project: {getProjectName(task.projectId)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Upcoming Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {assignedTasks.length === 0 ? (
              <p className="text-muted-foreground text-sm">No scheduled tasks</p>
            ) : (
              [...assignedTasks]
                .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
                .map(task => (
                  <div 
                    key={task.id} 
                    className="block p-3 border rounded-md hover:bg-secondary/20 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-sm">{task.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Date: {format(task.startDate, 'MMM d, yyyy')}
                        </p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                          Time: {format(task.startDate, 'h:mm a')} - {format(task.endDate, 'h:mm a')}
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs"
                        onClick={(e) => {
                          e.preventDefault();
                          onOpenWorkEntry(task.projectId);
                        }}
                      >
                        Log Hours
                      </Button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
