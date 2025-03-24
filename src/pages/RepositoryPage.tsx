
import React, { useState } from 'react';
import { SimplePageLayout } from '@/components/layout/SimplePageLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Upload } from 'lucide-react';
import { useSchedule } from '@/context/ScheduleContext';
import { useToast } from '@/components/ui/use-toast';

// Import refactored components
import { RepositoryHeader } from '@/components/repository/page/RepositoryHeader';
import { PendingNotification } from '@/components/repository/page/PendingNotification';
import { MapSection } from '@/components/repository/page/MapSection';
import { FileSection } from '@/components/repository/page/FileSection';

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
  
  const currentUser = { id: 'user-1', name: 'John Davis', teamId: 'team-1' };
  const totalPendingFiles = projectsWithPendingFiles.reduce((sum, project) => sum + project.pendingCount, 0);
  
  const toggleKmzUploader = () => {
    setShowKmzUploader(prev => !prev);
  };
  
  const handleSetPendingTab = () => {
    setSelectedTab('pending');
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
    </SimplePageLayout>
  );
};

export default RepositoryPage;
