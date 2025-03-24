
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { TaskConfirmationDialog } from '../schedule/map/TaskConfirmationDialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { TechnicianDrawingTools } from './TechnicianDrawingTools';
import { TechnicianTaskDetails } from './TechnicianTaskDetails';
import { TechnicianTaskSelector } from './TechnicianTaskSelector';
import { useSchedule, Task } from '@/context/ScheduleContext';
import { TechnicianWorkEntryDialog } from './TechnicianWorkEntryDialog';
import { TechnicianHeader } from './TechnicianHeader';
import { TechnicianLocationMap } from './TechnicianLocationMap';
import { TechnicianMobileSummary } from './TechnicianMobileSummary';
import { TechnicianPdfViewer } from './TechnicianPdfViewer';
import { TechnicianNotesTab } from './TechnicianNotesTab';

export const TechnicianWindow: React.FC = () => {
  const { toast } = useToast();
  const [currentTool, setCurrentTool] = useState<'pen' | 'text' | 'circle' | 'square'>('pen');
  const [workEntryDialogOpen, setWorkEntryDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'drawing' | 'notes'>('drawing');
  const [mapboxToken, setMapboxToken] = useState<string>("pk.eyJ1IjoiY2h1Y2F0eCIsImEiOiJjbThra2NrcHIwZGIzMm1wdDYzNnpreTZyIn0.KUTPCuD8hk7VOzTYJ-WODg");
  const [showMapTokenInput, setShowMapTokenInput] = useState(false);
  const [showMobileTools, setShowMobileTools] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("task-123");
  
  const isMobile = useIsMobile();
  const { tasks } = useSchedule();
  
  const defaultTaskData: Task = {
    id: 'task-123',
    title: 'Field Dashboard',
    description: 'Review the construction drawings for the new commercial building project. Check for structural issues and compliance with local building codes.',
    location: {
      address: '123 Construction Ave, Building 3, San Francisco, CA 94103',
      lat: 37.7749,
      lng: -122.4194
    },
    startDate: new Date('2023-10-15T09:00:00'),
    endDate: new Date('2023-10-15T17:00:00'),
    projectId: 'project-1',
    teamMemberId: 'team-1',
    priority: 'high',
    status: 'in_progress',
    billingCodeId: 'billing-1',
    quantityEstimate: 100
  };
  
  const handleTaskSelect = (taskId: string) => {
    setSelectedTaskId(taskId);
  };
  
  const getSelectedTask = (): Task => {
    const foundTask = tasks.find(task => task.id === selectedTaskId);
    return foundTask || defaultTaskData;
  };
  
  const taskData = getSelectedTask();
  
  useEffect(() => {
    setShowMapTokenInput(false);
  }, []);
  
  const handleCompleteReview = () => {
    setConfirmDialogOpen(true);
  };
  
  const completeTask = () => {
    toast({
      title: "Task closed",
      description: "Please log your work entry for this task.",
    });
    setWorkEntryDialogOpen(true);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
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
        <div className="flex-1 overflow-auto p-2 sm:p-4">
          <div className="mb-2 sm:mb-4">
            <TechnicianLocationMap
              location={taskData.location}
              mapboxToken={mapboxToken}
              showMapTokenInput={showMapTokenInput}
              setShowMapTokenInput={setShowMapTokenInput}
              setMapboxToken={setMapboxToken}
            />
          </div>
          
          <TechnicianPdfViewer
            currentTool={currentTool}
            setCurrentTool={setCurrentTool}
          />
        </div>
        
        {!isMobile && (
          <div className="w-72 border-l border-border overflow-y-auto">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'drawing' | 'notes')} className="w-full">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="drawing">Drawing</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="drawing" className="p-4 space-y-4">
                <TechnicianDrawingTools 
                  currentTool={currentTool} 
                  setCurrentTool={setCurrentTool} 
                />
                
                <TechnicianTaskDetails 
                  task={taskData} 
                  formatDate={formatDate} 
                  formatTime={formatTime} 
                />
              </TabsContent>
              
              <TabsContent value="notes" className="p-4">
                <TechnicianNotesTab />
              </TabsContent>
            </Tabs>
          </div>
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
