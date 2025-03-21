
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, User, Users, Plus } from 'lucide-react';
import { useSchedule } from '@/context/ScheduleContext';
import { Task } from '@/context/ScheduleContext';
import { useApp } from '@/context/AppContext';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { format } from 'date-fns';

// You would normally store this in an environment variable
// For this demo, we're using a temporary public token
const MAPBOX_TOKEN = 'pk.eyJ1IjoibG92YWJsZWFpIiwiYSI6ImNscWdydDU0cTBocnUya25zODBoN2dtcWEifQ.a7mUVdXHjPSMcmYxnkVscA';

interface TeamLocation {
  id: string;
  name: string;
  role: string;
  location: {
    lat: number;
    lng: number;
  };
  numPeople: number;
  projectId: string | null;
}

// Mock team locations across the US
const teamLocations: TeamLocation[] = [
  { 
    id: '1', 
    name: 'Alpha Team', 
    role: 'Installation',
    location: { lat: 37.7749, lng: -122.4194 }, // San Francisco
    numPeople: 4,
    projectId: '1'
  },
  { 
    id: '2', 
    name: 'Beta Team', 
    role: 'Survey',
    location: { lat: 40.7128, lng: -74.0060 }, // New York
    numPeople: 2,
    projectId: '2'
  },
  { 
    id: '3', 
    name: 'Charlie Team', 
    role: 'Maintenance',
    location: { lat: 29.7604, lng: -95.3698 }, // Houston
    numPeople: 3,
    projectId: null
  },
  { 
    id: '4', 
    name: 'Delta Team', 
    role: 'Inspection',
    location: { lat: 34.0522, lng: -118.2437 }, // Los Angeles
    numPeople: 2,
    projectId: '3'
  },
  { 
    id: '5', 
    name: 'Echo Team', 
    role: 'Installation', 
    location: { lat: 41.8781, lng: -87.6298 }, // Chicago
    numPeople: 5,
    projectId: '4'
  },
  { 
    id: '6', 
    name: 'Foxtrot Team', 
    role: 'Repair',
    location: { lat: 39.9526, lng: -75.1652 }, // Philadelphia
    numPeople: 2,
    projectId: null
  },
  { 
    id: '7', 
    name: 'John Smith', 
    role: 'Technician',
    location: { lat: 47.6062, lng: -122.3321 }, // Seattle
    numPeople: 1,
    projectId: '2'
  },
  { 
    id: '8', 
    name: 'Mary Johnson', 
    role: 'Surveyor',
    location: { lat: 32.7767, lng: -96.7970 }, // Dallas
    numPeople: 1,
    projectId: '1'
  }
];

export const MapComponent: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{[key: string]: mapboxgl.Marker}>({});
  const popupsRef = useRef<{[key: string]: mapboxgl.Popup}>({});
  
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [taskAssignMode, setTaskAssignMode] = useState(false);
  
  const { tasks } = useSchedule();
  const { projects } = useApp();
  
  const getProjectName = (projectId: string | null) => {
    if (!projectId) return "No Project";
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : "Unknown Project";
  };
  
  const selectedTeam = selectedTeamId ? teamLocations.find(team => team.id === selectedTeamId) : null;
  
  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainer.current) return;
    
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-98.5795, 39.8283], // Center of USA
      zoom: 3.5,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Clean up on unmount
    return () => {
      map.current?.remove();
    };
  }, []);
  
  // Add markers when map is loaded
  useEffect(() => {
    if (!map.current) return;
    
    // Wait for map to load before adding markers
    map.current.on('load', () => {
      teamLocations.forEach(team => {
        // Create custom marker element
        const marker = document.createElement('div');
        marker.className = 'cursor-pointer';
        
        // Create React element inside marker
        const root = document.createElement('div');
        marker.appendChild(root);
        
        // Create color based on role
        let color = 'bg-blue-500';
        if (team.role === 'Installation') color = 'bg-green-500';
        if (team.role === 'Survey') color = 'bg-amber-500';
        if (team.role === 'Maintenance') color = 'bg-purple-500';
        if (team.role === 'Inspection') color = 'bg-red-500';
        if (team.role === 'Repair') color = 'bg-pink-500';
        
        // Render icon based on number of people
        marker.innerHTML = `
          <div class="${color} text-white p-2 rounded-full shadow-lg flex items-center justify-center" style="width: 40px; height: 40px;">
            ${team.numPeople > 1 
              ? `<span>${team.numPeople}</span>` 
              : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`}
          </div>
        `;
        
        // Create popup but don't add it to map yet
        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: 25
        }).setHTML(`
          <div>
            <h3 class="font-bold">${team.name}</h3>
            <p>${team.role}</p>
            <p class="text-sm">${getProjectName(team.projectId)}</p>
          </div>
        `);
        
        // Create and add the marker to the map
        const mapboxMarker = new mapboxgl.Marker(marker)
          .setLngLat([team.location.lng, team.location.lat])
          .addTo(map.current!);
          
        // Store references to markers and popups
        markersRef.current[team.id] = mapboxMarker;
        popupsRef.current[team.id] = popup;
        
        // Add event listeners
        marker.addEventListener('mouseenter', () => {
          if (taskAssignMode) return;
          mapboxMarker.setPopup(popup).togglePopup();
        });
        
        marker.addEventListener('mouseleave', () => {
          if (taskAssignMode) return;
          setTimeout(() => {
            if (popup.isOpen() && selectedTeamId !== team.id) {
              popup.remove();
            }
          }, 300);
        });
        
        marker.addEventListener('click', () => {
          setSelectedTeamId(prevId => prevId === team.id ? null : team.id);
        });
      });
      
      // Add task markers
      tasks.forEach(task => {
        const { lat, lng } = task.location;
        
        // Create custom marker for tasks
        const taskMarker = document.createElement('div');
        taskMarker.className = 'cursor-pointer';
        
        // Render based on task priority
        let priorityColor = 'bg-blue-500';
        if (task.priority === 'high') priorityColor = 'bg-red-500';
        else if (task.priority === 'medium') priorityColor = 'bg-amber-500';
        
        taskMarker.innerHTML = `
          <div class="${priorityColor} text-white p-1 rounded-full shadow-lg" style="transform: translateY(-50%);">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
        `;
        
        // Create task popup
        const taskPopup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: 25
        }).setHTML(`
          <div>
            <h3 class="font-bold">${task.title}</h3>
            <p class="text-sm">${task.description}</p>
            <p class="text-xs">${format(task.startDate, 'MMM d')}</p>
          </div>
        `);
        
        new mapboxgl.Marker(taskMarker)
          .setLngLat([lng, lat])
          .setPopup(taskPopup)
          .addTo(map.current!);
          
        // Mouse events for task markers
        taskMarker.addEventListener('mouseenter', () => {
          taskPopup.addTo(map.current!);
        });
        
        taskMarker.addEventListener('mouseleave', () => {
          setTimeout(() => {
            taskPopup.remove();
          }, 300);
        });
      });
    });
  }, [projects, tasks]);
  
  // Handle showing selected team details  
  useEffect(() => {
    if (!map.current) return;
    
    // Close all popups first
    Object.values(popupsRef.current).forEach(popup => {
      popup.remove();
    });
    
    // If we have a selected team, fly to it and show popup
    if (selectedTeamId && markersRef.current[selectedTeamId]) {
      const team = teamLocations.find(t => t.id === selectedTeamId);
      if (!team) return;
      
      // Fly to the selected team
      map.current.flyTo({
        center: [team.location.lng, team.location.lat],
        zoom: 8,
        duration: 1500
      });
      
      // Show the popup for the selected team
      const marker = markersRef.current[selectedTeamId];
      const popup = popupsRef.current[selectedTeamId];
      marker.setPopup(popup).togglePopup();
    } else if (map.current && !selectedTeamId) {
      // If no team is selected, reset the map view
      map.current.flyTo({
        center: [-98.5795, 39.8283], // Center of USA
        zoom: 3.5,
        duration: 1500
      });
    }
  }, [selectedTeamId]);
  
  const handleAssignTask = () => {
    setTaskAssignMode(true);
  };
  
  const handleCancelAssign = () => {
    setTaskAssignMode(false);
  };
  
  return (
    <div className="relative h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
      
      {/* Selected Team Info Card */}
      {selectedTeam && (
        <div className="absolute right-4 top-4 w-72 z-10">
          <Card className="p-3 shadow-lg border-l-4 border-l-fieldvision-orange">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">{selectedTeam.name}</h3>
              <Badge variant="outline">{selectedTeam.role}</Badge>
            </div>
            
            <p className="text-xs mb-2">
              {selectedTeam.numPeople > 1 
                ? `Team of ${selectedTeam.numPeople} people` 
                : "Individual"
              }
            </p>
            
            <p className="text-xs mb-3">{getProjectName(selectedTeam.projectId)}</p>
            
            <div className="flex gap-2">
              {!taskAssignMode ? (
                <Button 
                  size="sm" 
                  onClick={handleAssignTask}
                  className="w-full text-xs bg-fieldvision-orange hover:bg-fieldvision-orange/90 text-white"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Assign Task
                </Button>
              ) : (
                <>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleCancelAssign}
                    className="w-full text-xs"
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm"
                    className="w-full text-xs"
                  >
                    Confirm
                  </Button>
                </>
              )}
            </div>
            
            {taskAssignMode && (
              <div className="mt-2 text-xs text-center text-muted-foreground">
                Click the "Confirm" button to assign a new task
              </div>
            )}
          </Card>
        </div>
      )}
      
      {/* Legend */}
      <div className="absolute left-4 bottom-4 z-10 bg-white/90 p-2 rounded-md shadow-md text-xs">
        <div className="font-medium mb-1">Map Legend</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
            <span>Installation</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-amber-500 mr-1"></div>
            <span>Survey</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>
            <span>Maintenance</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
            <span>Inspection</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-pink-500 mr-1"></div>
            <span>Repair</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
            <span>Other</span>
          </div>
        </div>
      </div>
    </div>
  );
};
