
import React, { useState } from 'react';
import { SimplePageLayout } from '@/components/layout/SimplePageLayout';
import { useSchedule } from '@/context/ScheduleContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Plus, Map, FileText } from 'lucide-react';

// Import refactored components
import { RepositoryHeader } from '@/components/repository/page/RepositoryHeader';
import { PendingNotification } from '@/components/repository/page/PendingNotification';
import { MapSection } from '@/components/repository/page/MapSection';
import { FileSection } from '@/components/repository/page/FileSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

// Mock data
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

type KmzFeatureWithVisibility = any;

const RepositoryPage = () => {
  const [showUploader, setShowUploader] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'schedule'>('schedule');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [showKmzUploader, setShowKmzUploader] = useState(false);
  const [importedKmzFeatures, setImportedKmzFeatures] = useState<KmzFeatureWithVisibility[]>([]);
  const [mapboxApiKey] = useState<string>("pk.eyJ1IjoiY2h1Y2F0eCIsImEiOiJjbThra2NrcHIwZGIzMm1wdDYzNnpreTZyIn0.KUTPCuD8hk7VOzTYJ-WODg");
  const { tasks } = useSchedule();
  const isMobile = useIsMobile();
  
  const currentUser = { id: 'user-1', name: 'John Davis', teamId: 'team-1' };
  const totalPendingFiles = projectsWithPendingFiles.reduce((sum, project) => sum + project.pendingCount, 0);
  
  const toggleKmzUploader = () => {
    setShowKmzUploader(prev => !prev);
  };
  
  const handleSetPendingTab = () => {
    setSelectedTab('pending');
  };

  return (
    <SimplePageLayout 
      subtitle="Upload and manage project files, schedule tasks and monitor field operations"
      showFooter={true}
      footerProps={{
        backLink: "/",
        backLabel: "Home",
        actionButton: isMobile ? (
          <Button 
            variant="blue"
            size="sm"
            className="text-white"
            onClick={() => setShowUploader(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Upload
          </Button>
        ) : undefined
      }}
    >
      {isMobile ? (
        <>
          <Tabs 
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="w-full"
          >
            <TabsList className="w-full grid grid-cols-3 mb-4 bg-muted/70 p-1 rounded-lg sticky top-0 z-20 shadow-sm">
              <TabsTrigger value="schedule" className="text-sm py-1.5">
                <Map className="h-3.5 w-3.5 mr-1" />
                Map
              </TabsTrigger>
              <TabsTrigger value="pending" className="text-sm py-1.5">
                <FileText className="h-3.5 w-3.5 mr-1" />
                Files
              </TabsTrigger>
              <TabsTrigger value="all" className="text-sm py-1.5">
                All Files
              </TabsTrigger>
            </TabsList>
            
            {totalPendingFiles > 0 && selectedTab !== 'pending' && (
              <Card className="p-3 mb-4 bg-amber-50 border-amber-200">
                <PendingNotification 
                  projectsWithPendingFiles={projectsWithPendingFiles}
                  onProjectClick={handleSetPendingTab}
                />
              </Card>
            )}
            
            <TabsContent value="schedule" className="pb-20 animate-fade-in">
              <MapSection 
                mapboxApiKey={mapboxApiKey}
                showKmzUploader={showKmzUploader}
                setShowKmzUploader={setShowKmzUploader}
                importedKmzFeatures={importedKmzFeatures}
                setImportedKmzFeatures={setImportedKmzFeatures}
                isTaskFormOpen={isTaskFormOpen}
                setIsTaskFormOpen={setIsTaskFormOpen}
                currentUser={currentUser}
              />
            </TabsContent>
            
            <TabsContent value="all" className="pb-20 animate-fade-in">
              <FileSection 
                selectedTab="all"
                totalPendingFiles={totalPendingFiles}
                showUploader={showUploader}
                setShowUploader={setShowUploader}
              />
            </TabsContent>
            
            <TabsContent value="pending" className="pb-20 animate-fade-in">
              <FileSection 
                selectedTab="pending"
                totalPendingFiles={totalPendingFiles}
                showUploader={showUploader}
                setShowUploader={setShowUploader}
              />
            </TabsContent>
            
            <TabsContent value="approved" className="pb-20 animate-fade-in">
              <FileSection 
                selectedTab="approved"
                totalPendingFiles={totalPendingFiles}
                showUploader={showUploader}
                setShowUploader={setShowUploader}
              />
            </TabsContent>
            
            <TabsContent value="rejected" className="pb-20 animate-fade-in">
              <FileSection 
                selectedTab="rejected"
                totalPendingFiles={totalPendingFiles}
                showUploader={showUploader}
                setShowUploader={setShowUploader}
              />
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <>
          <RepositoryHeader 
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            totalPendingFiles={totalPendingFiles}
            tasksCount={tasks.length}
            onAddTaskClick={() => setIsTaskFormOpen(true)}
            onImportMapClick={toggleKmzUploader}
            onUploadClick={() => setShowUploader(true)}
          />
          
          <PendingNotification 
            projectsWithPendingFiles={projectsWithPendingFiles}
            onProjectClick={handleSetPendingTab}
          />
          
          <Tabs 
            value={selectedTab}
            className="w-full"
          >
            <TabsContent value="schedule">
              <MapSection 
                mapboxApiKey={mapboxApiKey}
                showKmzUploader={showKmzUploader}
                setShowKmzUploader={setShowKmzUploader}
                importedKmzFeatures={importedKmzFeatures}
                setImportedKmzFeatures={setImportedKmzFeatures}
                isTaskFormOpen={isTaskFormOpen}
                setIsTaskFormOpen={setIsTaskFormOpen}
                currentUser={currentUser}
              />
            </TabsContent>
            
            <TabsContent value="all">
              <FileSection 
                selectedTab="all"
                totalPendingFiles={totalPendingFiles}
                showUploader={showUploader}
                setShowUploader={setShowUploader}
              />
            </TabsContent>
            
            <TabsContent value="pending">
              <FileSection 
                selectedTab="pending"
                totalPendingFiles={totalPendingFiles}
                showUploader={showUploader}
                setShowUploader={setShowUploader}
              />
            </TabsContent>
            
            <TabsContent value="approved">
              <FileSection 
                selectedTab="approved"
                totalPendingFiles={totalPendingFiles}
                showUploader={showUploader}
                setShowUploader={setShowUploader}
              />
            </TabsContent>
            
            <TabsContent value="rejected">
              <FileSection 
                selectedTab="rejected"
                totalPendingFiles={totalPendingFiles}
                showUploader={showUploader}
                setShowUploader={setShowUploader}
              />
            </TabsContent>
          </Tabs>
        </>
      )}
    </SimplePageLayout>
  );
};

export default RepositoryPage;
