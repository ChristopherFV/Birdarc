
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CheckCheck } from 'lucide-react';
import { Task } from '@/context/ScheduleContext';
import { Button } from '@/components/ui/button';
import { SectionHeader } from './SectionHeader';
import { GanttChart } from './GanttChart';

interface TaskColumnsProps {
  assignedTasks: Task[];
  completedTasks: Task[];
  handleOpenWorkEntry: (projectId: string | null) => void;
  getProjectName: (projectId: string | null) => string;
}

export const TaskColumns: React.FC<TaskColumnsProps> = ({
  assignedTasks,
  completedTasks,
  handleOpenWorkEntry,
  getProjectName
}) => {
  return (
    <>
      {/* My Assigned Tasks */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">
            <SectionHeader icon={<Calendar className="h-5 w-5" />} title="My Assigned Tasks" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[208px] overflow-y-auto">
            {assignedTasks.length === 0 ? (
              <p className="text-muted-foreground text-sm">No active tasks</p>
            ) : (
              assignedTasks.map(task => (
                <div 
                  key={task.id} 
                  className="block p-3 border rounded-md hover:bg-secondary transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-sm">{task.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
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
      
      {/* Gantt Chart */}
      <GanttChart 
        tasks={assignedTasks}
        handleOpenWorkEntry={handleOpenWorkEntry}
        getProjectName={getProjectName}
      />
      
      {/* Recently Completed */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">
            <SectionHeader icon={<CheckCheck className="h-5 w-5" />} title="Recently Completed" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[208px] overflow-y-auto">
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
    </>
  );
};
