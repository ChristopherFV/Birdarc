
import React from 'react';
import { useTechnicianMap } from './hooks/useTechnicianMap';
import { useTechnicianNotes } from './hooks/useTechnicianNotes';
import { useTechnicianTask } from './hooks/useTechnicianTask';
import { useTaskCompletion } from './hooks/useTaskCompletion';
import { useDrawingTools } from './hooks/useDrawingTools';
import { useMobileTools } from './hooks/useMobileTools';
import { TechnicianWindowContainer } from './TechnicianWindowContainer';

export const TechnicianWindow: React.FC = () => {
  // Custom hooks for mobile UI management
  const { 
    showMobileTools, setShowMobileTools, 
    activeTab, setActiveTab 
  } = useMobileTools();
  
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
  React.useEffect(() => {
    setShowMapTokenInput(false);
  }, [setShowMapTokenInput]);
  
  return (
    <TechnicianWindowContainer
      showMobileTools={showMobileTools}
      setShowMobileTools={setShowMobileTools}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      selectedTaskId={selectedTaskId}
      handleTaskSelect={handleTaskSelect}
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
      handleMapVisibilityChange={handleMapVisibilityChange}
      generalNotes={generalNotes}
      saveGeneralNotes={saveGeneralNotes}
      formatDate={formatDate}
      formatTime={formatTime}
      workEntryDialogOpen={workEntryDialogOpen}
      setWorkEntryDialogOpen={setWorkEntryDialogOpen}
      confirmDialogOpen={confirmDialogOpen}
      setConfirmDialogOpen={setConfirmDialogOpen}
      exportDialogOpen={exportDialogOpen}
      setExportDialogOpen={setExportDialogOpen}
      handleCompleteReview={handleCompleteReview}
      completeTask={completeTask}
      exportAsGeoJSON={exportAsGeoJSON}
      exportAsKMZ={exportAsKMZ}
      shouldExportMap={shouldExportMap}
      setShouldExportMap={setShouldExportMap}
    />
  );
};
