
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Filter, SortDesc, FileType, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';

interface RepositoryHeaderProps {
  selectedTab: string;
  setSelectedTab: (value: any) => void;
  totalPendingFiles: number;
  tasksCount: number;
  onAddTaskClick: () => void;
  onImportMapClick: () => void;
  onUploadClick: () => void;
}

export const RepositoryHeader: React.FC<RepositoryHeaderProps> = ({
  selectedTab,
  setSelectedTab,
  totalPendingFiles,
  tasksCount,
  onAddTaskClick,
  onImportMapClick,
  onUploadClick
}) => {
  const isMobile = useIsMobile();

  const handleAddTaskClick = () => {
    console.log("Add Task button clicked in header");
    onAddTaskClick();
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-6">
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <SortDesc className="h-4 w-4" />
            <span>Sort</span>
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-start sm:justify-end">
          {selectedTab === 'schedule' && (
            <>
              <Button 
                onClick={onImportMapClick} 
                variant="outline"
                className="flex items-center gap-2"
                size={isMobile ? "sm" : "default"}
              >
                <FileType className="h-4 w-4" />
                <span>{isMobile ? "Import Map" : "Import Map File"}</span>
              </Button>
              <Button 
                onClick={handleAddTaskClick} 
                className="flex items-center gap-2 bg-fieldvision-orange hover:bg-fieldvision-orange/90 text-white"
                size={isMobile ? "sm" : "default"}
              >
                <Plus className="h-4 w-4" />
                <span>New Task</span>
              </Button>
            </>
          )}
          {selectedTab !== 'schedule' && (
            <Button 
              onClick={onUploadClick} 
              className="flex items-center gap-2"
              size={isMobile ? "sm" : "default"}
            >
              <Plus className="h-4 w-4" />
              <span>Upload Files</span>
            </Button>
          )}
        </div>
      </div>

      <Tabs 
        defaultValue="schedule" 
        className="w-full"
        value={selectedTab}
        onValueChange={setSelectedTab}
      >
        <TabsList className="mb-4 flex flex-wrap sm:flex-nowrap w-full overflow-x-auto">
          <TabsTrigger value="schedule" className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>Field Map</span>
            {tasksCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {tasksCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="all">All Files</TabsTrigger>
          <TabsTrigger value="pending">
            Pending Review
            {totalPendingFiles > 0 && (
              <Badge variant="secondary" className="ml-2">
                {totalPendingFiles}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
      </Tabs>
    </>
  );
};
