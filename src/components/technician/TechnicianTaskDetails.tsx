
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin, FileText, HardHat, User } from 'lucide-react';

interface TaskDetailsProps {
  task: {
    id: string;
    title: string;
    description: string;
    location: {
      address: string;
      lat: number;
      lng: number;
    };
    startDate: Date;
    endDate: Date;
    projectId: string;
    teamMemberId: string;
    priority: string;
    status: string;
  };
  formatDate: (date: Date) => string;
  formatTime: (date: Date) => string;
}

export const TechnicianTaskDetails: React.FC<TaskDetailsProps> = ({
  task,
  formatDate,
  formatTime
}) => {
  return (
    <Card>
      <CardHeader className="py-2">
        <CardTitle className="text-sm">Task Details</CardTitle>
      </CardHeader>
      <CardContent className="py-2">
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="font-medium">Date:</span>
            </div>
            <p className="text-sm pl-6">{formatDate(task.startDate)}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="font-medium">Time:</span>
            </div>
            <p className="text-sm pl-6">{formatTime(task.startDate)} - {formatTime(task.endDate)}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="font-medium">Location:</span>
            </div>
            <p className="text-sm pl-6">{task.location.address}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center text-sm">
              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="font-medium">Description:</span>
            </div>
            <p className="text-sm pl-6">{task.description}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center text-sm">
              <HardHat className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="font-medium">Priority:</span>
            </div>
            <div className="pl-6">
              <span className={`text-xs font-medium rounded-full px-2 py-1 ${
                task.priority === 'high' 
                  ? 'bg-red-100 text-red-800' 
                  : task.priority === 'medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center text-sm">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="font-medium">Status:</span>
            </div>
            <div className="pl-6">
              <span className={`text-xs font-medium rounded-full px-2 py-1 ${
                task.status === 'completed' 
                  ? 'bg-green-100 text-green-800' 
                  : task.status === 'in_progress'
                  ? 'bg-blue-100 text-blue-800'
                  : task.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {task.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
