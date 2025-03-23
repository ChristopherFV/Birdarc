
import React from 'react';
import { Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapLayerControlsProps {
  showTasks: boolean;
  setShowTasks: (show: boolean) => void;
  showProjects: boolean;
  setShowProjects: (show: boolean) => void;
  taskCount: number;
  projectCount: number;
}

export const MapLayerControls: React.FC<MapLayerControlsProps> = ({
  showTasks,
  setShowTasks,
  showProjects,
  setShowProjects,
  taskCount,
  projectCount
}) => {
  return (
    <div className="absolute left-4 top-4 z-10">
      <div className="bg-white p-2 rounded-md shadow-md space-y-1 border">
        <div className="text-xs font-medium text-gray-500 mb-1 flex items-center">
          <Layers className="h-3 w-3 mr-1" />
          Map Layers
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant={showTasks ? "default" : "outline"} 
            size="sm" 
            className="text-xs h-7 px-2" 
            onClick={() => setShowTasks(!showTasks)}
          >
            Tasks ({taskCount})
          </Button>
          <Button 
            variant={showProjects ? "default" : "outline"} 
            size="sm" 
            className="text-xs h-7 px-2" 
            onClick={() => setShowProjects(!showProjects)}
          >
            Projects ({projectCount})
          </Button>
        </div>
      </div>
    </div>
  );
};
