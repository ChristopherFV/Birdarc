
import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { useSchedule } from '@/context/ScheduleContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export const ScheduleMap: React.FC = () => {
  const { tasks } = useSchedule();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  
  // This is a placeholder for the actual map implementation
  // In a real application, you would integrate with a mapping library like Mapbox or Google Maps
  
  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId === selectedTaskId ? null : taskId);
  };
  
  const selectedTask = tasks.find(task => task.id === selectedTaskId);
  
  return (
    <div className="relative h-full w-full bg-gray-100 overflow-hidden">
      {/* Placeholder Map Background */}
      <div className="absolute inset-0 bg-fieldvision-navy/10 flex items-center justify-center">
        <p className="text-muted-foreground text-center">
          Map View
          <br />
          <span className="text-xs">
            In a real implementation, this would display a map from a service like Mapbox or Google Maps
          </span>
        </p>
      </div>
      
      {/* Task Markers */}
      <div className="absolute inset-0 pointer-events-none">
        {tasks.map((task) => (
          <div 
            key={task.id}
            className="absolute"
            style={{
              // Placeholder positioning - in a real app these would correspond to actual map coordinates
              left: `${(task.location.lng + 122.44) * 400}px`,
              top: `${(37.79 - task.location.lat) * 400}px`,
              transform: 'translate(-50%, -100%)',
              pointerEvents: 'auto'
            }}
          >
            <button
              onClick={() => handleTaskClick(task.id)}
              className={`
                text-white p-1 rounded-full transition-all duration-300 
                ${task.priority === 'high' ? 'bg-red-500' : 
                  task.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'}
                ${selectedTaskId === task.id ? 'scale-125 shadow-lg' : ''}
              `}
            >
              <MapPin size={20} />
            </button>
          </div>
        ))}
      </div>
      
      {/* Selected Task Info */}
      {selectedTask && (
        <div className="absolute right-4 top-4 w-72 pointer-events-auto">
          <Card className="p-3 shadow-lg border-l-4 border-l-fieldvision-orange">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">{selectedTask.title}</h3>
              <Badge variant={
                selectedTask.priority === 'high' ? 'destructive' : 
                selectedTask.priority === 'medium' ? 'default' : 'outline'
              }>
                {selectedTask.priority}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{selectedTask.description}</p>
            <div className="text-xs mb-1">
              <span className="font-medium">Location: </span> 
              {selectedTask.location.address}
            </div>
            <div className="text-xs">
              <span className="font-medium">Schedule: </span> 
              {format(selectedTask.startDate, 'MMM d')}
              {!format(selectedTask.startDate, 'yyyy-MM-dd').includes(format(selectedTask.endDate, 'yyyy-MM-dd')) && 
                ` - ${format(selectedTask.endDate, 'MMM d')}`
              }
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
