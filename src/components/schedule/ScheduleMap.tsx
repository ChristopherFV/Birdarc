
import React, { useState, useEffect, useRef } from 'react';
import { useSchedule } from '@/context/ScheduleContext';
import { useApp } from '@/context/AppContext';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapLayerControls } from './map/MapLayerControls';
import { TaskInfoCard } from './map/InfoCard';
import { MapFallback } from './map/MapFallback';
import { useMapMarkers } from './map/useMapMarkers';

// Generate 100 mock task locations spread across the US
const generateMockTaskLocations = () => {
  const mockTasks = [];
  
  const usaBounds = {
    west: -125.0,
    east: -66.0,
    south: 24.0,
    north: 49.0
  };
  
  const priorities = ['high', 'medium', 'low'];
  const projectIds = ['1', '2', '3', '4', '5'];
  const billingCodeIds = ['1', '2', '3', '4', '5', '6'];
  
  for (let i = 0; i < 100; i++) {
    const lng = usaBounds.west + (Math.random() * (usaBounds.east - usaBounds.west));
    const lat = usaBounds.south + (Math.random() * (usaBounds.north - usaBounds.south));
    
    mockTasks.push({
      id: `mock-${i}`,
      title: `Task ${i + 1}`,
      description: `Mock task description for task ${i + 1}`,
      location: {
        address: `Location ${i + 1}, USA`,
        lat,
        lng
      },
      startDate: new Date(),
      endDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000),
      projectId: projectIds[Math.floor(Math.random() * projectIds.length)],
      teamMemberId: null,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      status: 'pending',
      billingCodeId: billingCodeIds[Math.floor(Math.random() * billingCodeIds.length)],
      quantityEstimate: Math.floor(Math.random() * 100) + 10
    });
  }
  
  return mockTasks;
};

interface ScheduleMapProps {
  mapboxApiKey?: string;
}

export const ScheduleMap: React.FC<ScheduleMapProps> = ({ mapboxApiKey }) => {
  const { tasks: originalTasks } = useSchedule();
  const { billingCodes, projects } = useApp();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [usingMapbox, setUsingMapbox] = useState(false);
  const [showTasks, setShowTasks] = useState(true);
  
  // Combine original tasks with mock tasks
  const allTasks = [...originalTasks, ...generateMockTaskLocations()];
  
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
    </div>
  );
};
