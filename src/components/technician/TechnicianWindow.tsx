
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
import { LayoutDashboard, ChevronLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";

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
      
      <TechnicianHeader />
      
      <div className="p-2 bg-background">
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
      
      {/* Bottom navigation bar with logo */}
      <div className="bg-fieldvision-navy p-3 flex justify-between items-center shadow-inner">
        <div className="flex items-center gap-3">
          <Link to="/technician/dashboard">
            <Button variant="ghost" size="sm" className="text-white hover:bg-fieldvision-navy/80">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
          
          <Menubar className="bg-transparent border-none">
            <MenubarMenu>
              <MenubarTrigger className="text-white hover:bg-fieldvision-navy/80 data-[state=open]:bg-fieldvision-navy/80">
                <LayoutDashboard className="h-4 w-4 mr-1" />
                Menu
              </MenubarTrigger>
              <MenubarContent>
                <Link to="/technician/dashboard">
                  <MenubarItem>
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </MenubarItem>
                </Link>
                <Link to="/schedule">
                  <MenubarItem>
                    <Check className="h-4 w-4 mr-2" />
                    My Tasks
                  </MenubarItem>
                </Link>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
        
        {/* Logo in center of bottom bar */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <img 
            src="/lovable-uploads/4a7fa1f1-9138-41e0-a593-01d098a4d5f9.png" 
            alt="Fieldvision Logo" 
            className="h-6 w-auto object-contain" 
          />
        </div>
        
        <Button 
          onClick={handleCompleteReview}
          className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded"
        >
          Complete Task
        </Button>
      </div>
    </div>
  );
};
