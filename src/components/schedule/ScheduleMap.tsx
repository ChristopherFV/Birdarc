
import React, { useState } from 'react';
import { useSchedule } from '@/context/ScheduleContext';
import { useApp } from '@/context/AppContext';
import { MapLayerControls } from './map/MapLayerControls';
import { MapContent } from './map/MapContent';
import { TaskInfoSidebar } from './map/TaskInfoSidebar';
import { AddTaskDialog } from './AddTaskDialog';
import { mockProjectLocations } from '@/utils/mockMapData';
import { TechnicianWorkEntryDialog } from '@/components/technician/TechnicianWorkEntryDialog';
import { TaskConfirmationDialog } from './map/TaskConfirmationDialog';
import { useTaskActions } from './map/useTaskActions';
import { useTaskMetadata } from './map/useTaskMetadata';

interface ScheduleMapProps {
  mapboxApiKey?: string;
}

export const ScheduleMap: React.FC<ScheduleMapProps> = ({ mapboxApiKey }) => {
  const { tasks: originalTasks, updateTask } = useSchedule();
  const { billingCodes, projects, teamMembers } = useApp();
  const [showTasks, setShowTasks] = useState(true);
  
  // Combine original tasks with mock tasks
  const mockTasks = mockProjectLocations.map(loc => ({
    ...loc,
    status: loc.status
  }));
  
  const allTasks = [...originalTasks, ...mockTasks];
  
  // Use our task actions hook
  const {
    selectedTaskId,
    isAddTaskDialogOpen,
    setIsAddTaskDialogOpen,
    isEditTaskDialogOpen,
    setIsEditTaskDialogOpen,
    isConfirmationDialogOpen,
    setIsConfirmationDialogOpen,
    confirmationAction,
    isWorkEntryDialogOpen,
    setIsWorkEntryDialogOpen,
    currentProjectId,
    handleTaskClick,
    handleAddTask,
    handleEditTask,
    handleCompleteTask,
    handleCancelTask,
    confirmTaskAction,
    openWorkEntryForm
  } = useTaskActions(allTasks, updateTask);
  
  // Use our task metadata hook
  const {
    selectedTask,
    selectedBillingCode,
    selectedProjectName
  } = useTaskMetadata(
    allTasks,
    billingCodes,
    projects,
    teamMembers,
    selectedTaskId
  );
  
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Map layer controls */}
      <MapLayerControls 
        showTasks={showTasks}
        setShowTasks={setShowTasks}
        taskCount={allTasks.length}
        onAddTask={handleAddTask}
        onEditTask={handleEditTask}
        selectedTaskId={selectedTaskId}
      />
      
      {/* Map content */}
      <MapContent 
        mapboxApiKey={mapboxApiKey}
        showTasks={showTasks}
        tasks={allTasks}
        onTaskClick={handleTaskClick}
        selectedTaskId={selectedTaskId}
      />
      
      {/* Selected Task Info Sidebar */}
      {selectedTask && (
        <TaskInfoSidebar
          selectedTask={selectedTask}
          projectName={selectedProjectName}
          billingCode={selectedBillingCode}
          onClose={() => handleTaskClick(selectedTask.id)}
          onEdit={handleEditTask}
          onCompleteTask={handleCompleteTask}
          onCancelTask={handleCancelTask}
        />
      )}
      
      {/* Task Dialogs */}
      <AddTaskDialog 
        open={isAddTaskDialogOpen} 
        onOpenChange={setIsAddTaskDialogOpen} 
      />
      
      {/* Confirmation Dialog */}
      <TaskConfirmationDialog
        open={isConfirmationDialogOpen}
        onOpenChange={setIsConfirmationDialogOpen}
        onConfirm={confirmTaskAction}
        onWorkEntry={openWorkEntryForm}
        actionType={confirmationAction}
        taskTitle={selectedTask?.title || ''}
        projectId={selectedTask?.projectId || undefined}
      />
      
      {/* Work Entry Dialog */}
      <TechnicianWorkEntryDialog
        open={isWorkEntryDialogOpen}
        onOpenChange={setIsWorkEntryDialogOpen}
        projectId={currentProjectId || undefined}
      />
    </div>
  );
};
