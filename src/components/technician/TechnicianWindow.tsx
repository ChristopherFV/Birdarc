
import React, { useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { TaskConfirmationDialog } from '../schedule/map/TaskConfirmationDialog';
import { TechnicianHeader } from './TechnicianHeader';
import { TechnicianTaskSelector } from './TechnicianTaskSelector';
import { TechnicianMobileSummary } from './TechnicianMobileSummary';
import { TechnicianWorkEntryDialog } from './TechnicianWorkEntryDialog';
import { TechnicianMainContent } from './TechnicianMainContent';
import { TechnicianSidebar } from './TechnicianSidebar';
import { useTechnicianMap } from './hooks/useTechnicianMap';
import { useTechnicianNotes } from './hooks/useTechnicianNotes';
import { useTechnicianTask } from './hooks/useTechnicianTask';
import { useTaskCompletion } from './hooks/useTaskCompletion';
import { useDrawingTools } from './hooks/useDrawingTools';

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
    setConfirmDialogOpen, handleCompleteReview, completeTask 
  } = useTaskCompletion();
  
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
      />
      
      <TechnicianHeader
        taskTitle={taskData.title}
        handleCompleteReview={handleCompleteReview}
      />
      
      <div className="p-2 bg-background border-b border-border">
        <TechnicianTaskSelector 
          currentTaskId={selectedTaskId}
          onTaskSelect={handleTaskSelect}
        />
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
