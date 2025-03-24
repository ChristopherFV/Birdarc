
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileType, MapPin, Plus, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScheduleMap } from '@/components/schedule/ScheduleMap';
import { KmzUploader } from '@/components/repository/KmzUploader';
import { KmzFeature } from '@/utils/kmzUtils';
import { TaskForm } from '@/components/schedule/TaskForm';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface MapSectionProps {
  mapboxApiKey: string;
  showKmzUploader: boolean;
  setShowKmzUploader: (show: boolean) => void;
  importedKmzFeatures: any[];
  setImportedKmzFeatures: (features: any[]) => void;
  isTaskFormOpen: boolean;
  setIsTaskFormOpen: (isOpen: boolean) => void;
  currentUser: { id: string, name: string, teamId: string };
}

export const MapSection: React.FC<MapSectionProps> = ({
  mapboxApiKey,
  showKmzUploader,
  setShowKmzUploader,
  importedKmzFeatures,
  setImportedKmzFeatures,
  isTaskFormOpen,
  setIsTaskFormOpen,
  currentUser
}) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const getVisibleFeatures = () => {
    return importedKmzFeatures.filter(feature => {
      const { visibilityType, teamId, userId } = feature.visibleTo;
      
      if (visibilityType === 'all') {
        return true;
      } else if (visibilityType === 'team') {
        return teamId === currentUser.teamId;
      } else if (visibilityType === 'specific') {
        return userId === currentUser.id;
      }
      
      return false;
    });
  };
  
  const visibleFeatures = getVisibleFeatures();
  
  const handleKmzDataImported = (features: KmzFeature[], visibility: any) => {
    const featuresWithVisibility = features.map(feature => ({
      ...feature,
      visibleTo: visibility
    }));
    
    setImportedKmzFeatures(prevFeatures => [...prevFeatures, ...featuresWithVisibility]);
    setShowKmzUploader(false);
    
    toast({
      title: "Map features imported",
      description: `${features.length} features have been added to the map for tracking`,
      variant: "default",
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6">
      {showKmzUploader && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Import Map Data</CardTitle>
            <CardDescription>
              Upload KMZ or GeoJSON files to import geographic data for your projects and control who can see it
            </CardDescription>
          </CardHeader>
          <CardContent>
            <KmzUploader onKmzDataImported={handleKmzDataImported} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center mb-2 sm:mb-0">
              <MapPin className="mr-2 h-5 w-5" />
              Fieldmap
            </div>
            <div className="flex items-center text-sm">
              <User className="h-4 w-4 mr-1" />
              <span className="text-muted-foreground text-xs sm:text-sm">Viewing as: {currentUser.name}</span>
            </div>
          </CardTitle>
          <CardDescription>
            <span className="text-xs sm:text-sm">
              View all teams and technicians across locations. Click on markers to assign tasks.
              {visibleFeatures.length > 0 && (
                <Badge variant="outline" className="ml-2">
                  {visibleFeatures.length} imported features
                </Badge>
              )}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] sm:h-[600px] w-full rounded-md overflow-hidden">
            <ScheduleMap mapboxApiKey={mapboxApiKey} />
          </div>
        </CardContent>
      </Card>
      
      <TaskForm open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen} />
    </div>
  );
};
