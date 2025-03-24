
import React, { useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { TechnicianTaskSelector } from './TechnicianTaskSelector';
import { TechnicianMobileSummary } from './TechnicianMobileSummary';
import { Button } from '@/components/ui/button';
import { PageFooter } from '@/components/layout/PageFooter';
import { useTechnicianMap } from './hooks/useTechnicianMap';
import { useTechnicianNotes } from './hooks/useTechnicianNotes';
import { useTechnicianTask } from './hooks/useTechnicianTask';
import { useTaskCompletion } from './hooks/useTaskCompletion';
import { useDrawingTools } from './hooks/useDrawingTools';
import { TechnicianMobileTabs } from './mobile/TechnicianMobileTabs';
import { TechnicianDesktopContent } from './desktop/TechnicianDesktopContent';
import { TechnicianDialogs } from './dialogs/TechnicianDialogs';

export const TechnicianWindow: React.FC = () => {
  const isMobile = useIsMobile();
  const [showMobileTools, setShowMobileTools] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<string>("map");
  
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
  }, [setShowMapTokenInput]);
  
  // Action button for the footer - Updated to use Fieldvision blue
  const actionButton = (
    <Button 
      onClick={handleCompleteReview}
      variant="blue"
      className="text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded"
    >
      Complete Task
    </Button>
  );
  
  return (
    <div className="flex flex-col h-screen bg-background">
      <TechnicianDialogs 
        workEntryDialogOpen={workEntryDialogOpen}
        setWorkEntryDialogOpen={setWorkEntryDialogOpen}
        confirmDialogOpen={confirmDialogOpen}
        setConfirmDialogOpen={setConfirmDialogOpen}
        exportDialogOpen={exportDialogOpen}
        setExportDialogOpen={setExportDialogOpen}
        completeTask={completeTask}
        exportAsGeoJSON={exportAsGeoJSON}
        exportAsKMZ={exportAsKMZ}
        taskData={taskData}
        shouldExportMap={shouldExportMap}
        setShouldExportMap={setShouldExportMap}
      />
      
      <div className="p-2 bg-background">
        <TechnicianTaskSelector 
          currentTaskId={selectedTaskId}
          onTaskSelect={handleTaskSelect}
        />
      </div>
      
      {isMobile ? (
        <>
          <TechnicianMobileSummary
            taskData={taskData}
            formatDate={formatDate}
            formatTime={formatTime}
            setShowMobileTools={setShowMobileTools}
            showMobileTools={showMobileTools}
          />
          
          <TechnicianMobileTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            taskData={taskData}
            mapboxToken={mapboxToken}
            showMapTokenInput={showMapTokenInput}
            setShowMapTokenInput={setShowMapTokenInput}
            setMapboxToken={setMapboxToken}
            mapNotes={mapNotes}
            addMapNote={addMapNote}
            deleteMapNote={deleteMapNote}
            currentTool={currentTool}
            setCurrentTool={setCurrentTool}
            mapVisible={mapVisible}
            onMapVisibilityChange={handleMapVisibilityChange}
            generalNotes={generalNotes}
            saveGeneralNotes={saveGeneralNotes}
            formatDate={formatDate}
            formatTime={formatTime}
          />
        </>
      ) : (
        <TechnicianDesktopContent 
          taskData={taskData}
          mapboxToken={mapboxToken}
          showMapTokenInput={showMapTokenInput}
          setShowMapTokenInput={setShowMapTokenInput}
          setMapboxToken={setMapboxToken}
          mapNotes={mapNotes}
          addMapNote={addMapNote}
          deleteMapNote={deleteMapNote}
          currentTool={currentTool}
          setCurrentTool={setCurrentTool}
          mapVisible={mapVisible}
          onMapVisibilityChange={handleMapVisibilityChange}
          formatDate={formatDate}
          formatTime={formatTime}
          generalNotes={generalNotes}
          saveGeneralNotes={saveGeneralNotes}
        />
      )}
      
      {/* Using the PageFooter component */}
      <PageFooter
        backLink="/technician/dashboard"
        backLabel="Back"
        actionButton={actionButton}
      />
    </div>
  );
};
