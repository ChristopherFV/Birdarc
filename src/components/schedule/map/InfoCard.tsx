
import React from 'react';
import { DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Task } from '@/context/ScheduleContext';

interface TaskInfoCardProps {
  task: Task;
  projectName: string;
  billingCode: {
    code: string;
    ratePerFoot: number;
  } | null;
}

export const TaskInfoCard: React.FC<TaskInfoCardProps> = ({ task, projectName, billingCode }) => {
  return (
    <Card className="p-3 shadow-lg border-l-4 border-l-fieldvision-orange">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">{task.title}</h3>
        <Badge variant={
          task.priority === 'high' ? 'destructive' : 
          task.priority === 'medium' ? 'default' : 'outline'
        }>
          {task.priority}
        </Badge>
      </div>
      <p className="text-xs mb-2">{projectName}</p>
      <p className="text-xs text-muted-foreground mb-2">{task.description}</p>
      
      {billingCode && (
        <div className="text-xs mb-2 flex items-center">
          <DollarSign className="h-3 w-3 mr-1" />
          <span>
            {billingCode.code} - {task.quantityEstimate} units 
            (${(billingCode.ratePerFoot * task.quantityEstimate).toFixed(2)})
          </span>
        </div>
      )}
      
      <div className="text-xs mb-1">
        <span className="font-medium">Location: </span> 
        {task.location.address}
      </div>
      <div className="text-xs">
        <span className="font-medium">Schedule: </span> 
        {format(task.startDate, 'MMM d')}
        {!format(task.startDate, 'yyyy-MM-dd').includes(format(task.endDate, 'yyyy-MM-dd')) && 
          ` - ${format(task.endDate, 'MMM d')}`
        }
      </div>
    </Card>
  );
};

interface ProjectInfoCardProps {
  project: {
    id: string;
    title: string;
    type: string;
    status: string;
    priority: string;
    size: number;
    lat: number;
    lng: number;
  };
}

export const ProjectInfoCard: React.FC<ProjectInfoCardProps> = ({ project }) => {
  return (
    <Card className="p-3 shadow-lg border-l-4 border-l-blue-500">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">{project.title}</h3>
        <Badge variant={
          project.priority === 'high' ? 'destructive' : 
          project.priority === 'medium' ? 'default' : 'outline'
        }>
          {project.priority}
        </Badge>
      </div>
      <p className="text-xs mb-2">{project.type}</p>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
          {project.status}
        </span>
        <span className="text-xs text-muted-foreground">
          {project.size} ft
        </span>
      </div>
      <div className="text-xs mb-1">
        <span className="font-medium">Location: </span> 
        {`${project.lat.toFixed(4)}, ${project.lng.toFixed(4)}`}
      </div>
      <div className="text-xs mt-2 text-blue-600">
        <Button variant="link" className="h-auto p-0 text-xs">
          View Project Details
        </Button>
      </div>
    </Card>
  );
};
