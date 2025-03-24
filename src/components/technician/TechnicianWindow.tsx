
import React, { useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { TaskConfirmationDialog } from '../schedule/map/TaskConfirmationDialog';
import { TechnicianHeader } from './TechnicianHeader';
import { TechnicianTaskSelector } from './TechnicianTaskSelector';
import { TechnicianMobileSummary } from './TechnicianMobileSummary';
import { TechnicianWorkEntryDialog } from './TechnicianWorkEntryDialog';
import { TechnicianMainContent } from './TechnicianMainContent';
import { TechnicianSidebar } from './TechnicianSidebar';
import { TechnicianExportDialog } from './TechnicianExportDialog';
import { useTechnicianMap } from './hooks/useTechnicianMap';
import { useTechnicianNotes } from './hooks/useTechnicianNotes';
import { useTechnicianTask } from './hooks/useTechnicianTask';
import { useTaskCompletion } from './hooks/useTaskCompletion';
import { useDrawingTools } from './hooks/useDrawingTools';
import { Link } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const TechnicianWindow: React.FC = () => {
  const isMobile = useIsMobile();
  const [showMobileTools, setShowMobileTools] = React.useState(false);
  
  // Custom hooks for various functionality
  const { 
    mapboxToken, setMapboxToken, showMapTokenInput, setShowMapTokenInput,
    mapNotes, addMapNote, deleteMapNote, mapVisible, handleMapVisibilityChange
  } = useTechnicianMap();
  
  const { generalNotes, saveGeneralNotes } = useTechnicianNotes();
  
  const { selectedTaskId, handleTaskSelect, taskData, formatDate, formatTime } = useTechnicianTask();
  
  const { 
    workEntryDialogOpen, setWorkEntryDialogOpen, confirmDialogOpen, 
    setConfirmDialogOpen, exportDialogOpen, setExportDialogOpen,
    handleCompleteReview, completeTask, exportAsGeoJSON, exportAsKMZ,
    shouldExportMap, setShouldExportMap
  } = useTaskCompletion({ mapNotes, taskData });
  
  const { currentTool, setCurrentTool } = useDrawingTools();
  
  // Set map token input to false on initial load
  useEffect(() => {
    setShowMapTokenInput(false);
  }, []);
  
  return (
    <div className="flex flex-col h-screen bg-background">
      <TechnicianWorkEntryDialog 
        open={workEntryDialogOpen} 
        onOpenChange={setWorkEntryDialogOpen} 
        projectId={taskData.projectId || "project-1"}
      />
      
      <TaskConfirmationDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirm={completeTask}
        actionType="complete"
        taskTitle={taskData.title}
        shouldExportMap={shouldExportMap}
        setShouldExportMap={setShouldExportMap}
      />
      
      <TechnicianExportDialog 
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        onExportGeoJSON={exportAsGeoJSON}
        onExportKMZ={exportAsKMZ}
        onSkip={() => setConfirmDialogOpen(true)}
        hasNotes={mapNotes.length > 0}
      />
      
      <TechnicianHeader
        taskTitle={taskData.title}
        handleCompleteReview={handleCompleteReview}
      />
      
      <div className="p-2 bg-background border-b border-border">
        <div className="flex justify-between items-center">
          <TechnicianTaskSelector 
            currentTaskId={selectedTaskId}
            onTaskSelect={handleTaskSelect}
          />
          <Link to="/technician/dashboard">
            <Button variant="outline" size="sm" className="ml-2">
              <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
            </Button>
          </Link>
        </div>
      </div>
      
      {isMobile && (
        <TechnicianMobileSummary
          taskData={taskData}
          formatDate={formatDate}
          formatTime={formatTime}
          setShowMobileTools={setShowMobileTools}
          showMobileTools={showMobileTools}
        />
      )}
      
      <div className="flex flex-1 overflow-hidden">
        <TechnicianMainContent 
          taskData={taskData}
          mapboxToken={mapboxToken}
          showMapTokenInput={showMapTokenInput}
          setShowMapTokenInput={setShowMapTokenInput}
          setMapboxToken={setMapboxToken}
          notes={mapNotes}
          addNote={addMapNote}
          currentTool={currentTool}
          setCurrentTool={setCurrentTool}
          mapVisible={mapVisible}
          onMapVisibilityChange={handleMapVisibilityChange}
        />
        
        {!isMobile && (
          <TechnicianSidebar 
            taskData={taskData}
            formatDate={formatDate}
            formatTime={formatTime}
            currentTool={currentTool}
            setCurrentTool={setCurrentTool}
            notes={mapNotes}
            deleteNote={deleteMapNote}
            saveGeneralNotes={saveGeneralNotes}
            generalNotes={generalNotes}
          />
        )}
      </div>
      
      <div className="flex flex-col items-center justify-center mt-4 mb-4 sm:mb-6">
        <img 
          src="/lovable-uploads/4a7fa1f1-9138-41e0-a593-01d098a4d5f9.png" 
          alt="Fieldvision Logo" 
          className="h-6 sm:h-8 w-auto object-contain" 
        />
      </div>
    </div>
  );
};
