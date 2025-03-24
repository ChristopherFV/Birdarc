
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Task } from '@/context/ScheduleContext';
import { format } from 'date-fns';

interface TimeEntryCardProps {
  onOpenWorkEntry: () => void;
  completedTasks: Task[];
  getProjectName: (projectId: string | null) => string;
}

export const TimeEntryCard: React.FC<TimeEntryCardProps> = ({
  onOpenWorkEntry,
  completedTasks,
  getProjectName
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Time Entry
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <p className="text-sm text-muted-foreground">
            Log your work hours or add production details for completed tasks.
          </p>
          <Button
            onClick={onOpenWorkEntry}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Work Entry
          </Button>
          
          <div className="border rounded-md p-4 mt-4">
            <h3 className="font-medium mb-2">Recent Entries</h3>
            {completedTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent work entries</p>
            ) : (
              <div className="space-y-2">
                {completedTasks.slice(0, 3).map(task => (
                  <div key={task.id} className="border-b pb-2 last:border-0">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium text-sm">{task.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(task.endDate, 'MMM d, yyyy')} • {task.quantityEstimate} units
                        </p>
                      </div>
                      <div className="text-sm font-medium">
                        {task.projectId ? getProjectName(task.projectId) : 'No Project'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
