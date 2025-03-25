
import React from 'react';
import { Layers, Edit, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapLayerControlsProps {
  showTasks: boolean;
  setShowTasks: (show: boolean) => void;
  taskCount: number;
  onAddTask?: () => void;
  onEditTask?: () => void;
  selectedTaskId: string | null;
}

export const MapLayerControls: React.FC<MapLayerControlsProps> = ({
  showTasks,
  setShowTasks,
  taskCount,
  onAddTask,
  onEditTask,
  selectedTaskId
}) => {
  const handleAddTaskClick = () => {
    console.log("Add task button clicked");
    if (onAddTask) {
      onAddTask();
    }
  };

  return (
    <div className="absolute left-4 top-4 z-10">
      <div className="bg-white p-2 rounded-md shadow-md space-y-2 border border-fieldvision-blue/20">
        <div className="text-xs font-medium text-fieldvision-blue mb-1 flex items-center">
          <Layers className="h-3 w-3 mr-1" />
          Map Layers
        </div>
        <div className="flex items-center">
          <Button 
            variant={showTasks ? "blue" : "outline"} 
            size="sm" 
            className="text-xs h-7 px-2" 
            onClick={() => setShowTasks(!showTasks)}
          >
            Tasks ({taskCount})
          </Button>
        </div>
        
        <div className="border-t pt-2 mt-2">
          <div className="text-xs font-medium text-fieldvision-blue mb-1">Actions</div>
          <div className="flex flex-col space-y-1">
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7 px-2 flex items-center justify-start border-fieldvision-blue/30"
              onClick={handleAddTaskClick}
            >
              <Plus className="h-3 w-3 mr-1 text-fieldvision-blue" /> New Task
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7 px-2 flex items-center justify-start border-fieldvision-blue/30"
              onClick={onEditTask}
              disabled={!selectedTaskId}
            >
              <Edit className="h-3 w-3 mr-1 text-fieldvision-blue" /> Edit Selected Task
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
