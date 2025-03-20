
import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter, SortDesc, Calendar, Upload, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RepositoryActionsProps {
  showSchedule: boolean;
  toggleScheduleView: () => void;
  setShowUploader: (show: boolean) => void;
  setIsTaskFormOpen: (open: boolean) => void;
  tasksCount: number;
  showUploader: boolean;
}

export const RepositoryActions: React.FC<RepositoryActionsProps> = ({
  showSchedule,
  toggleScheduleView,
  setShowUploader,
  setIsTaskFormOpen,
  tasksCount,
  showUploader
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <SortDesc className="h-4 w-4" />
          <span>Sort</span>
        </Button>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={toggleScheduleView}
          variant={showSchedule ? "default" : "outline"}
          className={`flex items-center gap-2 ${showSchedule ? "bg-fieldvision-blue hover:bg-fieldvision-blue/90 text-white" : ""}`}
        >
          <Calendar className="h-4 w-4" />
          <span>Schedule</span>
          {tasksCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {tasksCount}
            </Badge>
          )}
        </Button>
        
        {showSchedule ? (
          <Button 
            onClick={() => setIsTaskFormOpen(true)} 
            className="flex items-center gap-2 bg-fieldvision-orange hover:bg-fieldvision-orange/90 text-white"
          >
            <Plus className="h-4 w-4" />
            <span>New Task</span>
          </Button>
        ) : (
          <Button 
            onClick={() => setShowUploader(true)} 
            className="flex items-center gap-2"
            disabled={showUploader}
          >
            <Upload className="h-4 w-4" />
            <span>Upload Files</span>
          </Button>
        )}
      </div>
    </div>
  );
};
