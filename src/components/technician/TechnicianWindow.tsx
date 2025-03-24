
import React, { useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { TaskConfirmationDialog } from '../schedule/map/TaskConfirmationDialog';
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
import { Button } from '@/components/ui/button';
import { PageFooter } from '@/components/layout/PageFooter';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map, FileText, MessageSquare } from 'lucide-react';

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
  }, []);
  
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
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="w-full grid grid-cols-3 bg-muted/70 p-1 rounded-lg shadow-sm mx-2">
              <TabsTrigger value="map" className="text-xs py-1.5">
                <Map className="h-3.5 w-3.5 mr-1" />
                Map
              </TabsTrigger>
              <TabsTrigger value="details" className="text-xs py-1.5">
                <FileText className="h-3.5 w-3.5 mr-1" />
                Details
              </TabsTrigger>
              <TabsTrigger value="notes" className="text-xs py-1.5">
                <MessageSquare className="h-3.5 w-3.5 mr-1" />
                Notes
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="map" className="flex-1 p-0 mt-0 overflow-hidden">
              <div className="h-full">
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
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="flex-1 p-2 mt-0 overflow-auto">
              <Card className="p-3 mb-3">
                <h3 className="text-sm font-medium mb-2">Task Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Title:</span>
                    <span className="font-medium">{taskData.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span>{formatDate(taskData.startDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span>{formatTime(taskData.startDate)} - {formatTime(taskData.endDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {taskData.status || "Active"}
                    </span>
                  </div>
                </div>
              </Card>
              
              <Card className="p-3">
                <h3 className="text-sm font-medium mb-2">Task Description</h3>
                <p className="text-sm text-muted-foreground">
                  {taskData.description || "No description available for this task."}
                </p>
              </Card>
            </TabsContent>
            
            <TabsContent value="notes" className="flex-1 p-2 mt-0 overflow-auto">
              <Card className="p-3 mb-3">
                <h3 className="text-sm font-medium mb-2">Notes</h3>
                <textarea
                  className="w-full p-2 border rounded-md text-sm min-h-[120px]"
                  placeholder="Add your notes here..."
                  value={generalNotes}
                  onChange={(e) => saveGeneralNotes(e.target.value)}
                />
              </Card>
              
              <Card className="p-3">
                <h3 className="text-sm font-medium mb-2">Map Notes</h3>
                {mapNotes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No map notes added yet.</p>
                ) : (
                  <div className="space-y-2">
                    {mapNotes.map((note, index) => (
                      <div key={index} className="flex justify-between items-start border-b pb-2">
                        <div>
                          <div className="text-xs font-medium">{note.title || `Note ${index + 1}`}</div>
                          <div className="text-xs text-muted-foreground">{note.text}</div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0" 
                          onClick={() => deleteMapNote(index)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : (
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
        </div>
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
