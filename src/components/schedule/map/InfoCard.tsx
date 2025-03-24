
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, X, CheckSquare, MapPin, Calendar, DollarSign, User, Briefcase, XCircle } from 'lucide-react';
import { Task } from '@/context/ScheduleContext';
import { TaskConfirmationDialog } from './TaskConfirmationDialog';
import { useIsMobile } from '@/hooks/use-mobile';

interface TaskInfoCardProps {
  task: Task;
  projectName: string;
  billingCode: any | null;
  onClose?: () => void;
  onEdit?: () => void;
  onCloseTask?: () => void;
  onCancelTask?: () => void;
}

export const TaskInfoCard: React.FC<TaskInfoCardProps> = ({ 
  task, 
  projectName, 
  billingCode,
  onClose,
  onEdit,
  onCloseTask,
  onCancelTask
}) => {
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  const priorityColors = {
    high: 'bg-red-500',
    medium: 'bg-amber-500',
    low: 'bg-blue-500'
  };
  
  const statusColors = {
    pending: 'bg-yellow-400',
    in_progress: 'bg-blue-500',
    completed: 'bg-green-500',
    cancelled: 'bg-gray-500'
  };
  
  const formattedStartDate = new Date(task.startDate).toLocaleDateString();
  const formattedEndDate = new Date(task.endDate).toLocaleDateString();
  
  return (
    <Card className="shadow-lg max-w-[350px] sm:max-w-none">
      <CardHeader className="pb-2 relative">
        {onClose && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-2 h-6 w-6" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <CardTitle className="text-base sm:text-lg font-semibold pr-7">{task.title}</CardTitle>
        <div className="flex flex-wrap gap-2 mt-1">
          <Badge variant="outline" className={`${priorityColors[task.priority as keyof typeof priorityColors]} text-white text-xs`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
          </Badge>
          <Badge variant="outline" className={`${statusColors[task.status as keyof typeof statusColors]} text-white text-xs`}>
            {task.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-2 pb-3">
        <div className="space-y-2 text-xs sm:text-sm">
          <p className="text-gray-700">{task.description}</p>
          
          <div className="grid grid-cols-1 gap-2 text-xs mt-3">
            <div className="flex items-center">
              <Briefcase className="h-3 w-3 mr-2 text-gray-500 flex-shrink-0" />
              <span className="font-medium text-gray-500 mr-2">Project:</span>
              <span className="truncate">{projectName}</span>
            </div>
            
            <div className="flex items-center">
              <User className="h-3 w-3 mr-2 text-gray-500 flex-shrink-0" />
              <span className="font-medium text-gray-500 mr-2">Assigned to:</span>
              <span className="truncate">{task.teamMemberName || "Unassigned"}</span>
            </div>
            
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-2 text-gray-500 flex-shrink-0" />
              <span className="font-medium text-gray-500 mr-2">Location:</span>
              <span className="break-words truncate">{task.location.address}</span>
            </div>
            
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-2 text-gray-500 flex-shrink-0" />
              <span className="font-medium text-gray-500 mr-2">Timeline:</span>
              <span>{formattedStartDate} to {formattedEndDate}</span>
            </div>
            
            {billingCode && (
              <div className="flex items-center">
                <DollarSign className="h-3 w-3 mr-2 text-gray-500 flex-shrink-0" />
                <span className="font-medium text-gray-500 mr-2">Billing:</span>
                <span>{billingCode.code} ({task.quantityEstimate} units)</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      {task.status !== 'completed' && task.status !== 'cancelled' && (
        <CardFooter className="pt-0 grid grid-cols-3 gap-2">
          {onEdit && (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs h-8" 
              onClick={onEdit}
            >
              <Edit className="h-3 w-3 mr-1" /> Edit
            </Button>
          )}
          {onCloseTask && (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs h-8 text-green-600 border-green-200 hover:bg-green-50" 
              onClick={() => setCompleteDialogOpen(true)}
            >
              <CheckSquare className="h-3 w-3 mr-1" /> Complete
            </Button>
          )}
          {onCancelTask && (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs h-8 text-red-600 border-red-200 hover:bg-red-50" 
              onClick={() => setCancelDialogOpen(true)}
            >
              <XCircle className="h-3 w-3 mr-1" /> Cancel
            </Button>
          )}
        </CardFooter>
      )}

      {/* Confirmation Dialogs */}
      <TaskConfirmationDialog
        open={completeDialogOpen}
        onOpenChange={setCompleteDialogOpen}
        onConfirm={() => onCloseTask && onCloseTask()}
        actionType="complete"
        taskTitle={task.title}
      />

      <TaskConfirmationDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        onConfirm={() => onCancelTask && onCancelTask()}
        actionType="cancel"
        taskTitle={task.title}
      />
    </Card>
  );
};
