import React, { useState } from 'react';
import { SimplePageLayout } from '@/components/layout/SimplePageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Plus, Filter, SortDesc, CircleAlert, MapPin, FileType, Users, User } from 'lucide-react';
import { FileRepository } from '@/components/repository/FileRepository';
import { FileUploader } from '@/components/repository/FileUploader';
import { Badge } from '@/components/ui/badge';
import { useSchedule } from '@/context/ScheduleContext';
import { ScheduleMap } from '@/components/schedule/ScheduleMap';
import { TaskForm } from '@/components/schedule/TaskForm';
import { KmzUploader } from '@/components/repository/KmzUploader';
import { KmzFeature } from '@/utils/kmzUtils';
import { useToast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const projectsWithPendingFiles = [
  { id: '1', name: 'Cedar Heights Fiber', pendingCount: 25, billingCodes: ['FBR-001'] },
  { id: '2', name: 'Oakridge Expansion', pendingCount: 12, billingCodes: ['UND-025'] },
  { id: '3', name: 'Downtown Connection', pendingCount: 0, billingCodes: ['PMT-103'] },
  { id: '4', name: 'Westside Network', pendingCount: 8, billingCodes: ['SPL-072'] },
];

type VisibilitySettings = {
  visibilityType: 'all' | 'team' | 'specific';
  teamId?: string;
  userId?: string;
};

type KmzFeatureWithVisibility = KmzFeature & {
  visibleTo: VisibilitySettings;
};

const RepositoryPage = () => {
  const [showUploader, setShowUploader] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'schedule'>('schedule');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [showKmzUploader, setShowKmzUploader] = useState(false);
  const [importedKmzFeatures, setImportedKmzFeatures] = useState<KmzFeatureWithVisibility[]>([]);
  const [mapboxApiKey] = useState<string>("pk.eyJ1IjoiY2h1Y2F0eCIsImEiOiJjbThra2NrcHIwZGIzMm1wdDYzNnpreTZyIn0.KUTPCuD8hk7VOzTYJ-WODg");
  const { tasks } = useSchedule();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const currentUser = { id: 'user-1', name: 'John Davis', teamId: 'team-1' };

  const totalPendingFiles = projectsWithPendingFiles.reduce((sum, project) => sum + project.pendingCount, 0);

  const handleKmzDataImported = (features: KmzFeature[], visibility: VisibilitySettings) => {
    const featuresWithVisibility = features.map(feature => ({
      ...feature,
      visibleTo: visibility
    })) as KmzFeatureWithVisibility[];
    
    setImportedKmzFeatures(prevFeatures => [...prevFeatures, ...featuresWithVisibility]);
    setShowKmzUploader(false);
    
    toast({
      title: "Map features imported",
      description: `${features.length} features have been added to the map for tracking`,
      variant: "default",
    });
  };
  
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
  
  const toggleKmzUploader = () => {
    setShowKmzUploader(prev => !prev);
  };
  
  const actionButton = (
    <Button 
      onClick={() => setShowUploader(true)} 
      className="bg-fieldvision-orange hover:bg-fieldvision-orange/90 text-white"
      size="sm"
      disabled={showUploader}
    >
      <Upload className="h-4 w-4 mr-1" />
      Upload
    </Button>
  );

  return (
    <SimplePageLayout 
      subtitle="Upload and manage project files, schedule tasks and monitor field operations"
      showFooter={true}
      footerProps={{
        backLink: "/",
        backLabel: "Dashboard",
        actionButton: actionButton
      }}
    >
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
                onClick={toggleKmzUploader} 
                variant="outline"
                className="flex items-center gap-2"
                size={isMobile ? "sm" : "default"}
              >
                <FileType className="h-4 w-4" />
                <span>{isMobile ? "Import Map" : "Import Map File"}</span>
              </Button>
              <Button 
                onClick={() => setIsTaskFormOpen(true)} 
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
              onClick={() => setShowUploader(true)} 
              className="flex items-center gap-2"
              disabled={showUploader}
              size={isMobile ? "sm" : "default"}
            >
              <Upload className="h-4 w-4" />
              <span>Upload Files</span>
            </Button>
          )}
        </div>
      </div>

      {showKmzUploader && selectedTab === 'schedule' && (
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

      <Tabs 
        defaultValue="schedule" 
        className="w-full"
        value={selectedTab}
        onValueChange={(value) => setSelectedTab(value as any)}
      >
        <TabsList className="mb-4 flex flex-wrap sm:flex-nowrap w-full overflow-x-auto">
          <TabsTrigger value="schedule" className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>Field Map</span>
            {tasks.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {tasks.length}
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
        
        {totalPendingFiles > 0 && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-yellow-700 mb-2">
                <CircleAlert className="h-5 w-5" />
                <h3 className="font-medium">Files Pending Approval</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {projectsWithPendingFiles
                  .filter(project => project.pendingCount > 0)
                  .map(project => (
                    <div 
                      key={project.id} 
                      className="flex justify-between items-center bg-white rounded-md p-3 shadow-sm cursor-pointer"
                      onClick={() => setSelectedTab('pending')}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium truncate max-w-[150px] sm:max-w-none">{project.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {project.billingCodes.join(', ')}
                        </span>
                      </div>
                      <Badge variant="secondary" className="ml-2 whitespace-nowrap">
                        {project.pendingCount} files
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {showUploader && selectedTab !== 'schedule' && (
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle>Upload Project Files</CardTitle>
              <CardDescription>
                Add multiple files to the repository for review and approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploader />
            </CardContent>
            <CardFooter className="justify-end gap-2 pt-2 flex-wrap">
              <Button variant="outline" onClick={() => setShowUploader(false)} size={isMobile ? "sm" : "default"}>
                Cancel
              </Button>
              <Button size={isMobile ? "sm" : "default"}>
                Submit Files
              </Button>
            </CardFooter>
          </Card>
        )}
        
      <TabsContent value="schedule">
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
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
        </div>
      </TabsContent>
      
        <TabsContent value="all">
          <FileRepository status="all" />
        </TabsContent>
        <TabsContent value="pending">
          <FileRepository status="pending" />
        </TabsContent>
        <TabsContent value="approved">
          <FileRepository status="approved" />
        </TabsContent>
        <TabsContent value="rejected">
          <FileRepository status="rejected" />
        </TabsContent>
      </Tabs>
      
      <TaskForm open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen} />
    </SimplePageLayout>
  );
};

export default RepositoryPage;
