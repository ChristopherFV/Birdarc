
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { TechnicianMobileHeader } from './mobile/TechnicianMobileHeader';
import { TechnicianDesktopHeader } from './desktop/TechnicianDesktopHeader';
import { TechnicianMobileTabs } from './mobile/TechnicianMobileTabs';
import { TechnicianDesktopContent } from './desktop/TechnicianDesktopContent';
import { TechnicianDialogs } from './dialogs/TechnicianDialogs';
import { Button } from '@/components/ui/button';

interface TechnicianWindowContainerProps {
  showMobileTools: boolean;
  setShowMobileTools: (show: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedTaskId: string;
  handleTaskSelect: (taskId: string) => void;
  taskData: any;
  mapboxToken: string;
  showMapTokenInput: boolean;
  setShowMapTokenInput: (show: boolean) => void;
  setMapboxToken: (token: string) => void;
  mapNotes: any[];
  addMapNote: (note: any) => void;
  deleteMapNote: (id: string) => void;
  currentTool: 'pen' | 'text' | 'circle' | 'square';
  setCurrentTool: (tool: 'pen' | 'text' | 'circle' | 'square') => void;
  mapVisible: boolean;
  handleMapVisibilityChange: (visible: boolean) => void;
  generalNotes: string;
  saveGeneralNotes: (notes: string) => void;
  formatDate: (date: Date) => string;
  formatTime: (date: Date) => string;
  workEntryDialogOpen: boolean;
  setWorkEntryDialogOpen: (open: boolean) => void;
  confirmDialogOpen: boolean;
  setConfirmDialogOpen: (open: boolean) => void;
  exportDialogOpen: boolean;
  setExportDialogOpen: (open: boolean) => void;
  handleCompleteReview: () => void;
  completeTask: () => void;
  exportAsGeoJSON: () => void;
  exportAsKMZ: () => void;
  shouldExportMap: boolean;
  setShouldExportMap: (shouldExport: boolean) => void;
}

export const TechnicianWindowContainer: React.FC<TechnicianWindowContainerProps> = ({
  showMobileTools,
  setShowMobileTools,
  activeTab,
  setActiveTab,
  selectedTaskId,
  handleTaskSelect,
  taskData,
  mapboxToken,
  showMapTokenInput,
  setShowMapTokenInput,
  setMapboxToken,
  mapNotes,
  addMapNote,
  deleteMapNote,
  currentTool,
  setCurrentTool,
  mapVisible,
  handleMapVisibilityChange,
  generalNotes,
  saveGeneralNotes,
  formatDate,
  formatTime,
  workEntryDialogOpen,
  setWorkEntryDialogOpen,
  confirmDialogOpen,
  setConfirmDialogOpen,
  exportDialogOpen,
  setExportDialogOpen,
  handleCompleteReview,
  completeTask,
  exportAsGeoJSON,
  exportAsKMZ,
  shouldExportMap,
  setShouldExportMap
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col h-full bg-background">
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
      
      {isMobile ? (
        <>
          <TechnicianMobileHeader
            taskData={taskData}
            selectedTaskId={selectedTaskId}
            handleTaskSelect={handleTaskSelect}
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
          
          {/* Complete task button */}
          <div className="fixed bottom-20 right-4 z-50">
            <Button 
              onClick={handleCompleteReview}
              variant="blue"
              className="text-white shadow-lg rounded-full px-4"
            >
              Complete Task
            </Button>
          </div>
        </>
      ) : (
        <>
          <TechnicianDesktopHeader 
            selectedTaskId={selectedTaskId}
            handleTaskSelect={handleTaskSelect}
          />
          
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
          
          {/* Complete task button */}
          <div className="fixed bottom-8 right-8 z-50">
            <Button 
              onClick={handleCompleteReview}
              variant="blue"
              className="text-white shadow-lg"
            >
              Complete Task
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
