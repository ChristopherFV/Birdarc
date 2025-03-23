
import React, { useState, useEffect, useRef } from 'react';
import { useSchedule } from '@/context/ScheduleContext';
import { useApp } from '@/context/AppContext';
import { mockProjectLocations } from '@/utils/mockMapData';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapLayerControls } from './map/MapLayerControls';
import { TaskInfoCard, ProjectInfoCard } from './map/InfoCard';
import { MapFallback } from './map/MapFallback';
import { useMapMarkers } from './map/useMapMarkers';

interface ScheduleMapProps {
  mapboxApiKey?: string;
}

export const ScheduleMap: React.FC<ScheduleMapProps> = ({ mapboxApiKey }) => {
  const { tasks } = useSchedule();
  const { billingCodes, projects } = useApp();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [usingMapbox, setUsingMapbox] = useState(false);
  const [showProjects, setShowProjects] = useState(true);
  const [showTasks, setShowTasks] = useState(true);
  
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
    setSelectedProjectId(null);
  };
  
  const handleProjectClick = (projectId: string) => {
    setSelectedProjectId(projectId === selectedProjectId ? null : projectId);
    setSelectedTaskId(null);
  };
  
  // Use custom hook to manage markers
  useMapMarkers(
    map.current,
    showTasks,
    showProjects,
    tasks,
    mockProjectLocations,
    handleTaskClick,
    handleProjectClick
  );
  
  const selectedTask = tasks.find(task => task.id === selectedTaskId);
  const selectedProject = mockProjectLocations.find(proj => proj.id === selectedProjectId);
  
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
        tasks={tasks} 
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
        showProjects={showProjects}
        setShowProjects={setShowProjects}
        taskCount={tasks.length}
        projectCount={mockProjectLocations.length}
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
          />
        </div>
      )}

      {/* Selected Project Info */}
      {selectedProject && (
        <div className="absolute right-4 top-4 w-72 pointer-events-auto z-10">
          <ProjectInfoCard project={selectedProject} />
        </div>
      )}
    </div>
  );
};
