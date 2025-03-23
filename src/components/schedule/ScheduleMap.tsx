
import React, { useState, useEffect, useRef } from 'react';
import { useSchedule, Task } from '@/context/ScheduleContext';
import { useApp } from '@/context/AppContext';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapLayerControls } from './map/MapLayerControls';
import { TaskInfoCard } from './map/InfoCard';
import { MapFallback } from './map/MapFallback';
import { useMapMarkers } from './map/useMapMarkers';
import { AddTaskDialog } from './AddTaskDialog';
import { mockProjectLocations } from '@/utils/mockMapData';
import { useToast } from '@/hooks/use-toast';

interface ScheduleMapProps {
  mapboxApiKey?: string;
}

export const ScheduleMap: React.FC<ScheduleMapProps> = ({ mapboxApiKey }) => {
  const { tasks: originalTasks, updateTask } = useSchedule();
  const { billingCodes, projects } = useApp();
  const { toast } = useToast();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [isEditTaskDialogOpen, setIsEditTaskDialogOpen] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [usingMapbox, setUsingMapbox] = useState(false);
  const [showTasks, setShowTasks] = useState(true);
  
  // Combine original tasks with mock tasks
  const mockTasks = mockProjectLocations.map(loc => ({
    ...loc,
    status: loc.status as any
  }));
  
  const allTasks = [...originalTasks, ...mockTasks];
  
  // Initialize and set up Mapbox when API key is provided
  useEffect(() => {
    if (!mapContainer.current || !mapboxApiKey) return;
    
    try {
      // Set Mapbox access token
      mapboxgl.accessToken = mapboxApiKey;
      
      // Initialize the map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-98.5795, 39.8283], // Center of USA
        zoom: 3
      });
      
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      setUsingMapbox(true);
      
      // Cleanup function
      return () => {
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
    } catch (error) {
      console.error('Error initializing Mapbox:', error);
      setUsingMapbox(false);
    }
  }, [mapboxApiKey]);
  
  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId === selectedTaskId ? null : taskId);
  };
  
  const handleAddTask = () => {
    setIsAddTaskDialogOpen(true);
  };
  
  const handleEditTask = () => {
    if (selectedTaskId) {
      setIsEditTaskDialogOpen(true);
    }
  };
  
  const handleCloseTask = (taskId: string) => {
    const task = allTasks.find(t => t.id === taskId);
    if (task) {
      const updatedTask = { ...task, status: 'completed' as const };
      
      try {
        // Update the task in the context
        updateTask(updatedTask);
        
        // Show success message
        toast({
          title: "Task closed",
          description: `Task "${task.title}" has been marked as completed.`,
        });
        
        // Reset selected task id
        setSelectedTaskId(null);
      } catch (error) {
        console.error('Error closing task:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to close task. Please try again.",
        });
      }
    }
  };
  
  // Use custom hook to manage markers
  useMapMarkers(
    map.current,
    showTasks,
    allTasks,
    handleTaskClick
  );
  
  const selectedTask = allTasks.find(task => task.id === selectedTaskId);
  
  // Helper to get billing code details
  const getBillingCode = (codeId: string | null) => {
    if (!codeId) return null;
    return billingCodes.find(code => code.id === codeId);
  };
  
  // Helper to get project name
  const getProjectName = (projectId: string | null) => {
    if (!projectId) return "No Project";
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : "Unknown Project";
  };
  
  const selectedBillingCode = selectedTask ? getBillingCode(selectedTask.billingCodeId) : null;
  
  // Render a fallback UI if Mapbox isn't initialized
  if (!mapboxApiKey) {
    return (
      <MapFallback 
        tasks={allTasks} 
        onTaskClick={handleTaskClick} 
        selectedTaskId={selectedTaskId} 
      />
    );
  }
  
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
      
      {/* Mapbox container */}
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Selected Task Info */}
      {selectedTask && (
        <div className="absolute right-4 top-4 w-72 pointer-events-auto z-10">
          <TaskInfoCard 
            task={selectedTask} 
            projectName={getProjectName(selectedTask.projectId)}
            billingCode={selectedBillingCode}
            onClose={() => setSelectedTaskId(null)}
            onEdit={handleEditTask}
            onCloseTask={() => handleCloseTask(selectedTask.id)}
          />
        </div>
      )}
      
      {/* Task Dialogs */}
      <AddTaskDialog 
        open={isAddTaskDialogOpen} 
        onOpenChange={setIsAddTaskDialogOpen} 
      />
    </div>
  );
};
